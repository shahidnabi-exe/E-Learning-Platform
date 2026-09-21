import { Course } from '../models/course.js';
import { Lecture } from '../models/lecture.js';
import { User } from '../models/user.js';
import { Review } from '../models/review.js';
import { Comment } from '../models/comment.js';
import { Note } from '../models/note.js';
import { Progress } from '../models/progress.js';
import fs from 'fs';

const safeUnlink = (filePath) => {
  if (!filePath) return;
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.warn("Could not delete file:", filePath, err.message);
  }
};

export const createCourse = async (req, res) => {
  try {
    const { title, description, instructor, duration, category, price } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Thumbnail image is required" });
    }

    const image = req.file.path.replace(/\\/g, "/");
    const course = new Course({
      title,
      description,
      instructor,
      image,
      duration: Number(duration),
      category,
      price: Number(price),
      createdBy: req.user._id,
      status: "approved",
    });

    await course.save();

    res.status(201).json({
      message: "Course created successfully",
      course
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addLectures = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "No course with this id",
      });
    }

    const { title, description } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Lecture video is required" });
    }

    const video = file.path.replace(/\\/g, "/");
    const lecture = await Lecture.create({
      title,
      description,
      video,
      course: course._id,
    });

    res.status(201).json({
      message: "Lecture added successfully",
      lecture,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

export const deleteLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    safeUnlink(lecture.video);

    // Cascade delete comments, notes, and references from progress
    await Comment.deleteMany({ lecture: lecture._id });
    await Note.deleteMany({ lecture: lecture._id });
    await Progress.updateMany(
      { course: lecture.course },
      { $pull: { completedLectures: lecture._id } }
    );

    await lecture.deleteOne();

    res.json({ message: "Lecture deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const lectures = await Lecture.find({ course: course._id });
    for (const lecture of lectures) {
      safeUnlink(lecture.video);
    }
    safeUnlink(course.image);

    // Cascade delete all child resources
    await Lecture.deleteMany({ course: course._id });
    await Comment.deleteMany({ lecture: { $in: lectures.map(l => l._id) } });
    await Note.deleteMany({ lecture: { $in: lectures.map(l => l._id) } });
    await Review.deleteMany({ course: course._id });
    await Progress.deleteMany({ course: course._id });

    await course.deleteOne();
    await User.updateMany({}, { $pull: { subscription: course._id } });

    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllStats = async (req, res) => {
  try {
    const [
      totalCourses,
      pendingCourses,
      totalLectures,
      totalUsers,
      totalStudents,
      totalInstructors,
      usersWithSub
    ] = await Promise.all([
      Course.countDocuments({ status: "approved" }),
      Course.countDocuments({ status: "pending" }),
      Lecture.countDocuments(),
      User.countDocuments(),
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "instructor" }),
      User.find({}, "subscription")
    ]);

    const activeEnrollments = usersWithSub.reduce(
      (sum, u) => sum + (u.subscription ? u.subscription.length : 0),
      0
    );

    const stats = {
      totalCourses,
      pendingCourses,
      totalLectures,
      totalUsers,
      totalStudents,
      totalInstructors,
      activeEnrollments,
    };

    res.json({ stats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// List all courses instructors have submitted that are awaiting review
export const getPendingCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: "pending" })
      .populate("createdBy", "name email")
      .sort({ createdAt: 1 });

    res.json({ courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin approves or rejects a submitted course
export const reviewCourse = async (req, res) => {
  try {
    const { decision, rejectionReason } = req.body;

    if (!["approved", "rejected"].includes(decision)) {
      return res.status(400).json({
        message: "decision must be either 'approved' or 'rejected'",
      });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "No course with this id" });
    }

    course.status = decision;
    course.rejectionReason = decision === "rejected" ? rejectionReason || "" : "";

    await course.save();

    res.json({
      message: `Course ${decision}`,
      course,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// List all users for admin user management
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin updates a user's role
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["student", "instructor", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.json({
      message: `User role updated to ${role}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin deletes a user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot delete your own admin account" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// List all courses (approved, pending, rejected) for admin catalog management
export const getAllAdminCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    res.json({ courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
