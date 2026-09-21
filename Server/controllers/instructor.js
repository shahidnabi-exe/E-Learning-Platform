import { Course } from "../models/course.js";
import { Lecture } from "../models/lecture.js";
import { User } from "../models/user.js";
import { Review } from "../models/review.js";
import { Comment } from "../models/comment.js";
import { Note } from "../models/note.js";
import { Progress } from "../models/progress.js";
import fs from "fs";

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

// Instructor creates a course — it always starts as "pending" and needs admin approval
export const createCourseAsInstructor = async (req, res) => {
  try {
    const { title, description, duration, category, price } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Thumbnail image is required" });
    }

    const image = req.file.path.replace(/\\/g, "/");

    const course = new Course({
      title,
      description,
      instructor: req.user.name,
      image,
      duration: Number(duration),
      category,
      price: Number(price),
      createdBy: req.user._id,
      status: "pending",
    });

    await course.save();

    res.status(201).json({
      message: "Course submitted for admin review successfully!",
      course,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Instructor adds a lecture — only allowed once the course has been approved by an admin
export const addLectureAsInstructor = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "No course with this id" });
    }

    if (course.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You do not own this course" });
    }

    if (course.status !== "approved") {
      return res.status(400).json({
        message:
          "This course hasn't been approved by an admin yet. You can add lectures once it's approved.",
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
    res.status(500).json({ message: error.message });
  }
};

// Instructor deletes a lecture from their course
export const deleteLectureAsInstructor = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    const course = await Course.findById(lecture.course);
    if (!course || course.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You do not own this lecture's course" });
    }

    safeUnlink(lecture.video);

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

// List all courses this instructor has created, with their current approval status
export const getMyInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ createdBy: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({ courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// List lectures for one of the instructor's own courses (any status)
export const getMyCourseLectures = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "No course with this id" });
    }

    if (course.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You do not own this course" });
    }

    const lectures = await Lecture.find({ course: course._id }).sort({ createdAt: 1 });

    res.json({ lectures });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Per-course stats for the instructor's dashboard: enrolled students, average rating, lecture count
export const getInstructorAnalytics = async (req, res) => {
  try {
    const courses = await Course.find({ createdBy: req.user._id }).sort({
      createdAt: -1,
    });

    const analytics = await Promise.all(
      courses.map(async (course) => {
        const enrolledCount = await User.countDocuments({
          subscription: course._id,
        });

        const lectureCount = await Lecture.countDocuments({
          course: course._id,
        });

        const reviews = await Review.find({ course: course._id });
        const averageRating =
          reviews.length > 0
            ? Math.round(
                (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10
              ) / 10
            : 0;

        return {
          course,
          enrolledCount,
          lectureCount,
          averageRating,
          reviewCount: reviews.length,
        };
      })
    );

    res.json({ analytics });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
