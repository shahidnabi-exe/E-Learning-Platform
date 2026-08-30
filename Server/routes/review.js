import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { addOrUpdateReview, getCourseReviews } from "../controllers/review.js";

const router = express.Router();

router.post("/course/:id/review", isAuth, addOrUpdateReview);
router.get("/course/:id/reviews", getCourseReviews);

export default router;
