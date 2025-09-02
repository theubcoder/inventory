import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

// GET all sales or search by ID/phone
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let where = {};
    
    if (search) {
      // Try to parse as number for ID search
      const searchId = parseInt(search);
      if (!isNaN(searchId)) {
        where.OR = [
          { id: searchId },
          { customer: { phone: search } }
        ];
      } else {
        where.customer = { phone: search };
      }
    }

    const sales = await prisma.sale.findMany({
      where,
      include: {
        customer: true,
        saleItems: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(sales);
  } catch (error) {
    console.error('Error fetching sales:', error);
    return NextResponse.json({ error: 'Failed to fetch sales' }, { status: 500 });
  }
}

// POST - Create new sale
export async function POST(request) {
  try {
    const body = await request.json();
    const { customer, items, paymentMethod, amountPaid, profitDiscount, dueDate } = body;

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxAmount = 0; // No tax
    const totalAmount = subtotal; // Total is just subtotal without tax
    
    // Calculate profit
    let totalProfit = 0;
    for (const item of items) {
      const profitPerUnit = parseFloat(item.profitPerUnit || 0);
      const profitPerBox = parseFloat(item.profitPerBox || 0);
      const unitsPerBox = 10; // Default units per box, you might want to fetch this from product
      const quantity = item.quantity;
      
      let itemProfit = 0;
      if (profitPerBox > 0) {
        // If profit per box is set, use box calculation
        const boxes = Math.floor(quantity / unitsPerBox);
        const remainingUnits = quantity % unitsPerBox;
        itemProfit = (boxes * profitPerBox) + (remainingUnits * profitPerUnit);
      } else {
        // If no box profit is set, calculate all as individual units
        itemProfit = quantity * profitPerUnit;
      }
      
      totalProfit += itemProfit;
    }
    
    // Apply profit discount
    const finalProfit = Math.max(0, totalProfit - (parseFloat(profitDiscount) || 0));
    
    // Calculate payment details
    const paidAmount = amountPaid !== undefined ? parseFloat(amountPaid) : totalAmount;
    const remainingAmount = totalAmount - paidAmount;
    const paymentStatus = remainingAmount <= 0 ? 'paid' : remainingAmount < totalAmount ? 'partial' : 'pending';

    // Start a transaction with increased timeout
    const result = await prisma.$transaction(async (tx) => {
      // Create or find customer
      let customerId = null;
      if (customer && customer.name) {
        const existingCustomer = await tx.customer.findFirst({
          where: { 
            OR: [
              { phone: customer.phone },
              { email: customer.email }
            ]
          }
        });

        if (existingCustomer) {
          customerId = existingCustomer.id;
        } else {
          const newCustomer = await tx.customer.create({
            data: {
              name: customer.name,
              phone: customer.phone,
              email: customer.email
            }
          });
          customerId = newCustomer.id;
        }
      }

      // Create sale
      const sale = await tx.sale.create({
        data: {
          customerId,
          totalAmount,
          taxAmount,
          profitDiscount: parseFloat(profitDiscount) || 0,
          totalProfit: finalProfit,
          amountPaid: paidAmount,
          remainingAmount,
          paymentStatus,
          paymentMethod: paymentMethod || 'cash',
          dueDate: dueDate ? new Date(dueDate) : null,
          saleItems: {
            create: items.map(item => ({
              productId: item.id,
              quantity: item.quantity,
              unitPrice: item.price,
              totalPrice: item.price * item.quantity
            }))
          }
        },
        include: {
          customer: true,
          saleItems: {
            include: {
              product: true
            }
          },
          paymentHistory: true
        }
      });

      // Update product quantities FIRST (this should always happen for any sale)
      for (const item of items) {
        // First check current quantity
        const product = await tx.product.findUnique({
          where: { id: item.id }
        });
        
        if (!product) {
          throw new Error(`Product with id ${item.id} not found`);
        }
        
        // Calculate new quantity, ensuring it doesn't go below 0
        const newQuantity = Math.max(0, product.quantity - item.quantity);
        
        await tx.product.update({
          where: { id: item.id },
          data: {
            quantity: newQuantity
          }
        });
      }

      // Create initial payment record if amount was paid
      if (paidAmount > 0) {
        await tx.paymentHistory.create({
          data: {
            saleId: sale.id,
            amountPaid: paidAmount,
            paymentMethod: paymentMethod || 'cash',
            notes: 'Initial payment'
          }
        });
        
        // Re-fetch the sale to include the payment history
        return await tx.sale.findUnique({
          where: { id: sale.id },
          include: {
            customer: true,
            saleItems: {
              include: {
                product: true
              }
            },
            paymentHistory: true
          }
        });
      }

      return sale;
    }, {
      maxWait: 10000, // 10 seconds
      timeout: 20000 // 20 seconds
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating sale:', error);
    return NextResponse.json({ error: 'Failed to create sale' }, { status: 500 });
  }
}

// PUT - Update sale payment
export async function PUT(request) {
  try {
    const body = await request.json();
    const { saleId, amountPaid, paymentMethod, notes } = body;

    const result = await prisma.$transaction(async (tx) => {
      // Get current sale
      const sale = await tx.sale.findUnique({
        where: { id: parseInt(saleId) }
      });

      if (!sale) {
        throw new Error('Sale not found');
      }

      // Calculate new payment details
      const newTotalPaid = parseFloat(sale.amountPaid || 0) + parseFloat(amountPaid);
      const newRemaining = parseFloat(sale.totalAmount) - newTotalPaid;
      const newPaymentStatus = newRemaining <= 0 ? 'paid' : newRemaining < parseFloat(sale.totalAmount) ? 'partial' : 'pending';

      // Update sale and create payment history in parallel
      const [updatedSale, paymentRecord] = await Promise.all([
        tx.sale.update({
          where: { id: parseInt(saleId) },
          data: {
            amountPaid: newTotalPaid,
            remainingAmount: newRemaining,
            paymentStatus: newPaymentStatus
          },
          include: {
            customer: true,
            saleItems: {
              include: {
                product: true
              }
            },
            paymentHistory: true
          }
        }),
        tx.paymentHistory.create({
          data: {
            saleId: parseInt(saleId),
            amountPaid: parseFloat(amountPaid),
            paymentMethod: paymentMethod || 'cash',
            notes: notes || 'Payment received'
          }
        })
      ]);

      return updatedSale;
    }, {
      maxWait: 10000, // 10 seconds
      timeout: 20000  // 20 seconds
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating sale payment:', error);
    return NextResponse.json({ error: 'Failed to update payment' }, { status: 500 });
  }
}