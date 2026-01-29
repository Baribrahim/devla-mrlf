const { resetDb } = require("../src/db/db");
const { resetProviderState } = require("../src/adapters/paymentProvider");
const { orderStatusCache } = require("../src/utils/cache");

function resetAll() {
  resetDb();
  resetProviderState();
  orderStatusCache.clear();
}

module.exports = { resetAll };
