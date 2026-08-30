import express from 'express';
import { fetchLecture, fetchLectures, getAllCourses, getSingleCourse, enrollInCourse } from '../controllers/course.js';
import { isAuth } from '../middlewares/isAuth.js';
import { getMyCourses } from '../controllers/course.js';

const router = express.Router();

router.get('/course/all', getAllCourses);

router.get('/course/:id', getSingleCourse);

router.post('/course/:id/enroll', isAuth, enrollInCourse);

router.get('/lectures/:id', isAuth, fetchLectures)

router.get('/lecture/:id', isAuth, fetchLecture)

router.get('/mycourse', isAuth, getMyCourses)



export default router;