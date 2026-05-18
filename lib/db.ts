import Database from 'better-sqlite3';
import path from 'path';

// Store DB in the root of the project
const dbPath = path.join(process.cwd(), 'expenses.db');
const db = new Database(dbPath);

// Initialize table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    amount REAL NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('food', 'transport', 'utilities', 'other')),
    date TEXT NOT NULL,
    createdAt TEXT NOT NULL
  )
`);

export default db;
