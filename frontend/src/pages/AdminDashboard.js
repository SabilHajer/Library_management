// src/pages/AdminDashboard.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import BookList from '../components/BookList';
import UserList from '../components/UserList';
import LoanList from '../components/LoanList';
import './AdminDashboard.css';
import logo from './images/logo.png'; // Adjust the path to where your logo is

const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState('');
  const { token, user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('books'); // State to manage active tab
  const navigate = useNavigate();

  useEffect(() => {
    if (user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

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

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users');
    }
  };

  const fetchLoans = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/loans', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoans(response.data);
    } catch (err) {
      setError('Failed to fetch loans');
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchUsers();
    fetchLoans();
  }, [token]);

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
        <h1>Admin Dashboard</h1>
        <div className="nav-buttons">
          <button className={`nav-button ${activeTab === 'books' ? 'active' : ''}`} onClick={() => setActiveTab('books')}>
            Books
          </button>
          <button className={`nav-button ${activeTab === 'loans' ? 'active' : ''}`} onClick={() => setActiveTab('loans')}>
            Loans
          </button>
          <button className={`nav-button ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            Users
          </button>
        </div>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {activeTab === 'books' && (
        <>
          <h2>Book List</h2>
          <BookList books={books} onRefresh={fetchBooks} />
        </>
      )}
      {activeTab === 'users' && (
        <>
          <h2>User List</h2>
          <UserList users={users} onRefresh={fetchUsers} />
        </>
      )}
      {activeTab === 'loans' && (
        <>
          <h2>Loan List</h2>
          <LoanList loans={loans} onRefresh={fetchLoans} />
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
