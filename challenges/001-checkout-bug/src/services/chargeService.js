const crypto = require("crypto");
const { retry } = require("../utils/retry");
const { TimeoutError } = require("../utils/errors");
const { createCharge } = require("../adapters/paymentProvider");
const Orders = require("../db/ordersRepo");
const { orderStatusCache } = require("../utils/cache");

/**
 * Charge the order.
 *
 * Intended behavior:
 * - retries on provider timeout
 * - never double-charges the same order
 *
 * NOTE: There is a production bug causing duplicate charges under retries.
 */
async function chargeOrder(orderId) {
  const order = Orders.ensureOrderExists(orderId);

  if (order.status === "paid") {
    return { status: "paid", chargeId: null };
  }

  const result = await retry(
    async () => {
      const attemptIdemKey = crypto.randomUUID?.() ?? crypto.randomBytes(16).toString("hex");
      const providerRes = await createCharge({
        orderId,
        amountCents: order.amount_cents,
        currency: order.currency,
        idempotencyKey: attemptIdemKey,
      });

      // Store idempotency key only after provider returns successfully.
      // (In a timeout case, we don't persist it, so retry uses a new key.)
      Orders.setIdempotencyKey(orderId, attemptIdemKey);
      Orders.recordCharge(providerRes.chargeId, orderId, attemptIdemKey);

      Orders.markPaid(orderId);
      return { status: "paid", chargeId: providerRes.chargeId };
    },
    {
      retries: 2,
      shouldRetry: (err) => err instanceof TimeoutError,
    }
  );

  return result;
}

module.exports = { chargeOrder };
