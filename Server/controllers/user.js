import { User } from '../models/user.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import sendMail from '../middlewares/sendMail.js';

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

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save user
        user = new User({
            name,
            email,
            password: hashedPassword,
        });

        await user.save();

        res.status(201).json({
            message: "User registered successfully",
        });


        const otp =  Math.floor(Math.random() * 1000000);

        const activationToken = jwt.sign(
            {
                user,
                otp,
            },
            process.env.Activation_Secret,
            {
                expiresIn: "5m",
            }
        );

        const data = {
            name, otp,
        };

        await sendMail(
            email,
            "E Learning ",
            data    
        )

        res.status(200).json({
            message: "Otp send to your email ",
            activationToken,
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

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

        const token = await jwt.sign({_id: user._id}, process.env.JWT_SECRET, {
            expiresIn: '15d',
        });

        res.json({
            message: `Welcome back ${user.name}`,
            token,
            user,
        })
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}

export const myProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    res.json({ user })
}