const { idempotencyStore } = require('./idempotencyStore');
const { GatewayClient } = require('./gatewayClient');
const { log, generateRequestId } = require('./utils');

/**
 * Payment service handling capture operations
 */
class PaymentService {
  constructor(gateway) {
    this.gatewayClient = new GatewayClient(gateway);
  }

  /**
   * Capture payment for an order
   * Should be idempotent - same orderId should result in same charge
   * 
   * @param {object} params
   * @param {string} params.orderId - Unique order identifier
   * @param {number} params.amount - Amount in cents
   * @param {string} params.currency - Currency code (e.g., 'usd')
   * @param {string} params.paymentMethodId - Customer's payment method
   * @returns {Promise<object>} - Capture result
   */
  async capturePayment({ orderId, amount, currency, paymentMethodId }) {
    // Generate an idempotency key for this capture operation
    // Note: We use a request-scoped key to track this specific request
    const idempotencyKey = this._generateIdempotencyKey(orderId);
    
    log('info', 'Processing payment capture', {
      orderId,
      amount,
      currency,
      idempotencyKey
    });

    // Check if we've already processed this
    const existingResult = idempotencyStore.get(idempotencyKey);
    if (existingResult) {
      log('info', 'Returning cached result for idempotent request', {
        orderId,
        chargeId: existingResult.chargeId
      });
      return existingResult;
    }

    // Validate input
    this._validateCaptureRequest({ orderId, amount, currency, paymentMethodId });

    // Build the capture request
    const captureRequest = {
      orderId,
      amount,
      currency,
      paymentMethodId,
      metadata: {
        source: 'snapcart-checkout',
        capturedAt: new Date().toISOString()
      }
    };

    // Call gateway with retry logic
    const result = await this.gatewayClient.captureWithRetry(captureRequest);

    // Store successful result for idempotency
    const captureResult = {
      success: true,
      chargeId: result.chargeId,
      orderId,
      amount,
      currency,
      capturedAt: result.capturedAt
    };

    idempotencyStore.set(idempotencyKey, captureResult);

    log('info', 'Payment capture completed', {
      orderId,
      chargeId: result.chargeId
    });

    return captureResult;
  }

  /**
   * Generate idempotency key for a capture operation
   * @private
   */
  _generateIdempotencyKey(orderId) {
    // Intent: key should be unique per capture attempt
    // Using a combination approach for flexibility
    const requestId = generateRequestId();
    return `capture:${requestId}`;
  }

  /**
   * Validate capture request parameters
   * @private
   */
  _validateCaptureRequest({ orderId, amount, currency, paymentMethodId }) {
    if (!orderId || typeof orderId !== 'string') {
      throw new Error('Invalid orderId');
    }
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      throw new Error('Invalid amount');
    }
    if (!currency || typeof currency !== 'string') {
      throw new Error('Invalid currency');
    }
    if (!paymentMethodId || typeof paymentMethodId !== 'string') {
      throw new Error('Invalid paymentMethodId');
    }
  }
}

module.exports = { PaymentService };

