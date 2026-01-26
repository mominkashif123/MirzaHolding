import express from "express";
import { Signup, Login, UserData, ChangePassword } from '../controllers/userController.js';

const router = express.Router();

router.post('/signup', Signup);
router.post('/login', Login);
router.get('/data', UserData);
router.post('/changePassword', ChangePassword);


export default router; 