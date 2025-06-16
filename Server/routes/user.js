import express from 'express';
import {register, loginUser} from "../controllers/user.js";
import { isAuth } from '../middlewares/isAuth.js';

const router = express.Router();

router.post('/user/register', register);
router.post('/user/login', loginUser);
router.get('/user/me',isAuth, (req, res) => {
    res.status(200).json({
        user: req.user,
    });
});


export default router;