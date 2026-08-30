import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role : {
        type: String,
        enum: ["student", "instructor", "admin"],
        default: "student",
    },
    subscription: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        
        }
    ]
}, 
{
    timestamps: true,
} 
);

export const User = mongoose.model("User", schema);

 
