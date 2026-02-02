const jwt = require('jsonwebtoken');

// In a real app, this would be in environment variables
const JWT_SECRET = 'dashly-super-secret-key-2024';
const TOKEN_EXPIRY = '24h';

/**
 * Sign a JWT token with the provided payload
 */
function signToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

/**
 * Verify and decode a JWT token
 * Returns the decoded payload or throws an error
 */
function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

/**
 * Decode a token without verification (for debugging)
 * WARNING: This does not verify the signature!
 */
function decodeToken(token) {
    return jwt.decode(token);
}

module.exports = {
    signToken,
    verifyToken,
    decodeToken,
    JWT_SECRET
};
