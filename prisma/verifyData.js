import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function verifyData() {
  console.log('🔍 Verifying data in Neon database...\n');
  console.log('Database URL:', process.env.DATABASE_URL?.substring(0, 50) + '...\n');

  try {
    // Count records in each table
    const counts = {
      categories: await prisma.category.count(),
      products: await prisma.product.count(),
      customers: await prisma.customer.count(),
      sales: await prisma.sale.count(),
      saleItems: await prisma.saleItem.count(),
      returns: await prisma.return.count(),
      returnItems: await prisma.returnItem.count(),
      expenses: await prisma.expense.count(),
    };

    console.log('📊 Record counts in Neon database:');
    console.log('================================');
    Object.entries(counts).forEach(([table, count]) => {
      console.log(`${table.padEnd(15)} : ${count} records`);
    });

    // Show sample data
    console.log('\n📝 Sample data from each table:');
    console.log('================================\n');

    // Categories
    const categories = await prisma.category.findMany({ take: 3 });
    console.log('Categories:');
    categories.forEach(cat => {
      console.log(`  - ${cat.name} (ID: ${cat.id})`);
    });

    // Products
    const products = await prisma.product.findMany({ 
      take: 3,
      include: { category: true }
    });
    console.log('\nProducts:');
    products.forEach(prod => {
      console.log(`  - ${prod.name} | PKR ${prod.price} | Stock: ${prod.quantity} | Category: ${prod.category?.name}`);
    });

    // Customers
    const customers = await prisma.customer.findMany({ take: 3 });
    console.log('\nCustomers:');
    customers.forEach(cust => {
      console.log(`  - ${cust.name} | ${cust.phone}`);
    });

    // Recent Sales
    const sales = await prisma.sale.findMany({ 
      take: 3,
      include: { customer: true },
      orderBy: { createdAt: 'desc' }
    });
    console.log('\nRecent Sales:');
    sales.forEach(sale => {
      console.log(`  - Sale #${sale.id} | PKR ${sale.totalAmount} | Customer: ${sale.customer?.name || 'Walk-in'}`);
    });

    // Low Stock Products
    const lowStock = await prisma.$queryRaw`
      SELECT name, quantity, min_stock 
      FROM products 
      WHERE quantity <= min_stock 
      LIMIT 5
    `;
    console.log('\nLow Stock Alerts:');
    lowStock.forEach(prod => {
      console.log(`  - ${prod.name} | Current: ${prod.quantity} | Min: ${prod.min_stock}`);
    });

    console.log('\n✅ Data verification complete!');
    console.log('\n🌐 Check your Neon dashboard at:');
    console.log('   https://console.neon.tech/');
    console.log('   Database: neondb');
    console.log('   Tables should be visible under "Tables" section');

  } catch (error) {
    console.error('❌ Error verifying data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyData();