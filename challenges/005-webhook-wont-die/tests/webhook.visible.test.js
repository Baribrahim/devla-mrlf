const request = require('supertest');
const app = require('../src/app');
const { resetDb } = require('../src/db/database');

beforeEach(() => {
    resetDb();
});

afterAll(() => {
    resetDb();
});

describe('Webhook Processing — Visible Tests', () => {

    test('single webhook event is processed successfully', async () => {
        const res = await request(app)
            .post('/webhooks/stripe')
            .send({
                id: 'evt_test_001',
                type: 'payment_intent.succeeded',
                data: { orderId: 'ord_001', customerEmail: 'alice@example.com' },
            });

        expect(res.status).toBe(200);
        expect(res.body.processed).toBe(true);
    });

    test('duplicate webhook should be handled gracefully — not error', async () => {
        const event = {
            id: 'evt_dup_001',
            type: 'payment_intent.succeeded',
            data: { orderId: 'ord_002', customerEmail: 'bob@example.com' },
        };

        // First delivery
        const res1 = await request(app).post('/webhooks/stripe').send(event);
        expect(res1.status).toBe(200);

        // Retry (duplicate delivery)
        const res2 = await request(app).post('/webhooks/stripe').send(event);
        // Should return 200 (not 500) — idempotent
        expect(res2.status).toBe(200);
    });

    test('duplicate webhook should NOT trigger side effects again', async () => {
        const event = {
            id: 'evt_dup_002',
            type: 'payment_intent.succeeded',
            data: { orderId: 'ord_003', customerEmail: 'carol@example.com' },
        };

        // Process twice
        await request(app).post('/webhooks/stripe').send(event);
        await request(app).post('/webhooks/stripe').send(event);

        // Check fulfillment log — should have exactly 3 entries
        // (email_sent, inventory_updated, warehouse_notified) NOT 6
        const orderRes = await request(app).get('/orders/ord_003');
        const emailEntries = orderRes.body.fulfillment_log.filter(
            e => e.action === 'email_sent'
        );

        expect(emailEntries).toHaveLength(1);
    });

    test('webhook with missing event ID returns 400', async () => {
        const res = await request(app)
            .post('/webhooks/stripe')
            .send({ type: 'payment_intent.succeeded', data: {} });

        expect(res.status).toBe(400);
    });

    test('processed order should be marked as fulfilled', async () => {
        await request(app)
            .post('/webhooks/stripe')
            .send({
                id: 'evt_fulfill_001',
                type: 'payment_intent.succeeded',
                data: { orderId: 'ord_004' },
            });

        const orderRes = await request(app).get('/orders/ord_004');
        expect(orderRes.body.order.status).toBe('fulfilled');
    });
});
