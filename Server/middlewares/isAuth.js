import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';

export const isAuth = async (req, res, next) => {
    try {
        console.log("HEADERS RECEIVED:", req.headers); // 👈 Add this line

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "No token provided, authorization denied",
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded._id);
        next();
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const isAdmin = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                message: "Access denied, admin only",
            });
        }
        next(); 
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
}
