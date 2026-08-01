const { pool } = require('../config/db');

// GET /api/packages
async function getPackages(req, res, next) {
  try {
    const [rows] = await pool.query(
      'SELECT id, diamonds, bonus, price, label FROM diamond_packages WHERE is_active = 1 ORDER BY sort_order ASC'
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
}

module.exports = { getPackages };
