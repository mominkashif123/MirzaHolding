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
            _id: user._id,
            email: user.email,
            amount: user.amount.toString(),
            transactions: user.transactions,
            isMutual: !!user.isMutual,
        }));

        res.status(200).json(formattedUsers);
    } catch (err) {
        res.status(500).send("Error getting users");
    }
};

export const updateUser = async (req, res) => {
    const { email } = req.params;
    const { amountChange, transactionsToAdd, transactionsToRemove, isMutual } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send("User not found");
        }

        const updateFields = {};
        
        // Handle amount change (add/subtract)
        if (amountChange !== undefined && amountChange !== null && amountChange !== "") {
            const change = parseFloat(amountChange);
            if (!isNaN(change)) {
                const currentAmount = parseFloat(user.amount.toString());
                const newAmount = currentAmount + change;
                updateFields.amount = newAmount;
            }
        }
        
        // Handle transactions: add new ones and remove specified ones
        if (transactionsToAdd !== undefined || transactionsToRemove !== undefined) {
            let updatedTransactions = [...(user.transactions || [])];
            
            // Remove transactions
            if (Array.isArray(transactionsToRemove) && transactionsToRemove.length > 0) {
                updatedTransactions = updatedTransactions.filter(
                    (t, index) => !transactionsToRemove.includes(index)
                );
            }
            
            // Add new transactions
            if (Array.isArray(transactionsToAdd) && transactionsToAdd.length > 0) {
                updatedTransactions = [...updatedTransactions, ...transactionsToAdd.filter(Boolean)];
            }
            
            updateFields.transactions = updatedTransactions;
        }
        
        // Handle account type change
        if (typeof isMutual === "boolean") {
            updateFields.isMutual = isMutual;
        }
        
        const updatedUser = await User.findOneAndUpdate(
            { email: email },
            updateFields,
            { new: true }
        );

        // Convert Decimal128 to string for JSON response
        const formattedUser = {
            _id: updatedUser._id,
            email: updatedUser.email,
            amount: updatedUser.amount.toString(),
            transactions: updatedUser.transactions,
            isMutual: !!updatedUser.isMutual,
            premium: updatedUser.premium,
        };

        res.status(200).json(formattedUser);
    } catch (error) {
        res.status(500).send("Error updating user");
    }
};
