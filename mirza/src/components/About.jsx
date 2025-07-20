
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Target, Award, Users, TrendingUp, Building, CreditCard, Briefcase } from "lucide-react";

const AboutUs = () => {
    const [isInView, setIsInView] = useState(false);
    const [ref, setRef] = useState(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                }
            },
            { threshold: 0.3 }
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

    const stats = [
        { icon: <Award className="w-6 h-6 sm:w-8 sm:h-8" />, label: "Excellence", value: "Since 2020" },
        { icon: <Users className="w-6 h-6 sm:w-8 sm:h-8" />, label: "Clients", value: "100+" },
        { icon: <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8" />, label: "Growth", value: "100%" },
        { icon: <Target className="w-6 h-6 sm:w-8 sm:h-8" />, label: "Success", value: "Proven" }
    ];

    const services = [
        {
            icon: <CreditCard className="w-8 h-8 sm:w-10 sm:h-10" />,
            title: "Retail Services",
            description: "Financial solutions for everyday consumers and individual investors"
        },
        {
            icon: <Building className="w-8 h-8 sm:w-10 sm:h-10" />,
            title: "Corporate Services", 
            description: "Comprehensive business financing and investment solutions for companies"
        },
        {
            icon: <Briefcase className="w-8 h-8 sm:w-10 sm:h-10" />,
            title: "Private Services",
            description: "Exclusive wealth management and investment opportunities for high-net-worth individuals"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
            <Navbar />
            
            {/* Hero Section - Scrollable with proper coverage */}
            <div className="relative min-h-screen pt-[10vh]">
                {/* Background decorative elements */}
                <div className="absolute inset-0">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 bg-black/10 rounded-full animate-pulse"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${5 + Math.random() * 3}s`
                            }}
                        />
                    ))}
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row min-h-[90vh]">
                    {/* Left side - Services section with proper height coverage */}
                    <div className="w-full lg:w-1/3 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 relative min-h-[50vh] lg:min-h-[90vh] flex flex-col justify-between p-6 sm:p-8 lg:p-10">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        
                        {/* Main content area */}
                        <div className="relative z-10 text-white w-full max-w-md mx-auto flex-1 flex flex-col justify-center py-8">
                            <div className="text-center mb-8 sm:mb-10">
                                <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 font-playfair text-white">Our Services</h3>
                                <p className="text-gray-300 text-base sm:text-lg">Three divisions serving all your financial needs</p>
                            </div>
                            
                            <div className="space-y-6 sm:space-y-8">
                                {services.map((service, index) => (
                                    <div 
                                        key={index}
                                        className="bg-white/10 backdrop-blur-lg rounded-xl p-6 sm:p-8 hover:bg-white/20 transition-all duration-300 border border-white/20"
                                        style={{ animationDelay: `${index * 0.2}s` }}
                                    >
                                        <div className="flex items-center mb-4 sm:mb-5">
                                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex items-center justify-center text-white mr-4 sm:mr-5">
                                                {service.icon}
                                            </div>
                                            <div>
                                                <h4 className="text-lg sm:text-xl font-semibold text-white">{service.title}</h4>
                                            </div>
                                        </div>
                                        <p className="text-sm sm:text-base text-gray-300 leading-relaxed">{service.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {/* Bottom vision section */}
                        <div className="relative z-10 mt-8">
                            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 sm:p-8 border border-white/20 text-center">
                                <div className="flex items-center justify-center mb-4">
                                    <Target className="w-6 h-6 text-white mr-3" />
                                    <h4 className="text-lg sm:text-xl font-semibold text-white">Our Vision</h4>
                                </div>
                                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                                    Leading Pakistan's financial transformation through innovation.
                                </p>
                            </div>
                        </div>
                        
                        {/* Floating elements */}
                        <div className="absolute top-10 left-10 w-16 h-16 sm:w-20 sm:h-20 bg-white/5 rounded-full backdrop-blur-sm animate-pulse"></div>
                        <div className="absolute bottom-10 right-10 w-12 h-12 sm:w-16 sm:h-16 bg-white/5 rounded-full backdrop-blur-sm animate-pulse" style={{ animationDelay: '1s' }}></div>
                        <div className="absolute top-1/2 right-5 w-10 h-10 sm:w-12 sm:h-12 bg-white/5 rounded-full backdrop-blur-sm animate-pulse" style={{ animationDelay: '2s' }}></div>
                    </div>

                    {/* Right side - Content */}
                    <div 
                        ref={setRef}
                        className="w-full lg:w-2/3 bg-white/80 backdrop-blur-lg text-black flex flex-col items-center justify-center px-6 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20 relative min-h-[50vh] lg:min-h-[90vh]"
                    >
                        {/* Glass morphism background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-gray-100/30 backdrop-blur-xl"></div>
                        
                        <div className={`relative z-10 text-center max-w-5xl transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <div className="mb-12 sm:mb-16">
                                <div className="inline-flex items-center space-x-3 px-6 py-3 sm:px-8 sm:py-4 bg-black/10 rounded-full mb-8 sm:mb-10 backdrop-blur-sm">
                                    <Award className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                                    <span className="text-black font-semibold text-base sm:text-lg">About Mirza Holding</span>
                                </div>
                                
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold mb-6 sm:mb-8 font-playfair bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
                                    WHAT WE DO
                                </h1>
                                
                                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold mb-8 sm:mb-10 text-gray-700 max-w-4xl mx-auto leading-relaxed px-4">
                                    A company built to redefine the financial landscape of Pakistan
                                </h2>
                            </div>
                            
                            <div className="mb-12 sm:mb-16">
                                <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-gray-200/50">
                                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-justify text-gray-800 leading-relaxed font-light">
                                        Mirza Holding launched in 2020 is a financial institute specialising in asset and wealth management. From local investments and businesses to financing global projects and companies, Mirza Holding has acted as an intermediary between businesses and clients since the very beginning. Mirza Holding wealth and asset management is divided into three divisions: Retail services for everyday consumers, Corporate services for business financing needs, and Private services for exclusive wealth management solutions.
                                    </p>
                                </div>
                            </div>
                            
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
                                {stats.map((stat, index) => (
                                    <div 
                                        key={index}
                                        className="bg-white/60 backdrop-blur-lg rounded-xl p-4 sm:p-6 lg:p-8 text-center hover:bg-white/80 transition-all duration-300 hover-lift shadow-lg border border-gray-200/30"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <div className="flex justify-center mb-3 sm:mb-4 text-gray-700">
                                            {stat.icon}
                                        </div>
                                        <div className="font-bold text-black text-xl sm:text-2xl mb-2">{stat.value}</div>
                                        <div className="text-sm sm:text-base text-gray-600">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="flex justify-center px-4">
                                <div className="bg-gradient-to-r from-black to-gray-800 text-white px-6 py-6 sm:px-10 sm:py-8 lg:px-12 lg:py-10 rounded-2xl shadow-2xl">
                                    <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold font-playfair text-center leading-tight">
                                        MODERNISING THE WAY MONEY WORKS IN PAKISTAN
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;