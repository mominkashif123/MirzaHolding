import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { TrendingUp, PiggyBank, DollarSign, PieChart } from "lucide-react";

const ServiceCard = ({ name, description, icon: IconComponent, index, to }) => {
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsInView(true), index * 100);
        return () => clearTimeout(timer);
    }, [index]);

    const cardClassName = `group relative bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-xl p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-gray-200/50 overflow-hidden h-full
            ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${to ? 'cursor-pointer' : ''}`;

    const cardContent = (
        <>
            <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-gray-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                    <div className="p-4 bg-gradient-to-br from-black to-gray-800 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:rotate-3">
                        <IconComponent className="w-8 h-8 text-white" />
                    </div>
                </div>
                <h3 className="text-2xl font-bold text-black mb-4 group-hover:text-gray-800 transition-colors duration-300">
                    {name}
                </h3>
                <p className="text-gray-700 text-base leading-relaxed flex-grow group-hover:text-gray-800 transition-colors duration-300">
                    {description}
                </p>
                <div className="mt-6 flex items-center text-black/60 group-hover:text-black transition-colors duration-300" />
            </div>
        </>
    );

    if (to) {
        return (
            <Link to={to} className="block h-full">
                <div className={cardClassName}>{cardContent}</div>
            </Link>
        );
    }

    return <div className={cardClassName}>{cardContent}</div>;
};

const PrivateServices = () => {
    const [headerInView, setHeaderInView] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setHeaderInView(true), 300);
        return () => clearTimeout(timer);
    }, []);

    const privateData = [
        {
            name: "Savings Committee",
            description: "Join our community-based savings committee that helps you build wealth through structured savings plans. Our committee offers a reliable way to save money while connecting with like-minded individuals focused on financial growth.",
            icon: PiggyBank
        },
        {
            name: "Trading Account",
            description: "Access professional trading accounts with advanced tools and analytics. Trade in multiple financial markets with our expert guidance and proven strategies to maximize your investment returns.",
            icon: TrendingUp
        },
        {
            name: "Mutual Funds",
            description: "Diversify your portfolio with our carefully curated mutual fund options. Our investment experts manage diversified portfolios designed to provide steady returns while minimizing risk through professional fund management.",
            icon: PieChart,
            to: "/funds"
        },
        {
            name: "Wealth Management",
            description: "Comprehensive wealth management services tailored to your financial goals. Our advisors create personalized strategies for asset allocation, tax optimization, and long-term wealth preservation and growth.",
            icon: DollarSign
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            <Navbar />
            
            {/* Hero Section */}
            <div className="relative min-h-screen pt-[10vh] overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute inset-0">
                    {[...Array(15)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 bg-black/10 rounded-full animate-pulse"
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
                    <div className={`text-center mb-20 transition-all duration-1000 ${headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="inline-flex items-center space-x-2 px-6 py-3 bg-black/10 rounded-full mb-8 backdrop-blur-sm">
                            <DollarSign className="w-5 h-5 text-black" />
                            <span className="text-black font-semibold">Private Division</span>
                        </div>
                        
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 font-playfair bg-gradient-to-r from-black via-gray-700 to-black bg-clip-text text-transparent">
                            PRIVATE SERVICES
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-light">
                            Personalized financial solutions designed for individual wealth building and investment growth
                        </p>
                    </div>

                    {/* Services Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                        {privateData.map((service, index) => (
                            <ServiceCard
                                key={index}
                                name={service.name}
                                description={service.description}
                                icon={service.icon}
                                index={index}
                                to={service.to}
                            />
                        ))}
                    </div>

                    {/* Bottom CTA Section */}
                    <div className="text-center">
                        <div className="bg-gradient-to-r from-black to-gray-800 text-white px-12 py-8 rounded-3xl shadow-2xl max-w-4xl mx-auto">
                            <h2 className="text-2xl md:text-3xl font-bold mb-4 font-playfair">
                                Ready to Grow Your Wealth?
                            </h2>
                            <p className="text-lg text-gray-200 mb-6">
                                Let our private banking experts create a personalized financial strategy for you
                            </p>
                            <button className="bg-white text-black px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300 transform hover:scale-105 shadow-lg">
                                Get Started Today
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivateServices;