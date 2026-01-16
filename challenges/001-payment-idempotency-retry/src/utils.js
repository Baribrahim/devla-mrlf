const crypto = require('crypto');

/**
 * Generates a unique request ID for tracing
 */
function generateRequestId() {
  return `req_${crypto.randomUUID()}`;
}

/**
 * Simple logger with timestamp
 */
function log(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
  console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`);
}

/**
 * Sleep helper for retry backoff
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Determines if an error is retryable
 */
function isRetryableError(error) {
  if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
    return true;
  }
  if (error.statusCode >= 500 && error.statusCode < 600) {
    return true;
  }
  if (error.message && error.message.includes('timeout')) {
    return true;
  }
  return false;
}

module.exports = {
  generateRequestId,
  log,
  sleep,
  isRetryableError
};

