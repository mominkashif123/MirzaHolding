import express from "express";
import { AdminLogin, getUsers, updateUser } from '../controllers/adminController.js';

const router = express.Router();

router.post('/adminlogin', AdminLogin);
router.get('/getusers', getUsers);
router.put("/updateuser/:email", updateUser);

export default router; 