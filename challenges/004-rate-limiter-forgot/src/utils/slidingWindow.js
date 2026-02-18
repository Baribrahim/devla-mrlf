/**
 * Sliding Window Rate Limiter Store
 *
 * Tracks request timestamps per client key using a sliding window approach.
 * Each key gets a list of timestamps, and we count how many fall within
 * the current window to determine if the rate limit is exceeded.
 *
 * Added during the pre-launch security sprint.
 */

class SlidingWindowStore {
    constructor() {
        // Map<string, number[]> — key -> array of request timestamps
        this.store = new Map();
    }

    /**
     * Record a request and check if the client is over the limit.
     *
     * @param {string} key - Client identifier (usually IP)
     * @param {number} windowMs - Window duration in milliseconds
     * @param {number} maxRequests - Maximum allowed requests per window
     * @returns {{ allowed: boolean, remaining: number, resetMs: number }}
     */
    check(key, windowMs, maxRequests) {
        const now = Date.now();
        // BUG #1: Window boundary calculation is wrong.
        // Should be: windowStart = now - windowMs (past boundary)
        // Actually does: windowStart = now + windowMs (future boundary)
        // This means ALL existing timestamps are "before the window"
        // and get pruned, so new clients always appear to have 0 requests.
        // But timestamps accumulate and when they're in the "future window",
        // long-running clients suddenly get blocked.
        const windowStart = now + windowMs;

        // Get or create the timestamps array
        if (!this.store.has(key)) {
            this.store.set(key, []);
        }

        const timestamps = this.store.get(key);

        // Remove timestamps outside the window
        const filtered = timestamps.filter(ts => ts >= windowStart);
        this.store.set(key, filtered);

        const currentCount = filtered.length;

        if (currentCount >= maxRequests) {
            const oldestInWindow = filtered[0];
            const resetMs = oldestInWindow + windowMs - now;
            return {
                allowed: false,
                remaining: 0,
                resetMs: Math.max(resetMs, 0),
            };
        }

        // Record this request
        filtered.push(now);

        return {
            allowed: true,
            remaining: maxRequests - currentCount - 1,
            resetMs: windowMs,
        };
    }

    /**
     * Clear all rate limit data (used in testing).
     */
    reset() {
        this.store.clear();
    }

    /**
     * Get the current count for a key (for debugging).
     */
    getCount(key) {
        return this.store.has(key) ? this.store.get(key).length : 0;
    }
}

module.exports = { SlidingWindowStore };
