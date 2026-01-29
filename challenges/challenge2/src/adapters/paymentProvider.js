/**
 * Fake payment provider that simulates an important real-world failure mode:
 *
 * - A request can TIME OUT, but the provider may still create a charge.
 * - Idempotency keys prevent duplicate charges if the same request is retried.
 *
 * This module keeps its own internal state to simulate the provider.
 */
const { TimeoutError } = require("../utils/errors");

const _state = {
  chargesByIdempotencyKey: new Map(),   // idemKey -> chargeId
  charges: [],                          // { chargeId, orderId, idemKey }
  callCountByOrder: new Map(),          // orderId -> count
};

function _nextChargeId() {
  return `ch_${Math.random().toString(16).slice(2, 10)}`;
}

function resetProviderState() {
  _state.chargesByIdempotencyKey.clear();
  _state.charges.length = 0;
  _state.callCountByOrder.clear();
}

function listProviderCharges(orderId) {
  return _state.charges.filter((c) => c.orderId === orderId);
}

/**
 * Simulate charging an order.
 * If idempotencyKey is provided:
 *   - repeated calls with the same key return the SAME chargeId.
 *
 * Failure mode:
 *   - first call for certain orders will throw TimeoutError AFTER creating a charge.
 */
async function createCharge({ orderId, amountCents, currency, idempotencyKey }) {
  const prevCount = _state.callCountByOrder.get(orderId) ?? 0;
  const nextCount = prevCount + 1;
  _state.callCountByOrder.set(orderId, nextCount);

  if (idempotencyKey && _state.chargesByIdempotencyKey.has(idempotencyKey)) {
    // provider dedupes for same idem key
    return { chargeId: _state.chargesByIdempotencyKey.get(idempotencyKey) };
  }

  const chargeId = _nextChargeId();
  if (idempotencyKey) _state.chargesByIdempotencyKey.set(idempotencyKey, chargeId);
  _state.charges.push({ chargeId, orderId, idemKey: idempotencyKey ?? null, amountCents, currency });

  // Deterministic timeout pattern:
  // - On the FIRST call for an order, simulate a timeout for certain realistic conditions.
  // - Still creates the charge (already recorded above).
  if (nextCount === 1 && orderId.startsWith("ord_timeout_")) {
    // emulate network latency
    await new Promise((r) => setTimeout(r, 5));
    throw new TimeoutError("provider timeout (charge may have been created)");
  }

  // small latency to feel real
  await new Promise((r) => setTimeout(r, 5));
  return { chargeId };
}

module.exports = {
  createCharge,
  resetProviderState,
  listProviderCharges,
};
