const request = require('supertest');
const app = require('../src/app');
const { resetDb } = require('../src/db/database');

beforeEach(() => {
    resetDb();
});

afterAll(() => {
    resetDb();
});

module.exports = { request, app };
