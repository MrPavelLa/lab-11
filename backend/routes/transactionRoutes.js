const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.post('/', transactionController.createTransaction);
router.get('/:code', transactionController.getAllTransactionsForCode);
router.put('/:id', transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);
router.put('/recover/:id', transactionController.recoverTransaction);
router.get('/', transactionController.getAllTransactions);

module.exports = router;
