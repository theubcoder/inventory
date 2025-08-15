import sql from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initializeDatabase() {
  try {
    if (!sql) {
      console.log('Database connection not configured. Please set DATABASE_URL in .env.local');
      return;
    }

    console.log('Initializing database...');
    
    // Read the schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split the schema into individual statements
    const statements = schema
      .split(';')
      .filter(statement => statement.trim() !== '')
      .map(statement => statement.trim() + ';');
    
    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        await sql(statement);
      }
    }
    
    console.log('Database initialized successfully!');
    
    // Insert some sample data
    await insertSampleData();
    
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

async function insertSampleData() {
  try {
    console.log('Inserting sample data...');
    
    // Check if products already exist
    const existingProducts = await sql`SELECT COUNT(*) as count FROM products`;
    
    if (existingProducts[0].count > 0) {
      console.log('Sample data already exists');
      return;
    }
    
    // Get category IDs
    const categories = await sql`SELECT id, name FROM categories`;
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat.id;
    });
    
    // Insert sample products
    const sampleProducts = [
      { name: 'Laptop Dell XPS 13', category: 'Electronics', price: 85000, quantity: 15, min_stock: 5, barcode: '123456789' },
      { name: 'Cotton T-Shirt', category: 'Clothing', price: 599, quantity: 50, min_stock: 10, barcode: '987654321' },
      { name: 'Organic Rice 5kg', category: 'Food', price: 450, quantity: 25, min_stock: 10, barcode: '456789123' },
      { name: 'JavaScript Book', category: 'Books', price: 899, quantity: 8, min_stock: 5, barcode: '789123456' },
      { name: 'Wireless Mouse', category: 'Electronics', price: 1299, quantity: 30, min_stock: 10, barcode: '321654987' },
      { name: 'Yoga Mat', category: 'Sports', price: 1599, quantity: 20, min_stock: 5, barcode: '654321789' },
    ];
    
    for (const product of sampleProducts) {
      await sql`
        INSERT INTO products (name, category_id, price, quantity, min_stock, barcode)
        VALUES (${product.name}, ${categoryMap[product.category]}, ${product.price}, 
                ${product.quantity}, ${product.min_stock}, ${product.barcode})
      `;
    }
    
    console.log('Sample data inserted successfully!');
    
  } catch (error) {
    console.error('Error inserting sample data:', error);
  }
}

// Run initialization if this file is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  initializeDatabase().then(() => {
    process.exit(0);
  }).catch(error => {
    console.error(error);
    process.exit(1);
  });
}