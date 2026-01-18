import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Upload, X, FileText, AlertCircle, CheckCircle } from "lucide-react";
import EditUserModal from "./EditUser.jsx"; // Import the EditUserModal component

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState('');
    const [uploadForm, setUploadForm] = useState({
        quarter: '',
        year: '',
        title: '',
        pdfFile: null
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // const response = await axios.get("http://localhost:5000/api/getusers");
                const response = await axios.get("https://mirza-holding.onrender.com/api/getusers");
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

    const handleLogout = () => {
        sessionStorage.removeItem("user");
        navigate("/admin");
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                setUploadError('Please select a PDF file');
                return;
            }
            setUploadForm({ ...uploadForm, pdfFile: file });
            setUploadError('');
        }
    };

    const handleUploadSubmit = async (e) => {
        e.preventDefault();
        setUploadError('');
        setUploadSuccess('');

        if (!uploadForm.quarter || !uploadForm.year || !uploadForm.title || !uploadForm.pdfFile) {
            setUploadError('Please fill in all fields and select a PDF file');
            return;
        }

        setUploadLoading(true);

        try {
            // Convert PDF to base64
            const fileReader = new FileReader();
            fileReader.readAsDataURL(uploadForm.pdfFile);
            
            fileReader.onload = async () => {
                const pdfBase64 = fileReader.result;
                const fileSizeMB = (uploadForm.pdfFile.size / (1024 * 1024)).toFixed(2);

                try {
                    await axios.post('http://localhost:5000/api/quarterreports', {
                    // await axios.post('https://mirza-holding.onrender.com/api/quarterreports', {
                        quarter: uploadForm.quarter,
                        year: uploadForm.year,
                        title: uploadForm.title,
                        size: `${fileSizeMB} MB`,
                        pdfBase64: pdfBase64
                    });

                    setUploadSuccess('Quarter report uploaded successfully!');
                    setUploadForm({ quarter: '', year: '', title: '', pdfFile: null });
                    
                    setTimeout(() => {
                        setShowUploadModal(false);
                        setUploadSuccess('');
                    }, 2000);
                } catch (error) {
                    console.error('Upload error:', error);
                    setUploadError(error.response?.data?.error || 'Failed to upload report. Please try again.');
                } finally {
                    setUploadLoading(false);
                }
            };

            fileReader.onerror = () => {
                setUploadError('Error reading file. Please try again.');
                setUploadLoading(false);
            };
        } catch (error) {
            console.error('File processing error:', error);
            setUploadError('Error processing file. Please try again.');
            setUploadLoading(false);
        }
    };

    const handleCloseUploadModal = () => {
        setShowUploadModal(false);
        setUploadForm({ quarter: '', year: '', title: '', pdfFile: null });
        setUploadError('');
        setUploadSuccess('');
    };

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-200">
            {/* Top Navigation */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-black to-gray-700 rounded-xl flex items-center justify-center shadow-lg">
                                <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-black">Admin Dashboard</h1>
                                <p className="text-gray-600 text-sm">User Management</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setShowUploadModal(true)}
                                className="flex items-center space-x-2 bg-gray-700 text-white px-4 py-2.5 rounded-xl hover:bg-gray-600 transition-all duration-300 shadow-lg"
                            >
                                <Upload className="w-4 h-4" />
                                <span className="font-semibold">Upload Report</span>
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

            {/* Main Content */}
            <div className="p-6">
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

            {/* Upload Quarter Report Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-black">Upload Quarter Report</h2>
                            <button
                                onClick={handleCloseUploadModal}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                disabled={uploadLoading}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Success/Error Messages */}
                        {uploadError && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                                <div className="flex items-center space-x-2">
                                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                    <p className="text-red-800 text-sm">{uploadError}</p>
                                </div>
                            </div>
                        )}

                        {uploadSuccess && (
                            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <p className="text-green-800 text-sm">{uploadSuccess}</p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleUploadSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Quarter <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={uploadForm.quarter}
                                    onChange={(e) => {
                                        setUploadForm({ ...uploadForm, quarter: e.target.value });
                                        setUploadError('');
                                    }}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                                    disabled={uploadLoading}
                                    required
                                >
                                    <option value="">Select Quarter</option>
                                    <option value="Q1">Q1</option>
                                    <option value="Q2">Q2</option>
                                    <option value="Q3">Q3</option>
                                    <option value="Q4">Q4</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Year <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={uploadForm.year}
                                    onChange={(e) => {
                                        setUploadForm({ ...uploadForm, year: e.target.value });
                                        setUploadError('');
                                    }}
                                    placeholder="e.g., 2024"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                                    disabled={uploadLoading}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={uploadForm.title}
                                    onChange={(e) => {
                                        setUploadForm({ ...uploadForm, title: e.target.value });
                                        setUploadError('');
                                    }}
                                    placeholder="e.g., Q1 FY24 Report"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                                    disabled={uploadLoading}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    PDF File <span className="text-red-500">*</span>
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-colors">
                                    <input
                                        type="file"
                                        accept=".pdf,application/pdf"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="pdf-upload"
                                        disabled={uploadLoading}
                                    />
                                    <label htmlFor="pdf-upload" className="cursor-pointer">
                                        {uploadForm.pdfFile ? (
                                            <div className="flex items-center justify-center space-x-2 text-black">
                                                <FileText className="w-5 h-5" />
                                                <span className="font-medium">{uploadForm.pdfFile.name}</span>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                                                <p className="text-sm text-gray-600">Click to upload PDF</p>
                                                <p className="text-xs text-gray-500">or drag and drop</p>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>

                            <div className="flex space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={handleCloseUploadModal}
                                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                                    disabled={uploadLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploadLoading}
                                    className="flex-1 px-4 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {uploadLoading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        'Upload'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
