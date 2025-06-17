import mongoose from 'mongoose';
import create from 'prompt-sync';

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    instructor: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },

    duration: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    createdBy: {
        type: "String",
        required: true
    },
})

export const Courses = mongoose.model('Course', courseSchema);

