const request = require('supertest');
const app = require('../src/app');
const { resetRateLimiter } = require('../src/middleware/rateLimiter');

beforeEach(() => {
    resetRateLimiter();
});

module.exports = { request, app };
