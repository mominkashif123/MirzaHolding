import React, { useState } from "react";
import axios from "axios";
import { Plus, Minus, X, Trash2 } from "lucide-react";

const EditUserModal = ({ user, onClose, onUpdate }) => {
    // Handle Decimal128 conversion - convert to string if it's an object
    const getAmountString = (amountValue) => {
        if (amountValue == null || amountValue === "") return "0";
        if (typeof amountValue === "object" && amountValue.$numberDecimal) {
            return amountValue.$numberDecimal;
        }
        return String(amountValue);
    };
    
    const currentAmount = parseFloat(getAmountString(user.amount)) || 0;
    const [amountChange, setAmountChange] = useState("");
    const [amountOperation, setAmountOperation] = useState("add"); // "add" or "subtract"
    const originalTransactions = Array.isArray(user.transactions) ? user.transactions : [];
    const [existingTransactions, setExistingTransactions] = useState([...originalTransactions]);
    const [removedIndices, setRemovedIndices] = useState(new Set());
    const [newTransaction, setNewTransaction] = useState("");
    const [isMutual, setIsMutual] = useState(!!user.isMutual);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleRemoveTransaction = (displayIndex) => {
        // Find the original index before any removals
        const originalIndex = Array.from(originalTransactions.keys()).filter(
            idx => !removedIndices.has(idx)
        )[displayIndex];
        
        if (originalIndex !== undefined) {
            setRemovedIndices(prev => new Set([...prev, originalIndex]));
            setExistingTransactions(prev => prev.filter((_, i) => i !== displayIndex));
        }
    };

    const handleAddTransaction = () => {
        if (newTransaction.trim()) {
            setExistingTransactions(prev => [...prev, newTransaction.trim()]);
            setNewTransaction("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        // Check if there are any changes
        const hasAmountChange = amountChange !== "" && amountChange !== null && amountChange !== undefined;
        
        // Find newly added transactions (in existingTransactions but not in originalTransactions)
        const newTransactions = existingTransactions.filter(
            txn => !originalTransactions.includes(txn)
        );
        const hasTransactionChanges = newTransaction.trim() || removedIndices.size > 0 || newTransactions.length > 0;
        const hasAccountTypeChange = isMutual !== !!user.isMutual;
        
        if (!hasAmountChange && !hasTransactionChanges && !hasAccountTypeChange) {
            onClose();
            return;
        }

        setLoading(true);
        try {
            // Combine new transaction from input with newly added transactions from the list
            const transactionsToAdd = [
                ...(newTransaction.trim() ? [newTransaction.trim()] : []),
                ...newTransactions
            ];
            const transactionsToRemove = Array.from(removedIndices);
            
            // Calculate amount change
            let amountDelta = 0;
            if (hasAmountChange) {
                const change = parseFloat(amountChange);
                if (!isNaN(change)) {
                    amountDelta = amountOperation === "add" ? change : -change;
                }
            }

            const response = await axios.put(
                `https://mirza-holding.onrender.com/api/updateuser/${encodeURIComponent(user.email)}`,
                {
                    amountChange: amountDelta !== 0 ? amountDelta : undefined,
                    transactionsToAdd: transactionsToAdd.length > 0 ? transactionsToAdd : undefined,
                    transactionsToRemove: transactionsToRemove.length > 0 ? transactionsToRemove : undefined,
                    isMutual,
                }
            );
            
            // Ensure amount is converted to string if it's a Decimal128 object
            const updatedData = {
                ...response.data,
                amount: getAmountString(response.data.amount),
                isMutual,
            };
            onUpdate(updatedData);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update user");
        } finally {
            setLoading(false);
        }
    };

    const calculatedNewAmount = amountChange !== "" && amountChange !== null && amountChange !== undefined
        ? (amountOperation === "add" 
            ? currentAmount + parseFloat(amountChange || 0)
            : currentAmount - parseFloat(amountChange || 0))
        : currentAmount;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white p-6 rounded-2xl shadow-xl max-w-2xl w-full my-8">
                <h2 className="text-2xl font-bold mb-4 text-black">Edit User</h2>
                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
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

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Investment Amount
                        </label>
                        <div className="bg-gray-50 p-4 rounded-xl mb-3">
                            <div className="text-sm text-gray-600 mb-1">Current Amount:</div>
                            <div className="text-2xl font-bold text-black">PKR {currentAmount.toLocaleString()}</div>
                        </div>
                        
                        <div className="flex gap-2 items-start">
                            <div className="flex-1">
                                <div className="flex gap-2 mb-2">
                                    <button
                                        type="button"
                                        onClick={() => setAmountOperation("add")}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                                            amountOperation === "add"
                                                ? "bg-green-600 text-white"
                                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        }`}
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAmountOperation("subtract")}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                                            amountOperation === "subtract"
                                                ? "bg-red-600 text-white"
                                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        }`}
                                    >
                                        <Minus className="w-4 h-4" />
                                        Subtract
                                    </button>
                                </div>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={amountChange}
                                    onChange={(e) => setAmountChange(e.target.value)}
                                    placeholder="Enter amount"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                                />
                            </div>
                        </div>
                        
                        {amountChange !== "" && amountChange !== null && amountChange !== undefined && !isNaN(parseFloat(amountChange)) && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-xl">
                                <div className="text-sm text-gray-600 mb-1">New Amount:</div>
                                <div className="text-xl font-bold text-blue-900">
                                    PKR {calculatedNewAmount.toLocaleString()}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Transactions
                        </label>
                        
                        {existingTransactions.length > 0 && (
                            <div className="mb-4 space-y-2 max-h-48 overflow-y-auto">
                                {existingTransactions.map((transaction, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200"
                                    >
                                        <span className="text-gray-800 flex-1">{transaction}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTransaction(index)}
                                            className="ml-3 p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Remove transaction"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newTransaction}
                                onChange={(e) => setNewTransaction(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleAddTransaction();
                                    }
                                }}
                                placeholder="Add new transaction"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                            />
                            <button
                                type="button"
                                onClick={handleAddTransaction}
                                disabled={!newTransaction.trim()}
                                className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
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
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;
