const Database = require('better-sqlite3');
const path = require('path');

let db;

function getDb() {
    if (!db) {
        db = new Database(path.join(__dirname, '../../products.db'));
        db.pragma('journal_mode = WAL');
        initializeSchema();
        seedData();
    }
    return db;
}

function initializeSchema() {
    db.exec(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            price_cents INTEGER NOT NULL,
            category TEXT NOT NULL,
            in_stock INTEGER DEFAULT 1,
            rating REAL DEFAULT 0,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
    `);
}

function seedData() {
    const count = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
    if (count > 0) return;

    const insert = db.prepare(`
        INSERT INTO products (name, description, price_cents, category, in_stock, rating, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // NOTE: The highest-rated products were added early (older dates).
    // The newest products have moderate ratings.
    // This matters because the "featured" logic shows top-rated items on page 1,
    // but those items naturally belong on later pages (older dates).
    const products = [
        // === Oldest products (page 5 in date-descending order) — HIGHEST ratings ===
        ['Ergonomic Standing Desk', 'Height-adjustable bamboo desk', 34999, 'office', 1, 4.9, '2024-10-01T09:00:00Z', '2024-10-01T09:00:00Z'],
        ['Noise Cancelling Earbuds Pro', 'Active noise cancelling, 30hr battery', 12999, 'electronics', 1, 4.9, '2024-10-02T10:00:00Z', '2024-10-02T10:00:00Z'],
        ['Cast Iron Dutch Oven', 'Enameled 6-quart, oven-safe', 7999, 'home', 1, 4.8, '2024-10-03T11:00:00Z', '2024-10-03T11:00:00Z'],
        ['Premium Yoga Mat', 'Non-slip natural rubber, 6mm', 4999, 'fitness', 1, 4.7, '2024-10-04T12:00:00Z', '2024-10-04T12:00:00Z'],
        ['Designing Data-Intensive Apps', 'Martin Kleppmann', 4299, 'books', 1, 4.8, '2024-10-05T13:00:00Z', '2024-10-05T13:00:00Z'],

        // === Older products (page 4) — good ratings ===
        ['Mechanical Keyboard TKL', 'Gateron Brown switches, PBT keycaps', 8999, 'electronics', 1, 4.5, '2024-10-15T09:00:00Z', '2024-10-15T09:00:00Z'],
        ['Bamboo Cutting Board Set', 'Set of 3 with juice groove', 3299, 'home', 1, 4.3, '2024-10-16T10:00:00Z', '2024-10-16T10:00:00Z'],
        ['Resistance Bands Set', '5 bands with handles and door anchor', 1999, 'fitness', 1, 4.4, '2024-10-17T11:00:00Z', '2024-10-17T11:00:00Z'],
        ['Monitor Light Bar', 'Screen-mounted LED, auto-dimming', 5999, 'office', 1, 4.6, '2024-10-18T12:00:00Z', '2024-10-18T12:00:00Z'],
        ['Clean Code', 'Robert C. Martin', 3499, 'books', 1, 4.5, '2024-10-19T13:00:00Z', '2024-10-19T13:00:00Z'],

        // === Middle products (page 3) — average ratings ===
        ['USB-C Hub 7-in-1', 'HDMI, USB-A, SD card, ethernet', 3999, 'electronics', 1, 4.1, '2024-11-01T09:00:00Z', '2024-11-01T09:00:00Z'],
        ['French Press Coffee Maker', '8-cup stainless steel press', 2999, 'home', 0, 4.0, '2024-11-02T10:00:00Z', '2024-11-02T10:00:00Z'],
        ['Jump Rope Speed', 'Ball bearing handles, adjustable', 1499, 'fitness', 1, 3.9, '2024-11-03T11:00:00Z', '2024-11-03T11:00:00Z'],
        ['Notebook 5-Pack', 'A5 dotted, 80gsm paper', 1199, 'office', 1, 4.2, '2024-11-04T12:00:00Z', '2024-11-04T12:00:00Z'],
        ['The Pragmatic Programmer', 'Hunt & Thomas', 3999, 'books', 1, 4.3, '2024-11-05T13:00:00Z', '2024-11-05T13:00:00Z'],

        // === Newer products (page 2) — moderate ratings ===
        ['Webcam 1080p', 'HD webcam with ring light', 4999, 'electronics', 1, 3.8, '2024-11-15T09:00:00Z', '2024-11-15T09:00:00Z'],
        ['LED Desk Lamp', 'Adjustable color temp, USB charging', 4499, 'home', 1, 4.0, '2024-11-16T10:00:00Z', '2024-11-16T10:00:00Z'],
        ['Foam Roller 18"', 'High-density EVA, textured', 2499, 'fitness', 0, 3.7, '2024-11-17T11:00:00Z', '2024-11-17T11:00:00Z'],
        ['Cable Management Kit', 'Clips, ties, and sleeves', 1899, 'office', 1, 3.6, '2024-11-18T12:00:00Z', '2024-11-18T12:00:00Z'],
        ['System Design Interview', 'Alex Xu', 3499, 'books', 1, 4.1, '2024-11-19T13:00:00Z', '2024-11-19T13:00:00Z'],

        // === Newest products (page 1 naturally) — LOW ratings (just added) ===
        ['Wireless Bluetooth Headphones', 'Over-ear, 40hr battery', 7999, 'electronics', 1, 3.2, '2024-12-01T09:00:00Z', '2024-12-01T09:00:00Z'],
        ['Stainless Steel Water Bottle', 'Insulated 750ml, leak-proof', 2499, 'home', 1, 3.5, '2024-12-02T10:00:00Z', '2024-12-02T10:00:00Z'],
        ['Dumbbell Set Adjustable', '5-25lbs, rubber-coated', 14999, 'fitness', 1, 3.3, '2024-12-03T11:00:00Z', '2024-12-03T11:00:00Z'],
        ['Wireless Presenter Remote', 'Laser pointer, USB-C receiver', 2499, 'office', 1, 3.4, '2024-12-04T12:00:00Z', '2024-12-04T12:00:00Z'],
        ['Refactoring', 'Martin Fowler, 2nd Edition', 4499, 'books', 1, 3.6, '2024-12-05T13:00:00Z', '2024-12-05T13:00:00Z'],
    ];

    const insertMany = db.transaction((items) => {
        for (const item of items) {
            insert.run(...item);
        }
    });

    insertMany(products);
}

function resetDb() {
    if (db) {
        db.close();
        db = null;
    }
    const fs = require('fs');
    const dbPath = path.join(__dirname, '../../products.db');
    if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath);
    }
}

module.exports = { getDb, resetDb };
