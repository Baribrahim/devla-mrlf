const request = require('supertest');
const { createApp } = require('../src/server');
const { resetAll } = require('./helpers');

describe('Admin Dashboard Bug (visible)', () => {
    beforeEach(() => resetAll());

    test('login succeeds with valid credentials', async () => {
        const app = createApp();

        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'admin@dashly.io', password: 'admin123' });

        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
        expect(res.body.user.email).toBe('admin@dashly.io');
    });

    test('login fails with invalid credentials', async () => {
        const app = createApp();

        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'admin@dashly.io', password: 'wrongpassword' });

        expect(res.status).toBe(401);
        expect(res.body.error).toBe('Invalid email or password');
    });

    test('JWT token contains user role for admin user', async () => {
        const app = createApp();

        // Login as admin
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: 'admin@dashly.io', password: 'admin123' });

        expect(loginRes.status).toBe(200);
        const token = loginRes.body.token;

        // Decode the token payload
        const payload = JSON.parse(
            Buffer.from(token.split('.')[1], 'base64').toString()
        );

        // The token MUST contain the user's role
        expect(payload.role).toBe('admin');
    });

    test('admin can access /api/admin/stats endpoint', async () => {
        const app = createApp();

        // Login as admin
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: 'admin@dashly.io', password: 'admin123' });

        const token = loginRes.body.token;

        // Access admin endpoint
        const statsRes = await request(app)
            .get('/api/admin/stats')
            .set('Authorization', `Bearer ${token}`);

        expect(statsRes.status).toBe(200);
        expect(statsRes.body.totalUsers).toBeDefined();
    });

    test('regular user cannot access admin endpoint', async () => {
        const app = createApp();

        // Login as regular user
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: 'user@dashly.io', password: 'user123' });

        const token = loginRes.body.token;

        // Try to access admin endpoint
        const statsRes = await request(app)
            .get('/api/admin/stats')
            .set('Authorization', `Bearer ${token}`);

        expect(statsRes.status).toBe(403);
        expect(statsRes.body.error).toBe('Admin access required');
    });
});
