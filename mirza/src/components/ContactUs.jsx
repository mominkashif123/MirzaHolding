import { Phone, Mail, MapPin, Clock, Send, ExternalLink } from 'lucide-react';
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Link } from 'react-router-dom';

const ContactUs = () => {
    const [isInView, setIsInView] = useState(false);
    const [ref, setRef] = useState(null);

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

    const contactInfo = [
        {
            icon: <Phone className="w-6 h-6" />,
            title: "Phone",
            value: "+92311-3553546",
            description: "Mon-Fri 9AM-6PM"
        },
        {
            icon: <Mail className="w-6 h-6" />,
            title: "Email",
            value: "mhwealthmanagement@gmail.com",
            description: "We'll respond within 24hrs"
        },
        {
            icon: <MapPin className="w-6 h-6" />,
            title: "Address",
            value: "Ruby Centre, 4th Floor II",
            description: "Chundrigar Rd. Karachi City, Sindh"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
            <Navbar />
            
            {/* Hero Section */}
            <div className="relative min-h-screen pt-[10vh] overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute inset-0">
                    {[...Array(30)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-black/20 rounded-full animate-float"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 6}s`,
                                animationDuration: `${6 + Math.random() * 4}s`
                            }}
                        />
                    ))}
                </div>

                <div className="relative z-10 flex flex-col md:flex-row h-full">
                    {/* Left side - Content */}
                    <div 
                        ref={setRef}
                        className="md:w-2/3 w-full flex flex-col px-6 py-12 lg:px-12 bg-white/80 backdrop-blur-lg relative"
                    >
                        {/* Glass morphism background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-gray-100/20 backdrop-blur-xl"></div>
                        
                        <div className="relative z-10">
                            {/* Login Section */}
                            <div className={`flex flex-col justify-center items-center flex-1 mb-16 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                                <div className="text-center mb-12">
                                    
                                    
                                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 font-playfair text-center bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent leading-tight">
                                        LOGIN TO YOUR ACCOUNT
                                    </h1>
                                    
                                    <Link 
                                        to="/login"
                                        className="group inline-flex items-center space-x-3 px-10 py-5 bg-gradient-to-r from-black to-gray-800 text-white font-semibold rounded-2xl hover:from-gray-800 hover:to-black transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl"
                                    >
                                        <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                        <span className="text-lg">LOGIN YOUR WALLET</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Contact Section */}
                            <div className={`flex flex-col justify-center flex-1 transition-all duration-1000 delay-300 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                                <div className="text-center mb-12">
                                    <div className="inline-flex items-center space-x-2 px-6 py-3 bg-black/10 rounded-full mb-8 backdrop-blur-sm">
                                        <Phone className="w-5 h-5 text-black" />
                                        <span className="text-black font-semibold">Get In Touch</span>
                                    </div>
                                    
                                    <h2 className="text-4xl font-bold mb-8 text-center font-playfair text-black">Contact Us</h2>
                                </div>

                                {/* Contact Cards */}
                                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3 mb-12">
                                    {contactInfo.map((contact, index) => (
                                        <div 
                                            key={index}
                                            className="bg-white/60 backdrop-blur-lg rounded-xl p-6 text-center hover:bg-white/80 transition-all duration-300 hover-lift shadow-lg border border-gray-200/30"
                                            style={{ animationDelay: `${index * 0.1}s` }}
                                        >
                                            <div className="flex justify-center mb-4 text-black">
                                                {contact.icon}
                                            </div>
                                            <h3 className="font-bold text-black text-lg mb-2">{contact.title}</h3>
                                            <p className="text-black font-semibold mb-1">{contact.value}</p>
                                            <p className="text-gray-600 text-sm">{contact.description}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Office Info */}
                                <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-200/50">
                                    <div className="text-center text-gray-800 leading-relaxed space-y-4">
                                        <div className="mb-6">
                                            <h3 className="text-2xl font-bold text-black mb-2">Mirza Holding • Head Office</h3>
                                        </div>
                                        
                                        <div className="grid md:grid-cols-2 gap-8 text-left">
                                            <div>
                                                <h4 className="font-semibold text-black mb-3 flex items-center">
                                                    <MapPin className="w-4 h-4 mr-2" />
                                                    Office Address
                                                </h4>
                                                <p className="text-gray-700">Ruby Centre, 4th Floor II</p>
                                                <p className="text-gray-700">Chundrigar Rd. Opp Chamber of</p>
                                                <p className="text-gray-700">Commerce, Karachi City, Sindh.</p>
                                            </div>
                                            
                                            <div>
                                                <h4 className="font-semibold text-black mb-3 flex items-center">
                                                    <Clock className="w-4 h-4 mr-2" />
                                                    Business Hours
                                                </h4>
                                                <p className="text-gray-700">Monday - Friday: 9:00 AM - 6:00 PM</p>
                                                <p className="text-gray-700">Saturday: 10:00 AM - 4:00 PM</p>
                                                <p className="text-gray-700">Sunday: Closed</p>
                                            </div>
                                        </div>
                                        
                                        <div className="pt-6 border-t border-gray-200/50">
                                            <p className="text-black font-semibold">Social: @mirzaholdingplc</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Visual */}
                    <div className="md:w-1/3 w-full bg-gradient-to-br from-black via-gray-800 to-gray-700 hidden md:flex items-center justify-center relative overflow-hidden">
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0" style={{
                                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                                backgroundSize: '40px 40px'
                            }}></div>
                        </div>

                        <div className="relative z-10 text-center text-white p-8">
                            <div className="w-32 h-32 bg-gradient-to-br from-gray-600 to-black rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl">
                                <Phone className="w-16 h-16 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Get in Touch</h3>
                            <p className="text-gray-300 text-lg">We're here to help you succeed</p>
                            
                            {/* Floating decorative elements */}
                            <div className="absolute top-20 left-10 w-6 h-6 bg-white/20 rounded-full animate-pulse"></div>
                            <div className="absolute bottom-20 right-10 w-8 h-8 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                            <div className="absolute top-1/2 left-6 w-4 h-4 bg-white/15 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;