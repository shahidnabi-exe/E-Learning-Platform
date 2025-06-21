
import { Courses } from '../models/courses.js';
import { isAuth } from '../middlewares/isAuth.js';
import { uploadFiles } from '../middlewares/multer.js';

export const createCourse = async (req, res) => {
  try {
    console.log("BODY:", req.body);  // Debug: Should not be undefined
    console.log("FILE:", req.file);  // Debug: Should show uploaded file

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Missing form fields in body" });
    }

    const { title, description, price, category, duration, createdBy } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const course = await Courses.create({
      title,
      description,
      price,
      category,
      duration,
      createdBy,
      image: req.file.path,
    });

    return res.status(201).json({ message: "Course created", course });
  } catch (error) {
    console.error("🔥 Error in createCourse:", error);
    return res.status(500).json({ message: error.message });
  }
};
