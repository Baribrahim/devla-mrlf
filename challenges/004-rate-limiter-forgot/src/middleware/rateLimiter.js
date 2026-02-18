const { SlidingWindowStore } = require('../utils/slidingWindow');

// Shared store instance for rate limiting
const store = new SlidingWindowStore();

// Configuration
const WINDOW_MS = 60 * 1000;  // 1 minute window
const MAX_REQUESTS = 10;      // 10 requests per window

/**
 * Rate limiting middleware.
 *
 * Limits each client to MAX_REQUESTS per WINDOW_MS.
 * Uses the client's IP address as the identifier.
 *
 * Added during the HN launch prep to protect the API.
 */
function rateLimiter(req, res, next) {
    // BUG #2: IP extraction doesn't handle X-Forwarded-For properly.
    // X-Forwarded-For can contain multiple IPs: "client, proxy1, proxy2"
    // We should use the FIRST IP (the actual client), but we're using
    // the entire raw header string as the key. This means:
    // - All requests through the same proxy chain share ONE key
    //   (even from different clients)
    // - Direct connections use req.ip which may be undefined/::1
    const clientKey = req.headers['x-forwarded-for'] || req.ip;

    const result = store.check(clientKey, WINDOW_MS, MAX_REQUESTS);

    // Set standard rate limit headers
    res.set('X-RateLimit-Limit', String(MAX_REQUESTS));
    res.set('X-RateLimit-Remaining', String(result.remaining));

    if (!result.allowed) {
        res.set('Retry-After', String(Math.ceil(result.resetMs / 1000)));
        return res.status(429).json({
            error: 'Too Many Requests',
            message: `Rate limit exceeded. Try again in ${Math.ceil(result.resetMs / 1000)} seconds.`,
            retryAfter: Math.ceil(result.resetMs / 1000),
        });
    }

    next();
}

/**
 * Reset rate limiter state (for testing).
 */
function resetRateLimiter() {
    store.reset();
}

module.exports = { rateLimiter, resetRateLimiter, WINDOW_MS, MAX_REQUESTS };
