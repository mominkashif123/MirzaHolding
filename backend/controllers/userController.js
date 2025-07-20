import User from '../models/User.js';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';
import TemporaryUser from '../models/Temp.js'; 
import dotenv from 'dotenv';

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSKEY,
    },
});

export const Signup = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists.' });
        }

        const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });

        await User.create({ email, password, otp, isVerified: false });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending OTP email:', error);
                return res.status(500).json({ error: 'Error sending OTP. in signup.' });
            }
            console.log('OTP email sent:', info.response);
            res.status(200).json({ message: 'OTP sent to your email.' });
        });

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const sendOtp = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists.' });
        }

        const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
        console.log(otp);

        try {
            await TemporaryUser.create({ email, password, otp });
        } catch (err) {
            console.error('Error saving temporary user:', err);
            return res.status(500).json({ error: 'Error saving temporary user.' });
        }

        const mailOptions = { 
            from: process.env.EMAIL,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'OTP sent to your email!' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ error: 'Error sending OTP.' });
    }
};

export const verifyOtpAndCreateUser = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ error: 'Email and OTP are required.' });
    }

    try {
        const tempUser = await TemporaryUser.findOne({ email, otp });
        if (!tempUser) {
            return res.status(400).json({ error: 'Invalid OTP.' });
        }

        await User.create({ email, password: tempUser.password });
        await TemporaryUser.deleteOne({ email });

        res.status(200).json({ message: 'User created successfully!' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ error: 'Error verifying OTP.' });
    }
};

export const Login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "User does not exist" });
        }
        if (user.password !== password) {
            return res.status(400).json({ msg: "Invalid password" });
        }
        res.status(200).json({ msg: "User logged in" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error logging in User");
    }
};

export const UserData = async (req, res) => {
    try {
        const { email } = req.query; 

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const amount = user.amount instanceof mongoose.Types.Decimal128
            ? user.amount.toString()
            : user.amount;

        const transactions = user.transactions.map(transaction => transaction);
        res.json({ amount, transactions, premium: user.premium });
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ message: 'Error fetching user data' });
    }
}

export const ChangePassword = async (req, res) => {
    const { email, currentPassword, newPassword } = req.body;
    if (!email || !currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Email, old password, and new password are required.' });
    }

    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({
            error: 'Password must be at least 8 characters long and include at least one special character.'
        });
    }
    
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        if (user.password !== currentPassword) {
            return res.status(400).json({ error: 'Old password is incorrect.' });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully.' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}