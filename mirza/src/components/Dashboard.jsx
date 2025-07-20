import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    DollarSign, TrendingUp, Activity, LogOut, User, Wallet, BarChart3,
    CreditCard, PieChart, Target, Globe, Calendar, Clock,
    ArrowUpRight, ArrowDownRight, Plus, Filter, Download, Bell, Settings, X, AlertCircle, CheckCircle
} from "lucide-react";
import jsPDF from 'jspdf';
import Newsletters from '../components/Newsletters';

const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const useremail = sessionStorage.getItem("user");
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const showToast = (type, message) => {
        setToast({ show: true, type, message });
        setTimeout(() => {
            setToast({ show: false, type: '', message: '' });
        }, 5000);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`https://mirza-holding.onrender.com/api/data?email=${encodeURIComponent(useremail)}`);
                // const response = await axios.get(`http://localhost:5000/api/data?email=${encodeURIComponent(useremail)}`);
                setUserData(response.data);
                setLoading(false);
                console.log('User data fetched successfully:', response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                let errorMessage = "Error fetching user data.";

                if (error.response) {
                    // Server responded with error status
                    errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
                } else if (error.request) {
                    // Request was made but no response received
                    errorMessage = "Unable to connect to server. Please check your internet connection.";
                } else {
                    // Something else happened
                    errorMessage = error.message || "An unexpected error occurred.";
                }

                setError(errorMessage);
                setLoading(false);
            }
        };

        fetchUserData();
    }, [useremail]);

    const handleLogout = () => {
        setShowAlert(true);
        showToast('success', 'Logging out...');
        setTimeout(() => {
            sessionStorage.removeItem("user");
            navigate("/login");
        }, 2000);
    };

    const handlePasswordChange = async () => {
        // Clear previous errors
        setPasswordError('');
        setPasswordSuccess('');

        // Validation
        if (!passwordData.currentPassword.trim()) {
            setPasswordError('Current password is required');
            return;
        }

        if (!passwordData.newPassword.trim()) {
            setPasswordError('New password is required');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters long');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError("New passwords don't match!");
            return;
        }

        setPasswordLoading(true);

        try {
            // Placeholder API call - replace with actual endpoint
            // await axios.post('http://localhost:5000/api/changePassword', {
            await axios.post('https://mirza-holding.onrender.com/api/changePassword', {
                email: useremail,
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });

            setPasswordSuccess("Password changed successfully!");
            showToast('success', 'Password updated successfully!');

            setTimeout(() => {
                setShowSettingsModal(false);
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setPasswordSuccess('');
            }, 2000);

        } catch (error) {
            console.error('Password change error:', error);
            let errorMessage = "Error changing password. Please try again.";

            if (error.response) {
                // Server responded with error status
                switch (error.response.status) {
                    case 400:
                        errorMessage = error.response.data?.error || "Invalid password data provided";
                        break;
                    case 401:
                        errorMessage = "Current password is incorrect";
                        break;
                    case 404:
                        errorMessage = "User account not found";
                        break;
                    case 500:
                        errorMessage = "Server error. Please try again later";
                        break;
                    default:
                        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
                }
            } else if (error.request) {
                // Request was made but no response received
                errorMessage = "Unable to connect to server. Please check your internet connection.";
            } else {
                // Something else happened
                errorMessage = error.message || "An unexpected error occurred.";
            }

            setPasswordError(errorMessage);
            showToast('error', errorMessage);
        } finally {
            setPasswordLoading(false);
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(20);
        doc.text('Mirza Holding - Transaction Report', 20, 30);

        // User Info
        doc.setFontSize(12);
        doc.text(`Account: ${useremail}`, 20, 50);
        doc.text(`Portfolio Value: PKR ${userData?.amount || '0'}`, 20, 60);
        doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, 20, 70);

        // Transactions
        doc.setFontSize(16);
        doc.text('Transaction History', 20, 90);

        if (userData?.transactions && userData.transactions.length > 0) {
            let yPosition = 110;
            userData.transactions.forEach((transaction, index) => {
                doc.setFontSize(10);
                doc.text(`${index + 1}. ${transaction}`, 20, yPosition);
                yPosition += 10;
            });
        } else {
            doc.setFontSize(10);
            doc.text('No transactions found.', 20, 110);
        }

        doc.save('mirza-holding-transactions.pdf');
    };

    const Toast = ({ show, type, message }) => {
        if (!show) return null;

        return (
            <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl border transition-all duration-300 transform ${show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                } ${type === 'success'
                    ? 'bg-green-50 text-green-800 border-green-200'
                    : 'bg-red-50 text-red-800 border-red-200'
                }`}>
                <div className="flex items-center space-x-3">
                    <div className={`flex-shrink-0 ${type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                        {type === 'success' ? (
                            <CheckCircle className="w-5 h-5" />
                        ) : (
                            <AlertCircle className="w-5 h-5" />
                        )}
                    </div>
                    <div className="font-medium">{message}</div>
                    <button
                        onClick={() => setToast({ show: false, type: '', message: '' })}
                        className={`flex-shrink-0 ${type === 'success' ? 'text-green-600 hover:text-green-800' : 'text-red-600 hover:text-red-800'}`}
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-12 shadow-2xl text-center border border-gray-200">
                    <div className="w-20 h-20 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                    <p className="text-gray-700 font-semibold text-lg">Loading your dashboard...</p>
                    <p className="text-gray-500 text-sm mt-2">Please wait while we fetch your data</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-12 shadow-2xl text-center border border-red-200">
                    <div className="w-20 h-20 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                        <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-red-600 mb-3">Connection Error</h3>
                    <p className="text-red-600 mb-6 max-w-md">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-semibold"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const stats = [
        { label: 'Total Portfolio', value: userData?.amount || '0', change: '+5.2%', icon: Wallet, positive: true },
        // { label: 'Monthly Returns', value: '15.5%', change: '+2.1%', icon: TrendingUp, positive: true },
        // { label: 'Active Investments', value: '8', change: '+1', icon: Target, positive: true },
        { label: 'Total Transactions', value: userData?.transactions?.length || 0, change: '+3', icon: Activity, positive: true }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            {/* Top Navigation */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-black to-gray-700 rounded-xl flex items-center justify-center shadow-lg">
                                <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-black font-playfair">Portfolio Dashboard</h1>
                                <p className="text-gray-600 text-sm">{useremail}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <button className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                                <Bell className="w-5 h-5 text-gray-600" />
                            </button>
                            <button
                                onClick={() => setShowSettingsModal(true)}
                                className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                            >
                                <Settings className="w-5 h-5 text-gray-600" />
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 bg-black text-white px-4 py-2.5 rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-lg"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="font-semibold">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white/60 backdrop-blur-lg border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6">
                    <nav className="flex space-x-8">
                        {[
                            { id: 'overview', label: 'Overview', icon: BarChart3 },
                            // { id: 'portfolio', label: 'Portfolio', icon: PieChart },
                            { id: 'transactions', label: 'Transactions', icon: Activity },
                            { id: 'newsletters', label: 'Newsletters', icon: Bell }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center space-x-2 py-4 border-b-2 transition-all duration-300 ${activeTab === tab.id
                                    ? 'border-black text-black font-semibold'
                                    : 'border-transparent text-gray-600 hover:text-black hover:border-gray-300'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {stats.map((stat, index) => (
                                <div key={index} className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 group">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-black to-gray-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <stat.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className={`flex items-center space-x-1 text-sm ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                                            {stat.positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                            <span>{stat.change}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-2xl font-bold text-black">{stat.value}</div>
                                        <div className="text-sm text-gray-600">{stat.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Main Portfolio Card */}
                        <div className="bg-gradient-to-br from-black via-gray-800 to-black rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full transform translate-x-32 -translate-y-32"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/3 rounded-full transform -translate-x-24 translate-y-24"></div>

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-3xl font-bold font-playfair mb-2">Total Portfolio Value</h2>
                                        <p className="text-gray-300">Your complete investment overview</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center space-x-2 text-green-400 mb-2">
                                            <TrendingUp className="w-5 h-5" />
                                            <span className="text-lg font-semibold">+12.8%</span>
                                        </div>
                                        <p className="text-gray-400 text-sm">This month</p>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <div className="text-5xl font-bold mb-2">PKR {userData?.amount || '0'}</div>
                                    <div className="text-gray-300">Pakistani Rupee</div>
                                </div>

                                <div className="grid grid-cols-3 gap-8">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold mb-1">850K</div>
                                        <div className="text-gray-400 text-sm">Assets Under Management</div>
                                    </div>
                                    {/*
                                    <div className="text-center">
                                        <div className="text-2xl font-bold mb-1">18.2%</div>
                                        <div className="text-gray-400 text-sm">Annual Returns</div>
                                    </div>
                                    */}
                                    <div className="text-center">
                                        <div className="text-2xl font-bold mb-1">{currentDateTime.toLocaleString()}</div>
                                        <div className="text-gray-400 text-sm">Current Date & Time</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions - Updated to remove investment option */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-200">
                                <div className="flex items-center space-x-3 mb-4">
                                    <Download className="w-6 h-6 text-black" />
                                    <h3 className="font-semibold text-black">Download Report</h3>
                                </div>
                                <p className="text-gray-600 mb-4">Get your portfolio performance report</p>
                                <button
                                    onClick={generatePDF}
                                    className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition-colors font-semibold"
                                >
                                    Download PDF
                                </button>
                            </div>

                            <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-200">
                                <div className="flex items-center space-x-3 mb-4">
                                    <Calendar className="w-6 h-6 text-black" />
                                    <h3 className="font-semibold text-black">Schedule Meeting</h3>
                                </div>
                                <p className="text-gray-600 mb-4">Book a consultation with our experts</p>
                                <button className="w-full bg-gray-100 text-black py-3 rounded-xl hover:bg-gray-200 transition-colors font-semibold">
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Transactions Tab */}
                {activeTab === 'transactions' && (
                    <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-200">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-black to-gray-700 rounded-xl flex items-center justify-center">
                                    <Activity className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-black font-playfair">Transaction History</h3>
                                    <p className="text-gray-600">Your complete financial activity log</p>
                                </div>
                            </div>
                            <button className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl transition-colors">
                                <Filter className="w-4 h-4" />
                                <span>Filter</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            {userData?.transactions && userData.transactions.length > 0 ? (
                                userData.transactions.map((transaction, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-6 bg-gray-50/80 rounded-xl hover:bg-gray-100/80 transition-all duration-300 border border-gray-200"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-black to-gray-700 rounded-xl flex items-center justify-center">
                                                <DollarSign className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-black text-lg">{transaction}</div>
                                                <div className="text-gray-500">Transaction #{index + 1}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center space-x-2 text-green-600 mb-1">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span className="font-semibold">Completed</span>
                                            </div>
                                            {/* <div className="text-gray-500 text-sm flex items-center">
                                                <Clock className="w-3 h-3 mr-1" />
                                                2 hours ago
                                            </div> */}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-16">
                                    <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                                        <Activity className="w-10 h-10 text-gray-400" />
                                    </div>
                                    <h4 className="text-xl font-semibold text-gray-700 mb-3">No transactions yet</h4>
                                    <p className="text-gray-500 mb-6">Your transaction history will appear here once you start investing</p>
                                    <button className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors font-semibold">
                                        Start Investing
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Newsletters Tab */}
                {activeTab === 'newsletters' && (
                    <div className="relative">
                        {/* Newsletters content */}
                        <div
                            className={`${userData?.premium ? '' : 'pointer-events-none blur-sm select-none max-h-72 overflow-hidden'
                                } transition-all duration-300`}
                        >
                            <Newsletters />
                        </div>

                        {/* Overlay for non-premium users */}
                        {!userData?.premium && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-md rounded-2xl p-6 z-10">
                                <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">Coming Soon</h3>
                                <p className="text-gray-600 mb-4 text-center max-w-md">
                                    The newsletter section will be available soon for all users.
                                </p>
                            </div>
                        )}
                    </div>
                )}

            </div>

            {/* Settings Modal */}
            {showSettingsModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-black">Change Password</h2>
                            <button
                                onClick={() => {
                                    setShowSettingsModal(false);
                                    setPasswordError('');
                                    setPasswordSuccess('');
                                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                }}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Success/Error Messages */}
                        {passwordError && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                                <div className="flex items-center space-x-2">
                                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                    <p className="text-red-800 text-sm">{passwordError}</p>
                                </div>
                            </div>
                        )}

                        {passwordSuccess && (
                            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <p className="text-green-800 text-sm">{passwordSuccess}</p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => {
                                        setPasswordData({ ...passwordData, currentPassword: e.target.value });
                                        setPasswordError('');
                                    }}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-colors ${passwordError ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    disabled={passwordLoading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => {
                                        setPasswordData({ ...passwordData, newPassword: e.target.value });
                                        setPasswordError('');
                                    }}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-colors ${passwordError ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    disabled={passwordLoading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => {
                                        setPasswordData({ ...passwordData, confirmPassword: e.target.value });
                                        setPasswordError('');
                                    }}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-colors ${passwordError ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    disabled={passwordLoading}
                                />
                            </div>
                        </div>

                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowSettingsModal(false);
                                    setPasswordError('');
                                    setPasswordSuccess('');
                                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                }}
                                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                                disabled={passwordLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePasswordChange}
                                disabled={passwordLoading}
                                className="flex-1 px-4 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {passwordLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    'Update Password'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Component */}
            <Toast show={toast.show} type={toast.type} message={toast.message} />
        </div>
    );
};

export default Dashboard;