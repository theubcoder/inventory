import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const transactions = await prisma.ograiTransaction.findMany({
      orderBy: { transactionDate: 'desc' }
    });
    
    return Response.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return Response.json([], { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    let supplier = await prisma.supplier.findFirst({
      where: { name: body.supplierName }
    });
    
    if (!supplier) {
      supplier = await prisma.supplier.create({
        data: {
          name: body.supplierName,
          contactNumber: body.contactNumber || '',
          address: body.address || ''
        }
      });
    }
    
    const transaction = await prisma.ograiTransaction.create({
      data: {
        supplierId: supplier.id,
        supplierName: body.supplierName,
        contactNumber: body.contactNumber || '',
        address: body.address || '',
        transactionDate: new Date(body.transactionDate),
        productName: body.productName,
        quantity: parseFloat(body.quantity),
        pricePerUnit: parseFloat(body.pricePerUnit),
        totalAmount: parseFloat(body.totalAmount),
        amountPaid: parseFloat(body.amountPaid),
        remainingAmount: parseFloat(body.remainingAmount),
        overpaidAmount: parseFloat(body.overpaidAmount || 0),
        transportFee: parseFloat(body.transportFee || 0),
        transportPaid: parseFloat(body.transportPaid || 0),
        transportRemaining: parseFloat(body.transportRemaining || 0),
        paymentMethod: body.paymentMethod,
        notes: body.notes || ''
      }
    });
    
    return Response.json(transaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    return Response.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    const transaction = await prisma.ograiTransaction.update({
      where: { id: parseInt(id) },
      data: updateData
    });
    
    return Response.json(transaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    return Response.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    await prisma.ograiTransaction.delete({
      where: { id: parseInt(id) }
    });
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return Response.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}