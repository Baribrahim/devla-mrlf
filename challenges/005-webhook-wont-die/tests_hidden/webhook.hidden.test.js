const request = require('supertest');
const app = require('../src/app');
const { resetDb, getDb } = require('../src/db/database');

beforeEach(() => {
    resetDb();
});

afterAll(() => {
    resetDb();
});

describe('Webhook Processor — Hidden Tests', () => {

    test('5 duplicate deliveries should produce exactly 1 email, 1 inventory update, 1 warehouse notification', async () => {
        const event = {
            id: 'evt_storm_001',
            type: 'payment_intent.succeeded',
            data: { orderId: 'ord_001', customerEmail: 'alice@example.com' },
        };

        for (let i = 0; i < 5; i++) {
            await request(app).post('/webhooks/stripe').send(event);
        }

        const orderRes = await request(app).get('/orders/ord_001');
        const log = orderRes.body.fulfillment_log;

        const emails = log.filter(e => e.action === 'email_sent');
        const inventory = log.filter(e => e.action === 'inventory_updated');
        const warehouse = log.filter(e => e.action === 'warehouse_notified');

        expect(emails).toHaveLength(1);
        expect(inventory).toHaveLength(1);
        expect(warehouse).toHaveLength(1);
    });

    test('event status transitions must be valid — completed event cannot go back to processing', async () => {
        const event = {
            id: 'evt_state_001',
            type: 'payment_intent.succeeded',
            data: { orderId: 'ord_002', customerEmail: 'bob@example.com' },
        };

        // Process successfully
        await request(app).post('/webhooks/stripe').send(event);

        // Check event status
        const eventRes = await request(app).get('/webhooks/events/evt_state_001');
        expect(eventRes.body.event.status).toBe('completed');

        // A retry should NOT change the status back to 'processing' or 'received'
        await request(app).post('/webhooks/stripe').send(event);

        const eventRes2 = await request(app).get('/webhooks/events/evt_state_001');
        expect(eventRes2.body.event.status).toBe('completed');
    });

    test('duplicate events return 200 with indication that event was already processed', async () => {
        const event = {
            id: 'evt_dup_hid_001',
            type: 'payment_intent.succeeded',
            data: { orderId: 'ord_003' },
        };

        await request(app).post('/webhooks/stripe').send(event);
        const dup = await request(app).post('/webhooks/stripe').send(event);

        expect(dup.status).toBe(200);
        // Response should indicate this was a duplicate
        expect(dup.body.duplicate || dup.body.already_processed || dup.body.received).toBeTruthy();
    });

    test('failed processing tracks attempt count correctly', async () => {
        // Send an event with a non-existent order (will fail)
        const event = {
            id: 'evt_fail_001',
            type: 'payment_intent.succeeded',
            data: { orderId: 'ord_nonexistent' },
        };

        // Process the event — it should fail but be recorded
        const res = await request(app).post('/webhooks/stripe').send(event);

        // The event should exist and have at least 1 attempt tracked
        const eventRes = await request(app).get('/webhooks/events/evt_fail_001');
        expect(eventRes.status).toBe(200);
        expect(eventRes.body.event).toBeDefined();
        expect(['failed', 'dead_letter']).toContain(eventRes.body.event.status);
        expect(eventRes.body.event.attempts).toBeGreaterThanOrEqual(1);
    });

    test('webhook events table shows correct summary counts', async () => {
        // Process a successful event
        await request(app).post('/webhooks/stripe').send({
            id: 'evt_sum_001',
            type: 'payment_intent.succeeded',
            data: { orderId: 'ord_001' },
        });

        // Check events endpoint
        const eventRes = await request(app).get('/webhooks/events?status=completed');
        expect(eventRes.body.events.length).toBeGreaterThanOrEqual(1);
    });

    test('order fulfillment is atomic — all actions or none', async () => {
        const event = {
            id: 'evt_atomic_001',
            type: 'payment_intent.succeeded',
            data: { orderId: 'ord_005', customerEmail: 'eve@example.com' },
        };

        await request(app).post('/webhooks/stripe').send(event);

        const orderRes = await request(app).get('/orders/ord_005');
        const log = orderRes.body.fulfillment_log;

        // Should have all 3 actions
        const actions = log.map(e => e.action);
        expect(actions).toContain('email_sent');
        expect(actions).toContain('inventory_updated');
        expect(actions).toContain('warehouse_notified');

        // Order should be fulfilled
        expect(orderRes.body.order.status).toBe('fulfilled');
    });
});
