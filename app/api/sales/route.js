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
    const { customer, items, paymentMethod } = body;

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxAmount = subtotal * 0.18; // 18% GST
    const totalAmount = subtotal + taxAmount;

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
          paymentMethod: paymentMethod || 'cash',
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
          }
        }
      });

      // Update product quantities
      for (const item of items) {
        await tx.product.update({
          where: { id: item.id },
          data: {
            quantity: {
              decrement: item.quantity
            }
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