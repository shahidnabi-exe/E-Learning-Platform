import { Course } from '../models/course.js';

export const createCourse = async (req, res) => {
  try {
    const { title, description, instructor, duration, category, price, createdBy } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Thumbnail image is required" });
    }

    const image = req.file.path;
    // console.log(title, description, instructor, duration, category, price, createdBy)
    console.log(req.body)
    const course = new Course({
      title,
      description,
      instructor,
      image,
      duration,
      category,
      price,
      createdBy,
    });

    await course.save();
    console.log("✅ Course saved to DB:", course);

    res.status(201).json({
      message: "Course created successfully",
      course
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
