import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    LogOut,
    User,
    Upload,
    X,
    FileText,
    AlertCircle,
    CheckCircle,
    Wallet,
    PieChart,
    Plus,
    TrendingUp,
    Users,
} from "lucide-react";
import EditUserModal from "./EditUser.jsx";

const API = "http://localhost:5000/api";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("general");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [uploadSuccess, setUploadSuccess] = useState("");
    const [uploadForm, setUploadForm] = useState({
        quarter: "",
        year: "",
        title: "",
        pdfFile: null,
    });
    const navigate = useNavigate();

    // Mutual funds state
    const [funds, setFunds] = useState([]);
    const [mutualUsersWithHoldings, setMutualUsersWithHoldings] = useState([]);
    const [fundsLoading, setFundsLoading] = useState(false);
    const [showCreateFundModal, setShowCreateFundModal] = useState(false);
    const [createFundForm, setCreateFundForm] = useState({ code: "", name: "", category: "Equity" });
    const [showNavModal, setShowNavModal] = useState(false);
    const [navForm, setNavForm] = useState({ date: "" });
    const [navValues, setNavValues] = useState({});
    const [showHoldingsModal, setShowHoldingsModal] = useState(false);
    const [holdingsUser, setHoldingsUser] = useState(null);
    const [holdingsData, setHoldingsData] = useState([]);
    const [holdingsLoading, setHoldingsLoading] = useState(false);
    const [mutualMsg, setMutualMsg] = useState({ type: "", text: "" });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${API}/getusers`);
                setUsers(response.data);
                setError(null);
            } catch (err) {
                setError("Error fetching users.");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        if (activeTab !== "mutual") return;
        const fetchMutual = async () => {
            setFundsLoading(true);
            try {
                const [fundsRes, usersRes] = await Promise.all([
                    axios.get(`${API}/funds/with-nav`),
                    axios.get(`${API}/funds/mutual-users-holdings`),
                ]);
                setFunds(fundsRes.data);
                setMutualUsersWithHoldings(usersRes.data);
            } catch (err) {
                setMutualMsg({ type: "error", text: err.response?.data?.message || "Error loading funds" });
            } finally {
                setFundsLoading(false);
            }
        };
        fetchMutual();
    }, [activeTab]);

    const handleCardClick = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    const handleUpdateUser = (updatedUser) => {
        setUsers((prev) =>
            prev.map((u) => (u.email === updatedUser.email ? { ...u, ...updatedUser, isMutual: updatedUser.isMutual } : u))
        );
        handleCloseModal();
    };

    const handleLogout = () => {
        sessionStorage.removeItem("user");
        navigate("/admin");
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== "application/pdf") {
                setUploadError("Please select a PDF file");
                return;
            }
            setUploadForm({ ...uploadForm, pdfFile: file });
            setUploadError("");
        }
    };

    const handleUploadSubmit = async (e) => {
        e.preventDefault();
        setUploadError("");
        setUploadSuccess("");
        if (!uploadForm.quarter || !uploadForm.year || !uploadForm.title || !uploadForm.pdfFile) {
            setUploadError("Please fill in all fields and select a PDF file");
            return;
        }
        setUploadLoading(true);
        try {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(uploadForm.pdfFile);
            fileReader.onload = async () => {
                const pdfBase64 = fileReader.result;
                const fileSizeMB = (uploadForm.pdfFile.size / (1024 * 1024)).toFixed(2);
                try {
                    await axios.post(`${API}/quarterreports`, {
                        quarter: uploadForm.quarter,
                        year: uploadForm.year,
                        title: uploadForm.title,
                        size: `${fileSizeMB} MB`,
                        pdfBase64,
                    });
                    setUploadSuccess("Quarter report uploaded successfully!");
                    setUploadForm({ quarter: "", year: "", title: "", pdfFile: null });
                    setTimeout(() => {
                        setShowUploadModal(false);
                        setUploadSuccess("");
                    }, 2000);
                } catch (err) {
                    setUploadError(err.response?.data?.error || "Failed to upload report.");
                } finally {
                    setUploadLoading(false);
                }
            };
            fileReader.onerror = () => {
                setUploadError("Error reading file.");
                setUploadLoading(false);
            };
        } catch (err) {
            setUploadError("Error processing file.");
            setUploadLoading(false);
        }
    };

    const handleCloseUploadModal = () => {
        setShowUploadModal(false);
        setUploadForm({ quarter: "", year: "", title: "", pdfFile: null });
        setUploadError("");
        setUploadSuccess("");
    };

    const handleCreateFund = async (e) => {
        e.preventDefault();
        setMutualMsg({ type: "", text: "" });
        try {
            await axios.post(`${API}/funds`, createFundForm);
            setMutualMsg({ type: "success", text: "Fund created." });
            setShowCreateFundModal(false);
            setCreateFundForm({ code: "", name: "", category: "Equity" });
            const res = await axios.get(`${API}/funds/with-nav`);
            setFunds(res.data);
        } catch (err) {
            setMutualMsg({ type: "error", text: err.response?.data?.message || "Failed to create fund" });
        }
    };

    const handleUploadNavs = async (e) => {
        e.preventDefault();
        setMutualMsg({ type: "", text: "" });
        if (!navForm.date) {
            setMutualMsg({ type: "error", text: "Select a date." });
            return;
        }
        const navs = funds
            .filter((f) => navValues[f.code] !== undefined && navValues[f.code] !== "")
            .map((f) => ({ fundCode: f.code, nav: parseFloat(navValues[f.code]) }));
        if (navs.length === 0) {
            setMutualMsg({ type: "error", text: "Enter at least one NAV." });
            return;
        }
        try {
            await axios.post(`${API}/funds/navs`, { date: navForm.date, navs });
            setMutualMsg({ type: "success", text: "NAVs uploaded and portfolio snapshots updated." });
            setShowNavModal(false);
            setNavForm({ date: "" });
            setNavValues({});
            const fundsRes = await axios.get(`${API}/funds/with-nav`);
            setFunds(fundsRes.data);
        } catch (err) {
            setMutualMsg({ type: "error", text: err.response?.data?.message || "Failed to upload NAVs" });
        }
    };

    const openHoldingsModal = async (u) => {
        setHoldingsUser(u);
        setShowHoldingsModal(true);
        setHoldingsLoading(true);
        setMutualMsg({ type: "", text: "" });
        try {
            const res = await axios.get(`${API}/funds/holdings/${encodeURIComponent(u.email)}`);
            const existing = res.data;
            const byFund = {};
            existing.forEach((h) => {
                byFund[h.fund?.code] = { units: h.units, investedAmount: h.investedAmount?.toString() ?? "" };
            });
            const next = funds.map((f) => {
                const nav = f.latestNav != null ? Number(f.latestNav) : null;
                return {
                    fundCode: f.code,
                    fundName: f.name,
                    latestNav: nav,
                    units: byFund[f.code]?.units ?? 0,
                    investedAmount: byFund[f.code]?.investedAmount ?? "",
                };
            });
            setHoldingsData(next);
        } catch (err) {
            setMutualMsg({ type: "error", text: err.response?.data?.message || "Failed to load holdings" });
            setHoldingsData(funds.map((f) => ({
                fundCode: f.code,
                fundName: f.name,
                latestNav: f.latestNav != null ? Number(f.latestNav) : null,
                units: 0,
                investedAmount: "",
            })));
        } finally {
            setHoldingsLoading(false);
        }
    };

    const setHoldingField = (fundCode, field, value) => {
        setHoldingsData((prev) =>
            prev.map((h) => {
                if (h.fundCode !== fundCode) return h;
                const nav = h.latestNav;
                const num = parseFloat(value);
                const hasNav = nav != null && nav > 0;
                if (field === "units") {
                    const units = value;
                    const investedAmount = hasNav && !isNaN(num) ? String((num * nav).toFixed(2)) : h.investedAmount;
                    return { ...h, units, investedAmount };
                }
                if (field === "investedAmount") {
                    const investedAmount = value;
                    const units = hasNav && !isNaN(num) ? String((num / nav).toFixed(4)) : h.units;
                    return { ...h, investedAmount, units };
                }
                return { ...h, [field]: value };
            })
        );
    };

    const handleSaveHoldings = async (e) => {
        e.preventDefault();
        if (!holdingsUser) return;
        setHoldingsLoading(true);
        setMutualMsg({ type: "", text: "" });
        try {
            for (const h of holdingsData) {
                const units = Number(h.units) || 0;
                const investedAmount = Number(h.investedAmount) || 0;
                await axios.put(`${API}/funds/holdings/${encodeURIComponent(holdingsUser.email)}`, {
                    fundCode: h.fundCode,
                    units,
                    investedAmount,
                });
            }
            setMutualMsg({ type: "success", text: "Holdings saved. User portfolio will show these units." });
            const usersRes = await axios.get(`${API}/funds/mutual-users-holdings`);
            setMutualUsersWithHoldings(usersRes.data);
            setTimeout(() => setShowHoldingsModal(false), 1500);
        } catch (err) {
            setMutualMsg({ type: "error", text: err.response?.data?.message || "Failed to save holdings" });
        } finally {
            setHoldingsLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-200 flex items-center justify-center">
                <div className="text-lg font-semibold text-gray-700">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-200 flex items-center justify-center">
                <div className="text-red-600 font-semibold">{error}</div>
            </div>
        );
    }

    const generalUsers = users.filter((u) => !u.isMutual);
    const mutualOnlyUsers = users.filter((u) => u.isMutual);

    return (
        <div className="min-h-screen bg-gray-200">
            <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-black to-gray-700 rounded-xl flex items-center justify-center shadow-lg">
                                <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-black">Admin Dashboard</h1>
                                <p className="text-gray-600 text-sm">
                                    {activeTab === "general" ? "User management & reports" : "Mutual funds"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            {activeTab === "general" && (
                                <button
                                    onClick={() => setShowUploadModal(true)}
                                    className="flex items-center space-x-2 bg-gray-700 text-white px-4 py-2.5 rounded-xl hover:bg-gray-600 transition-all"
                                >
                                    <Upload className="w-4 h-4" />
                                    <span className="font-semibold">Upload Report</span>
                                </button>
                            )}
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 bg-black text-white px-4 py-2.5 rounded-xl hover:bg-gray-800"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="font-semibold">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 border-t border-gray-100">
                    <div className="flex gap-1 pt-2">
                        <button
                            onClick={() => setActiveTab("general")}
                            className={`flex items-center gap-2 px-4 py-3 rounded-t-xl font-medium transition-colors ${
                                activeTab === "general"
                                    ? "bg-gray-200 text-black border-b-2 border-black"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-150"
                            }`}
                        >
                            <Users className="w-4 h-4" />
                            General accounts
                        </button>
                        <button
                            onClick={() => setActiveTab("mutual")}
                            className={`flex items-center gap-2 px-4 py-3 rounded-t-xl font-medium transition-colors ${
                                activeTab === "mutual"
                                    ? "bg-gray-200 text-black border-b-2 border-black"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-150"
                            }`}
                        >
                            <PieChart className="w-4 h-4" />
                            Mutual funds
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                {activeTab === "general" && (
                    <>
                        <div className="mb-4 flex flex-wrap gap-2 items-center">
                            <span className="text-gray-600 text-sm">
                                General accounts: {generalUsers.length}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {generalUsers.length === 0 ? (
                                <div className="col-span-full text-center text-gray-600 py-12">No general accounts. Edit a user and set account type to General.</div>
                            ) : (
                                generalUsers.map((user) => (
                                    <div
                                        key={user.email}
                                        className="bg-white p-5 rounded-2xl shadow-md cursor-pointer hover:shadow-lg transition-shadow border border-gray-100"
                                        onClick={() => handleCardClick(user)}
                                    >
                                        <h2 className="text-lg font-semibold text-black truncate">{user.email}</h2>
                                        <p className="text-gray-600 text-sm">
                                            <strong>Amount:</strong> PKR {user.amount}
                                        </p>
                                        <p className="text-gray-600 text-sm mt-1">
                                            <strong>Transactions:</strong> {user.transactions?.length ?? 0}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                )}

                {activeTab === "mutual" && (
                    <div className="space-y-8">
                        {mutualMsg.text && (
                            <div
                                className={`p-4 rounded-xl flex items-center gap-2 ${
                                    mutualMsg.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                                }`}
                            >
                                {mutualMsg.type === "success" ? (
                                    <CheckCircle className="w-5 h-5 shrink-0" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                )}
                                <span>{mutualMsg.text}</span>
                            </div>
                        )}

                        {fundsLoading ? (
                            <p className="text-gray-600">Loading funds...</p>
                        ) : (
                            <>
                                <section className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                        <h2 className="text-xl font-bold text-black">Funds</h2>
                                        <button
                                            onClick={() => setShowCreateFundModal(true)}
                                            className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-xl hover:bg-gray-800"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add fund
                                        </button>
                                    </div>
                                    {funds.length === 0 ? (
                                        <p className="text-gray-600">No funds. Create one to get started.</p>
                                    ) : (
                                        <ul className="space-y-2">
                                            {funds.map((f) => (
                                                <li
                                                    key={f._id}
                                                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                                                >
                                                    <span className="font-medium text-black">{f.code}</span>
                                                    <span className="text-gray-600 text-sm">{f.name} · {f.category}</span>
                                                    <span className="text-black font-semibold">
                                                        {f.latestNav != null ? `NAV ${Number(f.latestNav).toFixed(2)}` : "—"}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </section>

                                <section className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                        <h2 className="text-xl font-bold text-black">Upload NAVs (daily)</h2>
                                        <button
                                            onClick={() => {
                                                setNavForm({ date: new Date().toISOString().slice(0, 10) });
                                                setNavValues({});
                                                setShowNavModal(true);
                                            }}
                                            className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2.5 rounded-xl hover:bg-gray-700"
                                        >
                                            <TrendingUp className="w-4 h-4" />
                                            Upload NAVs
                                        </button>
                                    </div>
                                    <p className="text-gray-600 text-sm">
                                        Only funds you enter a value for will be updated; leave others blank. Portfolio snapshots for that day will be recalculated for all users with holdings.
                                    </p>
                                </section>

                                <section className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                                    <h2 className="text-xl font-bold text-black mb-4">Mutual fund users – units assigned &amp; assign holdings</h2>
                                    {mutualUsersWithHoldings.length === 0 ? (
                                        <p className="text-gray-600">No mutual fund users. Edit a user in General accounts and set account type to &quot;Mutual funds&quot;.</p>
                                    ) : (
                                        <ul className="space-y-3">
                                            {mutualUsersWithHoldings.map((u) => (
                                                <li
                                                    key={u.email}
                                                    className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-gray-100 last:border-0"
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-black">{u.email}</p>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {u.holdings?.length ? (
                                                                u.holdings.map((h) => `${h.fundCode}: ${Number(h.units).toLocaleString()} units`).join(" · ")
                                                            ) : (
                                                                "No units assigned yet"
                                                            )}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => openHoldingsModal({ email: u.email })}
                                                        className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 text-sm font-medium shrink-0"
                                                    >
                                                        <Wallet className="w-4 h-4" />
                                                        Assign / edit holdings
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </section>
                            </>
                        )}
                    </div>
                )}
            </div>

            {showModal && selectedUser && (
                <EditUserModal
                    user={selectedUser}
                    onClose={handleCloseModal}
                    onUpdate={handleUpdateUser}
                />
            )}

            {showUploadModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-black">Upload Quarter Report</h2>
                            <button onClick={handleCloseUploadModal} className="p-2 hover:bg-gray-100 rounded-lg" disabled={uploadLoading}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        {uploadError && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                                <p className="text-red-800 text-sm">{uploadError}</p>
                            </div>
                        )}
                        {uploadSuccess && (
                            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                                <p className="text-green-800 text-sm">{uploadSuccess}</p>
                            </div>
                        )}
                        <form onSubmit={handleUploadSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Quarter *</label>
                                <select
                                    value={uploadForm.quarter}
                                    onChange={(e) => setUploadForm({ ...uploadForm, quarter: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black"
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="Q1">Q1</option>
                                    <option value="Q2">Q2</option>
                                    <option value="Q3">Q3</option>
                                    <option value="Q4">Q4</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                                <input
                                    type="text"
                                    value={uploadForm.year}
                                    onChange={(e) => setUploadForm({ ...uploadForm, year: e.target.value })}
                                    placeholder="e.g. 2024"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                                <input
                                    type="text"
                                    value={uploadForm.title}
                                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                                    placeholder="e.g. Q1 FY24 Report"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">PDF *</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                                    <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" id="pdf-upload" />
                                    <label htmlFor="pdf-upload" className="cursor-pointer">
                                        {uploadForm.pdfFile ? (
                                            <div className="flex items-center justify-center gap-2 text-black">
                                                <FileText className="w-5 h-5" />
                                                <span>{uploadForm.pdfFile.name}</span>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                                                <p className="text-sm text-gray-600 mt-2">Click to upload PDF</p>
                                            </>
                                        )}
                                    </label>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button type="button" onClick={handleCloseUploadModal} className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold">
                                    Cancel
                                </button>
                                <button type="submit" disabled={uploadLoading} className="flex-1 py-3 bg-black text-white rounded-xl font-semibold disabled:opacity-50">
                                    {uploadLoading ? "Uploading..." : "Upload"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showCreateFundModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-black">Create fund</h2>
                            <button onClick={() => setShowCreateFundModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateFund} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Code *</label>
                                <input
                                    type="text"
                                    value={createFundForm.code}
                                    onChange={(e) => setCreateFundForm({ ...createFundForm, code: e.target.value })}
                                    placeholder="e.g. MH100"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                                <input
                                    type="text"
                                    value={createFundForm.name}
                                    onChange={(e) => setCreateFundForm({ ...createFundForm, name: e.target.value })}
                                    placeholder="e.g. MH100"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select
                                    value={createFundForm.category}
                                    onChange={(e) => setCreateFundForm({ ...createFundForm, category: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black"
                                >
                                    <option value="Equity">Equity</option>
                                    <option value="Balanced">Balanced</option>
                                    <option value="Islamic Equity">Islamic Equity</option>
                                    <option value="Money Market">Money Market</option>
                                </select>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button type="button" onClick={() => setShowCreateFundModal(false)} className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 py-3 bg-black text-white rounded-xl font-semibold">
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showNavModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-black">Upload NAVs</h2>
                            <button onClick={() => setShowNavModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleUploadNavs} className="space-y-4">
                            <p className="text-gray-600 text-sm">Only funds with a value are updated. Others are left unchanged.</p>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                                <input
                                    type="date"
                                    value={navForm.date}
                                    onChange={(e) => setNavForm({ ...navForm, date: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black"
                                    required
                                />
                            </div>
                            {funds.map((f) => (
                                <div key={f._id}>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">{f.code} NAV (leave blank to skip)</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={navValues[f.code] ?? ""}
                                        onChange={(e) => setNavValues((prev) => ({ ...prev, [f.code]: e.target.value }))}
                                        placeholder={f.latestNav != null ? `Current: ${Number(f.latestNav).toFixed(2)}` : "Enter NAV"}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black"
                                    />
                                </div>
                            ))}
                            <div className="flex gap-3 mt-6">
                                <button type="button" onClick={() => setShowNavModal(false)} className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 py-3 bg-black text-white rounded-xl font-semibold">
                                    Upload
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showHoldingsModal && holdingsUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-black">Holdings – {holdingsUser.email}</h2>
                            <button onClick={() => setShowHoldingsModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        {mutualMsg.text && (
                            <div className={`mb-4 p-3 rounded-xl text-sm ${mutualMsg.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
                                {mutualMsg.text}
                            </div>
                        )}
                        {holdingsLoading && holdingsData.length === 0 ? (
                            <p className="text-gray-600">Loading...</p>
                        ) : (
                            <form onSubmit={handleSaveHoldings} className="space-y-4">
                                {holdingsData.map((h) => (
                                    <div key={h.fundCode} className="border border-gray-200 rounded-xl p-4">
                                        <p className="font-semibold text-black mb-1">{h.fundName} ({h.fundCode})</p>
                                        {h.latestNav != null && <p className="text-xs text-gray-500 mb-3">NAV: {Number(h.latestNav).toFixed(2)} — enter one field to auto-fill the other</p>}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs text-gray-600 mb-1">Units</label>
                                                <input
                                                    type="number"
                                                    step="any"
                                                    value={h.units}
                                                    onChange={(e) => setHoldingField(h.fundCode, "units", e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-600 mb-1">Invested (PKR)</label>
                                                <input
                                                    type="number"
                                                    step="any"
                                                    value={h.investedAmount}
                                                    onChange={(e) => setHoldingField(h.fundCode, "investedAmount", e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="flex gap-3 mt-6">
                                    <button type="button" onClick={() => setShowHoldingsModal(false)} className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={holdingsLoading} className="flex-1 py-3 bg-black text-white rounded-xl font-semibold disabled:opacity-50">
                                        {holdingsLoading ? "Saving..." : "Save holdings"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
