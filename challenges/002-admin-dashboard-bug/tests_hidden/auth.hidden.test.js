const request = require('supertest');
const { createApp } = require('../src/server');
const { resetAll } = require('../tests/helpers');

/**
 * Hidden tests for Admin Dashboard Bug
 * 
 * These tests ensure:
 * 1. The fix works for ALL role types, not just admin
 * 2. Bait fixes (like hardcoding isAdmin) fail
 * 3. Token contains the actual role value
 * 4. Role-based access control works end-to-end
 */
describe('Admin Dashboard Bug (hidden)', () => {
    beforeEach(() => resetAll());

    // Test 1: Moderator role is also in token
    // Defeats the bait fix of hardcoding "admin" check
    test('JWT token contains user role for moderator user', async () => {
        const app = createApp();

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: 'mod@dashly.io', password: 'mod123' });

        expect(loginRes.status).toBe(200);
        const token = loginRes.body.token;

        const payload = JSON.parse(
            Buffer.from(token.split('.')[1], 'base64').toString()
        );

        // Token must contain the actual role value
        expect(payload.role).toBe('moderator');
    });

    // Test 2: Regular user role is in token
    test('JWT token contains user role for regular user', async () => {
        const app = createApp();

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: 'user@dashly.io', password: 'user123' });

        expect(loginRes.status).toBe(200);
        const token = loginRes.body.token;

        const payload = JSON.parse(
            Buffer.from(token.split('.')[1], 'base64').toString()
        );

        expect(payload.role).toBe('user');
    });

    // Test 3: /api/user/me endpoint returns role from token
    // This verifies the middleware correctly extracts the role
    test('/api/user/me returns role from token', async () => {
        const app = createApp();

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: 'admin@dashly.io', password: 'admin123' });

        const token = loginRes.body.token;

        const meRes = await request(app)
            .get('/api/user/me')
            .set('Authorization', `Bearer ${token}`);

        expect(meRes.status).toBe(200);
        expect(meRes.body.fromToken.role).toBe('admin');
    });

    // Test 4: Moderator can access protected routes but not admin-only
    test('moderator is rejected from admin-only endpoints', async () => {
        const app = createApp();

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: 'mod@dashly.io', password: 'mod123' });

        const token = loginRes.body.token;

        const statsRes = await request(app)
            .get('/api/admin/stats')
            .set('Authorization', `Bearer ${token}`);

        expect(statsRes.status).toBe(403);
    });

    // Test 5: Verify token role is used for admin dashboard access
    // Not database lookup - the role must come from the token
    test('admin dashboard uses token role, not database', async () => {
        const app = createApp();

        // Login as admin
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: 'admin@dashly.io', password: 'admin123' });

        const token = loginRes.body.token;

        // The dashboard endpoint should work because role is in token
        const dashRes = await request(app)
            .get('/api/admin/dashboard')
            .set('Authorization', `Bearer ${token}`);

        expect(dashRes.status).toBe(200);
        expect(dashRes.body.welcome).toContain('admin dashboard');
    });
});
