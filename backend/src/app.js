const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const packageRoutes = require('./routes/packageRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const promoRoutes = require('./routes/promoRoutes');
const playerRoutes = require('./routes/playerRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// ----- Global middleware -----
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----- Health check -----
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'ZinzStore API is running 🔥' });
});

// ----- Routes -----
app.use('/api/auth', authRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/payment-methods', paymentRoutes);
app.use('/api/promo', promoRoutes);
app.use('/api/player', playerRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/admin', adminRoutes);

// ----- 404 & error handler (harus paling akhir) -----
app.use(notFound);
app.use(errorHandler);

module.exports = app;
