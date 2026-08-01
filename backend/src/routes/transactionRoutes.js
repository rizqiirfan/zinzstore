const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const {
  createTransaction,
  syncTransactionStatus,
  getMyTransactions,
} = require('../controllers/transactionController');

router.use(requireAuth);

router.post('/', createTransaction);
router.post('/:id/sync', syncTransactionStatus);
router.get('/', getMyTransactions);

module.exports = router;
