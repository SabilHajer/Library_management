// src/pages/UserDashboard.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import BookList from '../components/BookListUser';

const UserDashboard = () => {
  const [books, setBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [error, setError] = useState('');
  const { token, user, logout } = useContext(AuthContext);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/books', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(response.data);
    } catch (err) {
      setError('Failed to fetch books');
    }
  };

  const fetchBorrowedBooks = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/loans/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBorrowedBooks(response.data);
    } catch (err) {
      setError('Failed to fetch borrowed books');
    }
  };

  const handleReturnBook = async (loanId) => {
    try {
      await axios.post('http://localhost:5000/api/loans/return', { loanId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBooks();
      fetchBorrowedBooks();
    } catch (err) {
      setError('Failed to return book');
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchBorrowedBooks();
  }, [token, user.id]);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="dashboard">
      <div className="header">
        <h1>Library Management System</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h2>Book List</h2>
      <BookList books={books} />
      <h2>Borrowed Books</h2>
      <table className="loan-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>ISBN</th>
            <th>Category</th>
            <th>Borrowed On</th>
            <th>Return By</th>
          </tr>
        </thead>
        <tbody>
  {borrowedBooks.map(loan => (
    <tr key={loan.id}>
      <td>{loan.Book.titre}</td>
      <td>{loan.Book.isbn}</td>
      <td>{loan.Book.genre}</td>
      <td>{new Date(loan.dateEmprunt).toLocaleDateString()}</td>
      <td>{new Date(loan.dateRetour).toLocaleDateString()}</td>
      <td>
        <button onClick={() => handleReturnBook(loan.id)}>Return</button>
      </td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
};

export default UserDashboard;
