const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

let db = null;

function getDb() {
    if (!db) {
        db = new Database(':memory:');
        initializeDatabase();
    }
    return db;
}

function initializeDatabase() {
    const database = getDb();

    // Create users table
    database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // Seed with test users
    const seedUsers = [
        { email: 'admin@dashly.io', password: 'admin123', name: 'Alex Admin', role: 'admin' },
        { email: 'mod@dashly.io', password: 'mod123', name: 'Morgan Moderator', role: 'moderator' },
        { email: 'user@dashly.io', password: 'user123', name: 'Uma User', role: 'user' }
    ];

    const insertStmt = database.prepare(`
    INSERT OR IGNORE INTO users (email, password, name, role)
    VALUES (?, ?, ?, ?)
  `);

    for (const user of seedUsers) {
        const hashedPassword = bcrypt.hashSync(user.password, 10);
        insertStmt.run(user.email, hashedPassword, user.name, user.role);
    }
}

function resetDatabase() {
    if (db) {
        db.close();
        db = null;
    }
    getDb(); // Reinitialize
}

module.exports = { getDb, resetDatabase };
