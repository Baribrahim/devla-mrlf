# Friday Checkout Incident — Duplicate Charge Investigation

## Background

You just joined an e-commerce company with a growing payment volume. The checkout service was built last quarter to process orders through a third-party payment provider. The service was designed to be resilient — it retries failed provider requests automatically to handle transient network issues.

It's Friday, 16:47. Support is reporting a spike in **"Payment failed / charged twice"** complaints. Observability shows the checkout service's payment error rate jumped after a deploy ~30 minutes ago. The CTO is asking for an update.

Engineering investigated the provider logs and confirmed that duplicate charges are being created for the same order. The provider is processing each call as a separate charge because the requests appear distinct to them.

The team added idempotency handling a few months ago, but clearly something is wrong with how it's implemented.

## Your Task

Find and fix the bug(s) causing duplicate charges under retry and repeated request conditions.

The payment must be captured **exactly once** per `orderId`, even when:
- The provider returns transient errors (timeouts)
- The retry mechanism kicks in
- Multiple checkout attempts occur in quick succession
- A previously paid order is re-submitted

## What "Done" Looks Like

- All existing tests pass (`npm test`)
- A single `orderId` results in exactly one charge, regardless of retries
- Transient failures are still retried and eventually succeed
- Repeated checkout requests for paid orders return success without re-charging
- The fix does not break backward compatibility

## Constraints

**You must not:**
- Change the API contract (request/response shape for `POST /checkout`)
- Disable the retry mechanism
- Remove or disable caching entirely (it exists for performance reasons)
- Modify any test files

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
  app.js                         # Express app setup and routes
  routes/checkout.js             # Checkout route handler
  services/chargeService.js      # Payment charge business logic
  adapters/paymentProvider.js    # Fake payment provider with timeout simulation
  db/ordersRepo.js               # Order and charge persistence
  db/db.js                       # SQLite database setup
  utils/cache.js                 # In-memory TTL cache
  utils/retry.js                 # Retry utility with configurable conditions
  utils/errors.js                # Custom error types

tests/
  checkout.visible.test.js       # Visible test suite
  helpers.js                     # Test utilities
```

## Notes

- The payment provider adapter simulates real-world failure modes (timeouts that may still result in a charge)
- The idempotency store uses SQLite for persistence
- Visible tests guide you, but hidden tests cover edge cases including concurrency and timing
