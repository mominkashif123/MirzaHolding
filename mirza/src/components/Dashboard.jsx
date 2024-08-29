import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AlertMessage from "./Customalert.jsx";

const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const useremail = sessionStorage.getItem("user");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/data?email=${encodeURIComponent(useremail)}`);
                setUserData(response.data);
                setLoading(false);
            } catch (error) {
                setError("Error fetching user data.");
                setLoading(false);
            }
        };

        fetchUserData();
    }, [useremail]);

    const handleLogout = () => {
        setShowAlert(true);
        setTimeout(() => {
            sessionStorage.removeItem("user");
            navigate("/login");
        }, 2000);
    };

    if (loading) {
        return <div className="flex items-center justify-center h-full">Loading...</div>;
    }

    if (error) {
        return <div className="flex items-center justify-center h-full text-red-500">{error}</div>;
    }

    return (
        <div className="h-screen bg-gray-100">
            {/* Welcome Header */}
            <div className="bg-green-700 text-white text-center py-4">
                <h2 className="text-xl font-bold">Welcome, {useremail}</h2>
            </div>

            {/* Dashboard Content */}
            <div className="p-6">
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">What I Have</h3>
                    <div className="text-2xl text-green-600 font-bold">{userData.amount}</div>
                    <p className="text-gray-500 text-sm">Available Balance</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Transactions</h3>
                    <ul className="list-disc pl-5">
                        {userData.transactions && userData.transactions.length > 0 ? (
                            userData.transactions.map((transaction, index) => (
                                <li key={index} className="text-gray-600">{transaction}</li>
                            ))
                        ) : (
                            <li className="text-gray-500">No transactions available</li>
                        )}
                    </ul>
                </div>
            </div>

            {/* Logout Button */}
            <div className="p-6">
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white w-full py-2 rounded-md hover:bg-red-600"
                >
                    Logout
                </button>
                {showAlert && <AlertMessage type="success" message="Logged out successfully" />}
            </div>
        </div>
    );
};

export default Dashboard;
