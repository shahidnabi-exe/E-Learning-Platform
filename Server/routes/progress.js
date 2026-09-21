import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import {
  getCourseProgress,
  markLectureComplete,
  toggleLectureComplete,
  getAllUserProgress
} from "../controllers/progress.js";

const router = express.Router();

router.post("/lecture/:id/complete", isAuth, markLectureComplete);
router.post("/lecture/:id/toggle", isAuth, toggleLectureComplete);
router.get("/course/:id/progress", isAuth, getCourseProgress);
router.get("/progress/all", isAuth, getAllUserProgress);

export default router;
