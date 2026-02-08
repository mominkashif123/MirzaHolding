import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { PieChart, BarChart3, Wallet, TrendingUp, TrendingDown } from "lucide-react";

const formatPKR = (n) => `PKR ${Number(n).toLocaleString("en-PK", { minimumFractionDigits: 2 })}`;
const formatPercent = (n) => `${Number(n) >= 0 ? "+" : ""}${Number(n).toFixed(2)}%`;

const CATEGORY_COLORS = [
    { color: "#1f2937", colorClass: "bg-gray-800" },
    { color: "#4b5563", colorClass: "bg-gray-600" },
    { color: "#6b7280", colorClass: "bg-gray-500" },
    { color: "#9ca3af", colorClass: "bg-gray-400" },
];

const FundsDashboard = () => {
    const [activeTab, setActiveTab] = useState("overview");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const useremail = sessionStorage.getItem("user");

    useEffect(() => {
        if (!useremail) return;
        const fetchData = async () => {
            try {
                setError(null);
                const res = await axios.get(
                    `http://localhost:5000/api/portfolio-summary?email=${encodeURIComponent(useremail)}`
                );
                setData(res.data);
            } catch (err) {
                setError(err.response?.data?.message || err.message || "Failed to load portfolio");
                setData(null);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [useremail]);

    const tabs = [
        { id: "overview", label: "Overview", icon: BarChart3 },
        { id: "holdings", label: "Holdings", icon: PieChart },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
                <Navbar />
                <div className="pt-[10vh] flex items-center justify-center min-h-[60vh]">
                    <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-12 shadow-2xl text-center border border-gray-200">
                        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-gray-700 font-semibold">Loading your portfolio...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
                <Navbar />
                <div className="pt-[10vh] flex items-center justify-center min-h-[60vh]">
                    <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl text-center border border-gray-200 max-w-md">
                        <p className="text-red-600 font-semibold mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const holdings = data?.holdings ?? [];
    const totalValue = Number(data?.totalValue ?? 0);
    const investedAmount = Number(data?.investedAmount ?? 0);
    const absoluteGain = Number(data?.absoluteGain ?? 0);
    const absoluteGainPercent = Number(data?.absoluteGainPercent ?? 0);
    const changeVsYesterdayPercent = Number(data?.changeVsYesterdayPercent ?? 0);

    const allocationByCategory = holdings.reduce((acc, h) => {
        const cat = h.fund?.category || "Other";
        if (!acc[cat]) acc[cat] = 0;
        acc[cat] += Number(h.currentValue ?? 0);
        return acc;
    }, {});
    const totalAlloc = Object.values(allocationByCategory).reduce((s, v) => s + v, 0);
    const allocationList = Object.entries(allocationByCategory).map(([label, value], i) => ({
        label,
        value: totalAlloc > 0 ? (value / totalAlloc) * 100 : 0,
        ...CATEGORY_COLORS[i % CATEGORY_COLORS.length],
    }));

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
            <Navbar />

            <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40 pt-[10vh]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-black to-gray-700 rounded-xl flex items-center justify-center shadow-lg">
                                <Wallet className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-black font-playfair">Mutual Funds Dashboard</h1>
                                <p className="text-gray-600 text-sm">{useremail}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <nav className="flex flex-wrap gap-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center space-x-2 py-3 px-4 rounded-xl border-b-2 transition-all duration-300 ${
                                    activeTab === tab.id
                                        ? "border-black text-black font-semibold bg-white/80"
                                        : "border-transparent text-gray-600 hover:text-black hover:bg-white/50"
                                }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {activeTab === "overview" && (
                    <div className="space-y-8">
                        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-200/50">
                            <h2 className="text-xl font-bold text-black font-playfair mb-6">Portfolio Summary</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                    <p className="text-gray-600 text-sm font-medium mb-1">Total Portfolio Value</p>
                                    <p className="text-2xl font-bold text-black">{formatPKR(totalValue)}</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                    <p className="text-gray-600 text-sm font-medium mb-1">Invested Amount</p>
                                    <p className="text-2xl font-bold text-black">{formatPKR(investedAmount)}</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                    <p className="text-gray-600 text-sm font-medium mb-1">Absolute Gain / Loss</p>
                                    <p className={`text-2xl font-bold ${absoluteGain >= 0 ? "text-black" : "text-red-600"}`}>{formatPKR(absoluteGain)}</p>
                                    <p className={`text-sm font-semibold ${absoluteGainPercent >= 0 ? "text-green-600" : "text-red-600"}`}>{formatPercent(absoluteGainPercent)}</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                    <p className="text-gray-600 text-sm font-medium mb-1">Vs previous day</p>
                                    <div className="flex items-center gap-1">
                                        {changeVsYesterdayPercent >= 0 ? (
                                            <TrendingUp className="w-5 h-5 text-green-600" />
                                        ) : (
                                            <TrendingDown className="w-5 h-5 text-red-600" />
                                        )}
                                        <span className={changeVsYesterdayPercent >= 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                                            {formatPercent(changeVsYesterdayPercent)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {allocationList.length > 0 && (
                            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-200/50">
                                <h2 className="text-xl font-bold text-black font-playfair mb-6">Asset Allocation</h2>
                                <div className="flex flex-col lg:flex-row gap-8 items-center">
                                    <div
                                        className="w-56 h-56 rounded-full border-8 border-gray-100 flex items-center justify-center relative overflow-hidden"
                                        style={{
                                            background: `conic-gradient(${allocationList.map((a, i) => {
                                                const start = i === 0 ? 0 : allocationList.slice(0, i).reduce((s, x) => s + x.value, 0);
                                                const end = start + a.value;
                                                return `${a.color} ${start}% ${end}%`;
                                            }).join(", ")})`,
                                        }}
                                    >
                                        <div className="w-32 h-32 rounded-full bg-white border-4 border-gray-100 flex items-center justify-center">
                                            <span className="text-lg font-bold text-black">100%</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 grid grid-cols-2 gap-4">
                                        {allocationList.map((item) => (
                                            <div key={item.label} className="flex items-center gap-3">
                                                <div className={`w-4 h-4 rounded ${item.colorClass}`} style={{ backgroundColor: item.color }} />
                                                <div>
                                                    <p className="font-semibold text-black">{item.label}</p>
                                                    <p className="text-gray-600 text-sm">{item.value.toFixed(1)}%</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-200/50">
                            <h2 className="text-xl font-bold text-black font-playfair mb-4">Units Held</h2>
                            {holdings.length === 0 ? (
                                <p className="text-gray-600 py-4">No holdings yet. Admin will assign units to your account.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="py-3 font-semibold text-gray-700">Fund</th>
                                                <th className="py-3 font-semibold text-gray-700">Units</th>
                                                <th className="py-3 font-semibold text-gray-700">NAV</th>
                                                <th className="py-3 font-semibold text-gray-700">Current Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {holdings.map((h) => (
                                                <tr key={h.fund?.code || h.fund?._id} className="border-b border-gray-100">
                                                    <td className="py-3 font-medium text-black">{h.fund?.name || h.fund?.code}</td>
                                                    <td className="py-3 text-gray-700">{Number(h.units).toLocaleString()}</td>
                                                    <td className="py-3 text-gray-700">{Number(h.nav).toFixed(2)}</td>
                                                    <td className="py-3 font-semibold text-black">{formatPKR(h.currentValue)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === "holdings" && (
                    <div className="space-y-6">
                        {holdings.length === 0 ? (
                            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-200/50">
                                <p className="text-gray-600">No holdings yet. Admin will assign units to your account.</p>
                            </div>
                        ) : (
                            holdings.map((h) => (
                                <div key={h.fund?.code || h.fund?._id} className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-200/50">
                                    <div className="flex flex-wrap justify-between items-start gap-4">
                                        <h3 className="text-lg font-bold text-black font-playfair">{h.fund?.name || h.fund?.code}</h3>
                                        <div className="flex gap-4 text-sm">
                                            <span className="text-gray-600">Units: <strong className="text-black">{Number(h.units).toLocaleString()}</strong></span>
                                            <span className="text-gray-600">NAV: <strong className="text-black">{Number(h.nav).toFixed(2)}</strong></span>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-6 text-sm">
                                        <span className="text-gray-600">Invested: <strong className="text-black">{formatPKR(h.investedAmount)}</strong></span>
                                        <span className="text-gray-600">Current value: <strong className="text-black">{formatPKR(h.currentValue)}</strong></span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FundsDashboard;
