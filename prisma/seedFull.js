import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seed...\n');

  try {
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🗑️ Clearing existing data...');
    await prisma.returnItem.deleteMany();
    await prisma.return.deleteMany();
    await prisma.saleItem.deleteMany();
    await prisma.sale.deleteMany();
    await prisma.product.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.category.deleteMany();
    await prisma.expense.deleteMany();
    
    // 1. Create Categories
    console.log('📁 Creating categories...');
    const categories = await Promise.all([
      prisma.category.create({ data: { name: 'Electronics', description: 'Electronic devices and accessories' }}),
      prisma.category.create({ data: { name: 'Clothing', description: 'Apparel and fashion items' }}),
      prisma.category.create({ data: { name: 'Food', description: 'Food and beverages' }}),
      prisma.category.create({ data: { name: 'Books', description: 'Books and publications' }}),
      prisma.category.create({ data: { name: 'Home & Garden', description: 'Home improvement and garden supplies' }}),
      prisma.category.create({ data: { name: 'Sports', description: 'Sports equipment and accessories' }}),
      prisma.category.create({ data: { name: 'Toys', description: 'Toys and games for children' }}),
      prisma.category.create({ data: { name: 'Beauty', description: 'Beauty and personal care products' }}),
      prisma.category.create({ data: { name: 'Automotive', description: 'Automotive parts and accessories' }}),
      prisma.category.create({ data: { name: 'Office Supplies', description: 'Office and stationery items' }}),
    ]);
    console.log(`✅ Created ${categories.length} categories\n`);

    // 2. Create Products
    console.log('📦 Creating products...');
    const products = await Promise.all([
      // Electronics
      prisma.product.create({
        data: {
          name: 'Laptop Dell XPS 13',
          categoryId: categories[0].id,
          price: 85000,
          quantity: 15,
          minStock: 5,
          barcode: '123456789001',
          description: 'High-performance laptop with Intel Core i7, 16GB RAM, 512GB SSD'
        }
      }),
      prisma.product.create({
        data: {
          name: 'iPhone 15 Pro',
          categoryId: categories[0].id,
          price: 134900,
          quantity: 8,
          minStock: 3,
          barcode: '123456789002',
          description: 'Latest iPhone with A17 Pro chip, 256GB storage'
        }
      }),
      prisma.product.create({
        data: {
          name: 'Samsung 4K Smart TV 55"',
          categoryId: categories[0].id,
          price: 65000,
          quantity: 5,
          minStock: 2,
          barcode: '123456789003',
          description: 'Ultra HD 4K Smart LED TV with HDR'
        }
      }),
      prisma.product.create({
        data: {
          name: 'Wireless Mouse Logitech',
          categoryId: categories[0].id,
          price: 1299,
          quantity: 30,
          minStock: 10,
          barcode: '123456789004',
          description: 'Ergonomic wireless mouse with USB receiver'
        }
      }),
      prisma.product.create({
        data: {
          name: 'Mechanical Keyboard RGB',
          categoryId: categories[0].id,
          price: 5999,
          quantity: 12,
          minStock: 5,
          barcode: '123456789005',
          description: 'Gaming mechanical keyboard with RGB backlight'
        }
      }),

      // Clothing
      prisma.product.create({
        data: {
          name: 'Cotton T-Shirt (White)',
          categoryId: categories[1].id,
          price: 599,
          quantity: 50,
          minStock: 20,
          barcode: '123456789006',
          description: '100% cotton comfortable t-shirt'
        }
      }),
      prisma.product.create({
        data: {
          name: 'Denim Jeans (Blue)',
          categoryId: categories[1].id,
          price: 2499,
          quantity: 25,
          minStock: 10,
          barcode: '123456789007',
          description: 'Classic fit denim jeans'
        }
      }),
      prisma.product.create({
        data: {
          name: 'Formal Shirt (White)',
          categoryId: categories[1].id,
          price: 1599,
          quantity: 20,
          minStock: 8,
          barcode: '123456789008',
          description: 'Premium cotton formal shirt'
        }
      }),
      prisma.product.create({
        data: {
          name: 'Sports Shoes Nike',
          categoryId: categories[1].id,
          price: 7999,
          quantity: 15,
          minStock: 5,
          barcode: '123456789009',
          description: 'Running shoes with air cushion'
        }
      }),

      // Food
      prisma.product.create({
        data: {
          name: 'Organic Rice 5kg',
          categoryId: categories[2].id,
          price: 450,
          quantity: 40,
          minStock: 15,
          barcode: '123456789010',
          description: 'Premium quality organic basmati rice'
        }
      }),
      prisma.product.create({
        data: {
          name: 'Olive Oil 1L',
          categoryId: categories[2].id,
          price: 899,
          quantity: 20,
          minStock: 8,
          barcode: '123456789011',
          description: 'Extra virgin olive oil'
        }
      }),
      prisma.product.create({
        data: {
          name: 'Almonds 500g',
          categoryId: categories[2].id,
          price: 599,
          quantity: 25,
          minStock: 10,
          barcode: '123456789012',
          description: 'Premium California almonds'
        }
      }),
      prisma.product.create({
        data: {
          name: 'Green Tea 100 bags',
          categoryId: categories[2].id,
          price: 299,
          quantity: 30,
          minStock: 12,
          barcode: '123456789013',
          description: 'Organic green tea bags'
        }
      }),

      // Books
      prisma.product.create({
        data: {
          name: 'JavaScript Complete Guide',
          categoryId: categories[3].id,
          price: 899,
          quantity: 8,
          minStock: 3,
          barcode: '123456789014',
          description: 'Complete guide to JavaScript programming'
        }
      }),
      prisma.product.create({
        data: {
          name: 'Python for Data Science',
          categoryId: categories[3].id,
          price: 1299,
          quantity: 10,
          minStock: 4,
          barcode: '123456789015',
          description: 'Learn Python for data analysis and machine learning'
        }
      }),
      prisma.product.create({
        data: {
          name: 'Business Management 101',
          categoryId: categories[3].id,
          price: 599,
          quantity: 12,
          minStock: 5,
          barcode: '123456789016',
          description: 'Essential guide to business management'
        }
      }),

      // Home & Garden
      prisma.product.create({
        data: {
          name: 'LED Bulb 9W Pack of 4',
          categoryId: categories[4].id,
          price: 499,
          quantity: 35,
          minStock: 15,
          barcode: '123456789017',
          description: 'Energy efficient LED bulbs'
        }
      }),
      prisma.product.create({
        data: {
          name: 'Garden Tool Set',
          categoryId: categories[4].id,
          price: 1999,
          quantity: 10,
          minStock: 4,
          barcode: '123456789018',
          description: '5-piece stainless steel garden tool set'
        }
      }),
      prisma.product.create({
        data: {
          name: 'Wall Clock Designer',
          categoryId: categories[4].id,
          price: 1599,
          quantity: 8,
          minStock: 3,
          barcode: '123456789019',
          description: 'Modern designer wall clock'
        }
      }),

      // Sports
      prisma.product.create({
        data: {
          name: 'Yoga Mat Premium',
          categoryId: categories[5].id,
          price: 1599,
          quantity: 20,
          minStock: 8,
          barcode: '123456789020',
          description: 'Non-slip exercise and yoga mat 6mm'
        }
      }),
      prisma.product.create({
        data: {
          name: 'Cricket Bat English Willow',
          categoryId: categories[5].id,
          price: 8999,
          quantity: 5,
          minStock: 2,
          barcode: '123456789021',
          description: 'Professional grade cricket bat'
        }
      }),
      prisma.product.create({
        data: {
          name: 'Football Size 5',
          categoryId: categories[5].id,
          price: 1299,
          quantity: 15,
          minStock: 6,
          barcode: '123456789022',
          description: 'Official size football'
        }
      }),
      prisma.product.create({
        data: {
          name: 'Badminton Racket Set',
          categoryId: categories[5].id,
          price: 2499,
          quantity: 10,
          minStock: 4,
          barcode: '123456789023',
          description: 'Professional badminton racket set with shuttlecocks'
        }
      }),

      // Toys
      prisma.product.create({
        data: {
          name: 'LEGO Building Set',
          categoryId: categories[6].id,
          price: 3999,
          quantity: 12,
          minStock: 5,
          barcode: '123456789024',
          description: 'Creative building blocks set 500 pieces'
        }
      }),
      prisma.product.create({
        data: {
          name: 'Remote Control Car',
          categoryId: categories[6].id,
          price: 2499,
          quantity: 8,
          minStock: 3,
          barcode: '123456789025',
          description: 'High-speed RC car with rechargeable battery'
        }
      }),

      // Beauty
      prisma.product.create({
        data: {
          name: 'Face Cream SPF 50',
          categoryId: categories[7].id,
          price: 899,
          quantity: 25,
          minStock: 10,
          barcode: '123456789026',
          description: 'Moisturizing face cream with sun protection'
        }
      }),
      prisma.product.create({
        data: {
          name: 'Shampoo Anti-Dandruff 400ml',
          categoryId: categories[7].id,
          price: 349,
          quantity: 30,
          minStock: 12,
          barcode: '123456789027',
          description: 'Anti-dandruff shampoo for all hair types'
        }
      }),

      // Automotive
      prisma.product.create({
        data: {
          name: 'Car Phone Holder',
          categoryId: categories[8].id,
          price: 599,
          quantity: 20,
          minStock: 8,
          barcode: '123456789028',
          description: 'Universal car phone mount holder'
        }
      }),
      prisma.product.create({
        data: {
          name: 'Car Air Freshener Set',
          categoryId: categories[8].id,
          price: 299,
          quantity: 40,
          minStock: 15,
          barcode: '123456789029',
          description: 'Long lasting car air freshener pack of 3'
        }
      }),

      // Office Supplies
      prisma.product.create({
        data: {
          name: 'A4 Paper Ream 500 sheets',
          categoryId: categories[9].id,
          price: 299,
          quantity: 50,
          minStock: 20,
          barcode: '123456789030',
          description: '75 GSM copier paper'
        }
      }),
      prisma.product.create({
        data: {
          name: 'Pen Set (Blue) Pack of 10',
          categoryId: categories[9].id,
          price: 99,
          quantity: 100,
          minStock: 40,
          barcode: '123456789031',
          description: 'Ball point pens blue ink'
        }
      }),
      prisma.product.create({
        data: {
          name: 'Notebook Spiral 200 pages',
          categoryId: categories[9].id,
          price: 149,
          quantity: 60,
          minStock: 25,
          barcode: '123456789032',
          description: 'Ruled spiral notebook'
        }
      }),
    ]);
    console.log(`✅ Created ${products.length} products\n`);

    // 3. Create Customers
    console.log('👥 Creating customers...');
    const customers = await Promise.all([
      prisma.customer.create({
        data: {
          name: 'Rajesh Kumar',
          phone: '9876543210',
          email: 'rajesh.kumar@example.com',
          address: '123 MG Road, Bangalore, Karnataka 560001'
        }
      }),
      prisma.customer.create({
        data: {
          name: 'Priya Sharma',
          phone: '9876543211',
          email: 'priya.sharma@example.com',
          address: '456 Park Street, Kolkata, West Bengal 700016'
        }
      }),
      prisma.customer.create({
        data: {
          name: 'Amit Patel',
          phone: '9876543212',
          email: 'amit.patel@example.com',
          address: '789 CG Road, Ahmedabad, Gujarat 380009'
        }
      }),
      prisma.customer.create({
        data: {
          name: 'Sneha Reddy',
          phone: '9876543213',
          email: 'sneha.reddy@example.com',
          address: '321 Banjara Hills, Hyderabad, Telangana 500034'
        }
      }),
      prisma.customer.create({
        data: {
          name: 'Vikram Singh',
          phone: '9876543214',
          email: 'vikram.singh@example.com',
          address: '654 Connaught Place, New Delhi 110001'
        }
      }),
      prisma.customer.create({
        data: {
          name: 'Anita Desai',
          phone: '9876543215',
          email: 'anita.desai@example.com',
          address: '987 Marine Drive, Mumbai, Maharashtra 400020'
        }
      }),
      prisma.customer.create({
        data: {
          name: 'Ravi Verma',
          phone: '9876543216',
          email: 'ravi.verma@example.com',
          address: '147 Anna Nagar, Chennai, Tamil Nadu 600040'
        }
      }),
      prisma.customer.create({
        data: {
          name: 'Kavita Nair',
          phone: '9876543217',
          email: 'kavita.nair@example.com',
          address: '258 MG Road, Kochi, Kerala 682016'
        }
      }),
      prisma.customer.create({
        data: {
          name: 'Suresh Gupta',
          phone: '9876543218',
          email: 'suresh.gupta@example.com',
          address: '369 Civil Lines, Jaipur, Rajasthan 302006'
        }
      }),
      prisma.customer.create({
        data: {
          name: 'Neha Agarwal',
          phone: '9876543219',
          email: 'neha.agarwal@example.com',
          address: '741 Sector 17, Chandigarh 160017'
        }
      }),
    ]);
    console.log(`✅ Created ${customers.length} customers\n`);

    // 4. Create Sales with Sale Items
    console.log('💰 Creating sales transactions...');
    const sales = [];
    
    // Sale 1
    const sale1 = await prisma.sale.create({
      data: {
        customerId: customers[0].id,
        totalAmount: 86899,
        taxAmount: 13234.73,
        paymentMethod: 'card',
        saleItems: {
          create: [
            {
              productId: products[0].id, // Laptop
              quantity: 1,
              unitPrice: 85000,
              totalPrice: 85000
            },
            {
              productId: products[3].id, // Wireless Mouse
              quantity: 1,
              unitPrice: 1299,
              totalPrice: 1299
            },
            {
              productId: products[5].id, // Cotton T-Shirt
              quantity: 1,
              unitPrice: 599,
              totalPrice: 599
            }
          ]
        }
      }
    });
    sales.push(sale1);

    // Sale 2
    const sale2 = await prisma.sale.create({
      data: {
        customerId: customers[1].id,
        totalAmount: 11898,
        taxAmount: 1811.39,
        paymentMethod: 'cash',
        saleItems: {
          create: [
            {
              productId: products[6].id, // Denim Jeans
              quantity: 2,
              unitPrice: 2499,
              totalPrice: 4998
            },
            {
              productId: products[7].id, // Formal Shirt
              quantity: 3,
              unitPrice: 1599,
              totalPrice: 4797
            },
            {
              productId: products[5].id, // Cotton T-Shirt
              quantity: 2,
              unitPrice: 599,
              totalPrice: 1198
            }
          ]
        }
      }
    });
    sales.push(sale2);

    // Sale 3
    const sale3 = await prisma.sale.create({
      data: {
        customerId: customers[2].id,
        totalAmount: 3948,
        taxAmount: 601.36,
        paymentMethod: 'upi',
        saleItems: {
          create: [
            {
              productId: products[9].id, // Organic Rice
              quantity: 3,
              unitPrice: 450,
              totalPrice: 1350
            },
            {
              productId: products[10].id, // Olive Oil
              quantity: 2,
              unitPrice: 899,
              totalPrice: 1798
            },
            {
              productId: products[11].id, // Almonds
              quantity: 1,
              unitPrice: 599,
              totalPrice: 599
            }
          ]
        }
      }
    });
    sales.push(sale3);

    // Sale 4
    const sale4 = await prisma.sale.create({
      data: {
        customerId: customers[3].id,
        totalAmount: 12978,
        taxAmount: 1976.10,
        paymentMethod: 'card',
        saleItems: {
          create: [
            {
              productId: products[8].id, // Sports Shoes
              quantity: 1,
              unitPrice: 7999,
              totalPrice: 7999
            },
            {
              productId: products[19].id, // Yoga Mat
              quantity: 2,
              unitPrice: 1599,
              totalPrice: 3198
            },
            {
              productId: products[21].id, // Football
              quantity: 1,
              unitPrice: 1299,
              totalPrice: 1299
            }
          ]
        }
      }
    });
    sales.push(sale4);

    // Sale 5 (Today's sale)
    const sale5 = await prisma.sale.create({
      data: {
        customerId: customers[4].id,
        totalAmount: 141398,
        taxAmount: 21526.37,
        paymentMethod: 'card',
        createdAt: new Date(),
        saleItems: {
          create: [
            {
              productId: products[1].id, // iPhone
              quantity: 1,
              unitPrice: 134900,
              totalPrice: 134900
            },
            {
              productId: products[4].id, // Mechanical Keyboard
              quantity: 1,
              unitPrice: 5999,
              totalPrice: 5999
            }
          ]
        }
      }
    });
    sales.push(sale5);

    // More sales for variety
    for (let i = 0; i < 10; i++) {
      const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
      const numItems = Math.floor(Math.random() * 3) + 1;
      const saleItems = [];
      let subtotal = 0;

      for (let j = 0; j < numItems; j++) {
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        const totalPrice = randomProduct.price * quantity;
        subtotal += totalPrice;
        
        saleItems.push({
          productId: randomProduct.id,
          quantity: quantity,
          unitPrice: randomProduct.price,
          totalPrice: totalPrice
        });
      }

      const taxAmount = subtotal * 0.18;
      const totalAmount = subtotal + taxAmount;

      const sale = await prisma.sale.create({
        data: {
          customerId: randomCustomer.id,
          totalAmount: totalAmount,
          taxAmount: taxAmount,
          paymentMethod: ['cash', 'card', 'upi'][Math.floor(Math.random() * 3)],
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000), // Random date within last 30 days
          saleItems: {
            create: saleItems
          }
        }
      });
      sales.push(sale);
    }

    console.log(`✅ Created ${sales.length} sales transactions\n`);

    // 5. Create Returns
    console.log('↩️ Creating return transactions...');
    const returns = [];

    // Return 1
    const return1 = await prisma.return.create({
      data: {
        saleId: sale2.id,
        customerId: customers[1].id,
        reason: 'Size does not fit - need larger size',
        status: 'completed',
        refundAmount: 2499,
        processedBy: 'Admin',
        returnItems: {
          create: [
            {
              productId: products[6].id, // Denim Jeans
              quantity: 1,
              unitPrice: 2499,
              totalPrice: 2499
            }
          ]
        }
      }
    });
    returns.push(return1);

    // Return 2
    const return2 = await prisma.return.create({
      data: {
        saleId: sale3.id,
        customerId: customers[2].id,
        reason: 'Product quality not as expected',
        status: 'processing',
        refundAmount: 899,
        processedBy: 'Staff',
        returnItems: {
          create: [
            {
              productId: products[10].id, // Olive Oil
              quantity: 1,
              unitPrice: 899,
              totalPrice: 899
            }
          ]
        }
      }
    });
    returns.push(return2);

    console.log(`✅ Created ${returns.length} return transactions\n`);

    // 6. Create Expenses
    console.log('💸 Creating expense records...');
    const expenses = await Promise.all([
      prisma.expense.create({
        data: {
          category: 'Rent',
          amount: 50000,
          description: 'Monthly shop rent',
          date: new Date('2024-01-01')
        }
      }),
      prisma.expense.create({
        data: {
          category: 'Electricity',
          amount: 8500,
          description: 'Monthly electricity bill',
          date: new Date('2024-01-05')
        }
      }),
      prisma.expense.create({
        data: {
          category: 'Salaries',
          amount: 120000,
          description: 'Staff salaries for January',
          date: new Date('2024-01-31')
        }
      }),
      prisma.expense.create({
        data: {
          category: 'Internet',
          amount: 1500,
          description: 'Monthly internet bill',
          date: new Date('2024-01-10')
        }
      }),
      prisma.expense.create({
        data: {
          category: 'Maintenance',
          amount: 5000,
          description: 'AC servicing and repairs',
          date: new Date('2024-01-15')
        }
      }),
      prisma.expense.create({
        data: {
          category: 'Marketing',
          amount: 15000,
          description: 'Social media ads and promotions',
          date: new Date('2024-01-20')
        }
      }),
      prisma.expense.create({
        data: {
          category: 'Office Supplies',
          amount: 3500,
          description: 'Stationery and printing',
          date: new Date('2024-01-25')
        }
      }),
    ]);
    console.log(`✅ Created ${expenses.length} expense records\n`);

    // 7. Update product quantities (simulate some products being low on stock)
    console.log('📊 Adjusting some product quantities for low stock alerts...');
    await prisma.product.update({
      where: { id: products[1].id },
      data: { quantity: 2 } // iPhone low stock
    });
    await prisma.product.update({
      where: { id: products[5].id },
      data: { quantity: 8 } // Cotton T-Shirt low stock
    });
    await prisma.product.update({
      where: { id: products[13].id },
      data: { quantity: 2 } // JavaScript Book low stock
    });
    console.log('✅ Adjusted product quantities\n');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📈 Summary:');
    console.log(`   • Categories: ${categories.length}`);
    console.log(`   • Products: ${products.length}`);
    console.log(`   • Customers: ${customers.length}`);
    console.log(`   • Sales: ${sales.length}`);
    console.log(`   • Returns: ${returns.length}`);
    console.log(`   • Expenses: ${expenses.length}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });