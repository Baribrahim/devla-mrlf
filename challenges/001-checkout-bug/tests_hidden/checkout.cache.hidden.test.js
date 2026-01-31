const request = require("supertest");
const { createApp } = require("../src/app");
const { listProviderCharges } = require("../src/adapters/paymentProvider");
const { resetAll } = require("../tests/helpers");

describe("hidden: caching and repeated requests", () => {
  beforeEach(() => resetAll());

  test("paid status must be respected even if cache previously stored 'unpaid'", async () => {
    const app = createApp();

    // First request triggers timeout pattern; service eventually pays.
    await request(app).post("/checkout").send({ orderId: "ord_timeout_cache_1" });

    // Second request should not charge again.
    await request(app).post("/checkout").send({ orderId: "ord_timeout_cache_1" });

    const providerCharges = listProviderCharges("ord_timeout_cache_1");
    expect(providerCharges.length).toBe(1);
  });
});
