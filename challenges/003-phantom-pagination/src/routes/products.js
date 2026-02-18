const express = require('express');
const { getProducts, getProductById, searchProducts } = require('../db/productsRepo');
const { parsePaginationParams, buildPaginationLinks } = require('../utils/pagination');

const router = express.Router();

/**
 * GET /api/products
 * List products with pagination. Supports category and stock filters.
 *
 * Query params:
 *   - page (number, default: 1)
 *   - limit (number, default: 10, max: 50)
 *   - category (string, optional)
 *   - inStock (boolean, optional)
 */
router.get('/', (req, res) => {
    try {
        const { page, limit } = parsePaginationParams(req.query);
        const category = req.query.category || null;
        const inStock = req.query.inStock !== undefined
            ? req.query.inStock === 'true'
            : null;

        const result = getProducts({ page, limit, category, inStock });

        const links = buildPaginationLinks('/api/products', {
            page,
            limit,
            totalPages: result.pagination.totalPages,
        });

        res.json({
            ...result,
            links,
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch products', message: err.message });
    }
});

/**
 * GET /api/products/search
 * Search products by name.
 *
 * Query params:
 *   - q (string, required)
 *   - page (number, default: 1)
 *   - limit (number, default: 10)
 */
router.get('/search', (req, res) => {
    try {
        const { q } = req.query;
        if (!q || typeof q !== 'string') {
            return res.status(400).json({ error: 'Search query "q" is required' });
        }

        const { page, limit } = parsePaginationParams(req.query);
        const result = searchProducts(q, { page, limit });

        const links = buildPaginationLinks('/api/products/search', {
            page,
            limit,
            totalPages: result.pagination.totalPages,
        });

        res.json({
            ...result,
            links,
        });
    } catch (err) {
        res.status(500).json({ error: 'Search failed', message: err.message });
    }
});

/**
 * GET /api/products/:id
 * Get a single product by ID.
 */
router.get('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid product ID' });
        }

        const product = getProductById(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ product });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch product', message: err.message });
    }
});

module.exports = { productsRouter: router };
