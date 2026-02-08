import { User } from '../models/user.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ---------------------- REGISTER ----------------------
export const register = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and save to DB
    user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '15d' }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user,
    });

  } catch (error) {
    console.error("Registration Error:", error.message);
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ---------------------- LOGIN ----------------------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '15d' }
    );

    res.json({
      message: `Welcome back ${user.name}`,
      token,
      user,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ---------------------- MY PROFILE ----------------------
export const myProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
