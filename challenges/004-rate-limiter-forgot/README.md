# The Rate Limiter That Forgot — Inverted Protection

## Background

You're an engineer at **QuickAPI**, a startup that sells a data API to small businesses. The API was built fast and launched on Product Hunt three months ago. Traffic has been steady — about 200 requests/minute.

Last week, someone posted a link on Hacker News. Traffic spiked to 10,000 requests/minute. The servers melted.

After recovering, the CTO asked the team to add rate limiting. A teammate shipped a sliding-window rate limiter last Friday. It's supposed to:
- Allow 10 requests per minute per client
- Track clients by IP address
- Return proper `429 Too Many Requests` responses with `Retry-After` headers
- Work behind reverse proxies (parse `X-Forwarded-For`)

It's now Monday. Two support tickets came in over the weekend:

> **Ticket 1:** "I can't access the API. I get 429 immediately on my first request. I haven't used the API in days." — legit customer

> **Ticket 2:** "We're seeing thousands of requests per minute from a single IP, and none of them are getting rate limited." — operations team

The rate limiter is doing the **exact opposite** of what it should. It blocks legitimate users while letting heavy traffic through unchecked.

## Your Task

Find and fix the bug(s) in the rate limiting system.

The rate limiter should:
- Allow each client up to 10 requests per 60-second window
- Block excess requests with `429 Too Many Requests`
- Track each client independently by their real IP address
- Work correctly when requests come through proxies (`X-Forwarded-For`)
- Return accurate `X-RateLimit-Remaining` and `Retry-After` headers

## What "Done" Looks Like

- All existing tests pass (`npm test`)
- Rapid requests from one IP trigger the rate limit at the correct threshold
- Different clients are tracked independently
- Proxy headers are handled correctly (first IP = real client)
- Rate limit headers are accurate

## Constraints

**You must not:**
- Remove the rate limiter entirely
- Change the rate limit configuration (10 requests / 60 seconds)
- Change the API routes or response formats
- Modify any test files

**You must:**
- Preserve the sliding window algorithm approach
- Keep the existing architecture (middleware + store separation)
- Fix root causes, not symptoms

## Running the Project

```bash
npm install
npm test
```

## File Overview

```
src/
  app.js                         # Express app setup and middleware registration
  routes/api.js                  # API endpoints (data, submit, health, status)
  middleware/rateLimiter.js       # Rate limiting middleware (IP extraction, limit enforcement)
  utils/slidingWindow.js         # Sliding window store (timestamp tracking, window calculation)

tests/
  ratelimit.visible.test.js      # Visible test suite
  helpers.js                     # Test utilities
```

## Notes

- The rate limiter uses a sliding window algorithm, not a fixed window
- The `X-Forwarded-For` header may contain multiple IPs when requests pass through proxies
- The middleware and store are intentionally separated — the store manages state, the middleware handles HTTP concerns
- Visible tests guide you, but hidden tests cover additional scenarios including proxy handling and timing
