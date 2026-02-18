const express = require('express');
const { rateLimiter } = require('./middleware/rateLimiter');
const { apiRouter } = require('./routes/api');

const app = express();

// Parse JSON bodies
app.use(express.json());

// Apply rate limiter to all API routes
app.use('/api', rateLimiter);
app.use('/api', apiRouter);

// Root endpoint (not rate limited)
app.get('/', (req, res) => {
    res.json({
        name: 'QuickAPI',
        version: '1.2.0',
        endpoints: [
            'GET  /api/data',
            'POST /api/submit',
            'GET  /api/health',
            'GET  /api/status',
        ],
    });
});

// Start server if run directly
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`QuickAPI running on port ${PORT}`);
    });
}

module.exports = app;
