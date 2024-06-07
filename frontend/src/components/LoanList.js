// src/components/LoanList.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './LoanList.css';
import { AuthContext } from '../context/AuthContext';

const LoanList = ({ loans, onRefresh }) => {
  const { token } = useContext(AuthContext);
  const [loanDetails, setLoanDetails] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [newReturnDate, setNewReturnDate] = useState('');

  useEffect(() => {
    const fetchLoanDetails = async () => {
      try {
        const detailedLoans = await Promise.all(loans.map(async (loan) => {
          const userResponse = await axios.get(`http://localhost:5000/api/users/${loan.UserId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const bookResponse = await axios.get(`http://localhost:5000/api/books/${loan.BookId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          return {
            ...loan,
            userEmail: userResponse.data.email,
            bookTitle: bookResponse.data.titre,
          };
        }));
        setLoanDetails(detailedLoans);
      } catch (error) {
        console.error('Failed to fetch loan details', error);
      }
    };

    fetchLoanDetails();
  }, [loans, token]);

  const handleEditLoan = async (id, updatedLoan) => {
    try {
      await axios.put(`http://localhost:5000/api/loans/${id}`, updatedLoan, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onRefresh();
    } catch (err) {
      console.error('Failed to update loan', err);
    }
  };

  const handleDeleteLoan = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/loans/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onRefresh();
    } catch (err) {
      console.error('Failed to delete loan', err);
    }
  };

  const handleExtendClick = (loan) => {
    setSelectedLoan(loan);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedLoan(null);
    setNewReturnDate('');
  };

  const handleDateChange = (e) => {
    setNewReturnDate(e.target.value);
  };

  const handleExtendSubmit = async () => {
    try {
      await handleEditLoan(selectedLoan.id, {
        dateRetour: newReturnDate,
      });
      handleModalClose();
    } catch (err) {
      console.error('Failed to extend loan');
    }
  };

  return (
    <div>
      <div className="table-container">
        <table className="loan-table">
          <thead>
            <tr>
              <th>User Email</th>
              <th>Book Title</th>
              <th>Borrowed On</th>
              <th>Return By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loanDetails.map(loan => (
              <tr key={loan.id}>
                <td>{loan.userEmail}</td>
                <td>{loan.bookTitle}</td>
                <td>{new Date(loan.dateEmprunt).toLocaleDateString()}</td>
                <td>{new Date(loan.dateRetour).toLocaleDateString()}</td>
                <td>
                  <button className="extend-button" onClick={() => handleExtendClick(loan)}>Extend</button>
                  <button className="delete-button" onClick={() => handleDeleteLoan(loan.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <>
          <div className="overlay" onClick={handleModalClose}></div>
          <div className="form-container">
            <h2>Extend Loan</h2>
            <label>New Return Date:</label>
            <input type="date" value={newReturnDate} onChange={handleDateChange} />
            <button className="submit-button" onClick={handleExtendSubmit}>Extend Loan</button>
            <button className="cancel-button" onClick={handleModalClose}>Cancel</button>
          </div>
        </>
      )}
    </div>
  );
};

export default LoanList;
