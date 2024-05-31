const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const loanRoutes = require('./routes/loanRoutes'); // Import loan routes

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes); // Use book routes
app.use('/api/loans', loanRoutes); // Use loan routes
// Add other routes (books, loans) similarly

app.get('/', (req, res) => {
  res.send('Welcome to the Library Management System!');
});



app.use(cors({
  origin: 'http://localhost:3000', // replace with your frontend URL
  credentials: true,
}));

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
