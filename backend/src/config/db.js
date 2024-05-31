const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('library', 'root', 'Khadija@mama2003', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

// Test database connection
async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
connectToDatabase();

module.exports = sequelize;
