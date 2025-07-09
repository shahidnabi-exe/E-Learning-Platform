import { Course } from "../models/course.js"
import { Lecture } from "../models/lecture.js";
import { User } from "../models/user.js";


export const getAllCourses = async(req, res) => {
    const courses = await Course.find();

    res.json({
        courses,
    });
}

export const getSingleCourse = async(req, res) => {
    const course = await Course.findById(req.params.id);
    
    res.json({
        course,
    });
}

export const fetchLectures = async(req, res) => {
    const lectures = await Lecture.find({ course: req.params.id });

    const user = await User.findById(req.user._id);

    if (user.role === "admin") {
        return res.json({ lectures })
    }

    if(!user.subscription.includes(req.params.id))
        return res.status(400).json({
            message: " You haven't subscribed to this course",
        });

    res.json({ lectures });
}

export const fetchLecture = async(req, res) => {
    const lecture = await Lecture.findById(req.params.id);

    const user = await User.findById(req.user._id);

    if (user.role === "admin") {
        return res.json({ lecture })
    }

    if(!user.subscription.includes(req.params.id))
        return res.status(400).json({
            message: " You haven't subscribed to this course",
        });

    res.json({ lecture });
}