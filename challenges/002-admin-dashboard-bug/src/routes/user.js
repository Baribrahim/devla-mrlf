const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authenticate');
const Users = require('../db/users');

/**
 * GET /api/user/profile
 * Get current user's profile
 */
router.get('/profile', authenticate, (req, res) => {
    const user = Users.findById(req.user.id);

    if (!user) {
        return res.status(404).json({
            error: 'User not found'
        });
    }

    res.json({
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            createdAt: user.created_at
        }
    });
});

/**
 * GET /api/user/me
 * Get user info from the token
 */
router.get('/me', authenticate, (req, res) => {
    res.json({
        fromToken: {
            id: req.user.id,
            email: req.user.email,
            name: req.user.name,
            role: req.user.role
        }
    });
});

module.exports = router;
