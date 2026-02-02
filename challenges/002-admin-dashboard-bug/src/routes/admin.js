const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middleware/authenticate');
const Users = require('../db/users');

/**
 * GET /api/admin/stats
 * Get user statistics (admin only)
 */
router.get('/stats', authenticate, requireAdmin, (req, res) => {
    const stats = Users.getUserCountByRole();
    const totalUsers = Object.values(stats).reduce((sum, count) => sum + count, 0);

    res.json({
        totalUsers,
        byRole: stats,
        requestedBy: req.user.email
    });
});

/**
 * GET /api/admin/users
 * Get all users (admin only)
 */
router.get('/users', authenticate, requireAdmin, (req, res) => {
    const users = Users.getAllUsers();

    res.json({
        users,
        count: users.length
    });
});

/**
 * GET /api/admin/dashboard
 * Get admin dashboard data (admin only)
 */
router.get('/dashboard', authenticate, requireAdmin, (req, res) => {
    const stats = Users.getUserCountByRole();

    res.json({
        welcome: `Welcome to the admin dashboard, ${req.user.name}!`,
        stats: {
            usersByRole: stats
        },
        features: [
            'User management',
            'Analytics',
            'System settings'
        ]
    });
});

module.exports = router;
