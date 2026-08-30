import express from "express";
import { isAuth, isInstructor } from "../middlewares/isAuth.js";
import { uploadFiles } from "../middlewares/multer.js";
import {
  addLectureAsInstructor,
  createCourseAsInstructor,
  getInstructorAnalytics,
  getMyCourseLectures,
  getMyInstructorCourses,
} from "../controllers/instructor.js";

const router = express.Router();

router.post("/instructor/course/new", isAuth, isInstructor, uploadFiles, createCourseAsInstructor);
router.post("/instructor/course/:id/lecture", isAuth, isInstructor, uploadFiles, addLectureAsInstructor);
router.get("/instructor/mycourses", isAuth, isInstructor, getMyInstructorCourses);
router.get("/instructor/course/:id/lectures", isAuth, isInstructor, getMyCourseLectures);
router.get("/instructor/analytics", isAuth, isInstructor, getInstructorAnalytics);

export default router;
