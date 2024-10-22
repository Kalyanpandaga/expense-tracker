const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserProfile } = require('../models');

const generateToken = (user) => {
  return jwt.sign({ user_id: user.user_id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ user_id: user.user_id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2d' });
};

exports.register = async (req, res) => {
  try {
    const { user_name, name, email, password } = req.body;
    const user = await UserProfile.create({ user_name, name, email, password });
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    return res.status(201).json({ token, refreshToken });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserProfile.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    return res.status(200).json({ token, refreshToken });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};