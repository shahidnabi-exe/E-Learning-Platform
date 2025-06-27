import express from 'express';
import { isAdmin, isAuth } from '../middlewares/isAuth.js';
import { addLectures, createCourse } from '../controllers/admin.js';
import { uploadFiles } from '../middlewares/multer.js';

const router = express.Router();

router.post ('/course/new', isAuth, isAdmin, uploadFiles, createCourse)
router.post('/course/:id', uploadFiles, isAuth, isAdmin, addLectures);

export default router;
