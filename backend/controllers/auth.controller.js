import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  console.log("BODY RECEIVED:", req.body);
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    }

    if (process.env.DEMO_MODE === 'true') {
      if (email === 'demo@fertigation.com' && password === 'demo123') {
        const mockUser = {
          _id: "demo-user",
          id: "demo-user",
          name: "Demo User",
          email: "demo@fertigation.com",
          role: "admin",
          getSignedJwtToken: function () {
            return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
              expiresIn: process.env.JWT_EXPIRE || '30d',
            });
          }
        };
        return sendTokenResponse(mockUser, 200, res);
      } else {
        return res.status(401).json({ success: false, message: 'Invalid demo credentials' });
      }
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie or client token
// @route   GET /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  res.status(200).json({ success: true, data: {} });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    if (process.env.DEMO_MODE === 'true' && req.user.id === 'demo-user') {
      return res.status(200).json({ success: true, data: req.user });
    }
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  res.status(statusCode).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
};
