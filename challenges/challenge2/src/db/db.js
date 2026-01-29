const Database = require("better-sqlite3");

let db;

/**
 * In production this would be a real database connection pool.
 * For tests we use a single in-memory DB per process.
 */
function getDb() {
  if (!db) {
    db = new Database(":memory:");
    migrate(db);
  }
  return db;
}

function migrate(d) {
  d.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      amount_cents INTEGER NOT NULL,
      currency TEXT NOT NULL,
      status TEXT NOT NULL,
      idempotency_key TEXT,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS charges (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      idempotency_key TEXT,
      created_at INTEGER NOT NULL
    );
  `);
}

function resetDb() {
  db = null;
}

module.exports = { getDb, resetDb };
