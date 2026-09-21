import express from 'express';
import { isAdmin, isAuth } from '../middlewares/isAuth.js';
import {
  addLectures,
  createCourse,
  deleteCourse,
  deleteLecture,
  getAllStats,
  getPendingCourses,
  reviewCourse,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllAdminCourses
} from '../controllers/admin.js';
import { uploadFiles } from '../middlewares/multer.js';
import { adminLogin } from "../controllers/adminAuth.js";

const router = express.Router();

router.post("/admin/login", adminLogin);

// Course Management
router.post('/course/new', isAuth, isAdmin, uploadFiles, createCourse);
router.post('/course/:id', isAuth, isAdmin, uploadFiles, addLectures);
router.delete('/course/:id', isAuth, isAdmin, deleteCourse);
router.delete('/lecture/:id', isAuth, isAdmin, deleteLecture);
router.get('/admin/courses/all', isAuth, isAdmin, getAllAdminCourses);
router.get('/admin/courses/pending', isAuth, isAdmin, getPendingCourses);
router.put('/admin/course/:id/review', isAuth, isAdmin, reviewCourse);

// Platform Analytics & Stats (fixed middleware ordering)
router.get('/stats', isAuth, isAdmin, getAllStats);

// User Management
router.get('/admin/users', isAuth, isAdmin, getAllUsers);
router.put('/admin/user/:id/role', isAuth, isAdmin, updateUserRole);
router.delete('/admin/user/:id', isAuth, isAdmin, deleteUser);

export default router;
