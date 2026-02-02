const express = require('express');
const path = require('path');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');

function createApp() {
    const app = express();

    app.use(express.json());
    app.use(express.static(path.join(__dirname, '../public')));

    // API routes
    app.use('/api/auth', authRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/user', userRoutes);

    // Serve frontend
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });

    return app;
}

// Only start server if run directly
if (require.main === module) {
    const app = createApp();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Dashly server running on http://localhost:${PORT}`);
    });
}

module.exports = { createApp };
