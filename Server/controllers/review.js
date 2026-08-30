import { Review } from "../models/review.js";
import { User } from "../models/user.js";

export const addOrUpdateReview = async (req, res) => {
  try {
    const { rating, text } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const user = await User.findById(req.user._id);
    const isEnrolled = user.subscription
      .map((c) => c.toString())
      .includes(req.params.id);

    if (!isEnrolled) {
      return res.status(403).json({
        message: "You must be enrolled in this course to review it",
      });
    }

    const review = await Review.findOneAndUpdate(
      { course: req.params.id, user: req.user._id },
      { rating, text: text || "" },
      { new: true, upsert: true }
    );

    res.json({ message: "Review saved", review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCourseReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ course: req.params.id })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    const average =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    res.json({
      reviews,
      average: Math.round(average * 10) / 10,
      count: reviews.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
