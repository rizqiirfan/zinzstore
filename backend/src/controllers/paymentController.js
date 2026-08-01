const { pool } = require('../config/db');

// GET /api/payment-methods
async function getPaymentMethods(req, res, next) {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, icon, fee, category FROM payment_methods WHERE is_active = 1'
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
}

module.exports = { getPaymentMethods };
