// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Ensure this is correct
});

export const registerUser = async (userData) => {
  return await api.post('/users/register', userData);
};

export const loginUser = async (userData) => {
  try {
    const response = await api.post('/users/login', userData);
    return response;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const getBooks = async () => {
  return await api.get('/books');
};

export const getBookById = async (id) => {
  return await api.get(`/books/${id}`);
};

export const borrowBook = async (loanData) => {
  return await api.post('/loans/borrow', loanData);
};

export const returnBook = async (loanData) => {
  return await api.post('/loans/return', loanData);
};

export const addBook = async (bookData) => {
  return await api.post('/books', bookData);
};

export const updateBook = async (id, bookData) => {
  return await api.put(`/books/${id}`, bookData);
};

export const deleteBook = async (id) => {
  return await api.delete(`/books/${id}`);
};
