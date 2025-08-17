import prisma from '@/lib/prisma';

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
    console.log('Received transaction data:', body);
    
    let supplier = await prisma.supplier.findFirst({
      where: { name: body.supplierName }
    });
    
    if (!supplier) {
      console.log('Creating new supplier:', body.supplierName);
      supplier = await prisma.supplier.create({
        data: {
          name: body.supplierName,
          contactNumber: body.contactNumber || null,
          address: body.address || null
        }
      });
    }
    
    const transactionData = {
      supplierId: supplier.id,
      supplierName: body.supplierName,
      contactNumber: body.contactNumber || null,
      address: body.address || null,
      transactionDate: new Date(body.transactionDate),
      productName: body.productName,
      quantity: body.quantity ? String(body.quantity) : "0",
      pricePerUnit: body.pricePerUnit ? String(body.pricePerUnit) : "0",
      totalAmount: body.totalAmount ? String(body.totalAmount) : "0",
      amountPaid: body.amountPaid ? String(body.amountPaid) : "0",
      remainingAmount: body.remainingAmount ? String(body.remainingAmount) : "0",
      overpaidAmount: body.overpaidAmount ? String(body.overpaidAmount) : "0",
      transportFee: body.transportFee ? String(body.transportFee) : "0",
      transportPaid: body.transportPaid ? String(body.transportPaid) : "0",
      transportRemaining: body.transportRemaining ? String(body.transportRemaining) : "0",
      paymentMethod: body.paymentMethod || "cash",
      notes: body.notes || null
    };
    
    console.log('Creating transaction with data:', transactionData);
    
    const transaction = await prisma.ograiTransaction.create({
      data: transactionData
    });
    
    console.log('Transaction created successfully:', transaction);
    return Response.json(transaction);
  } catch (error) {
    console.error('Detailed error creating transaction:', error);
    console.error('Error stack:', error.stack);
    return Response.json({ 
      error: 'Failed to create transaction', 
      details: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, paymentData, ...updateData } = body;
    
    // Get current transaction to calculate payment amounts
    const currentTransaction = await prisma.ograiTransaction.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!currentTransaction) {
      return Response.json({ error: 'Transaction not found' }, { status: 404 });
    }
    
    // Calculate payment amounts
    const paymentAmount = parseFloat(updateData.amountPaid) - parseFloat(currentTransaction.amountPaid);
    const transportPayment = parseFloat(updateData.transportPaid) - parseFloat(currentTransaction.transportPaid);
    
    // Convert numeric values to strings for Prisma Decimal fields
    const processedData = {};
    for (const [key, value] of Object.entries(updateData)) {
      if (['amountPaid', 'remainingAmount', 'transportPaid', 'transportRemaining', 'overpaidAmount'].includes(key)) {
        processedData[key] = value !== null && value !== undefined ? String(value) : undefined;
      } else {
        processedData[key] = value;
      }
    }
    
    console.log('Updating transaction:', id, processedData);
    
    // Use transaction to update both transaction and create payment history
    const result = await prisma.$transaction(async (prisma) => {
      // Update transaction
      const transaction = await prisma.ograiTransaction.update({
        where: { id: parseInt(id) },
        data: processedData
      });
      
      // Create payment history entry if there's a payment
      if (paymentAmount > 0 || transportPayment > 0) {
        const paymentHistory = await prisma.ograiPaymentHistory.create({
          data: {
            transactionId: parseInt(id),
            paymentDate: paymentData?.paymentDate ? new Date(paymentData.paymentDate) : new Date(),
            paymentAmount: String(paymentAmount),
            transportPayment: String(transportPayment),
            totalPayment: String(paymentAmount + transportPayment),
            paymentMethod: paymentData?.paymentMethod || 'cash',
            notes: paymentData?.notes || null
          }
        });
        console.log('Payment history created:', paymentHistory);
      }
      
      return transaction;
    });
    
    return Response.json(result);
  } catch (error) {
    console.error('Error updating transaction:', error);
    return Response.json({ error: 'Failed to update transaction', details: error.message }, { status: 500 });
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