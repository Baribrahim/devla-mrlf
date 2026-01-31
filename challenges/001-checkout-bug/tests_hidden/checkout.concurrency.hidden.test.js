const request = require("supertest");
const { createApp } = require("../src/app");
const { listProviderCharges } = require("../src/adapters/paymentProvider");
const { resetAll } = require("../tests/helpers");

describe("hidden: basic concurrency", () => {
  beforeEach(() => resetAll());

  test("two concurrent checkouts for the same order must not result in two charges", async () => {
    const app = createApp();
    const orderId = "ord_timeout_concurrent_1";

    const [r1, r2] = await Promise.all([
      request(app).post("/checkout").send({ orderId }),
      request(app).post("/checkout").send({ orderId }),
    ]);

    expect(r1.status).toBe(200);
    expect(r2.status).toBe(200);

    const providerCharges = listProviderCharges(orderId);
    expect(providerCharges.length).toBe(1);
  });
});
