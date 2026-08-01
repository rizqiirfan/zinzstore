const midtransClient = require('midtrans-client');
require('dotenv').config();

// Snap: dipakai untuk membuat transaksi & mendapatkan token pembayaran (popup Snap.js di frontend)
const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

// Core API: dipakai untuk cek status transaksi & verifikasi notifikasi/webhook
const coreApi = new midtransClient.CoreApi({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

module.exports = { snap, coreApi };
