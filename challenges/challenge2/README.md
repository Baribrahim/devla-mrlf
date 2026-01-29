# Friday Checkout Incident (MVP Challenge)

It’s Friday, 16:47.

Support is reporting a spike in **“Payment failed / charged twice”** complaints.
Observability shows the checkout service’s payment error rate jumped after a deploy ~30 minutes ago.
The CTO is asking for an update.

You’ve been given access to this checkout service. Your job is to **stabilize payments**.

---

## What’s happening

Under certain retry conditions (timeouts) and some follow-up requests, **the same order can be charged more than once**.

This is rare locally, but shows up in production when latency spikes and retries kick in.

---

## Objective

Fix the bug(s) causing **duplicate charges** while preserving existing behavior.

✅ A correct solution must:
- prevent duplicate charges for the same order during retries/timeouts
- prevent duplicate charges on repeated requests for an already-paid order
- keep the API contract unchanged

---

## Constraints (Non‑negotiable)

- **Do not change** the public HTTP API shape (`POST /checkout`).
- **Do not remove** retries (the system must remain resilient to timeouts).
- **Do not disable** caching entirely (it exists for performance reasons).
- Fixes should be **targeted**, not a rewrite.

---

## Quickstart

### Install
```bash
npm install
```

### Run tests
```bash
npm test
```

### Run server (optional)
```bash
npm start
```

---

## API

### `POST /checkout`
Body:
```json
{ "orderId": "ord_123" }
```

Response (200):
```json
{ "orderId": "ord_123", "status": "paid", "chargeId": "ch_..." }
```

---

## Notes

- This repo uses a **fake payment provider adapter** (`src/adapters/paymentProvider.js`) that simulates real-world failure modes
  (timeouts that may still result in a charge).
- Visible tests guide you, hidden tests cover edge cases (including concurrency and timing).
