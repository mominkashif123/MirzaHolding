import React, { useEffect, useState } from 'react';
import { ArrowDown, Sparkles, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const [fadeIn, setFadeIn] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const timer = setTimeout(() => setFadeIn(true), 300);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <>
            <style>
                {`
                    @keyframes float {
                        0%, 100% { transform: translateY(0px) rotate(0deg); }
                        33% { transform: translateY(-10px) rotate(120deg); }
                        66% { transform: translateY(5px) rotate(240deg); }
                    }
                    
                    @keyframes pulse-glow {
                        0%, 100% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.1); }
                        50% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.2); }
                    }
                    
                    @keyframes shimmer {
                        0% { background-position: -200% 0; }
                        100% { background-position: 200% 0; }
                    }
                    
                    .animate-float {
                        animation: float 6s ease-in-out infinite;
                    }
                    
                    .animate-pulse-glow {
                        animation: pulse-glow 2s ease-in-out infinite;
                    }
                    
                    .hover-lift:hover {
                        transform: translateY(-2px);
                    }
                    
                    .shimmer {
                        background: linear-gradient(90deg, #ffffff 0%, #f0f0f0 50%, #ffffff 100%);
                        background-size: 200% 100%;
                        animation: shimmer 2s infinite;
                    }
                    
                    .shimmer:hover {
                        animation-duration: 0.5s;
                    }
                `}
            </style>
            <div className="relative h-[90vh] overflow-hidden flex items-center justify-center bg-black">
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-gray-800"></div>

                {/* Floating particles */}
                <div className="absolute inset-0">
                    {[...Array(50)].map((_, i) => (
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

                {/* Interactive mouse glow */}
                <div
                    className="absolute pointer-events-none w-96 h-96 bg-gradient-radial from-gray-500/10 via-gray-600/5 to-transparent rounded-full blur-3xl transition-all duration-300"
                    style={{
                        left: mousePosition.x - 192,
                        top: mousePosition.y - 192,
                        background: `radial-gradient(circle, rgba(107, 114, 128, 0.1) 0%, rgba(107, 114, 128, 0.05) 50%, transparent 100%)`
                    }}
                />

                {/* Main content */}
                <div className={`relative z-10 text-center px-4 max-w-6xl mx-auto transition-all duration-1000 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

                    {/* Premium badge */}
                    <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-900/50 border border-gray-700 mb-8 animate-pulse-glow">
                        <Sparkles className="w-4 h-4 text-gray-300" />
                        <span className="text-gray-300 text-sm font-medium">Premium Financial Solutions</span>
                        <TrendingUp className="w-4 h-4 text-gray-300" />
                    </div>

                    {/* Main heading */}
                    <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-6">
                        <span className="text-white" style={{ textShadow: '0 25px 50px rgba(0, 0, 0, 0.5)' }}>Mirza</span>
                        <br />
                        <span className="text-gray-300">
                            Holding
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-400 font-light mb-8 leading-relaxed">
                        A company built to{' '}
                        <span className="font-semibold text-white">build you.</span>
                    </p>

                    {/* Feature highlights */}
                    <div className="flex flex-wrap justify-center gap-6 mb-12">
                        {[
                            { icon: '💼', text: 'Corporate Solutions' },
                            { icon: '📈', text: 'Investment Growth' },
                            { icon: '🔒', text: 'Secure Platform' },
                            { icon: '⭐', text: 'Premium Service' }
                        ].map((item, index) => (
                            <div
                                key={item.text}
                                className="flex items-center space-x-2 px-4 py-2 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-gray-500 transition-all duration-300 hover-lift"
                                style={{ animationDelay: `${index * 0.2}s` }}
                            >
                                <span className="text-2xl">{item.icon}</span>
                                <span className="text-gray-300 font-medium">{item.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button className="group px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transform hover:scale-105 transition-all duration-300 shadow-2xl shimmer">
                            <span className="flex items-center space-x-2">
                                <span>Get Started</span>
                                <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
                            </span>
                        </button>

                        <button
                            onClick={() => navigate('/about')}
                            className="px-8 py-4 bg-gray-900/50 border border-gray-700 text-white font-semibold rounded-xl hover:bg-gray-800/50 transform hover:scale-105 transition-all duration-300"
                        >
                            Learn More
                        </button>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-gray-500 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;