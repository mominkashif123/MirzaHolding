import React, { useEffect, useState } from "react";
import axios from "axios";
import EditUserModal from "./EditUser.jsx"; // Import the EditUserModal component

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/getusers");
                setUsers(response.data);
                setLoading(false);
            } catch (error) {
                setError("Error fetching users.");
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleCardClick = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
    }

    return (
        <div className="h-screen bg-gray-200 p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.length === 0 ? (
                    <div className="flex items-center justify-center col-span-full text-lg">Welcome</div>
                ) : (
                    users.map(user => (
                        <div
                            key={user._id}
                            className="bg-white p-4 rounded-lg shadow-md cursor-pointer"
                            onClick={() => handleCardClick(user)}
                        >
                            <h2 className="text-xl font-semibold mb-2">{user.email}</h2>
                            <p><strong>Amount Invested:</strong> PKR {user.amount}</p>
                            <p><strong>Transactions:</strong></p>
                            <ul>
                                {user.transactions.length === 0 ? (
                                    <li>No transactions yet.</li>
                                ) : (
                                    user.transactions.map((transaction, index) => (
                                        <li key={index} className="border-b border-gray-200 py-1">{transaction}</li>
                                    ))
                                )}
                            </ul>
                        </div>
                    ))
                )}
            </div>
            {showModal && selectedUser && (
                <EditUserModal
                    user={selectedUser}
                    onClose={handleCloseModal}
                    onUpdate={(updatedUser) => {
                        setUsers(users.map(user => user._id === updatedUser._id ? updatedUser : user));
                        handleCloseModal();
                    }}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
