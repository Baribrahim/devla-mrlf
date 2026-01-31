const { getDb } = require("./db");

function now() {
  return Date.now();
}

function ensureOrderExists(orderId, amountCents = 1299, currency = "GBP") {
  const db = getDb();
  const existing = db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId);
  if (existing) return existing;

  db.prepare(
    "INSERT INTO orders (id, amount_cents, currency, status, idempotency_key, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(orderId, amountCents, currency, "unpaid", null, now());

  return db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId);
}

function getOrder(orderId) {
  const db = getDb();
  return db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId) || null;
}

function markPaid(orderId) {
  const db = getDb();
  db.prepare("UPDATE orders SET status = ?, updated_at = ? WHERE id = ?").run("paid", now(), orderId);
  return getOrder(orderId);
}

/**
 * Stores the idempotency key used for charging an order.
 * The platform needs this to handle retries safely.
 */
function setIdempotencyKey(orderId, key) {
  const db = getDb();
  db.prepare("UPDATE orders SET idempotency_key = ?, updated_at = ? WHERE id = ?").run(key, now(), orderId);
  return getOrder(orderId);
}

function recordCharge(chargeId, orderId, idempotencyKey) {
  const db = getDb();
  db.prepare(
    "INSERT INTO charges (id, order_id, idempotency_key, created_at) VALUES (?, ?, ?, ?)"
  ).run(chargeId, orderId, idempotencyKey ?? null, now());
}

function listCharges(orderId) {
  const db = getDb();
  return db.prepare("SELECT * FROM charges WHERE order_id = ? ORDER BY created_at ASC").all(orderId);
}

module.exports = {
  ensureOrderExists,
  getOrder,
  markPaid,
  setIdempotencyKey,
  recordCharge,
  listCharges,
};
