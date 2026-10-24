#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SCHEMA_FILE = path.resolve(__dirname, '../server/src/db/schema.sql');
const DATA_STORAGE = path.resolve(__dirname, '../data/ats_mysql_storage.json');

const DB_HOST = process.env.DB_HOST || process.env.MYSQL_HOST || '127.0.0.1';
const DB_PORT = parseInt(process.env.DB_PORT || process.env.MYSQL_PORT || '3306', 10);
const DB_USER = process.env.DB_USER || process.env.MYSQL_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD ?? process.env.MYSQL_PASSWORD ?? '';
const DB_NAME = process.env.DB_NAME || process.env.MYSQL_DATABASE || 'enterprise_ats';

async function main() {
  console.log('====================================================');
  console.log('🐬 Enterprise ATS: MySQL Relational Database Setup');
  console.log('====================================================');
  console.log(`Target Host:     ${DB_HOST}:${DB_PORT}`);
  console.log(`Database User:   ${DB_USER}`);
  console.log(`Target Database: ${DB_NAME}`);
  console.log('----------------------------------------------------');

  let mysql;
  try {
    mysql = (await import('mysql2/promise')).default;
  } catch (e) {
    console.error('❌ Failed to load mysql2 module. Run: npm install mysql2');
    process.exit(1);
  }

  let connection;
  let nativeSuccess = false;

  try {
    console.log('Connecting to MySQL Server...');
    connection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      multipleStatements: true,
      connectTimeout: 5000
    });

    console.log('✅ Connected to MySQL Server successfully.');

    // 1. Create Database if not exists
    console.log(`Creating database \`${DB_NAME}\` if not exists...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await connection.query(`USE \`${DB_NAME}\`;`);

    // 2. Read and apply schema.sql
    if (!fs.existsSync(SCHEMA_FILE)) {
      throw new Error(`Schema file not found at: ${SCHEMA_FILE}`);
    }

    console.log('Applying relational schema from server/src/db/schema.sql...');
    const ddl = fs.readFileSync(SCHEMA_FILE, 'utf-8');
    await connection.query(ddl);
    console.log('✅ Relational schema tables created successfully.');

    // 3. Inspect tables in database
    const [rows] = await connection.query('SHOW TABLES;');
    const tableKey = Object.keys(rows[0] || {})[0];
    const tableNames = rows.map(r => r[tableKey]);

    console.log(`\n📊 Verified ${tableNames.length} Relational Tables in MySQL:`);
    tableNames.forEach((tbl, idx) => {
      console.log(`   ${(idx + 1).toString().padStart(2, ' ')}. ${tbl}`);
    });

    nativeSuccess = true;
    console.log('\n🎉 MySQL Database initialization completed successfully!');
  } catch (err) {
    console.warn(`\n⚠️  Could not connect to Native MySQL Daemon: ${err.message}`);
    console.log('\n💡 To run a native MySQL server:');
    console.log('   - On macOS:   brew services start mysql');
    console.log('   - On Ubuntu:  sudo systemctl start mysql');
    console.log('   - Via Docker: docker run --name ats-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=enterprise_ats -p 3306:3306 -d mysql:8.0');
    console.log('\n🛡️ ATS will automatically operate with its zero-downtime Relational Engine fallback.');
  } finally {
    if (connection) {
      await connection.end();
    }
  }

  // Ensure JSON Relational Storage is also synced
  try {
    if (!fs.existsSync(path.dirname(DATA_STORAGE))) {
      fs.mkdirSync(path.dirname(DATA_STORAGE), { recursive: true });
    }
    const mainDbPath = path.resolve(__dirname, '../data/ats_database.json');
    if (fs.existsSync(mainDbPath) && !fs.existsSync(DATA_STORAGE)) {
      fs.copyFileSync(mainDbPath, DATA_STORAGE);
      console.log(`\n📁 Seeded fallback relational storage: ${DATA_STORAGE}`);
    }
  } catch (e) {
    // ignore
  }

  console.log('====================================================\n');
}

main().catch(err => {
  console.error('Fatal error during MySQL setup:', err);
  process.exit(1);
});
