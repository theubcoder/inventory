import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Electronics' },
      update: {},
      create: { name: 'Electronics', description: 'Electronic devices and accessories' }
    }),
    prisma.category.upsert({
      where: { name: 'Clothing' },
      update: {},
      create: { name: 'Clothing', description: 'Apparel and fashion items' }
    }),
    prisma.category.upsert({
      where: { name: 'Food' },
      update: {},
      create: { name: 'Food', description: 'Food and beverages' }
    }),
    prisma.category.upsert({
      where: { name: 'Books' },
      update: {},
      create: { name: 'Books', description: 'Books and publications' }
    }),
    prisma.category.upsert({
      where: { name: 'Home & Garden' },
      update: {},
      create: { name: 'Home & Garden', description: 'Home improvement and garden supplies' }
    }),
    prisma.category.upsert({
      where: { name: 'Sports' },
      update: {},
      create: { name: 'Sports', description: 'Sports equipment and accessories' }
    })
  ]);

  console.log('Categories created:', categories.map(c => c.name));

  // Create sample products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Laptop Dell XPS 13',
        categoryId: categories[0].id, // Electronics
        price: 85000,
        quantity: 15,
        minStock: 5,
        barcode: '123456789',
        description: 'High-performance laptop with Intel Core i7'
      }
    }),
    prisma.product.create({
      data: {
        name: 'Cotton T-Shirt',
        categoryId: categories[1].id, // Clothing
        price: 599,
        quantity: 50,
        minStock: 10,
        barcode: '987654321',
        description: '100% cotton comfortable t-shirt'
      }
    }),
    prisma.product.create({
      data: {
        name: 'Organic Rice 5kg',
        categoryId: categories[2].id, // Food
        price: 450,
        quantity: 25,
        minStock: 10,
        barcode: '456789123',
        description: 'Premium quality organic rice'
      }
    }),
    prisma.product.create({
      data: {
        name: 'JavaScript Book',
        categoryId: categories[3].id, // Books
        price: 899,
        quantity: 8,
        minStock: 5,
        barcode: '789123456',
        description: 'Complete guide to JavaScript programming'
      }
    }),
    prisma.product.create({
      data: {
        name: 'Wireless Mouse',
        categoryId: categories[0].id, // Electronics
        price: 1299,
        quantity: 30,
        minStock: 10,
        barcode: '321654987',
        description: 'Ergonomic wireless mouse with USB receiver'
      }
    }),
    prisma.product.create({
      data: {
        name: 'Yoga Mat',
        categoryId: categories[5].id, // Sports
        price: 1599,
        quantity: 20,
        minStock: 5,
        barcode: '654321789',
        description: 'Non-slip exercise and yoga mat'
      }
    })
  ]);

  console.log('Products created:', products.map(p => p.name));

  // Create sample customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: 'John Doe',
        phone: '9876543210',
        email: 'john@example.com',
        address: '123 Main St, City'
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Jane Smith',
        phone: '9876543211',
        email: 'jane@example.com',
        address: '456 Oak Ave, Town'
      }
    })
  ]);

  console.log('Customers created:', customers.map(c => c.name));

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });