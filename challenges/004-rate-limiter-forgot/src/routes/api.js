const express = require('express');
const router = express.Router();

/**
 * Public API routes.
 * These are the endpoints that the rate limiter should protect.
 */

// GET /api/data — returns sample data
router.get('/data', (req, res) => {
    res.json({
        message: 'Here is your data',
        items: [
            { id: 1, name: 'Item One', value: 42 },
            { id: 2, name: 'Item Two', value: 84 },
            { id: 3, name: 'Item Three', value: 126 },
        ],
        timestamp: new Date().toISOString(),
    });
});

// POST /api/submit — accepts submissions
router.post('/submit', (req, res) => {
    const { payload } = req.body || {};
    if (!payload) {
        return res.status(400).json({ error: 'payload is required' });
    }

    res.json({
        message: 'Submission received',
        id: `sub_${Date.now()}`,
        payload,
    });
});

// GET /api/health — health check (should NOT be rate limited in production,
// but currently is because the middleware is applied to all /api routes)
router.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
});

// GET /api/status — rate limit status for debugging
router.get('/status', (req, res) => {
    const clientKey = req.headers['x-forwarded-for'] || req.ip;
    res.json({
        clientKey,
        message: 'Use /api/data and /api/submit for testing rate limits',
    });
});

module.exports = { apiRouter: router };
