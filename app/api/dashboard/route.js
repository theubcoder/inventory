import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

// GET dashboard statistics
export async function GET() {
  try {
    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Fetch all statistics in parallel
    const [
      totalSales,
      todaySales,
      totalProducts,
      lowStockCount,
      pendingReturns,
      totalRevenue,
      recentSales
    ] = await Promise.all([
      // Total sales count
      prisma.sale.count(),
      
      // Today's sales count
      prisma.sale.count({
        where: {
          createdAt: {
            gte: today,
            lt: tomorrow
          }
        }
      }),
      
      // Total products count
      prisma.product.count(),
      
      // Low stock products count
      prisma.$queryRaw`
        SELECT COUNT(*) as count 
        FROM products 
        WHERE quantity <= min_stock
      `,
      
      // Pending returns count
      prisma.return.count({
        where: {
          status: 'processing'
        }
      }),
      
      // Total revenue
      prisma.sale.aggregate({
        _sum: {
          totalAmount: true
        }
      }),
      
      // Recent sales (last 5)
      prisma.sale.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          customer: true
        }
      })
    ]);

    // Format recent activities
    const recentActivities = recentSales.map(sale => ({
      id: sale.id,
      type: 'sale',
      description: `Sale #${sale.id} - PKR ${sale.totalAmount}`,
      customerName: sale.customer?.name || 'Walk-in Customer',
      time: sale.createdAt
    }));

    const stats = {
      totalSales,
      todaySales,
      totalProducts,
      lowStock: Number(lowStockCount[0].count),
      pendingReturns,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      recentActivities
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard statistics' }, { status: 500 });
  }
}