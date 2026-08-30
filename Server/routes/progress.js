import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { getCourseProgress, markLectureComplete } from "../controllers/progress.js";

const router = express.Router();

router.post("/lecture/:id/complete", isAuth, markLectureComplete);
router.get("/course/:id/progress", isAuth, getCourseProgress);

export default router;
