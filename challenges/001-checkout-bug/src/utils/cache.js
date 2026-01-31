/**
 * Very small in-memory cache with TTL.
 * This exists for performance and is intentionally part of the system.
 */
class TTLCache {
  constructor() {
    this._store = new Map();
  }

  set(key, value, ttlMs = 2000) {
    const expiresAt = Date.now() + ttlMs;
    this._store.set(key, { value, expiresAt });
  }

  get(key) {
    const entry = this._store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this._store.delete(key);
      return null;
    }
    return entry.value;
  }

  del(key) {
    this._store.delete(key);
  }

  clear() {
    this._store.clear();
  }
}

const orderStatusCache = new TTLCache();

module.exports = { TTLCache, orderStatusCache };
