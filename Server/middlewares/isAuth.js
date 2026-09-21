import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';

export const isAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({  
                message: "No token provided, authorization denied",
            });
        }

        const token = authHeader.split(" ")[1];
        if (!token || token === "null" || token === "undefined") {
            return res.status(401).json({
                message: "No valid token provided, authorization denied",
            });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (jwtError) {
            return res.status(401).json({
                message: "Token is invalid or expired. Please log in again.",
            });
        }

        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(401).json({
                message: "User session is invalid. Account not found.",
            });
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Authentication error",
        });
    }
};

export const isAdmin = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
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
};

export const isInstructor = async (req, res, next) => {
    try {
        if (!req.user || (req.user.role !== 'instructor' && req.user.role !== 'admin')) {
            return res.status(403).json({
                message: "Access denied, instructor only",
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
