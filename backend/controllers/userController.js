import User from '../models/User.js';
import mongoose from 'mongoose';

export const Signup = async (req, res) => {
    const { email, password, isMutual } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists.' });
        }

        await User.create({
            email,
            password,
            isMutual: Boolean(isMutual),
        });

        res.status(200).json({ message: 'User created successfully!' });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
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
        res.status(200).json({ msg: "User logged in", isMutual: user.isMutual });
    } catch (err) {
        res.status(500).send("Error logging in User");
    }
};

export const LoginFunds = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "User does not exist" });
        }
        if (user.password !== password) {
            return res.status(400).json({ msg: "Invalid password" });
        }
        if (!user.isMutual) {
            return res.status(403).json({ msg: "This account is not registered for mutual funds. Please use the general login or sign up for mutual funds." });
        }
        res.status(200).json({ msg: "User logged in", isMutual: true });
    } catch (err) {
        res.status(500).json({ error: "Error logging in" });
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
        res.json({ amount, transactions, premium: user.premium, isMutual: user.isMutual });
    } catch (error) {
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
        res.status(500).json({ error: 'Internal server error' });
    }
}