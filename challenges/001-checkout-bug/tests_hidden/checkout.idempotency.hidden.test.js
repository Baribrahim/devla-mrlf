const request = require("supertest");
const { createApp } = require("../src/app");
const { listProviderCharges } = require("../src/adapters/paymentProvider");
const { resetAll } = require("../tests/helpers");

describe("hidden: idempotency edge cases", () => {
  beforeEach(() => resetAll());

  test("timeout on first attempt must not create multiple provider charges", async () => {
    const app = createApp();

    await request(app).post("/checkout").send({ orderId: "ord_timeout_hidden_1" });

    const providerCharges = listProviderCharges("ord_timeout_hidden_1");
    expect(providerCharges.length).toBe(1);
  });

  test("two sequential retries due to repeated timeouts must still be idempotent", async () => {
    // Simulate multiple timeouts by calling multiple times for a new order
    // (provider times out only on first call per order, but repeated requests should still remain safe)
    const app = createApp();

    await request(app).post("/checkout").send({ orderId: "ord_timeout_hidden_2" });
    await request(app).post("/checkout").send({ orderId: "ord_timeout_hidden_2" });

    const providerCharges = listProviderCharges("ord_timeout_hidden_2");
    expect(providerCharges.length).toBe(1);
  });
});
