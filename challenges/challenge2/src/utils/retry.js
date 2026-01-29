/**
 * Tiny retry helper.
 * NOTE: Retries are part of the intended system behavior — do not remove.
 */
async function retry(fn, opts = {}) {
  const retries = opts.retries ?? 2;
  const shouldRetry = opts.shouldRetry ?? (() => true);

  let attempt = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      return await fn(attempt);
    } catch (err) {
      attempt += 1;
      if (attempt > retries || !shouldRetry(err, attempt)) {
        throw err;
      }
      // small backoff
      await new Promise((r) => setTimeout(r, 10 * attempt));
    }
  }
}

module.exports = { retry };
