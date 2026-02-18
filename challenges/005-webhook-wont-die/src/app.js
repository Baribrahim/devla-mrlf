const express = require('express');
const { webhookRouter } = require('./routes/webhooks');

const app = express();

app.use(express.json());

// Webhook routes
app.use('/webhooks', webhookRouter);
// Also mount orders route from the webhook router for convenience
app.use('/', webhookRouter);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        name: 'OrderFlow Webhook Processor',
        version: '1.0.0',
        endpoints: [
            'POST /webhooks/stripe',
            'GET  /webhooks/events',
            'GET  /webhooks/events/:id',
            'GET  /orders/:id',
        ],
    });
});

if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`OrderFlow running on port ${PORT}`);
    });
}

module.exports = app;
