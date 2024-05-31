// src/components/BookList.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import './BookList.css';
import { AuthContext } from '../context/AuthContext';

const BookList = ({ books, onRefresh }) => {
  const { token } = useContext(AuthContext);
  const [selectedBook, setSelectedBook] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [formValues, setFormValues] = useState({
    titre: '',
    auteur: '',
    anneePublication: '',
    genre: '',
    resume: '',
    disponible: true,
  });
  const [error, setError] = useState('');

  const handleViewDetails = (book) => {
    setSelectedBook(book);
    setEditMode(false);
    setAddMode(false);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
    setEditMode(false);
    setAddMode(false);
  };

  const handleAddBookClick = () => {
    setFormValues({
      titre: '',
      auteur: '',
      anneePublication: '',
      genre: '',
      resume: '',
      disponible: true,
    });
    setAddMode(true);
    setEditMode(false);
  };

  const handleEditBookClick = (book) => {
    setFormValues({
      titre: book.titre,
      auteur: book.auteur,
      anneePublication: book.anneePublication,
      genre: book.genre,
      resume: book.resume,
      disponible: book.disponible,
    });
    setSelectedBook(book);
    setEditMode(true);
    setAddMode(false);
  };

  const handleFormChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (addMode) {
        await axios.post('http://localhost:5000/api/books', formValues, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (editMode) {
        await axios.put(`http://localhost:5000/api/books/${selectedBook.id}`, formValues, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      onRefresh();
      handleCloseModal();
    } catch (err) {
      setError('Failed to submit form');
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      await axios.delete(`http://localhost:5000/api/books/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onRefresh();
    } catch (err) {
      setError('Failed to delete book');
    }
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
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.titre}</td>
              <td>{book.isbn}</td>
              <td>{book.genre}</td>
              <td>{book.quantity}</td>
              <td>{book.disponible ? 'Yes' : 'No'}</td>
              <td>{book.price}</td>
              <td>
                <button onClick={() => handleViewDetails(book)}>View</button>
                <button onClick={() => handleEditBookClick(book)}>Edit</button>
                <button onClick={() => handleDeleteBook(book.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedBook && !editMode && !addMode && (
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
      {(editMode || addMode) && (
        <div className="modal">
          <div className="modal-content">
            <h2>{addMode ? 'Add Book' : 'Edit Book'}</h2>
            <form onSubmit={handleFormSubmit}>
              <div>
                <label>Title</label>
                <input type="text" name="titre" value={formValues.titre} onChange={handleFormChange} required />
              </div>
              <div>
                <label>Author</label>
                <input type="text" name="auteur" value={formValues.auteur} onChange={handleFormChange} required />
              </div>
              <div>
                <label>Year of Publication</label>
                <input type="number" name="anneePublication" value={formValues.anneePublication} onChange={handleFormChange} required />
              </div>
              <div>
                <label>Genre</label>
                <input type="text" name="genre" value={formValues.genre} onChange={handleFormChange} required />
              </div>
              <div>
                <label>Summary</label>
                <textarea name="resume" value={formValues.resume} onChange={handleFormChange} required />
              </div>
              <div>
                <label>Available</label>
                <select name="disponible" value={formValues.disponible} onChange={handleFormChange} required>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </select>
              </div>
              <button type="submit">{addMode ? 'Add Book' : 'Save Changes'}</button>
              <button type="button" onClick={handleCloseModal}>Cancel</button>
            </form>
          </div>
        </div>
      )}
      <button onClick={handleAddBookClick}>Add Book</button>
    </div>
  );
};

export default BookList;
