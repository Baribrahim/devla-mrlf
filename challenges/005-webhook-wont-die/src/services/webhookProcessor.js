const eventStore = require('./eventStore');
const fulfillment = require('./fulfillment');

/**
 * Webhook Processor — orchestrates the processing of webhook events.
 *
 * When Stripe sends a payment_intent.succeeded webhook:
 * 1. Record the event
 * 2. Process it (trigger fulfillment side effects)
 * 3. Update event status
 *
 * The processor was built fast before launch. It works fine when each
 * webhook is delivered exactly once. But Stripe retries failed deliveries,
 * and that's where things break.
 */

/**
 * Process an incoming webhook event.
 *
 * BUG: No idempotency protection.
 * - recordEvent doesn't check for duplicates (it inserts blindly)
 * - Even if recording fails, we don't handle it gracefully
 * - Side effects fire every time, even for duplicate events
 * - If processing fails mid-way, the event gets stuck (no retry/dead-letter)
 */
async function processWebhookEvent(eventId, eventType, payload) {
    // Step 1: Record the event
    // (BUG: if this is a duplicate, it throws instead of returning gracefully)
    eventStore.recordEvent(eventId, eventType, payload);

    // Step 2: Mark as processing
    eventStore.updateEventStatus(eventId, 'processing');

    // Step 3: Process based on event type
    try {
        if (eventType === 'payment_intent.succeeded') {
            await _handlePaymentSuccess(payload);
        } else if (eventType === 'payment_intent.failed') {
            await _handlePaymentFailed(payload);
        }

        // Step 4: Mark as completed
        eventStore.updateEventStatus(eventId, 'completed');

        return { processed: true };
    } catch (err) {
        // BUG: On failure, we update status to 'failed' but don't check
        // if we should dead-letter it. The event just stays 'failed' forever.
        // No retry mechanism, no dead-letter queue.
        eventStore.updateEventStatus(eventId, 'failed');
        return { processed: false, error: err.message };
    }
}

/**
 * Handle a successful payment — trigger all fulfillment side effects.
 *
 * BUG: No check if the order is already fulfilled!
 * Every time this runs, it sends another email, decrements inventory again,
 * and creates another shipping label. This is the "5 emails" bug.
 */
async function _handlePaymentSuccess(payload) {
    const { orderId, customerEmail } = payload;

    if (!orderId) {
        throw new Error('Missing orderId in webhook payload');
    }

    const order = fulfillment.getOrder(orderId);
    if (!order) {
        throw new Error(`Order ${orderId} not found`);
    }

    // Fire all side effects (BUG: no idempotency — runs every time)
    fulfillment.sendConfirmationEmail(orderId, customerEmail || order.customer_email);
    fulfillment.updateInventory(orderId);
    fulfillment.notifyWarehouse(orderId);
    fulfillment.markOrderFulfilled(orderId);
}

/**
 * Handle a failed payment.
 */
async function _handlePaymentFailed(payload) {
    const { orderId } = payload;

    if (!orderId) {
        throw new Error('Missing orderId in webhook payload');
    }

    // Just log it for now
    const db = require('../db/database').getDb();
    db.prepare(`
        INSERT INTO fulfillment_log (order_id, action, details)
        VALUES (?, 'payment_failed', ?)
    `).run(orderId, `Payment failed for order ${orderId}`);
}

module.exports = { processWebhookEvent };
