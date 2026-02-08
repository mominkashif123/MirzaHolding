
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { TrendingUp, FileText, Users, BarChart3, DollarSign, PieChart, Download } from 'lucide-react';

const FinancialOverview = () => {
    const [isInView, setIsInView] = useState(false);
    const [ref, setRef] = useState(null);
    const [reports, setReports] = useState([]);
    const [loadingReports, setLoadingReports] = useState(true);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                }
            },
            { threshold: 0.2 }
        );

        if (ref) {
            observer.observe(ref);
        }

        return () => {
            if (ref) {
                observer.unobserve(ref);
            }
        };
    }, [ref]);

    // Fetch quarter reports from API
    useEffect(() => {
        const fetchQuarterReports = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/quarterreports');
                // const response = await axios.get('https://mirza-holding.onrender.com/api/quarterreports');
                setReports(response.data);
                setLoadingReports(false);
            } catch (error) {
                setLoadingReports(false);
            }
        };

        fetchQuarterReports();
    }, []);

    // Handle PDF download
    const handleDownloadPDF = async (quarter) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/quarterreports/${quarter}`, {
            // const response = await axios.get(`https://mirza-holding.onrender.com/api/quarterreports/${quarter}`, {
                responseType: 'blob'
            });
            
            // Create blob URL and trigger download
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            
            // Find the report to get proper filename
            const report = reports.find(r => r.quarter === quarter);
            const filename = report ? `${report.quarter}_FY${report.year}.pdf` : `${quarter}_Report.pdf`;
            
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert('Failed to download PDF. Please try again.');
        }
    };

    const stats = [
        { 
            title: "Assets under management", 
            value: "720,000PKR", 
            icon: <DollarSign className="w-8 h-8" />,
            growth: "+15.2%",
            description: "Total managed assets"
        },
        { 
            title: "Revenue for Q4 FY24", 
            value: "339,370PKR", 
            icon: <BarChart3 className="w-8 h-8" />,
            growth: "+8.7%",
            description: "Quarterly revenue"
        },
        { 
            title: "Investor benchmark Q4", 
            value: "15.5%", 
            icon: <TrendingUp className="w-8 h-8" />,
            growth: "+2.1%",
            description: "Performance benchmark"
        }
    ];

    const pressReleases = [
        { title: "Annual Year Report 2021", date: "Dec 2021", category: "Annual" },
        { title: "Annual Year Report 2022", date: "Dec 2022", category: "Annual" }, 
        { title: "Annual Year Report 2023", date: "Dec 2023", category: "Annual" }
    ];

    const letters = [
        { title: "Q2 FY24 Letter to Shareholders", date: "Apr 2024", author: "Chairman & CEO" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
            <Navbar />
            
            {/* Hero Stats Section */}
            <div className="relative bg-gradient-to-br from-black via-gray-900 to-gray-800 pt-[10vh] py-20 overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute inset-0">
                    {[...Array(40)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 6}s`,
                                animationDuration: `${6 + Math.random() * 4}s`
                            }}
                        />
                    ))}
                </div>

                {/* Grid pattern overlay */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }}></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center space-x-2 px-6 py-3 bg-white/10 rounded-full mb-8 backdrop-blur-sm">
                            <PieChart className="w-5 h-5 text-white" />
                            <span className="text-white font-semibold">Financial Performance</span>
                        </div>
                        
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white text-center mb-8 font-playfair">
                            Financial <span className="text-gray-300">Overview</span>
                        </h1>
                        
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Comprehensive insights into our financial performance and growth trajectory
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {stats.map((stat, index) => (
                            <div 
                                key={stat.title}
                                className="group bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-center hover:bg-white/15 transition-all duration-500 hover-lift relative overflow-hidden"
                                style={{ animationDelay: `${index * 0.2}s` }}
                            >
                                {/* Background glow effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                
                                <div className="relative z-10">
                                    <div className="flex justify-center mb-6">
                                        <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                                            <div className="text-white">
                                                {stat.icon}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <h2 className="text-lg font-semibold text-white mb-4 leading-tight">{stat.title}</h2>
                                    
                                    <div className="mb-4">
                                        <p className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</p>
                                        <div className="flex items-center justify-center space-x-2">
                                            <span className="text-sm text-green-400 font-semibold">{stat.growth}</span>
                                            <TrendingUp className="w-4 h-4 text-green-400" />
                                        </div>
                                    </div>
                                    
                                    <p className="text-gray-300 text-sm">{stat.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Information Section */}
            <div 
                ref={setRef}
                className="bg-white/80 backdrop-blur-lg py-20 relative"
            >
                {/* Glass morphism background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-gray-100/20 backdrop-blur-xl"></div>
                
                <div className="relative z-10 max-w-7xl mx-auto px-4">
                    <div className={`text-center mb-16 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <h2 className="text-4xl md:text-5xl font-bold text-black font-playfair mb-4">
                            Financial <span className="text-gray-600">Resources</span>
                        </h2>
                        <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                            Access our comprehensive financial reports and investor communications
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        
                        {/* Investor Relations */}
                        <div className={`transition-all duration-1000 delay-200 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-black to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                    <FileText className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-black font-playfair">Investor Relations</h3>
                                <p className="text-gray-600 mb-6">Quarterly reports and financial statements</p>
                            </div>
                            
                            <div className="space-y-4">
                                {loadingReports ? (
                                    <div className="text-center py-8 text-gray-600">Loading reports...</div>
                                ) : reports.length === 0 ? (
                                    <div className="text-center py-8 text-gray-600">No reports available</div>
                                ) : (
                                    reports.map((report) => (
                                        <div 
                                            key={report.quarter}
                                            onClick={() => handleDownloadPDF(report.quarter)}
                                            className="group bg-white/70 backdrop-blur-lg rounded-xl p-4 hover:bg-white/90 transition-all duration-300 hover-lift border border-gray-200/50 cursor-pointer"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-black group-hover:text-gray-800 transition-colors">
                                                        {report.title}
                                                    </h4>
                                                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                                        {report.size && <span>{report.size}</span>}
                                                    </div>
                                                </div>
                                                <Download className="w-5 h-5 text-gray-600 group-hover:text-black transition-colors" />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Press Releases */}
                        <div className={`transition-all duration-1000 delay-400 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-black to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                    <BarChart3 className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-black font-playfair">Press Releases</h3>
                                <p className="text-gray-600 mb-6">Annual reports and company announcements</p>
                            </div>
                            
                            <div className="space-y-4">
                                {pressReleases.map((release, index) => (
                                    <div 
                                        key={index}
                                        className="bg-white/70 backdrop-blur-lg rounded-xl p-4 hover:bg-white/90 transition-all duration-300 hover-lift border border-gray-200/50"
                                    >
                                        <h4 className="font-semibold text-black mb-1">{release.title}</h4>
                                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                                            <span>{release.date}</span>
                                            <span className="px-2 py-1 bg-gray-200 rounded-full text-xs">{release.category}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Letter to Investors */}
                        <div className={`transition-all duration-1000 delay-600 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-black to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                    <Users className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-black font-playfair">Letter to Investors</h3>
                                <p className="text-gray-600 mb-6">Direct communications from leadership</p>
                            </div>
                            
                            <div className="space-y-4">
                                {letters.map((letter, index) => (
                                    <div 
                                        key={index}
                                        className="bg-white/70 backdrop-blur-lg rounded-xl p-6 hover:bg-white/90 transition-all duration-300 hover-lift border border-gray-200/50"
                                    >
                                        <h4 className="font-semibold text-black mb-2">{letter.title}</h4>
                                        <div className="space-y-2 text-sm text-gray-600">
                                            <div className="flex items-center space-x-2">
                                                <span>📅</span>
                                                <span>{letter.date}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span>✍️</span>
                                                <span>{letter.author}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinancialOverview;
