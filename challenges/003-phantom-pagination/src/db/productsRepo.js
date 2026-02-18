const { getDb } = require('./database');

/**
 * Get products with pagination and optional filters.
 *
 * This was built quickly before launch — the product team needed
 * the catalog API ready for the marketing site. It works fine in
 * development with a small dataset.
 */
function getProducts({ page = 1, limit = 10, category = null, inStock = null } = {}) {
    const db = getDb();

    let whereClause = '';
    const params = [];
    const conditions = [];

    if (category) {
        conditions.push('category = ?');
        params.push(category);
    }
    if (inStock !== null) {
        conditions.push('in_stock = ?');
        params.push(inStock ? 1 : 0);
    }

    if (conditions.length > 0) {
        whereClause = 'WHERE ' + conditions.join(' AND ');
    }

    // Get total count for pagination metadata
    const countQuery = `SELECT COUNT(*) as total FROM products ${whereClause}`;
    const { total } = db.prepare(countQuery).get(...params);

    const totalPages = Math.ceil(total / limit);

    // Fetch the page of products
    // The featured products logic was added last week to highlight
    // top-rated items. It prepends them to page 1 results.
    const offset = (page - 1) * limit;

    let products;

    if (page === 1) {
        // Page 1: show featured products first, then fill remaining slots
        const featured = _getFeaturedProducts(db, whereClause, params, 2);
        const featuredIds = featured.map(p => p.id);

        const remainingLimit = limit - featured.length;

        // Fetch remaining products excluding featured ones
        let excludeClause = '';
        const remainingParams = [...params];
        if (featuredIds.length > 0) {
            excludeClause = whereClause
                ? ` AND id NOT IN (${featuredIds.join(',')})`
                : `WHERE id NOT IN (${featuredIds.join(',')})`;
        }

        const remainingQuery = `
            SELECT id, name, description, price_cents, category, in_stock, rating, created_at, updated_at
            FROM products
            ${whereClause}${excludeClause}
            ORDER BY created_at DESC
            LIMIT ?
        `;

        const remaining = db.prepare(remainingQuery).all(...remainingParams, remainingLimit);
        products = [...featured, ...remaining];
    } else {
        // Other pages: standard offset pagination
        // BUG: offset doesn't account for the featured products that were
        // prepended on page 1. Featured items appear on page 1 AND again
        // at their natural position on later pages.
        const query = `
            SELECT id, name, description, price_cents, category, in_stock, rating, created_at, updated_at
            FROM products
            ${whereClause}
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
        `;
        products = db.prepare(query).all(...params, limit, offset);
    }

    return {
        products,
        pagination: {
            page,
            limit,
            total,
            totalPages,
        },
    };
}

/**
 * Get top-rated "featured" products.
 * Added last sprint to highlight popular items on page 1.
 */
function _getFeaturedProducts(db, whereClause, params, count) {
    const query = `
        SELECT id, name, description, price_cents, category, in_stock, rating, created_at, updated_at
        FROM products
        ${whereClause}
        ORDER BY rating DESC, created_at DESC
        LIMIT ?
    `;
    return db.prepare(query).all(...params, count);
}

/**
 * Get a single product by ID.
 */
function getProductById(id) {
    const db = getDb();
    return db.prepare('SELECT * FROM products WHERE id = ?').get(id);
}

/**
 * Search products by name.
 */
function searchProducts(query, { page = 1, limit = 10 } = {}) {
    const db = getDb();
    const offset = (page - 1) * limit;
    const searchTerm = `%${query}%`;

    const countResult = db.prepare(
        'SELECT COUNT(*) as total FROM products WHERE name LIKE ?'
    ).get(searchTerm);

    const products = db.prepare(`
        SELECT id, name, description, price_cents, category, in_stock, rating, created_at, updated_at
        FROM products
        WHERE name LIKE ?
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
    `).all(searchTerm, limit, offset);

    return {
        products,
        pagination: {
            page,
            limit,
            total: countResult.total,
            totalPages: Math.ceil(countResult.total / limit),
        },
    };
}

module.exports = { getProducts, getProductById, searchProducts };
