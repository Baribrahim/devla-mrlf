const request = require('supertest');
const app = require('../src/app');
const { resetDb } = require('../src/db/database');

beforeEach(() => {
    resetDb();
});

afterAll(() => {
    resetDb();
});

describe('Product Pagination — Visible Tests', () => {

    test('GET /api/products returns first page of products with pagination metadata', async () => {
        const res = await request(app).get('/api/products?page=1&limit=5');

        expect(res.status).toBe(200);
        expect(res.body.products).toHaveLength(5);
        expect(res.body.pagination).toMatchObject({
            page: 1,
            limit: 5,
            total: 25,
            totalPages: 5,
        });
    });

    test('all products across all pages should be unique — no duplicates', async () => {
        const allProducts = [];

        for (let page = 1; page <= 5; page++) {
            const res = await request(app).get(`/api/products?page=${page}&limit=5`);
            expect(res.status).toBe(200);
            allProducts.push(...res.body.products);
        }

        // Every product ID should appear exactly once across all pages
        const ids = allProducts.map(p => p.id);
        const uniqueIds = new Set(ids);

        expect(ids.length).toBe(25);
        expect(uniqueIds.size).toBe(25);
    });

    test('no product should be missing when paginating through all pages', async () => {
        const allProducts = [];

        for (let page = 1; page <= 5; page++) {
            const res = await request(app).get(`/api/products?page=${page}&limit=5`);
            allProducts.push(...res.body.products);
        }

        // Should have collected all 25 products
        const ids = allProducts.map(p => p.id).sort((a, b) => a - b);
        const expected = Array.from({ length: 25 }, (_, i) => i + 1);

        expect(ids).toEqual(expected);
    });

    test('category filter returns only products in that category', async () => {
        const res = await request(app).get('/api/products?category=electronics');

        expect(res.status).toBe(200);
        expect(res.body.products.length).toBeGreaterThan(0);
        res.body.products.forEach(p => {
            expect(p.category).toBe('electronics');
        });
    });

    test('GET /api/products/:id returns a single product', async () => {
        const res = await request(app).get('/api/products/1');

        expect(res.status).toBe(200);
        expect(res.body.product).toBeDefined();
        expect(res.body.product.id).toBe(1);
    });

});
