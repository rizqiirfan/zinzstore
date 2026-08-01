// Middleware penangkap error terpusat.
// Dipasang paling akhir di app.js supaya semua error dari
// route/controller yang memanggil next(err) ditangani di sini.
function errorHandler(err, req, res, next) {
  console.error('🔥 Error:', err.message);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Terjadi kesalahan pada server.',
  });
}

function notFound(req, res) {
  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan.' });
}

module.exports = { errorHandler, notFound };
