const { getDb } = require('../db/database');

/**
 * Event Store — manages webhook event persistence and state.
 *
 * Events go through this lifecycle:
 *   received → processing → completed
 *                         → failed (after max retries → dead letter)
 *
 * The store was scaffolded during a backend sprint but the dedup
 * and state transition logic was rushed before the deadline.
 */

const MAX_RETRIES = 3;

/**
 * Record a new webhook event. Returns the internal row ID.
 *
 * BUG: No deduplication check! Every call inserts a new row.
 * If Stripe retries the same event, we insert it again and process it again.
 * The event_id column has no unique constraint, so duplicates are silently accepted.
 */
function recordEvent(eventId, eventType, payload) {
    const db = getDb();

    // BUG: Should check if event_id already exists before inserting.
    // Currently inserts a new row for every call, even duplicates.
    const result = db.prepare(`
        INSERT INTO webhook_events (event_id, type, status, payload)
        VALUES (?, ?, 'received', ?)
    `).run(eventId, eventType, JSON.stringify(payload));

    return result.lastInsertRowid;
}

/**
 * Transition an event to a new status.
 *
 * BUG: No validation of state transitions!
 * Should prevent: completed → processing, failed → completed, etc.
 * Currently allows any transition, which can corrupt event state.
 * Also updates ALL rows with this event_id, not just the latest.
 */
function updateEventStatus(eventId, newStatus) {
    const db = getDb();
    const now = new Date().toISOString();

    const updates = { status: newStatus };
    if (newStatus === 'completed') {
        updates.processed_at = now;
    }
    if (newStatus === 'failed') {
        updates.failed_at = now;
    }

    // BUG: Updates ALL event rows with this event_id
    db.prepare(`
        UPDATE webhook_events
        SET status = ?, processed_at = ?, failed_at = ?, attempts = attempts + 1
        WHERE event_id = ?
    `).run(
        newStatus,
        updates.processed_at || null,
        updates.failed_at || null,
        eventId
    );
}

/**
 * Get the most recent event record by event_id.
 */
function getEvent(eventId) {
    const db = getDb();
    return db.prepare(
        'SELECT * FROM webhook_events WHERE event_id = ? ORDER BY id DESC LIMIT 1'
    ).get(eventId);
}

/**
 * Get all events with a given status.
 */
function getEventsByStatus(status) {
    const db = getDb();
    return db.prepare('SELECT * FROM webhook_events WHERE status = ?').all(status);
}

/**
 * Check if an event should be sent to the dead letter queue.
 * An event is dead-lettered if it has exceeded MAX_RETRIES.
 */
function shouldDeadLetter(eventId) {
    const event = getEvent(eventId);
    if (!event) return false;
    return event.attempts >= MAX_RETRIES;
}

/**
 * Move an event to dead letter status.
 */
function deadLetterEvent(eventId, error) {
    const db = getDb();
    db.prepare(`
        UPDATE webhook_events
        SET status = 'dead_letter', last_error = ?
        WHERE event_id = ?
    `).run(error, eventId);
}

module.exports = {
    recordEvent,
    updateEventStatus,
    getEvent,
    getEventsByStatus,
    shouldDeadLetter,
    deadLetterEvent,
    MAX_RETRIES,
};
