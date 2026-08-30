import { Note } from "../models/note.js";

// Creates the student's note on first save, updates it on every save after that
export const saveNote = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Note content is required" });
    }

    const note = await Note.findOneAndUpdate(
      { lecture: req.params.id, user: req.user._id },
      { content },
      { new: true, upsert: true }
    );

    res.json({
      message: "Note saved",
      note,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      lecture: req.params.id,
      user: req.user._id,
    });

    res.json({ note: note || null });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
