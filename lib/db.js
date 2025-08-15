import { neon } from '@neondatabase/serverless';

let sql;

if (!process.env.DATABASE_URL) {
  console.warn('DATABASE_URL not found in environment variables');
  // You can set a default or throw an error
  // throw new Error('DATABASE_URL is required');
}

if (process.env.DATABASE_URL) {
  sql = neon(process.env.DATABASE_URL);
}

export default sql;