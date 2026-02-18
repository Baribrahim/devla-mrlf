const Database = require('better-sqlite3');
const path = require('path');

let db;

function getDb() {
    if (!db) {
        db = new Database(path.join(__dirname, '../../webhooks.db'));
        db.pragma('journal_mode = WAL');
        initializeSchema();
        seedData();
    }
    return db;
}

function initializeSchema() {
    db.exec(`
        CREATE TABLE IF NOT EXISTS webhook_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_id TEXT NOT NULL,
            type TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'received',
            payload TEXT NOT NULL,
            attempts INTEGER DEFAULT 0,
            last_error TEXT,
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
            processed_at TEXT,
            failed_at TEXT
        )
    `);

    db.exec(`
        CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            customer_email TEXT NOT NULL,
            amount_cents INTEGER NOT NULL,
            currency TEXT DEFAULT 'usd',
            status TEXT DEFAULT 'pending',
            fulfilled_at TEXT
        )
    `);

    db.exec(`
        CREATE TABLE IF NOT EXISTS fulfillment_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id TEXT NOT NULL,
            action TEXT NOT NULL,
            details TEXT,
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
        )
    `);
}

function seedData() {
    const count = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
    if (count > 0) return;

    const insert = db.prepare(`
        INSERT INTO orders (id, customer_email, amount_cents, currency, status)
        VALUES (?, ?, ?, ?, ?)
    `);

    const orders = [
        ['ord_001', 'alice@example.com', 4999, 'usd', 'pending'],
        ['ord_002', 'bob@example.com', 12999, 'usd', 'pending'],
        ['ord_003', 'carol@example.com', 7500, 'usd', 'pending'],
        ['ord_004', 'dave@example.com', 2999, 'usd', 'pending'],
        ['ord_005', 'eve@example.com', 8999, 'usd', 'pending'],
    ];

    const insertMany = db.transaction((items) => {
        for (const item of items) {
            insert.run(...item);
        }
    });

    insertMany(orders);
}

function resetDb() {
    if (db) {
        db.close();
        db = null;
    }
    const fs = require('fs');
    const dbPath = path.join(__dirname, '../../webhooks.db');
    if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath);
    }
}

module.exports = { getDb, resetDb };
