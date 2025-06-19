
import { Courses } from '../models/courses.js';
import { isAuth } from '../middlewares/isAuth.js';
import { uploadFiles } from '../middlewares/multer.js';

export const createCourse = async (req, res) => {
    const { title, description, price, category, duration, createdBy } = req.body;

    const image = req.file;

    await Courses.create({
        title,
        description,
        price,
        category,
        duration,
        createdBy,
        image: image?.path, // Assuming image.path contains the path to the uploaded image
    });

    res.status(201).json({
        message: "Course created successfully",
       
    })
}