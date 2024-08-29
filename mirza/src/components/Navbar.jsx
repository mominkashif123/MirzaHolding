import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { logo } from '../assets/index.js';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollTop, setLastScrollTop] = useState(0);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > lastScrollTop) {
                // Scrolling down
                setIsVisible(false);
            } else {
                // Scrolling up
                setIsVisible(true);
            }
            setLastScrollTop(scrollTop);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollTop]);

    return (
        <nav
            className={`bg-gray-300 h-[10vh] p-4 z-50 fixed top-0 w-full transition-all duration-300 
            ${isVisible ? 'opacity-100' : 'opacity-0 invisible'}`}>
            <div className="flex justify-between items-center h-full">
                {/* Logo */}
                <div className="flex items-center space-x-4 ml-4">
                    <img src={logo} alt="Mirza Holding" style={{ height: '150px' }} />
                    <span className="text-black font-bold text-xl hidden md:block">Mirza Holding</span>
                </div>

                {/* Links */}
                <div className="hidden md:flex space-x-6 items-center">
                    <Link to='/' className="text-black hover:text-gray-600">Home</Link>
                    <Link to='/about' className="text-black hover:text-gray-600">About Us</Link>
                    <Link to='/private' className="text-black hover:text-gray-600">Private</Link>
                    <Link to='/corporate' className="text-black hover:text-gray-600">Corporate</Link>
                    <Link to="/contact" className="text-black hover:text-gray-600">Contact Us</Link>
                    <Link to="/finance" className="text-black hover:text-gray-600">Financial Overview</Link>

                    {/* Login Button */}
                    <Link to="/login" className="bg-black text-white py-2 px-4 rounded hover:bg-white hover:text-black">
                        Login
                    </Link>
                </div>

                {/* Hamburger Icon */}
                <div className="md:hidden mr-4">
                    <button
                        onClick={toggleMobileMenu}
                        className="text-black focus:outline-none"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white text-center p-4">
                    <Link to='/' className="block text-black hover:text-gray-600 py-2">Home</Link>
                    <Link to='/about' className="block text-black hover:text-gray-600 py-2">About Us</Link>
                    <Link to='/private' className="block text-black hover:text-gray-600 py-2">Private</Link>
                    <Link to='/corporate' className="block text-black hover:text-gray-600 py-2">Corporate</Link>
                    <Link to='/contact' className="block text-black hover:text-gray-600 py-2">Contact Us</Link>
                    <Link to='/finance' className="block text-black hover:text-gray-600 py-2">Financial Overview</Link>
                    <button className="bg-black text-white py-2 px-4 rounded w-full mt-2">
                        Login
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
