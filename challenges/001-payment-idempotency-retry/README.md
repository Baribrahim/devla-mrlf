# Payment Capture Service — Duplicate Charge Investigation

## Background

You just joined SnapCart, a fast-growing e-commerce startup. The payments team built a payment capture service last quarter that processes orders through a third-party payment gateway (Stripe-like). The service was designed to be resilient — it retries failed gateway requests automatically to handle transient network issues.

Last week, the finance team flagged a critical issue: **some customers are being charged twice for the same order**. Support tickets are piling up, and refund requests are increasing. The issue seems intermittent — it doesn't happen on every order, but when it does, the customer's card is charged multiple times for identical amounts.

Engineering investigated the gateway logs and confirmed that duplicate `capture` calls are being sent for the same order. The gateway is processing each call as a separate charge because the requests appear distinct to them.

The team added idempotency handling a few months ago, but clearly something is wrong with how it's implemented.

## Your Task

Find and fix the bug causing duplicate payment captures under retry conditions.

The payment must be captured **exactly once** per `orderId`, even when:
- The gateway returns transient errors (5xx, timeouts)
- The retry mechanism kicks in
- Multiple capture attempts occur in quick succession

## What "Done" Looks Like

- All existing tests pass (`npm test`)
- A single `orderId` results in exactly one successful charge, regardless of retries
- Transient failures are still retried and eventually succeed
- The fix does not break backward compatibility

## Constraints

**You must not:**
- Change the API contract (request/response shape)
- Disable the retry mechanism
- Modify any test files
- Remove or bypass the idempotency check entirely

**You must:**
- Preserve backward compatibility with existing clients
- Ensure retries continue to work for transient failures
- Fix the root cause, not the symptoms

## Running the Project

```bash
npm install
npm test
```

## File Overview

```
src/
  server.js          # Express app setup and routes
  paymentService.js  # Payment capture business logic
  gatewayClient.js   # HTTP client for payment gateway with retry logic
  idempotencyStore.js # In-memory idempotency key storage
  utils.js           # Helper utilities

tests/
  payment.test.js    # Visible test suite
```

## Notes

- The gateway client simulates a real payment gateway with configurable failure modes
- The idempotency store uses in-memory storage (no external dependencies needed)
- Logs are available but may not tell the whole story

