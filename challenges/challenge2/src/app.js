const express = require("express");
const { checkoutRouter } = require("./routes/checkout");

function createApp() {
  const app = express();
  app.use(express.json());

  app.get("/health", (_req, res) => res.status(200).json({ ok: true }));

  app.use(checkoutRouter);

  return app;
}

if (require.main === module) {
  const app = createApp();
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`listening on :${port}`));
}

module.exports = { createApp };
