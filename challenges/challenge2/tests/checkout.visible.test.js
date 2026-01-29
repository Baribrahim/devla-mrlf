const request = require("supertest");
const { createApp } = require("../src/app");
const Orders = require("../src/db/ordersRepo");
const { listProviderCharges } = require("../src/adapters/paymentProvider");
const { resetAll } = require("./helpers");

describe("Friday Checkout Incident (visible)", () => {
  beforeEach(() => resetAll());

  test("charges an unpaid order and marks it paid", async () => {
    const app = createApp();

    const res = await request(app)
      .post("/checkout")
      .send({ orderId: "ord_ok_1" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("paid");

    const order = Orders.getOrder("ord_ok_1");
    expect(order.status).toBe("paid");
  });

  test("does not create duplicate charges when the provider times out and retry kicks in", async () => {
    const app = createApp();

    // This order deterministically times out on the first provider call.
    const res = await request(app)
      .post("/checkout")
      .send({ orderId: "ord_timeout_1" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("paid");

    const providerCharges = listProviderCharges("ord_timeout_1");
    // Expected: exactly 1 charge total, even with retry.
    expect(providerCharges.length).toBe(1);
  });

  test("repeat checkout call for a paid order must not charge again", async () => {
    const app = createApp();

    const res1 = await request(app).post("/checkout").send({ orderId: "ord_timeout_2" });
    expect(res1.status).toBe(200);

    const res2 = await request(app).post("/checkout").send({ orderId: "ord_timeout_2" });
    expect(res2.status).toBe(200);

    const providerCharges = listProviderCharges("ord_timeout_2");
    expect(providerCharges.length).toBe(1);
  });
});
