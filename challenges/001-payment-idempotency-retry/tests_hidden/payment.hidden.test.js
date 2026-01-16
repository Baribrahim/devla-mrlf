const request = require('supertest');
const { createApp } = require('../src/server');
const { MockGateway } = require('../tests/mockGateway');
const { idempotencyStore } = require('../src/idempotencyStore');

describe('Payment Capture - Hidden Tests', () => {
  let gateway;
  let app;

  beforeEach(() => {
    gateway = new MockGateway();
    app = createApp(gateway);
    idempotencyStore.clear();
  });

  /**
   * Hidden Test 1: Multiple retries should still result in exactly one capture
   * Defeats: Fixes that only handle single-retry scenarios
   */
  test('should capture exactly once even with max retries exhausted partially', async () => {
    // Gateway fails 3 times (max retries) then succeeds
    gateway = new MockGateway({ failureCount: 3 });
    app = createApp(gateway);

    const payload = {
      orderId: 'order_max_retry_test',
      amount: 12500,
      currency: 'usd',
      paymentMethodId: 'pm_test_visa'
    };

    const response = await request(app)
      .post('/payments/capture')
      .send(payload);

    expect(response.status).toBe(200);
    expect(gateway.getCapturesForOrder(payload.orderId).length).toBe(1);
  });

  /**
   * Hidden Test 2: Concurrent duplicate requests for same orderId
   * Defeats: Fixes that only handle sequential requests
   */
  test('should handle concurrent capture requests for same orderId', async () => {
    const payload = {
      orderId: 'order_concurrent_test',
      amount: 7500,
      currency: 'usd',
      paymentMethodId: 'pm_test_amex'
    };

    // Fire 3 concurrent requests for the same order
    const promises = [
      request(app).post('/payments/capture').send(payload),
      request(app).post('/payments/capture').send(payload),
      request(app).post('/payments/capture').send(payload)
    ];

    const responses = await Promise.all(promises);

    // All should succeed
    responses.forEach(r => {
      expect(r.status).toBe(200);
      expect(r.body.success).toBe(true);
    });

    // But only ONE capture should have occurred
    const captures = gateway.getCapturesForOrder(payload.orderId);
    expect(captures.length).toBe(1);

    // All responses should return the SAME chargeId
    const chargeIds = responses.map(r => r.body.chargeId);
    expect(new Set(chargeIds).size).toBe(1);
  });

  /**
   * Hidden Test 3: Retries must still work (not be disabled)
   * Defeats: Fixes that disable retries entirely
   */
  test('should successfully complete capture after transient failures', async () => {
    // Gateway fails twice, must retry to succeed
    gateway = new MockGateway({ failureCount: 2 });
    app = createApp(gateway);

    const payload = {
      orderId: 'order_retry_required',
      amount: 3300,
      currency: 'eur',
      paymentMethodId: 'pm_test_mc'
    };

    const response = await request(app)
      .post('/payments/capture')
      .send(payload);

    // Must succeed (proving retries work)
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.chargeId).toBeDefined();
  });

  /**
   * Hidden Test 4: Different orderIds should create separate charges
   * Defeats: Overly aggressive deduplication that blocks all requests
   */
  test('should create separate charges for different orderIds', async () => {
    const orders = [
      { orderId: 'order_a_001', amount: 1000 },
      { orderId: 'order_b_002', amount: 2000 },
      { orderId: 'order_c_003', amount: 3000 }
    ];

    for (const order of orders) {
      const response = await request(app)
        .post('/payments/capture')
        .send({
          ...order,
          currency: 'usd',
          paymentMethodId: 'pm_test_visa'
        });

      expect(response.status).toBe(200);
    }

    // Each order should have exactly one capture
    expect(gateway.getCapturesForOrder('order_a_001').length).toBe(1);
    expect(gateway.getCapturesForOrder('order_b_002').length).toBe(1);
    expect(gateway.getCapturesForOrder('order_c_003').length).toBe(1);
    
    // Total of 3 unique charges
    expect(gateway.getUniqueChargeIds().length).toBe(3);
  });

  /**
   * Hidden Test 5: Idempotency must be based on orderId, not request-level ID
   * Defeats: Using per-request UUIDs for idempotency
   */
  test('should return same chargeId for repeated requests with same orderId', async () => {
    const payload = {
      orderId: 'order_idempotency_check',
      amount: 9999,
      currency: 'usd',
      paymentMethodId: 'pm_test_discover'
    };

    // First request
    const response1 = await request(app)
      .post('/payments/capture')
      .send(payload);

    expect(response1.status).toBe(200);
    const firstChargeId = response1.body.chargeId;

    // Second request (same orderId) - should return cached result
    const response2 = await request(app)
      .post('/payments/capture')
      .send(payload);

    expect(response2.status).toBe(200);
    expect(response2.body.chargeId).toBe(firstChargeId);

    // Only one capture should have hit the gateway
    expect(gateway.getCapturesForOrder(payload.orderId).length).toBe(1);
  });
});

