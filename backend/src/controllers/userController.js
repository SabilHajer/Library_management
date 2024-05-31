const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { nom, email, motDePasse, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(motDePasse, 10);
    const user = await User.create({ nom, email, motDePasse: hashedPassword, role });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Unable to register user' });
  }
};

exports.login = async (req, res) => {
  const { email, motDePasse } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !await bcrypt.compare(motDePasse, user.motDePasse)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ error: 'Unable to login user' });
  }
};



exports.getUser = async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Unable to retrieve user' });
    }
  };
  

  exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { nom, email, motDePasse, role } = req.body;
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      if (motDePasse) {
        req.body.motDePasse = await bcrypt.hash(motDePasse, 10);
      }
      await user.update(req.body);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Unable to update user' });
    }
  };
  

  exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      await user.destroy();
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Unable to delete user' });
    }
  };
  

  exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Unable to retrieve users' });
    }
  };
// Add other user-related controllers (getUser, updateUser, deleteUser) similarly
