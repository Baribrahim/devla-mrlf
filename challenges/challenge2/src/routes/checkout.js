const express = require("express");
const Orders = require("../db/ordersRepo");
const { orderStatusCache } = require("../utils/cache");
const { chargeOrder } = require("../services/chargeService");

const router = express.Router();

/**
 * POST /checkout
 * Body: { orderId: string }
 */
router.post("/checkout", async (req, res) => {
  const { orderId } = req.body || {};
  if (!orderId || typeof orderId !== "string") {
    return res.status(400).json({ error: "orderId is required" });
  }

  Orders.ensureOrderExists(orderId);

  // Fast path: check cached order status.
  const cachedStatus = orderStatusCache.get(orderId);
  if (cachedStatus === "paid") {
    return res.status(200).json({ orderId, status: "paid", chargeId: null });
  }

  const order = Orders.getOrder(orderId);
  if (order?.status === "paid") {
    orderStatusCache.set(orderId, "paid", 2000);
    return res.status(200).json({ orderId, status: "paid", chargeId: null });
  }

  try {
    const result = await chargeOrder(orderId);
    // Intentionally cache status for performance
    orderStatusCache.set(orderId, result.status, 2000);
    return res.status(200).json({ orderId, status: result.status, chargeId: result.chargeId });
  } catch (err) {
    return res.status(502).json({ error: "payment_failed", message: err.message });
  }
});

module.exports = { checkoutRouter: router };
