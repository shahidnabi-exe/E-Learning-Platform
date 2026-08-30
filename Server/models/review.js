import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    text: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// One review per (student, course) pair — resubmitting updates it in place
schema.index({ course: 1, user: 1 }, { unique: true });

export const Review = mongoose.model("Review", schema);
