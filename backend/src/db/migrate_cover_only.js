import 'dotenv/config';
import mysql from 'mysql2/promise';

const statements = [
  'ALTER TABLE books MODIFY COLUMN cover_url LONGTEXT NULL',
  'ALTER TABLE books DROP COLUMN cover_s3_key',
  'ALTER TABLE books DROP COLUMN document_url',
  'ALTER TABLE books DROP COLUMN document_s3_key',
  'ALTER TABLE books DROP COLUMN document_name',
  'ALTER TABLE books DROP COLUMN document_type',
];

const conn = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: Number.parseInt(process.env.PORT, 10) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'booksapp',
});

try {
  for (const sql of statements) {
    try {
      await conn.execute(sql);
      console.log(`Applied: ${sql}`);
    } catch (err) {
      if (err.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
        console.log(`Skipped missing column: ${sql}`);
        continue;
      }
      throw err;
    }
  }
  console.log('Cover-only migration complete.');
} finally {
  await conn.end();
}
