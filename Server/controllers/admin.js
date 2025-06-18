
import { Courses } from '../models/Course.js';

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
}