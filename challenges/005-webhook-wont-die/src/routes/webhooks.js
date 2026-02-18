const express = require('express');
const router = express.Router();
const { processWebhookEvent } = require('../services/webhookProcessor');
const { getEvent, getEventsByStatus } = require('../services/eventStore');
const { getFulfillmentLog, getOrder } = require('../services/fulfillment');

/**
 * POST /webhooks/stripe — incoming Stripe webhook
 *
 * Stripe sends webhook events for payment lifecycle changes.
 * We need to process them reliably.
 */
router.post('/stripe', async (req, res) => {
    const { id: eventId, type: eventType, data } = req.body;

    if (!eventId || !eventType) {
        return res.status(400).json({ error: 'Missing event id or type' });
    }

    try {
        const result = await processWebhookEvent(eventId, eventType, data || {});
        res.json({ received: true, ...result });
    } catch (err) {
        // Processing failed — return 500
        // BUG: This causes Stripe to retry the webhook, which can lead to
        // partial reprocessing if the failure happens after some side effects.
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /webhooks/events — list events by status (for debugging)
 */
router.get('/events', (req, res) => {
    const { status } = req.query;
    if (status) {
        const events = getEventsByStatus(status);
        return res.json({ events });
    }

    // Return all statuses summary
    const db = require('../db/database').getDb();
    const summary = db.prepare(`
        SELECT status, COUNT(*) as count 
        FROM webhook_events 
        GROUP BY status
    `).all();
    res.json({ summary });
});

/**
 * GET /webhooks/events/:id — get a specific event
 */
router.get('/events/:id', (req, res) => {
    const event = getEvent(req.params.id);
    if (!event) {
        return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ event });
});

/**
 * GET /orders/:id — get order details with fulfillment log
 */
router.get('/orders/:id', (req, res) => {
    const order = getOrder(req.params.id);
    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }

    const log = getFulfillmentLog(req.params.id);
    res.json({ order, fulfillment_log: log });
});

module.exports = { webhookRouter: router };
