import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// Register
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role
    });

    sendTokenResponse(user, 201, res);

  } catch (err) {
    console.error(err);
    next(err);
  }
};

// Login
export const login = async (req, res, next) => {
  try {

    console.log("========== LOGIN ==========");
    console.log("BODY:", req.body);
    console.log("Mongo Ready:", mongoose.connection.readyState);
    console.log("DB Name:", mongoose.connection.name);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide an email and password"
      });
    }

    const user = await User.findOne({ email }).select("+password");

    console.log("USER FOUND:", !!user);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const isMatch = await user.matchPassword(password);

    console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    sendTokenResponse(user, 200, res);

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    next(err);
  }
};

// Logout
export const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    data: {}
  });
};

// Current User
export const getMe = async (req, res, next) => {
  try {

    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (err) {
    next(err);
  }
};

const sendTokenResponse = (user, statusCode, res) => {

  const token = user.getSignedJwtToken();

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });

};