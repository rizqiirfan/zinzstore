const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');
const {
  getStats,
  getAllTransactions,
  updateTransactionStatus,
  getAllUsers,
} = require('../controllers/adminController');

router.use(requireAuth, requireAdmin);

router.get('/stats', getStats);
router.get('/transactions', getAllTransactions);
router.patch('/transactions/:id/status', updateTransactionStatus);
router.get('/users', getAllUsers);

module.exports = router;
