import { Course } from '../models/course.js';
import { Lecture } from '../models/lecture.js';
import { rm } from 'fs'
import { promisify } from 'util';
import fs from 'fs';

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

export const addLectures = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(400).json({
        message: "No Course with this id",
      });
    }

    const { title, description } = req.body;
    const file = req.file;

    const lecture = await Lecture.create({
      title,
      description,
      video: file?.path,
      course: course._id,
    });

    console.log("✅ lecture saved to DB:", lecture);

    res.status(201).json({
      message: "Lecture added successfully",
      lecture,
    });
  } catch (error) {
    console.error("❌ Error in addLectures:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};


export const deleteLecture = async(req, res) => {
  const lecture = await Lecture.findById(req.params.id);

  rm(lecture.video, () => {
    console.log('video deleted');
  })

  await lecture.deleteOne();

  res.json({ message: " Lecture deleted "});
}

const unlinkAsync = promisify(fs.unlink)

export const deleteCourse = async (req, res) => {
  const course = await Course.findById(req.params.id)

  const lectures = await Lecture.find({course: course._id})

  await Promise.all(
    lectures.map( async(lecture) => { 
      await unlinkAsync(lecture.video);
      console.log('video deletedd ');

    })
  )

  rm(course.image, () => {
    console.log('image deleted');
  })

  await Lecture.find({course: req.params.id}).deleteMany()

  await course.deleteOne();

  res.json({
    message: "Course Deleted",
  })

}

// export const getAllStats = async(req, res) => {
//   // const totalCourses = 
// }

