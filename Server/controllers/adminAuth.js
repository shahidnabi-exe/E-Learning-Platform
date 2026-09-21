import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if admin user exists
    let admin = await User.findOne({ email: cleanEmail });

    // Seed default initial admin if not yet created and default credentials used
    if (!admin && cleanEmail === "ahmed@gmail.com" && password === "112233") {
      const hashedPassword = await bcrypt.hash(password, 10);
      admin = await User.create({
        name: "Super Admin",
        email: cleanEmail,
        password: hashedPassword,
        role: "admin",
      });
    }

    if (!admin) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    if (admin.role !== "admin") {
      return res.status(403).json({
        message: "Access denied: This account does not have administrator privileges.",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { _id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "15d" }
    );

    res.json({
      message: "Admin logged in successfully",
      token,
      user: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        subscription: admin.subscription || [],
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
