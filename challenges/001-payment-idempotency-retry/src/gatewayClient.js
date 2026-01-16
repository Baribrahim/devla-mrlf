const { log, sleep, isRetryableError, generateRequestId } = require('./utils');

/**
 * Configuration for retry behavior
 */
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelayMs: 100,
  maxDelayMs: 2000
};

/**
 * Simulated payment gateway client
 * In production, this would make real HTTP calls to Stripe/Braintree/etc
 */
class GatewayClient {
  constructor(gateway) {
    this.gateway = gateway;
  }

  /**
   * Capture a payment with automatic retry on transient failures
   * @param {object} captureRequest - The capture request payload
   * @returns {Promise<object>} - Gateway response
   */
  async captureWithRetry(captureRequest) {
    let lastError = null;
    let attempt = 0;

    while (attempt <= RETRY_CONFIG.maxRetries) {
      attempt++;
      
      // Generate a fresh request ID for each attempt (for tracing)
      const requestId = generateRequestId();
      
      try {
        log('info', `Gateway capture attempt ${attempt}`, {
          requestId,
          orderId: captureRequest.orderId,
          amount: captureRequest.amount
        });

        // Make the gateway call with the request ID
        const result = await this.gateway.capture({
          ...captureRequest,
          requestId,  // BUG: This creates a new ID per retry
          idempotencyKey: requestId  // BUG: Using request ID instead of orderId
        });

        log('info', 'Gateway capture succeeded', {
          requestId,
          chargeId: result.chargeId
        });

        return result;

      } catch (error) {
        lastError = error;
        
        log('warn', `Gateway capture failed (attempt ${attempt})`, {
          requestId,
          error: error.message,
          retryable: isRetryableError(error)
        });

        if (!isRetryableError(error)) {
          throw error;
        }

        if (attempt <= RETRY_CONFIG.maxRetries) {
          const delay = Math.min(
            RETRY_CONFIG.baseDelayMs * Math.pow(2, attempt - 1),
            RETRY_CONFIG.maxDelayMs
          );
          log('debug', `Retrying in ${delay}ms`);
          await sleep(delay);
        }
      }
    }

    log('error', 'Gateway capture failed after all retries', {
      orderId: captureRequest.orderId,
      attempts: attempt
    });
    
    throw lastError;
  }
}

module.exports = { GatewayClient, RETRY_CONFIG };

