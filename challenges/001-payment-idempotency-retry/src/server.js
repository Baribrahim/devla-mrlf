const express = require('express');
const { PaymentService } = require('./paymentService');
const { log } = require('./utils');

/**
 * Create the Express app with payment routes
 * @param {object} gateway - Payment gateway instance (injected for testing)
 */
function createApp(gateway) {
  const app = express();
  app.use(express.json());

  const paymentService = new PaymentService(gateway);

  /**
   * POST /payments/capture
   * Capture a payment for an order
   * 
   * Request body:
   * {
   *   orderId: string,
   *   amount: number (cents),
   *   currency: string,
   *   paymentMethodId: string
   * }
   * 
   * Response:
   * {
   *   success: boolean,
   *   chargeId: string,
   *   orderId: string,
   *   amount: number,
   *   currency: string,
   *   capturedAt: string
   * }
   */
  app.post('/payments/capture', async (req, res) => {
    const { orderId, amount, currency, paymentMethodId } = req.body;

    log('info', 'Received capture request', { orderId, amount, currency });

    try {
      const result = await paymentService.capturePayment({
        orderId,
        amount,
        currency,
        paymentMethodId
      });

      res.json(result);
    } catch (error) {
      log('error', 'Capture request failed', {
        orderId,
        error: error.message
      });

      if (error.message.startsWith('Invalid')) {
        return res.status(400).json({
          success: false,
          error: error.message
        });
      }

      res.status(500).json({
        success: false,
        error: 'Payment capture failed'
      });
    }
  });

  /**
   * GET /health
   * Health check endpoint
   */
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  return app;
}

module.exports = { createApp };

