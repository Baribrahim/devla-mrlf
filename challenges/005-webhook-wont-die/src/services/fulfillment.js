const { getDb } = require('../db/database');

/**
 * Fulfillment service — handles the side effects of a successful payment.
 *
 * When a payment succeeds, we need to:
 * 1. Send a confirmation email
 * 2. Update inventory
 * 3. Notify the warehouse for shipping
 *
 * Each action is logged to the fulfillment_log for auditing.
 */

/**
 * Send order confirmation email.
 * (Simulated — in production this would call SendGrid/SES)
 */
function sendConfirmationEmail(orderId, customerEmail) {
    const db = getDb();

    // Simulate email sending
    db.prepare(`
        INSERT INTO fulfillment_log (order_id, action, details)
        VALUES (?, 'email_sent', ?)
    `).run(orderId, `Confirmation email sent to ${customerEmail}`);

    return { success: true, to: customerEmail };
}

/**
 * Update inventory counts.
 * (Simulated — in production this would call inventory service)
 */
function updateInventory(orderId) {
    const db = getDb();

    db.prepare(`
        INSERT INTO fulfillment_log (order_id, action, details)
        VALUES (?, 'inventory_updated', ?)
    `).run(orderId, `Inventory decremented for order ${orderId}`);

    return { success: true };
}

/**
 * Notify warehouse to ship the order.
 * (Simulated — in production this would call warehouse API)
 */
function notifyWarehouse(orderId) {
    const db = getDb();

    db.prepare(`
        INSERT INTO fulfillment_log (order_id, action, details)
        VALUES (?, 'warehouse_notified', ?)
    `).run(orderId, `Shipping label created for order ${orderId}`);

    return { success: true };
}

/**
 * Get fulfillment log entries for an order.
 */
function getFulfillmentLog(orderId) {
    const db = getDb();
    return db.prepare('SELECT * FROM fulfillment_log WHERE order_id = ?').all(orderId);
}

/**
 * Mark order as fulfilled.
 */
function markOrderFulfilled(orderId) {
    const db = getDb();
    db.prepare(`
        UPDATE orders SET status = 'fulfilled', fulfilled_at = datetime('now')
        WHERE id = ?
    `).run(orderId);
}

/**
 * Get order by ID.
 */
function getOrder(orderId) {
    const db = getDb();
    return db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
}

module.exports = {
    sendConfirmationEmail,
    updateInventory,
    notifyWarehouse,
    getFulfillmentLog,
    markOrderFulfilled,
    getOrder,
};
