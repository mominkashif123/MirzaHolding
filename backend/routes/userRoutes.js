import express from "express";
import { Signup, Login, UserData, sendOtp, verifyOtpAndCreateUser, ChangePassword } from '../controllers/userController.js';

const router = express.Router();

router.post('/signup', Signup);
router.post('/login', Login);
router.get('/data', UserData);
router.post('/sendOtp', sendOtp);
router.post('/verifyOtpAndCreateUser', verifyOtpAndCreateUser);
router.post('/changePassword', ChangePassword);


export default router; 