const express = require('express');
const transactionController = require('../controllers/transactionController'); 
const authenticateToken  = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/transactions', authenticateToken, transactionController.createTransaction);
router.get('/transactions', authenticateToken, transactionController.getTransactions);
router.get('/transactions/:id', authenticateToken, transactionController.getTransactionById);
router.put('/transactions/:id', authenticateToken, transactionController.updateTransaction);
router.delete('/transactions/:id', authenticateToken, transactionController.deleteTransaction);
router.get('/summary', authenticateToken, transactionController.getSummary);

module.exports = router;