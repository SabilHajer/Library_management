// src/routes/loanRoutes.js
const express = require('express');
const loanController = require('../controllers/loanController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Ensure all routes have callback functions
router.post('/borrow', authMiddleware, loanController.borrowBook);
router.post('/return', authMiddleware, loanController.returnBook);

router.get('/user/:id', authMiddleware, loanController.getUserLoans);
router.get('/', loanController.getAllLoans);
router.get('/:id', loanController.getLoanById);
router.post('/', loanController.createLoan);
router.put('/:id', loanController.updateLoan);
router.delete('/:id', loanController.deleteLoan);

module.exports = router;
