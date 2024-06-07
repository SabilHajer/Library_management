// src/pages/UserDashboard.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import BookList from '../components/BookListUser';
import './UserDashboard.css';
import logo from './images/logo.png'; // Adjust the path to where your logo is

const UserDashboard = () => {
  const [books, setBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [error, setError] = useState('');
  const { token, user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('books'); // State to manage active tab
  const navigate = useNavigate();

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
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <h1>User Dashboard</h1>
        <div className="nav-buttons">
          <button className={`nav-button ${activeTab === 'books' ? 'active' : ''}`} onClick={() => setActiveTab('books')}>
            Book List
          </button>
          <button className={`nav-button ${activeTab === 'borrowed' ? 'active' : ''}`} onClick={() => setActiveTab('borrowed')}>
            Borrowed Books
          </button>
        </div>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {activeTab === 'books' && (
        <>
          <h2>Book List</h2>
          <BookList books={books} />
        </>
      )}
      {activeTab === 'borrowed' && (
        <>
          <h2>Borrowed Books</h2>
          <div className="table-container">
            <table className="loan-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Borrowed On</th>
                  <th>Return By</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {borrowedBooks.map(loan => (
                  <tr key={loan.id}>
                    <td>{loan.Book.titre}</td>
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
        </>
      )}
    </div>
  );
};

export default UserDashboard;
