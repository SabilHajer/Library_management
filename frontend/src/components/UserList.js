// src/components/UserList.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import './UserList.css';
import { AuthContext } from '../context/AuthContext';

const UserList = ({ users, onRefresh }) => {
  const { token } = useContext(AuthContext);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [formValues, setFormValues] = useState({
    nom: '',
    email: '',
    motDePasse: '',
    role: 'user',
  });
  const [error, setError] = useState('');

  const handleCloseModal = () => {
    setSelectedUser(null);
    setEditMode(false);
    setAddMode(false);
  };

  const handleAddUserClick = () => {
    setFormValues({
      nom: '',
      email: '',
      motDePasse: '',
      role: 'user',
    });
    setAddMode(true);
    setEditMode(false);
    setSelectedUser(null);
  };

  const handleEditUserClick = (user) => {
    setFormValues({
      nom: user.nom,
      email: user.email,
      motDePasse: '',
      role: user.role,
    });
    setSelectedUser(user);
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
        await axios.post('http://localhost:5000/api/users/register', formValues, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (editMode) {
        await axios.put(`http://localhost:5000/api/users/${selectedUser.id}`, formValues, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      onRefresh();
      handleCloseModal();
    } catch (err) {
      setError('Failed to submit form');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onRefresh();
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.nom}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button className="edit-button" onClick={() => handleEditUserClick(user)}>Edit</button>
                  <button className="delete-button" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(editMode || addMode) && (
        <>
          <div className="overlay" onClick={handleCloseModal}></div>
          <div className="form-container">
            <h2>{addMode ? 'Add User' : 'Edit User'}</h2>
            <form onSubmit={handleFormSubmit}>
              <div>
                <label>Name</label>
                <input type="text" name="nom" value={formValues.nom} onChange={handleFormChange} required />
              </div>
              <div>
                <label>Email</label>
                <input type="email" name="email" value={formValues.email} onChange={handleFormChange} required />
              </div>
              {addMode && (
                <div>
                  <label>Password</label>
                  <input type="password" name="motDePasse" value={formValues.motDePasse} onChange={handleFormChange} required />
                </div>
              )}
              <div>
                <label>Role</label>
                <select name="role" value={formValues.role} onChange={handleFormChange} required>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button className="submit-button" type="submit">{addMode ? 'Add User' : 'Save Changes'}</button>
              <button className="cancel-button" type="button" onClick={handleCloseModal}>Cancel</button>
            </form>
          </div>
        </>
      )}
      <button className="add-button" onClick={handleAddUserClick}>Add User</button>
    </div>
  );
};

export default UserList;
