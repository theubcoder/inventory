import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

// GET payment history for a sale
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const saleId = searchParams.get('saleId');

    if (!saleId) {
      return NextResponse.json({ error: 'Sale ID is required' }, { status: 400 });
    }

    const paymentHistory = await prisma.paymentHistory.findMany({
      where: { saleId: parseInt(saleId) },
      orderBy: { paymentDate: 'desc' },
      include: {
        sale: {
          include: {
            customer: true
          }
        }
      }
    });

    return NextResponse.json(paymentHistory);
  } catch (error) {
    console.error('Error fetching payment history:', error);
    return NextResponse.json({ error: 'Failed to fetch payment history' }, { status: 500 });
  }
}

// GET all pending/partial payments
export async function POST(request) {
  try {
    const body = await request.json();
    const { type } = body;

    let where = {};
    if (type === 'pending') {
      where.paymentStatus = { in: ['pending', 'partial'] };
    }

    const sales = await prisma.sale.findMany({
      where,
      include: {
        customer: true,
        saleItems: {
          include: {
            product: true
          }
        },
        paymentHistory: {
          orderBy: { paymentDate: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(sales);
  } catch (error) {
    console.error('Error fetching pending payments:', error);
    return NextResponse.json({ error: 'Failed to fetch pending payments' }, { status: 500 });
  }
}