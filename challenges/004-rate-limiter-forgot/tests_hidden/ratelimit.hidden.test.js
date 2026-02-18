const request = require('supertest');
const app = require('../src/app');
const { resetRateLimiter, MAX_REQUESTS, WINDOW_MS } = require('../src/middleware/rateLimiter');

beforeEach(() => {
    resetRateLimiter();
});

describe('Rate Limiter — Hidden Tests', () => {

    test('X-Forwarded-For with multiple IPs should use the first (client) IP', async () => {
        const clientIp = '203.0.113.50';
        const forwardedHeader = `${clientIp}, 10.0.0.1, 10.0.0.2`;

        // Exhaust the rate limit using the full forwarded header
        for (let i = 0; i < MAX_REQUESTS; i++) {
            await request(app)
                .get('/api/data')
                .set('X-Forwarded-For', forwardedHeader);
        }

        // Should be blocked
        const blocked = await request(app)
            .get('/api/data')
            .set('X-Forwarded-For', forwardedHeader);
        expect(blocked.status).toBe(429);

        // A different client through the same proxy should NOT be blocked
        const differentClient = `198.51.100.25, 10.0.0.1, 10.0.0.2`;
        const allowed = await request(app)
            .get('/api/data')
            .set('X-Forwarded-For', differentClient);
        expect(allowed.status).toBe(200);
    });

    test('429 response includes Retry-After header', async () => {
        const ip = '10.10.10.10';

        for (let i = 0; i < MAX_REQUESTS; i++) {
            await request(app)
                .get('/api/data')
                .set('X-Forwarded-For', ip);
        }

        const blocked = await request(app)
            .get('/api/data')
            .set('X-Forwarded-For', ip);

        expect(blocked.status).toBe(429);
        expect(blocked.headers['retry-after']).toBeDefined();
        const retryAfter = parseInt(blocked.headers['retry-after'], 10);
        expect(retryAfter).toBeGreaterThan(0);
        expect(retryAfter).toBeLessThanOrEqual(Math.ceil(WINDOW_MS / 1000));
    });

    test('remaining count decrements correctly with each request', async () => {
        const ip = '172.16.0.100';

        const res1 = await request(app)
            .get('/api/data')
            .set('X-Forwarded-For', ip);
        const remaining1 = parseInt(res1.headers['x-ratelimit-remaining'], 10);

        const res2 = await request(app)
            .get('/api/data')
            .set('X-Forwarded-For', ip);
        const remaining2 = parseInt(res2.headers['x-ratelimit-remaining'], 10);

        expect(remaining2).toBe(remaining1 - 1);
    });

    test('rate limit resets after window expires', async () => {
        // This test uses a custom store to simulate time passing
        const { SlidingWindowStore } = require('../src/utils/slidingWindow');

        const store = new SlidingWindowStore();
        const shortWindow = 100; // 100ms
        const maxReq = 2;
        const key = 'test-reset';

        // Use up the limit
        store.check(key, shortWindow, maxReq);
        store.check(key, shortWindow, maxReq);

        const blocked = store.check(key, shortWindow, maxReq);
        expect(blocked.allowed).toBe(false);

        // Wait for window to expire
        await new Promise(resolve => setTimeout(resolve, 150));

        const afterExpiry = store.check(key, shortWindow, maxReq);
        expect(afterExpiry.allowed).toBe(true);
    });

    test('rate limiter tracks requests across different HTTP methods independently sharing the same counter', async () => {
        const ip = '10.0.0.99';
        const halfLimit = Math.floor(MAX_REQUESTS / 2);

        // Use half the limit with GET
        for (let i = 0; i < halfLimit; i++) {
            await request(app)
                .get('/api/data')
                .set('X-Forwarded-For', ip);
        }

        // Use the rest with POST
        for (let i = 0; i < MAX_REQUESTS - halfLimit; i++) {
            await request(app)
                .post('/api/submit')
                .set('X-Forwarded-For', ip)
                .send({ payload: 'test' });
        }

        // Next request should be blocked regardless of method
        const blocked = await request(app)
            .get('/api/data')
            .set('X-Forwarded-For', ip);
        expect(blocked.status).toBe(429);
    });
});
