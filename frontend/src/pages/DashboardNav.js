// src/components/DashboardNav.js
import React from 'react';
import './DashboardNav.css';

const DashboardNav = ({ activeTab, setActiveTab }) => {
  return (
    <div className="dashboard-nav">
      <button
        className={`nav-button ${activeTab === 'books' ? 'active' : ''}`}
        onClick={() => setActiveTab('books')}
      >
        Books
      </button>
      <button
        className={`nav-button ${activeTab === 'loans' ? 'active' : ''}`}
        onClick={() => setActiveTab('loans')}
      >
        Loans
      </button>
      <button
        className={`nav-button ${activeTab === 'users' ? 'active' : ''}`}
        onClick={() => setActiveTab('users')}
      >
        Users
      </button>
    </div>
  );
};

export default DashboardNav;
