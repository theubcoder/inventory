import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('transactionId');
    
    if (!transactionId) {
      return Response.json({ error: 'Transaction ID is required' }, { status: 400 });
    }
    
    const paymentHistory = await prisma.ograiPaymentHistory.findMany({
      where: { transactionId: parseInt(transactionId) },
      orderBy: { paymentDate: 'desc' }
    });
    
    return Response.json(paymentHistory);
  } catch (error) {
    console.error('Error fetching payment history:', error);
    return Response.json({ error: 'Failed to fetch payment history' }, { status: 500 });
  }
}