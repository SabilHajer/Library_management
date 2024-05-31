// src/components/BookList.js
import React, { useState } from 'react';
import axios from 'axios';
import './BookList.css';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const BookList = ({ books, onBorrow, onAdd, onEdit, onDelete }) => {
  const { token } = useContext(AuthContext);
  const [selectedBook, setSelectedBook] = useState(null);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false); // Adjust based on actual role check

  const handleViewDetails = (book) => {
    setSelectedBook(book);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
  };

  const handleBorrowBook = async (bookId) => {
    try {
      await axios.post('http://localhost:5000/api/loans/borrow', { bookId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onBorrow();
    } catch (err) {
      setError('Failed to borrow book');
    }
  };

  const handleAddBook = () => {
    const newBook = {
      titre: 'New Book',
      auteur: 'Unknown',
      anneePublication: 2024,
      genre: 'Fiction',
      resume: 'A new book',
      disponible: true,
    };
    onAdd(newBook);
  };

  const handleEditBook = (bookId) => {
    const updatedBook = {
      titre: 'Updated Title',
      auteur: 'Updated Author',
      anneePublication: 2024,
      genre: 'Updated Genre',
      resume: 'Updated Summary',
      disponible: true,
    };
    onEdit(bookId, updatedBook);
  };

  const handleDeleteBook = (bookId) => {
    onDelete(bookId);
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table className="book-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>ISBN</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Available</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book.id}>
              <td>{book.titre}</td>
              <td>{book.isbn}</td>
              <td>{book.genre}</td>
              <td>{book.quantity}</td>
              <td>{book.disponible ? 'Yes' : 'No'}</td>
              <td>{book.price}</td>
              <td>
                <button onClick={() => handleViewDetails(book)}>View</button>
                {book.disponible && !isAdmin && (
                  <button onClick={() => handleBorrowBook(book.id)}>Borrow</button>
                )}
                {isAdmin && (
                  <>
                    <button onClick={() => handleEditBook(book.id)}>Edit</button>
                    <button onClick={() => handleDeleteBook(book.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedBook && (
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedBook.titre}</h2>
            <p><strong>Author:</strong> {selectedBook.auteur}</p>
            <p><strong>Genre:</strong> {selectedBook.genre}</p>
            <p><strong>ISBN:</strong> {selectedBook.isbn}</p>
            <p><strong>Quantity:</strong> {selectedBook.quantity}</p>
            <p><strong>Available:</strong> {selectedBook.disponible ? 'Yes' : 'No'}</p>
            <p><strong>Price:</strong> {selectedBook.price}</p>
            <p><strong>Summary:</strong> {selectedBook.resume}</p>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
      {isAdmin && <button onClick={handleAddBook}>Add Book</button>}
    </div>
  );
};

export default BookList;
