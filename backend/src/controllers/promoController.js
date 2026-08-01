const { pool } = require('../config/db');

// POST /api/promo/apply  { code, price }
async function applyPromo(req, res, next) {
  try {
    const { code, price } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Kode promo wajib diisi.' });
    }

    const [rows] = await pool.query(
      `SELECT * FROM promo_codes
       WHERE code = ? AND is_active = 1 AND (expires_at IS NULL OR expires_at > NOW())`,
      [code.trim().toUpperCase()]
    );
    const promo = rows[0];

    if (!promo) {
      return res.status(404).json({ success: false, message: 'Kode promo tidak valid.' });
    }

    let discount = 0;
    if (promo.discount_type === 'percent') {
      discount = Math.round(((price || 0) * promo.discount_value) / 100);
      if (promo.max_discount) discount = Math.min(discount, promo.max_discount);
    } else {
      discount = promo.discount_value;
    }

    res.json({
      success: true,
      message: `Kode promo berhasil! Diskon ${promo.discount_type === 'percent' ? promo.discount_value + '%' : 'Rp ' + promo.discount_value.toLocaleString('id-ID')}`,
      data: { code: promo.code, discount },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { applyPromo };
