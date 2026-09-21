import { Progress } from "../models/progress.js";
import { Lecture } from "../models/lecture.js";
import { User } from "../models/user.js";

export const markLectureComplete = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);

    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    const progress = await Progress.findOneAndUpdate(
      { user: req.user._id, course: lecture.course },
      { $addToSet: { completedLectures: lecture._id } },
      { new: true, upsert: true }
    );

    res.json({ message: "Marked as complete", progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleLectureComplete = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);

    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    let progress = await Progress.findOne({
      user: req.user._id,
      course: lecture.course,
    });

    if (!progress) {
      progress = await Progress.create({
        user: req.user._id,
        course: lecture.course,
        completedLectures: [lecture._id],
      });
      return res.json({
        message: "Marked as completed",
        isCompleted: true,
        progress,
      });
    }

    const isAlreadyCompleted = progress.completedLectures.some(
      (id) => id.toString() === lecture._id.toString()
    );

    if (isAlreadyCompleted) {
      progress.completedLectures = progress.completedLectures.filter(
        (id) => id.toString() !== lecture._id.toString()
      );
      await progress.save();
      return res.json({
        message: "Marked as incomplete",
        isCompleted: false,
        progress,
      });
    } else {
      progress.completedLectures.push(lecture._id);
      await progress.save();
      return res.json({
        message: "Marked as completed",
        isCompleted: true,
        progress,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCourseProgress = async (req, res) => {
  try {
    const totalLectures = await Lecture.countDocuments({ course: req.params.id });

    const progress = await Progress.findOne({
      user: req.user._id,
      course: req.params.id,
    });

    const completedCount = progress ? progress.completedLectures.length : 0;
    const percentage =
      totalLectures > 0 ? Math.round((completedCount / totalLectures) * 100) : 0;

    res.json({
      completedLectures: progress ? progress.completedLectures : [],
      totalLectures,
      percentage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Batch endpoint for student dashboard
export const getAllUserProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const enrolledCourses = user.subscription || [];

    const progressData = await Promise.all(
      enrolledCourses.map(async (courseId) => {
        const totalLectures = await Lecture.countDocuments({ course: courseId });
        const progress = await Progress.findOne({
          user: req.user._id,
          course: courseId,
        });
        const completedCount = progress ? progress.completedLectures.length : 0;
        const percentage =
          totalLectures > 0 ? Math.round((completedCount / totalLectures) * 100) : 0;

        return {
          courseId,
          completedCount,
          totalLectures,
          percentage,
          completedLectures: progress ? progress.completedLectures : [],
        };
      })
    );

    res.json({ progressData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
