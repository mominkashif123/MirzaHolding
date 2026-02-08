
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, TrendingUp, LogOut } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const isLoggedIn = typeof window !== 'undefined' && !!sessionStorage.getItem('user');
    const isMutualFundUser = typeof window !== 'undefined' && sessionStorage.getItem('isMutualFundUser') === 'true';
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Show/hide navbar based on scroll direction
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            
            // Add background blur when scrolled
            setIsScrolled(scrollTop > 50);
            setLastScrollTop(scrollTop);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollTop]);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMobileMenuOpen && !event.target.closest('nav')) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isMobileMenuOpen]);

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/about', label: 'About Us' },
        { to: '/retail', label: 'Retail' },
        { to: '/private', label: 'Private' },
        { to: '/corporate', label: 'Corporate' },
        { to: '/contact', label: 'Contact Us' },
        { to: '/finance', label: 'Financial Overview' }
    ];

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out h-[10vh]
            ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
            ${isScrolled 
                ? 'bg-black/98 backdrop-blur-xl shadow-2xl border-b border-gray-700' 
                : 'bg-black/95 backdrop-blur-lg shadow-2xl border-b border-gray-800'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex justify-between items-center h-full">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
                        <div className="relative">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-600 to-black rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg">
                                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-black rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                        </div>
                        <div className="hidden sm:block">
                            <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                                Mirza <span className="text-gray-300">Holding</span>
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-1">
                        {navLinks.map((link, index) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="relative px-3 xl:px-4 py-2 text-gray-300 hover:text-white transition-all duration-300 group rounded-lg hover:bg-white/5 text-sm xl:text-base"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <span className="relative z-10 font-medium">{link.label}</span>
                                <div className="absolute inset-0 bg-gray-700/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></div>
                            </Link>
                        ))}
                        {isLoggedIn && (
                            <Link
                                to={isMutualFundUser ? '/funds-dashboard' : '/dashboard'}
                                className="relative px-3 xl:px-4 py-2 text-gray-300 hover:text-white transition-all duration-300 group rounded-lg hover:bg-white/5 text-sm xl:text-base"
                            >
                                <span className="relative z-10 font-medium">Dashboard</span>
                                <div className="absolute inset-0 bg-gray-700/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></div>
                            </Link>
                        )}
                        {/* Login / Logout */}
                        {isLoggedIn ? (
                            <button
                                onClick={() => {
                                    sessionStorage.removeItem('user');
                                    sessionStorage.removeItem('isMutualFundUser');
                                    navigate('/');
                                }}
                                className="ml-4 px-4 xl:px-6 py-2 xl:py-2.5 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-sm xl:text-base flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="ml-4 px-4 xl:px-6 py-2 xl:py-2.5 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-sm xl:text-base"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMobileMenu}
                        className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors duration-200 z-50"
                        aria-label="Toggle mobile menu"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsMobileMenuOpen(false)} />
            )}

            {/* Mobile Menu */}
            <div
                className={`lg:hidden fixed top-[10vh] right-0 w-full sm:w-80 h-[calc(100vh-10vh)] bg-black/95 backdrop-blur-lg border-l border-gray-700 transform transition-transform duration-300 ease-in-out z-50
                ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="px-4 py-6 space-y-3 h-full overflow-y-auto">
                    {navLinks.map((link, index) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 transform hover:translate-x-2"
                            onClick={() => setIsMobileMenuOpen(false)}
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            {link.label}
                        </Link>
                    ))}
                    {isLoggedIn && (
                        <Link
                            to={isMutualFundUser ? '/funds-dashboard' : '/dashboard'}
                            className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 transform hover:translate-x-2"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Dashboard
                        </Link>
                    )}
                    {isLoggedIn ? (
                        <button
                            onClick={() => {
                                sessionStorage.removeItem('user');
                                sessionStorage.removeItem('isMutualFundUser');
                                setIsMobileMenuOpen(false);
                                navigate('/');
                            }}
                            className="flex mx-4 mt-6 w-[calc(100%-2rem)] px-6 py-3 bg-white text-black font-semibold rounded-xl text-center hover:bg-gray-200 items-center justify-center gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className="block mx-4 mt-6 px-6 py-3 bg-white text-black font-semibold rounded-xl text-center hover:bg-gray-200 transform hover:scale-105 transition-all duration-300"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
