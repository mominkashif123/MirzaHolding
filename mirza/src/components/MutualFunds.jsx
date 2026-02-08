import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import FundDetailModal from './FundDetailModal';
import { PieChart, Wallet, TrendingUp, Landmark, ChevronRight, ArrowRight, LogIn } from 'lucide-react';

// Fund data - placeholder content; update with actual details when provided
const FUNDS_DATA = [
    {
        id: 'MH100',
        name: 'MH100',
        shortName: 'Mirza Holding 100 Index Fund',
        description: 'MH100 is an open-ended equity fund designed to track market performance. It offers investors exposure to a diversified portfolio of top-performing stocks with the potential for long-term growth.',
        icon: TrendingUp,
        basicFacts: [
            { label: 'Launch Date', value: 'TBD' },
            { label: 'Fund Type', value: 'Open-ended' },
            { label: 'Fund Category', value: 'Equity Fund' },
            { label: 'Fund Manager', value: 'TBD' },
            { label: 'Management Fee', value: 'TBD' },
            { label: 'Benchmark', value: 'TBD' },
            { label: 'Dealing Days', value: 'Monday to Friday' },
        ],
    },
    {
        id: 'MDYF',
        name: 'MDYF',
        shortName: 'Mirza Holding Diversified Yield Fund',
        description: 'MDYF is a balanced fund aimed at providing steady returns through a mix of equity and fixed income investments. Suitable for investors seeking a balanced risk-return profile.',
        icon: PieChart,
        basicFacts: [
            { label: 'Launch Date', value: 'TBD' },
            { label: 'Fund Type', value: 'Open-ended' },
            { label: 'Fund Category', value: 'Balanced Fund' },
            { label: 'Fund Manager', value: 'TBD' },
            { label: 'Management Fee', value: 'TBD' },
            { label: 'Benchmark', value: 'TBD' },
            { label: 'Dealing Days', value: 'Monday to Friday' },
        ],
    },
    {
        id: 'MIEF',
        name: 'MIEF',
        shortName: 'Mirza Holding Islamic Equity Fund',
        description: 'MIEF is a Shariah-compliant equity fund investing in accordance with Islamic principles. It offers halal investment opportunities with professional fund management.',
        icon: Landmark,
        basicFacts: [
            { label: 'Launch Date', value: 'TBD' },
            { label: 'Fund Type', value: 'Open-ended' },
            { label: 'Fund Category', value: 'Islamic Equity Fund' },
            { label: 'Fund Manager', value: 'TBD' },
            { label: 'Management Fee', value: 'TBD' },
            { label: 'Benchmark', value: 'TBD' },
            { label: 'Dealing Days', value: 'Monday to Friday' },
        ],
    },
    {
        id: 'MXMF',
        name: 'MXMF',
        shortName: 'Mirza Holding Money Market Fund',
        description: 'MXMF is a low-risk money market fund offering liquidity and stability. Ideal for conservative investors seeking capital preservation with modest returns.',
        icon: Wallet,
        basicFacts: [
            { label: 'Launch Date', value: 'TBD' },
            { label: 'Fund Type', value: 'Open-ended' },
            { label: 'Fund Category', value: 'Money Market Fund' },
            { label: 'Fund Manager', value: 'TBD' },
            { label: 'Management Fee', value: 'TBD' },
            { label: 'Benchmark', value: 'TBD' },
            { label: 'Dealing Days', value: 'Monday to Friday' },
        ],
    },
];

const FundCard = ({ fund, index, onClick }) => {
    const [isInView, setIsInView] = useState(false);
    const IconComponent = fund.icon;

    useEffect(() => {
        const timer = setTimeout(() => setIsInView(true), index * 100);
        return () => clearTimeout(timer);
    }, [index]);

    return (
        <div
            className={`group relative bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-xl p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] border border-gray-200/50 overflow-hidden h-full flex flex-col cursor-pointer
            ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            onClick={onClick}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-gray-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-gradient-to-br from-black to-gray-800 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                        <IconComponent className="w-8 h-8 text-white" />
                    </div>
                </div>
                <h3 className="text-2xl font-bold text-black mb-3 text-center font-playfair group-hover:text-gray-800 transition-colors">
                    {fund.name}
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed flex-grow line-clamp-4">
                    {fund.description}
                </p>
                <button className="mt-6 flex items-center justify-center mx-auto px-6 py-2.5 border-2 border-black text-black rounded-xl font-semibold hover:bg-black hover:text-white transition-all duration-300 group/btn">
                    Read More
                    <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

const MutualFunds = () => {
    const [headerInView, setHeaderInView] = useState(false);
    const [selectedFund, setSelectedFund] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => setHeaderInView(true), 300);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
            <Navbar />

            <div className="relative min-h-screen pt-[10vh] overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute inset-0">
                    {[...Array(15)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 bg-black/10 rounded-full animate-float"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                animationDuration: `${2 + Math.random() * 2}s`
                            }}
                        />
                    ))}
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
                    {/* Header Section */}
                    <div className={`text-center mb-16 transition-all duration-1000 ${headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="inline-flex items-center space-x-2 px-6 py-3 bg-black/10 rounded-full mb-8 backdrop-blur-sm">
                            <PieChart className="w-5 h-5 text-black" />
                            <span className="text-black font-semibold">Investment Products</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 font-playfair bg-gradient-to-r from-black via-gray-700 to-black bg-clip-text text-transparent">
                            Our Mutual Funds
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-light">
                            Explore our range of mutual funds designed to meet diverse investment goals
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className={`flex flex-wrap justify-center gap-4 mb-12 transition-all duration-1000 delay-200 ${headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <Link
                            to="/contact"
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-black to-gray-800 text-white font-semibold rounded-xl hover:from-gray-800 hover:to-black transform hover:scale-105 transition-all duration-300 shadow-lg"
                        >
                            Invest Now
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                        <Link
                            to="/login"
                            className="inline-flex items-center px-6 py-3 border-2 border-black text-black font-semibold rounded-xl hover:bg-black hover:text-white transition-all duration-300"
                        >
                            <LogIn className="w-4 h-4 mr-2" />
                            Login
                        </Link>
                    </div>

                    {/* Funds Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                        {FUNDS_DATA.map((fund, index) => (
                            <FundCard
                                key={fund.id}
                                fund={fund}
                                index={index}
                                onClick={() => setSelectedFund(fund)}
                            />
                        ))}
                    </div>

                    {/* Bottom CTA */}
                    <div className={`text-center transition-all duration-1000 delay-300 ${headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="bg-gradient-to-r from-black to-gray-800 text-white px-12 py-8 rounded-3xl shadow-2xl max-w-4xl mx-auto">
                            <h2 className="text-2xl md:text-3xl font-bold mb-4 font-playfair">
                                Ready to Invest?
                            </h2>
                            <p className="text-lg text-gray-200 mb-6">
                                Connect with our team to start your investment journey
                            </p>
                            <Link to="/contact">
                                <button className="bg-white text-black px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300 transform hover:scale-105 shadow-lg">
                                    Contact Us
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {selectedFund && (
                <FundDetailModal
                    fund={selectedFund}
                    onClose={() => setSelectedFund(null)}
                />
            )}
        </div>
    );
};

export default MutualFunds;
