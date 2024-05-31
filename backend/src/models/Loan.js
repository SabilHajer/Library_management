// src/models/Loan.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Book = require('./Book');

const Loan = sequelize.define('Loan', {
  dateEmprunt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  dateRetour: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  BookId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Book,
      key: 'id'
    }
  }
}, {
  timestamps: false // Disable automatic addition of createdAt and updatedAt columns
});

Loan.belongsTo(User, { foreignKey: 'UserId' });
Loan.belongsTo(Book, { foreignKey: 'BookId' });
User.hasMany(Loan, { foreignKey: 'UserId' });
Book.hasMany(Loan, { foreignKey: 'BookId' });

module.exports = Loan;
