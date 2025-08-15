-- Check all tables in the public schema
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Count records in each table
SELECT 'categories' as table_name, COUNT(*) as record_count FROM categories
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'customers', COUNT(*) FROM customers
UNION ALL
SELECT 'sales', COUNT(*) FROM sales
UNION ALL
SELECT 'sale_items', COUNT(*) FROM sale_items
UNION ALL
SELECT 'returns', COUNT(*) FROM returns
UNION ALL
SELECT 'return_items', COUNT(*) FROM return_items
UNION ALL
SELECT 'expenses', COUNT(*) FROM expenses
ORDER BY table_name;

-- Show sample products
SELECT id, name, price, quantity, min_stock 
FROM products 
LIMIT 5;

-- Show sample sales
SELECT s.id, s.total_amount, s.payment_method, c.name as customer_name
FROM sales s
LEFT JOIN customers c ON s.customer_id = c.id
ORDER BY s.created_at DESC
LIMIT 5;