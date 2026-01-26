import Admin from '../models/Admin.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

export const AdminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await Admin.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "User does not exist" });
        }
        if (user.password !== password) {
            return res.status(400).json({ msg: "Invalid password" });
        }
        res.status(200).json({ msg: "User logged in" });
    } catch (err) {
        res.status(500).send("Error logging in User");
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();

        const formattedUsers = users.map(user => ({
            email: user.email,
            amount: user.amount.toString(), 
            transactions: user.transactions
        }));

        res.status(200).json(formattedUsers);
    } catch (err) {
        res.status(500).send("Error getting users");
    }
};

export const updateUser = async (req, res) => {
    const { email } = req.params; 
    const { amount, transactions } = req.body;

    try {
        const amountDecimal = parseFloat(amount);
        const updatedUser = await User.findOneAndUpdate(
            { email: email }, 
            { amount: amountDecimal, transactions },
            { new: true } 
        );

        if (!updatedUser) {
            return res.status(404).send("User not found");
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).send("Error updating user");
    }
};
