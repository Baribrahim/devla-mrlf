const { verifyToken } = require('../utils/jwt');

/**
 * Middleware to authenticate requests using JWT
 * Attaches decoded user info to req.user
 */
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            error: 'No authorization header provided'
        });
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({
            error: 'Invalid authorization header format. Use: Bearer <token>'
        });
    }

    const token = parts[1];

    try {
        const decoded = verifyToken(token);

        // Attach user info from token to request
        req.user = {
            id: decoded.sub,
            email: decoded.email,
            name: decoded.name,
            role: decoded.role
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired' });
        }

        return res.status(401).json({ error: 'Invalid token' });
    }
}

/**
 * Middleware to require admin role
 * Must be used after authenticate middleware
 */
function requireAdmin(req, res, next) {
    if (!req.user) {
        return res.status(401).json({
            error: 'Authentication required'
        });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            error: 'Admin access required'
        });
    }

    next();
}

/**
 * Middleware to require moderator or admin role
 * Must be used after authenticate middleware
 */
function requireModerator(req, res, next) {
    if (!req.user) {
        return res.status(401).json({
            error: 'Authentication required'
        });
    }

    if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
        return res.status(403).json({
            error: 'Moderator access required'
        });
    }

    next();
}

module.exports = {
    authenticate,
    requireAdmin,
    requireModerator
};
