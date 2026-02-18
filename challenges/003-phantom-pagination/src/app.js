const express = require('express');
const { productsRouter } = require('./routes/products');

const app = express();

app.use(express.json());

// Product catalog API
app.use('/api/products', productsRouter);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Start server if run directly
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Product catalog API running on port ${PORT}`);
    });
}

module.exports = app;
