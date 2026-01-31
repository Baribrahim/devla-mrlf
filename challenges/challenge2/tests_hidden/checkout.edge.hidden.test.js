const request = require("supertest");
const { createApp } = require("../src/app");
const { listProviderCharges } = require("../src/adapters/paymentProvider");
const { resetAll } = require("../tests/helpers");

describe("hidden: edge case scenarios", () => {
    beforeEach(() => resetAll());

    test("rapid sequential checkouts for the same order must produce exactly one charge", async () => {
        const app = createApp();
        const orderId = "ord_timeout_rapid_1";

        // Fire 5 sequential requests as fast as possible
        for (let i = 0; i < 5; i++) {
            const res = await request(app).post("/checkout").send({ orderId });
            expect(res.status).toBe(200);
            expect(res.body.status).toBe("paid");
        }

        const providerCharges = listProviderCharges(orderId);
        expect(providerCharges.length).toBe(1);
    });

    test("different orders with timeout pattern must each charge exactly once", async () => {
        const app = createApp();

        // Two distinct orders, both with timeout pattern
        await request(app).post("/checkout").send({ orderId: "ord_timeout_multi_a" });
        await request(app).post("/checkout").send({ orderId: "ord_timeout_multi_b" });

        const chargesA = listProviderCharges("ord_timeout_multi_a");
        const chargesB = listProviderCharges("ord_timeout_multi_b");

        expect(chargesA.length).toBe(1);
        expect(chargesB.length).toBe(1);
        expect(chargesA[0].chargeId).not.toBe(chargesB[0].chargeId);
    });

    test("interleaved checkout calls for different orders must not cross-contaminate", async () => {
        const app = createApp();

        // Interleave requests for two orders
        const [r1, r2, r3, r4] = await Promise.all([
            request(app).post("/checkout").send({ orderId: "ord_timeout_interleave_1" }),
            request(app).post("/checkout").send({ orderId: "ord_timeout_interleave_2" }),
            request(app).post("/checkout").send({ orderId: "ord_timeout_interleave_1" }),
            request(app).post("/checkout").send({ orderId: "ord_timeout_interleave_2" }),
        ]);

        expect(r1.status).toBe(200);
        expect(r2.status).toBe(200);
        expect(r3.status).toBe(200);
        expect(r4.status).toBe(200);

        const charges1 = listProviderCharges("ord_timeout_interleave_1");
        const charges2 = listProviderCharges("ord_timeout_interleave_2");

        expect(charges1.length).toBe(1);
        expect(charges2.length).toBe(1);
    });
});
