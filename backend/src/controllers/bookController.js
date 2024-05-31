const Book = require('../models/Book');

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Unable to retrieve books' });
  }
};

exports.getBookById = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Unable to retrieve book' });
  }
};

exports.createBook = async (req, res) => {
  const { titre, auteur, anneePublication, genre, resume, disponible } = req.body;
  try {
    const book = await Book.create({ titre, auteur, anneePublication, genre, resume, disponible });
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: 'Unable to create book' });
  }
};

exports.updateBook = async (req, res) => {
  const { id } = req.params;
  const { titre, auteur, anneePublication, genre, resume, disponible } = req.body;
  try {
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    await book.update({ titre, auteur, anneePublication, genre, resume, disponible });
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Unable to update book' });
  }
};

exports.deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    await book.destroy();
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Unable to delete book' });
  }
};
