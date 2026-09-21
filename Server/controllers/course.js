import { Course } from "../models/course.js";
import { Lecture } from "../models/lecture.js";
import { User } from "../models/user.js";

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: "approved" }).sort({ createdAt: -1 });
    res.json({ courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSingleCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("createdBy", "name email role");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Student enrolls in a course (free enrollment)
export const enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course || course.status !== "approved") {
      return res.status(404).json({ message: "Course not found or not approved" });
    }

    const user = await User.findById(req.user._id);

    const isAlreadyEnrolled = user.subscription.some(
      (subId) => subId.toString() === course._id.toString()
    );

    if (isAlreadyEnrolled) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    user.subscription.push(course._id);
    await user.save();

    res.json({
      message: "Enrolled successfully! You can now start learning.",
      subscription: user.subscription,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const fetchLectures = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const user = await User.findById(req.user._id);
    const isAdmin = user.role === "admin";
    const isOwner = course.createdBy.toString() === user._id.toString();
    const isEnrolled = user.subscription.some(
      (subId) => subId.toString() === course._id.toString()
    );

    if (!isAdmin && !isOwner && !isEnrolled) {
      return res.status(403).json({
        message: "You haven't enrolled in this course yet.",
      });
    }

    const lectures = await Lecture.find({ course: req.params.id }).sort({ createdAt: 1 });
    res.json({ lectures });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const fetchLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id).populate("course");

    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    const user = await User.findById(req.user._id);
    const isAdmin = user.role === "admin";
    const isOwner = lecture.course.createdBy.toString() === user._id.toString();
    const isEnrolled = user.subscription.some(
      (subId) => subId.toString() === lecture.course._id.toString()
    );

    if (!isAdmin && !isOwner && !isEnrolled) {
      return res.status(403).json({
        message: "You must be enrolled in the course to access this lecture.",
      });
    }

    res.json({ lecture });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const courses = await Course.find({
      _id: { $in: user.subscription },
      status: "approved",
    }).sort({ createdAt: -1 });

    res.json({ courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};