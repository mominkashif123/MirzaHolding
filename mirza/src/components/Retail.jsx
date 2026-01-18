import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { ShoppingCart, Users } from "lucide-react";

const ServiceCard = ({ name, description, icon: IconComponent, index }) => {
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsInView(true), index * 200);
        return () => clearTimeout(timer);
    }, [index]);

    return (
        <div 
            className={`group relative bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-xl p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-gray-200/50 overflow-hidden h-full
            ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-gray-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                    <div className="p-5 bg-gradient-to-br from-black to-gray-800 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:rotate-3">
                        <IconComponent className="w-10 h-10 text-white" />
                    </div>
                </div>
                
                <h3 className="text-3xl font-bold text-black mb-6 group-hover:text-gray-800 transition-colors duration-300">
                    {name}
                </h3>
                
                <p className="text-gray-700 text-lg leading-relaxed flex-grow group-hover:text-gray-800 transition-colors duration-300">
                    {description}
                </p>
                
                <div className="mt-8 flex items-center text-black/60 group-hover:text-black transition-colors duration-300">
                    {/* <Star className="w-5 h-5 mr-2" /> */}
                    {/* <span className="text-sm font-medium">Consumer Solution</span> */}
                </div>
            </div>
        </div>
    );
};

const RetailServices = () => {
    const [headerInView, setHeaderInView] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setHeaderInView(true), 300);
        return () => clearTimeout(timer);
    }, []);

    const retailData = [
        {
            name: "Buy Now Pay Later (BNPL)",
            description: "Shop now and pay in convenient installments without any interest charges. Our BNPL service makes purchases more accessible and manageable, allowing you to enjoy products and services immediately while spreading the cost over time.",
            icon: ShoppingCart
        },
        {
            name: "Peer-to-Peer (P2P)",
            description: "Connect directly with other individuals for lending and borrowing opportunities. Our P2P platform facilitates secure transactions between peers, offering competitive rates and flexible terms for both lenders and borrowers.",
            icon: Users
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            <Navbar />
            
            {/* Hero Section */}
            <div className="relative min-h-screen pt-[10vh] overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute inset-0">
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-3 h-3 bg-black/10 rounded-full animate-pulse"
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
                            <ShoppingCart className="w-5 h-5 text-black" />
                            <span className="text-black font-semibold">Retail Division</span>
                        </div>
                        
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 font-playfair bg-gradient-to-r from-black via-gray-700 to-black bg-clip-text text-transparent">
                            RETAIL SERVICES
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-light">
                            Consumer-focused financial solutions that make everyday transactions easier and more accessible
                        </p>
                    </div>

                    {/* Services Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                        {retailData.map((service, index) => (
                            <ServiceCard
                                key={index}
                                name={service.name}
                                description={service.description}
                                icon={service.icon}
                                index={index}
                            />
                        ))}
                    </div>

                    {/* Bottom CTA Section */}
                    <div className="text-center">
                        <div className="bg-gradient-to-r from-black to-gray-800 text-white px-12 py-8 rounded-3xl shadow-2xl max-w-4xl mx-auto">
                            <h2 className="text-2xl md:text-3xl font-bold mb-4 font-playfair">
                                Experience the Future of Retail Finance
                            </h2>
                            <p className="text-lg text-gray-200 mb-6">
                                Join thousands of satisfied customers who trust our innovative retail financial solutions
                            </p>
                            <button className="bg-white text-black px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300 transform hover:scale-105 shadow-lg">
                                Explore Services
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RetailServices;