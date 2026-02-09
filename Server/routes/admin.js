import express from 'express';
import { isAdmin, isAuth } from '../middlewares/isAuth.js';
import { addLectures, createCourse, deleteCourse, deleteLecture, getAllStats } from '../controllers/admin.js';
import { uploadFiles } from '../middlewares/multer.js';
import { adminLogin } from "../controllers/adminAuth.js";


const router = express.Router();
router.post("/admin/login", adminLogin);
router.post ('/course/new', isAuth, isAdmin, uploadFiles, createCourse)
router.post('/course/:id', isAuth, isAdmin, uploadFiles, addLectures);
router.delete('/course/:id', isAuth, isAdmin, deleteCourse);
router.delete('/lecture/:id', isAuth, isAdmin, deleteLecture);
router.get('/stats', isAdmin, isAuth, getAllStats);

export default router;
