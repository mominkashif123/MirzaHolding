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
        console.error(err);
        res.status(500).send("Error logging in User");
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();

        const formattedUsers = users.map(user => ({
            email: user.email,
            amount: user.amount.toString(), // Convert Decimal to string
            transactions: user.transactions
        }));

        res.status(200).json(formattedUsers);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error getting users");
    }
};

export const updateUser = async (req, res) => {
    const { email } = req.params; // Get email from params
    const { amount, transactions } = req.body;

    try {
        const amountDecimal = parseFloat(amount); // Convert amount to decimal
        const updatedUser = await User.findOneAndUpdate(
            { email: email }, // Query by email
            { amount: amountDecimal, transactions },
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).send("User not found");
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send("Error updating user");
    }
};
