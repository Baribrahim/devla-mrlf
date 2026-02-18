# The Webhook That Wouldn't Die — Retry Storm Recovery

## Background

You're an engineer at **OrderFlow**, a small e-commerce platform that processes payments through Stripe. When a customer pays, Stripe sends a webhook event (`payment_intent.succeeded`) to your server. Your server handles the fulfillment pipeline:

1. **Send confirmation email** to the customer
2. **Update inventory** counts
3. **Notify the warehouse** to create a shipping label

This has been working fine in production for 6 months. Until yesterday.

## The Incident

Your monitoring Slack channel lit up at 3:47 PM:

> 🚨 **Customer Support:** "A customer received 5 confirmation emails for the same order. Their inventory was decremented 5 times. 5 shipping labels were created."

> 🚨 **Operations:** "I see dozens of duplicate fulfillment entries in the database. It looks like one webhook event was processed 5+ times."

> 🚨 **Engineering Lead:** "Stripe's dashboard shows they retried the webhook 5 times because our server returned 500 errors on retries."

You pull the logs and see the chain of events:
1. Stripe sent the webhook event `evt_payment_abc123`
2. Your server processed it successfully — email sent, inventory updated, shipping created
3. Due to a network timeout, Stripe didn't get the 200 response
4. Stripe retried the webhook with the **same event ID**
5. Your server tried to process it again, hit a database unique constraint error, and returned **500**
6. Stripe saw the 500 and retried **again**. And again. And again.
7. Each time, your server partially processed the event before failing.

The result: 5 emails, 5 inventory decrements, 5 shipping labels — for a single order.

## Your Task

Fix the webhook processing pipeline to be **idempotent** and **resilient to retries**.

Your solution must:
- **Deduplicate events**: If the same event ID arrives twice, recognize it as a duplicate and skip reprocessing
- **Return 200 for duplicates**: Don't trigger Stripe retries for already-processed events
- **Prevent duplicate side effects**: Each order gets exactly ONE email, ONE inventory update, ONE warehouse notification — regardless of how many times the webhook fires
- **Handle failures gracefully**: If processing fails, track the failure and dead-letter events after too many retries

## What "Done" Looks Like

- `npm test` passes all visible tests
- Sending the same webhook event 5 times produces exactly 1 email, 1 inventory update, 1 warehouse notification
- Duplicate events return 200 (not 500)
- Event status never goes backwards (completed cannot become processing)
- Failed events are tracked with retry count

## Constraints

**You must not:**
- Change the database schema
- Remove any existing routes or endpoints
- Modify any test files
- Change the fulfillment service API (keep `sendConfirmationEmail`, `updateInventory`, `notifyWarehouse`)

**You must:**
- Fix root causes across all relevant files
- Preserve the event lifecycle (received → processing → completed/failed/dead_letter)
- Keep the webhook endpoint returning 200 for successful processing AND for duplicates

## Running the Project

```bash
npm install
npm test
```

## File Overview

```
src/
  app.js                           # Express app setup
  db/database.js                   # SQLite schema and seed data
  routes/webhooks.js               # Webhook endpoint and debugging routes
  services/
    eventStore.js                  # Event persistence and state tracking
    fulfillment.js                 # Side effects (email, inventory, warehouse)
    webhookProcessor.js            # Orchestrates event processing

tests/
  webhook.visible.test.js          # Visible tests
```

## Notes

- **Stripe retries**: Stripe retries webhooks when your server returns non-2xx responses. Always return 200 for events you've seen before.
- **Idempotency**: An operation is idempotent if running it multiple times produces the same result as running it once.
- **Event lifecycle**: Events should flow `received → processing → completed` (or `→ failed → dead_letter` after max retries). Never backwards.
- The bugs span multiple files — this isn't a single-line fix.
- Focus on the `services/` directory. The `fulfillment.js` service API is correct — the issue is in **how** it's called.
