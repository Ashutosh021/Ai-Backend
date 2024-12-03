const jwt = require('jsonwebtoken');
const User = require('../Models/user');
const dotenv = require('dotenv');
dotenv.config();

exports.isAuthenticated = async (req, res, next) => {
  const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided! You need to log in first.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token!', error: err.message });
  }
};
