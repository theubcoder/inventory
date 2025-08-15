import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const customerId = searchParams.get('customerId');

    const where = {};
    
    if (status && status !== 'all') {
      where.status = status;
    }
    
    if (customerId) {
      where.customerId = parseInt(customerId);
    }

    const returns = await prisma.return.findMany({
      where,
      include: {
        sale: true,
        customer: true,
        returnItems: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(returns);
  } catch (error) {
    console.error('Error fetching returns:', error);
    return NextResponse.json({ error: 'Failed to fetch returns' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { saleId, customerId, reason, items, processedBy } = body;

    if (!saleId || !items || items.length === 0) {
      return NextResponse.json({ error: 'Sale ID and return items are required' }, { status: 400 });
    }

    const refundAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

    const returnRecord = await prisma.$transaction(async (tx) => {
      const newReturn = await tx.return.create({
        data: {
          saleId: parseInt(saleId),
          customerId: customerId ? parseInt(customerId) : null,
          reason: reason || 'No reason provided',
          status: 'processing',
          refundAmount: refundAmount,
          processedBy,
          returnItems: {
            create: items.map(item => ({
              productId: parseInt(item.productId),
              quantity: parseInt(item.quantity),
              unitPrice: parseFloat(item.unitPrice),
              totalPrice: parseFloat(item.quantity * item.unitPrice)
            }))
          }
        },
        include: {
          sale: true,
          customer: true,
          returnItems: {
            include: {
              product: true
            }
          }
        }
      });

      for (const item of items) {
        await tx.product.update({
          where: { id: parseInt(item.productId) },
          data: {
            quantity: {
              increment: parseInt(item.quantity)
            }
          }
        });
      }

      return newReturn;
    });

    return NextResponse.json(returnRecord, { status: 201 });
  } catch (error) {
    console.error('Error creating return:', error);
    return NextResponse.json({ error: 'Failed to create return' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, status, processedBy } = body;

    if (!id) {
      return NextResponse.json({ error: 'Return ID required' }, { status: 400 });
    }

    const returnRecord = await prisma.return.update({
      where: { id: parseInt(id) },
      data: {
        status,
        processedBy
      },
      include: {
        sale: true,
        customer: true,
        returnItems: {
          include: {
            product: true
          }
        }
      }
    });

    return NextResponse.json(returnRecord);
  } catch (error) {
    console.error('Error updating return:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Return not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update return' }, { status: 500 });
  }
}