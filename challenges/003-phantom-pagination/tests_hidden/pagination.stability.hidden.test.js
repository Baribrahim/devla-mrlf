const request = require('supertest');
const app = require('../src/app');
const { resetDb, getDb } = require('../src/db/database');

beforeEach(() => {
    resetDb();
});

afterAll(() => {
    resetDb();
});

describe('Pagination Stability — Hidden Tests', () => {

    test('featured products on page 1 should not reappear on any later page', async () => {
        const page1Res = await request(app).get('/api/products?page=1&limit=5');
        const page1Ids = page1Res.body.products.map(p => p.id);

        // Check ALL subsequent pages, not just 2 and 3
        const totalPages = page1Res.body.pagination.totalPages;
        for (let page = 2; page <= totalPages; page++) {
            const res = await request(app).get(`/api/products?page=${page}&limit=5`);
            const pageIds = res.body.products.map(p => p.id);

            const overlap = page1Ids.filter(id => pageIds.includes(id));
            expect(overlap).toEqual([]);
        }
    });

    test('no overlap between any pair of pages', async () => {
        const allPages = [];
        for (let page = 1; page <= 5; page++) {
            const res = await request(app).get(`/api/products?page=${page}&limit=5`);
            allPages.push(res.body.products.map(p => p.id));
        }

        for (let i = 0; i < allPages.length; i++) {
            for (let j = i + 1; j < allPages.length; j++) {
                const overlap = allPages[i].filter(id => allPages[j].includes(id));
                expect(overlap).toEqual([]);
            }
        }
    });

    test('category-filtered pagination also produces no duplicates', async () => {
        const allProducts = [];
        for (let page = 1; page <= 3; page++) {
            const res = await request(app).get(`/api/products?page=${page}&limit=2&category=electronics`);
            allProducts.push(...res.body.products);
        }

        const ids = allProducts.map(p => p.id);
        const uniqueIds = new Set(ids);

        expect(uniqueIds.size).toBe(ids.length);
        expect(ids.length).toBe(5);
    });

    test('last page contains exactly the remaining products', async () => {
        // 25 products, limit 7 = 4 pages (7, 7, 7, 4)
        const res = await request(app).get('/api/products?page=4&limit=7');

        expect(res.status).toBe(200);
        expect(res.body.products).toHaveLength(4);
        expect(res.body.pagination.totalPages).toBe(4);
    });

    test('requesting a page beyond total returns empty array', async () => {
        const res = await request(app).get('/api/products?page=100&limit=10');

        expect(res.status).toBe(200);
        expect(res.body.products).toHaveLength(0);
    });

    test('total product count matches actual unique products across all pages', async () => {
        const res1 = await request(app).get('/api/products?page=1&limit=10');
        const expectedTotal = res1.body.pagination.total;

        const allProducts = [];
        const totalPages = res1.body.pagination.totalPages;

        for (let page = 1; page <= totalPages; page++) {
            const res = await request(app).get(`/api/products?page=${page}&limit=10`);
            allProducts.push(...res.body.products);
        }

        const uniqueIds = new Set(allProducts.map(p => p.id));
        expect(uniqueIds.size).toBe(expectedTotal);
    });

    test('in-stock filter combined with pagination produces complete unique results', async () => {
        const firstPage = await request(app).get('/api/products?page=1&limit=5&inStock=true');
        const total = firstPage.body.pagination.total;
        const totalPages = firstPage.body.pagination.totalPages;

        const allProducts = [];
        for (let page = 1; page <= totalPages; page++) {
            const res = await request(app).get(`/api/products?page=${page}&limit=5&inStock=true`);
            allProducts.push(...res.body.products);
        }

        const ids = allProducts.map(p => p.id);
        const uniqueIds = new Set(ids);

        expect(uniqueIds.size).toBe(total);
        allProducts.forEach(p => {
            expect(p.in_stock).toBe(1);
        });
    });
});
