import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const isAuth = async(req, res, next) => {
    try{
        const token = req.headers.token;

        if(!token) {
            return res.status(401).json({
                message: "No token provided, please login first",
            });
        }

        const decodedData = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decodedData._id)

        next();

    }  catch(error) {
        return res.status(500).json({
            message:"Login first",
        });
    }
    


}