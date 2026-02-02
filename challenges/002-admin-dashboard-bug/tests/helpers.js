const { resetDatabase } = require('../src/db/database');

/**
 * Reset all test state
 */
function resetAll() {
    resetDatabase();
}

module.exports = { resetAll };
