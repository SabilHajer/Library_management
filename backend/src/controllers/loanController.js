// src/controllers/loanController.js
const Loan = require('../models/Loan');
const User = require('../models/User');
const Book = require('../models/Book');

exports.getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.findAll({ include: [User, Book] });
    res.json(loans);
  } catch (error) {
    res.status(500).json({ error: 'Unable to retrieve loans' });
  }
};

exports.getLoanById = async (req, res) => {
  const { id } = req.params;
  try {
    const loan = await Loan.findByPk(id, { include: [User, Book] });
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }
    res.json(loan);
  } catch (error) {
    res.status(500).json({ error: 'Unable to retrieve loan' });
  }
};

exports.createLoan = async (req, res) => {
  const { UserId, BookId, dateEmprunt, dateRetour } = req.body;
  try {
    const loan = await Loan.create({ UserId, BookId, dateEmprunt, dateRetour });
    res.status(201).json(loan);
  } catch (error) {
    res.status(500).json({ error: 'Unable to create loan' });
  }
};

exports.updateLoan = async (req, res) => {
  const { id } = req.params;
  const { UserId, BookId, dateEmprunt, dateRetour } = req.body;
  try {
    const loan = await Loan.findByPk(id);
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }
    await loan.update({ UserId, BookId, dateEmprunt, dateRetour });
    res.json(loan);
  } catch (error) {
    res.status(500).json({ error: 'Unable to update loan' });
  }
};

exports.deleteLoan = async (req, res) => {
  const { id } = req.params;
  try {
    const loan = await Loan.findByPk(id);
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }
    await loan.destroy();
    res.json({ message: 'Loan deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Unable to delete loan' });
  }
};

exports.getUserLoans = async (req, res) => {
  const { id } = req.params;
  try {
    const loans = await Loan.findAll({
      where: { UserId: id },
      include: [Book],
    });
    res.json(loans);
  } catch (error) {
    console.error('Error fetching user loans:', error);
    res.status(500).json({ error: 'Unable to retrieve user loans' });
  }
};

exports.borrowBook = async (req, res) => {
  const { bookId } = req.body;
  const userId = req.user.id; // Assuming user ID is attached to req.user from the authentication middleware
  try {
    const book = await Book.findByPk(bookId);
    if (!book || !book.disponible) {
      return res.status(400).json({ error: 'Book not available' });
    }

    const loan = await Loan.create({
      UserId: userId,
      BookId: bookId,
      dateEmprunt: new Date(),
      dateRetour: new Date(new Date().setDate(new Date().getDate() + 14)), // 2 weeks loan period
    });

    await book.update({ disponible: false });

    res.status(201).json(loan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to borrow book' });
  }
};

exports.returnBook = async (req, res) => {
  const { loanId } = req.body;
  try {
    const loan = await Loan.findByPk(loanId);
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    const book = await Book.findByPk(loan.BookId);
    if (book) {
      await book.update({ disponible: true });
    }

    await loan.destroy();

    res.status(200).json({ message: 'Book returned successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to return book' });
  }
};
