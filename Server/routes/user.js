import express from 'express';
import {register, loginUser} from "../controllers/user.js";

const router = express.Router();

router.post('/user/register', register);
router.post('/user/login', loginUser);

export default router;