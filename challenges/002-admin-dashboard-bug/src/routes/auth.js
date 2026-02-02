const express = require('express');
const router = express.Router();
const Users = require('../db/users');
const { signToken } = require('../utils/jwt');

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 */
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: 'Email and password are required'
        });
    }

    const user = Users.verifyCredentials(email, password);

    if (!user) {
        return res.status(401).json({
            error: 'Invalid email or password'
        });
    }

    // Generate JWT token for the authenticated user
    // BUG: Role is NOT included in the token payload!
    // The developer remembered to add user info but forgot the role
    const token = signToken({
        sub: user.id,
        email: user.email,
        name: user.name
        // Missing: role: user.role
    });

    res.json({
        message: 'Login successful',
        token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role  // Role is returned here but NOT in the token!
        }
    });
});

/**
 * POST /api/auth/register
 * Register is disabled in this demo
 */
router.post('/register', (req, res) => {
    res.status(501).json({
        error: 'Registration is disabled in this demo'
    });
});

module.exports = router;
