import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { addComment, deleteComment, getComments } from "../controllers/comment.js";

const router = express.Router();

router.post("/lecture/:id/comment", isAuth, addComment);
router.get("/lecture/:id/comments", isAuth, getComments);
router.delete("/comment/:id", isAuth, deleteComment);

export default router;
