import React, { useState } from "react";
import axios from "axios";

const EditUserModal = ({ user, onClose, onUpdate }) => {
    const [amount, setAmount] = useState(user.amount ?? "");
    const [transactions, setTransactions] = useState(Array.isArray(user.transactions) ? user.transactions.join("\n") : "");
    const [isMutual, setIsMutual] = useState(!!user.isMutual);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const amountDecimal = parseFloat(amount);
            // `http://localhost:5000/api/updateuser/${encodeURIComponent(user.email)}`
            const response = await axios.put(
                `https://mirza-holding.onrender.com/api/updateuser/${encodeURIComponent(user.email)}`,
                {
                    amount: amountDecimal,
                    transactions: transactions.split("\n").filter(Boolean),
                    isMutual,
                }
            );
            onUpdate({ ...response.data, isMutual });
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update user");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4 text-black">Edit User</h2>
                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account type</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="accountType"
                                    checked={!isMutual}
                                    onChange={() => setIsMutual(false)}
                                    className="w-4 h-4 text-black"
                                />
                                <span className="text-gray-700">General</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="accountType"
                                    checked={isMutual}
                                    onChange={() => setIsMutual(true)}
                                    className="w-4 h-4 text-black"
                                />
                                <span className="text-gray-700">Mutual funds</span>
                            </label>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount invested (PKR)</label>
                        <input
                            type="text"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Transactions (one per line)</label>
                        <textarea
                            rows={4}
                            value={transactions}
                            onChange={(e) => setTransactions(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 font-medium disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;
