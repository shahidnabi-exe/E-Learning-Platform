import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { getMyNote, saveNote } from "../controllers/note.js";

const router = express.Router();

router.post("/lecture/:id/note", isAuth, saveNote);
router.get("/lecture/:id/note", isAuth, getMyNote);

export default router;
