const request = require('supertest');
const app = require('../src/app');
const { resetRateLimiter, MAX_REQUESTS } = require('../src/middleware/rateLimiter');

beforeEach(() => {
    resetRateLimiter();
});

describe('Rate Limiter — Visible Tests', () => {

    test('single request should succeed with 200', async () => {
        const res = await request(app)
            .get('/api/data')
            .set('X-Forwarded-For', '192.168.1.100');

        expect(res.status).toBe(200);
        expect(res.body.items).toBeDefined();
    });

    test('should return rate limit headers on every response', async () => {
        const res = await request(app)
            .get('/api/data')
            .set('X-Forwarded-For', '192.168.1.101');

        expect(res.headers['x-ratelimit-limit']).toBeDefined();
        expect(res.headers['x-ratelimit-remaining']).toBeDefined();
    });

    test('should block requests after exceeding the limit', async () => {
        const ip = '10.0.0.50';

        // Send MAX_REQUESTS successful requests
        for (let i = 0; i < MAX_REQUESTS; i++) {
            const res = await request(app)
                .get('/api/data')
                .set('X-Forwarded-For', ip);
            expect(res.status).toBe(200);
        }

        // The next request should be blocked
        const blocked = await request(app)
            .get('/api/data')
            .set('X-Forwarded-For', ip);

        expect(blocked.status).toBe(429);
        expect(blocked.body.error).toBe('Too Many Requests');
    });

    test('different IPs should have independent rate limits', async () => {
        const ip1 = '10.0.0.1';
        const ip2 = '10.0.0.2';

        // Exhaust ip1's limit
        for (let i = 0; i < MAX_REQUESTS; i++) {
            await request(app)
                .get('/api/data')
                .set('X-Forwarded-For', ip1);
        }

        // ip1 should be blocked
        const blocked = await request(app)
            .get('/api/data')
            .set('X-Forwarded-For', ip1);
        expect(blocked.status).toBe(429);

        // ip2 should still work
        const allowed = await request(app)
            .get('/api/data')
            .set('X-Forwarded-For', ip2);
        expect(allowed.status).toBe(200);
    });

    test('rate limit should apply to POST endpoints too', async () => {
        const ip = '10.0.0.75';

        // Exhaust the limit with GET requests
        for (let i = 0; i < MAX_REQUESTS; i++) {
            await request(app)
                .get('/api/data')
                .set('X-Forwarded-For', ip);
        }

        // POST should also be blocked
        const blocked = await request(app)
            .post('/api/submit')
            .set('X-Forwarded-For', ip)
            .send({ payload: 'test' });

        expect(blocked.status).toBe(429);
    });
});
