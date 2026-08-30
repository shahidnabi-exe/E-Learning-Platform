import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    lecture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// One note document per (user, lecture) pair — content is just updated in place
schema.index({ lecture: 1, user: 1 }, { unique: true });

export const Note = mongoose.model("Note", schema);
