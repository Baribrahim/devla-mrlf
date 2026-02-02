const { getDb } = require('./database');
const bcrypt = require('bcryptjs');

/**
 * Find a user by email
 */
function findByEmail(email) {
    const db = getDb();
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
}

/**
 * Find a user by ID
 */
function findById(id) {
    const db = getDb();
    return db.prepare('SELECT id, email, name, role, created_at FROM users WHERE id = ?').get(id);
}

/**
 * Verify user credentials
 * Returns user object without password if valid, null otherwise
 */
function verifyCredentials(email, password) {
    const user = findByEmail(email);

    if (!user) {
        return null;
    }

    const isValid = bcrypt.compareSync(password, user.password);

    if (!isValid) {
        return null;
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

/**
 * Get all users (admin function)
 */
function getAllUsers() {
    const db = getDb();
    return db.prepare('SELECT id, email, name, role, created_at FROM users').all();
}

/**
 * Get user count by role (admin stats)
 */
function getUserCountByRole() {
    const db = getDb();
    const results = db.prepare(`
    SELECT role, COUNT(*) as count 
    FROM users 
    GROUP BY role
  `).all();

    return results.reduce((acc, row) => {
        acc[row.role] = row.count;
        return acc;
    }, {});
}

module.exports = {
    findByEmail,
    findById,
    verifyCredentials,
    getAllUsers,
    getUserCountByRole
};
