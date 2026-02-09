import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Fixed admin credentials
    if (email !== "ahmed@gmail" || password !== "112233") {
      return res.status(401).json({
        message: "Invalid admin credentials",
      });
    }

    // Check if admin exists in DB
    let admin = await User.findOne({ email });

    // Create admin if not exists
    if (!admin) {
      const hashedPassword = await bcrypt.hash(password, 10);

      admin = await User.create({
        name: "Admin",
        email,
        password: hashedPassword,
        role: "admin",
      });
    }

    const token = jwt.sign(
      { _id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "15d" }
    );

    res.json({
      message: "Admin logged in successfully",
      token,
      user: admin,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
