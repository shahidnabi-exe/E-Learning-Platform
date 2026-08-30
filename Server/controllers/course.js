import { Course } from "../models/course.js"
import { Lecture } from "../models/lecture.js";
import { User } from "../models/user.js";


export const getAllCourses = async(req, res) => {
    const courses = await Course.find({ status: "approved" });

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

// Student enrolls in a course (free enrollment — no payment flow yet)
export const enrollInCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course || course.status !== "approved") {
            return res.status(404).json({ message: "Course not found" });
        }

        const user = await User.findById(req.user._id);

        if (user.subscription.includes(course._id.toString())) {
            return res.status(400).json({ message: "Already enrolled in this course" });
        }

        user.subscription.push(course._id);
        await user.save();

        res.json({ message: "Enrolled successfully", subscription: user.subscription });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
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
    
    const lecture = await Lecture.findById(req.params.id).populate("course");    

    const user = await User.findById(req.user._id);

    if (user.role === "admin") {
        return res.json({ lecture })
    }

    if (!user.subscription.includes(lecture.course._id.toString())) {
        return res.status(403).json({
            message: "You haven't subscribed to this course",
        });
    }

    res.json({ lecture });
}

export const getMyCourses = async(req, res) => {
  const courses = await Course.find({ _id: req.user.subscription });

  res.json({
    courses,
  })
}