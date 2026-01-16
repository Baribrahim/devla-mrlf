const crypto = require('crypto');

/**
 * Mock payment gateway for testing
 * Simulates a real payment gateway with configurable behavior
 */
class MockGateway {
  constructor(options = {}) {
    this.captures = [];
    this.failureCount = options.failureCount || 0;
    this.failuresRemaining = this.failureCount;
    this.failureType = options.failureType || 'transient';
    this.captureDelay = options.captureDelay || 0;
    this.idempotencyKeys = new Map();
  }

  /**
   * Simulate capturing a payment
   * @param {object} request - Capture request
   * @returns {Promise<object>} - Capture result
   */
  async capture(request) {
    // Simulate network delay
    if (this.captureDelay > 0) {
      await new Promise(r => setTimeout(r, this.captureDelay));
    }

    // Check if we should fail this request (transient failure simulation)
    if (this.failuresRemaining > 0) {
      this.failuresRemaining--;
      const error = new Error('Gateway temporarily unavailable');
      error.statusCode = 503;
      throw error;
    }

    // Gateway-side idempotency check (if idempotencyKey provided)
    if (request.idempotencyKey) {
      const existing = this.idempotencyKeys.get(request.idempotencyKey);
      if (existing) {
        return existing;
      }
    }

    // Record this capture
    const chargeId = `ch_${crypto.randomUUID().slice(0, 16)}`;
    const result = {
      chargeId,
      orderId: request.orderId,
      amount: request.amount,
      currency: request.currency,
      status: 'captured',
      capturedAt: new Date().toISOString()
    };

    this.captures.push({
      request: { ...request },
      result: { ...result },
      timestamp: Date.now()
    });

    // Store for gateway-side idempotency
    if (request.idempotencyKey) {
      this.idempotencyKeys.set(request.idempotencyKey, result);
    }

    return result;
  }

  /**
   * Get all captures made to this gateway
   */
  getCaptureCount() {
    return this.captures.length;
  }

  /**
   * Get captures for a specific orderId
   */
  getCapturesForOrder(orderId) {
    return this.captures.filter(c => c.request.orderId === orderId);
  }

  /**
   * Get unique charge IDs generated
   */
  getUniqueChargeIds() {
    return [...new Set(this.captures.map(c => c.result.chargeId))];
  }

  /**
   * Reset the gateway state
   */
  reset() {
    this.captures = [];
    this.failuresRemaining = this.failureCount;
    this.idempotencyKeys.clear();
  }
}

module.exports = { MockGateway };

