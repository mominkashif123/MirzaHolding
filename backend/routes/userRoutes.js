import express from "express";
import { Signup, Login, LoginFunds, UserData, ChangePassword } from '../controllers/userController.js';

const router = express.Router();

router.post('/signup', Signup);
router.post('/login', Login);
router.post('/login/funds', LoginFunds);
router.get('/data', UserData);
router.post('/changePassword', ChangePassword);


export default router; 