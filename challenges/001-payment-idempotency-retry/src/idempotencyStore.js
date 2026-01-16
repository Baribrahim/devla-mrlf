const { log } = require('./utils');

/**
 * In-memory idempotency store
 * In production, this would be Redis or similar
 */
class IdempotencyStore {
  constructor() {
    this.store = new Map();
    this.ttlMs = 24 * 60 * 60 * 1000; // 24 hours
  }

  /**
   * Check if a key exists and return stored result if so
   * @param {string} key - The idempotency key
   * @returns {object|null} - Stored result or null
   */
  get(key) {
    const entry = this.store.get(key);
    if (!entry) {
      return null;
    }
    
    // Check TTL
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      log('debug', 'Idempotency key expired', { key });
      return null;
    }
    
    log('debug', 'Idempotency cache hit', { key });
    return entry.result;
  }

  /**
   * Store a result against an idempotency key
   * @param {string} key - The idempotency key
   * @param {object} result - The result to store
   */
  set(key, result) {
    this.store.set(key, {
      result,
      expiresAt: Date.now() + this.ttlMs,
      createdAt: Date.now()
    });
    log('debug', 'Stored idempotency result', { key });
  }

  /**
   * Check if key exists (without returning result)
   * @param {string} key - The idempotency key
   * @returns {boolean}
   */
  has(key) {
    const entry = this.store.get(key);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return false;
    }
    return true;
  }

  /**
   * Clear all entries (for testing)
   */
  clear() {
    this.store.clear();
  }

  /**
   * Get store size (for testing/debugging)
   */
  size() {
    return this.store.size;
  }
}

// Singleton instance
const idempotencyStore = new IdempotencyStore();

module.exports = { idempotencyStore, IdempotencyStore };

