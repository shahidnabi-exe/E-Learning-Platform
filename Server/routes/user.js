import express from 'express';
import { register, loginUser, myProfile, updateProfile, changePassword } from "../controllers/user.js";
import { isAuth } from '../middlewares/isAuth.js';

const router = express.Router();

router.post('/user/register', register);
router.post('/user/login', loginUser);
router.get('/user/me', isAuth, myProfile);
router.put('/user/profile', isAuth, updateProfile);
router.put('/user/password', isAuth, changePassword);

export default router;