import React, { useState } from "react";
import axios from "axios";

const EditUserModal = ({ user, onClose, onUpdate }) => {
    console.log(user.email);
    const [amount, setAmount] = useState(user.amount);
    const [transactions, setTransactions] = useState(user.transactions.join('\n')); // Convert array to string for editing

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const amountDecimal = parseFloat(amount);

            // const response = await axios.put(`http://localhost:5000/api/updateuser/${encodeURIComponent(user.email)}`, {
            const response = await axios.put(`https://mirza-holding.onrender.com/api/updateuser/${encodeURIComponent(user.email)}`, {
                amount: amountDecimal,
                transactions: transactions.split('\n')
            });
            onUpdate(response.data);
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">Edit User</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Amount Invested</label>
                        <input
                            type="text"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Transactions</label>
                        <textarea
                            rows="4"
                            value={transactions}
                            onChange={(e) => setTransactions(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;
