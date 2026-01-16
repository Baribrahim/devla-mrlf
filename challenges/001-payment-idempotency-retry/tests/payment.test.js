const request = require('supertest');
const { createApp } = require('../src/server');
const { MockGateway } = require('./mockGateway');
const { idempotencyStore } = require('../src/idempotencyStore');

describe('Payment Capture API', () => {
  let gateway;
  let app;

  beforeEach(() => {
    gateway = new MockGateway();
    app = createApp(gateway);
    idempotencyStore.clear();
  });

  describe('POST /payments/capture', () => {
    const validPayload = {
      orderId: 'order_12345',
      amount: 5000,
      currency: 'usd',
      paymentMethodId: 'pm_card_visa'
    };

    test('should successfully capture a payment', async () => {
      const response = await request(app)
        .post('/payments/capture')
        .send(validPayload);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.chargeId).toBeDefined();
      expect(response.body.orderId).toBe(validPayload.orderId);
      expect(response.body.amount).toBe(validPayload.amount);
    });

    test('should return 400 for invalid amount', async () => {
      const response = await request(app)
        .post('/payments/capture')
        .send({ ...validPayload, amount: -100 });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should retry and succeed on transient gateway failures', async () => {
      // Gateway will fail twice then succeed
      gateway = new MockGateway({ failureCount: 2 });
      app = createApp(gateway);

      const response = await request(app)
        .post('/payments/capture')
        .send(validPayload);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.chargeId).toBeDefined();
    });

    test('should capture payment exactly once per orderId under retries', async () => {
      // Gateway will fail once, causing a retry
      gateway = new MockGateway({ failureCount: 1 });
      app = createApp(gateway);

      const response = await request(app)
        .post('/payments/capture')
        .send(validPayload);

      expect(response.status).toBe(200);

      // The critical assertion: only ONE capture should have occurred
      const captures = gateway.getCapturesForOrder(validPayload.orderId);
      expect(captures.length).toBe(1);
    });

    test('should be idempotent for duplicate requests with same orderId', async () => {
      // First request
      const response1 = await request(app)
        .post('/payments/capture')
        .send(validPayload);

      expect(response1.status).toBe(200);
      const firstChargeId = response1.body.chargeId;

      // Second request with same orderId should return same result
      const response2 = await request(app)
        .post('/payments/capture')
        .send(validPayload);

      expect(response2.status).toBe(200);
      expect(response2.body.chargeId).toBe(firstChargeId);

      // Only one capture should have hit the gateway
      const captures = gateway.getCapturesForOrder(validPayload.orderId);
      expect(captures.length).toBe(1);
    });
  });
});

