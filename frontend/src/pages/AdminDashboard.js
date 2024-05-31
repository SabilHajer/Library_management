import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import BookList from '../components/BookList';
import UserList from '../components/UserList';
import LoanList from '../components/LoanList';
import './AdminDashboard.css';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState('');
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.role !== 'Admin') {
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
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h2>Book List</h2>
      <BookList books={books} onRefresh={fetchBooks} />
      <h2>User List</h2>
      <UserList users={users} onRefresh={fetchUsers} />
      <h2>Loan List</h2>
      <LoanList loans={loans} onRefresh={fetchLoans} />
    </div>
  );
};

export default AdminDashboard;
