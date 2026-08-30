import { Progress } from "../models/progress.js";
import { Lecture } from "../models/lecture.js";

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
