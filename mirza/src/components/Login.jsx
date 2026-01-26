
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Mail, Lock, Eye, EyeOff, ArrowRight, UserCheck } from "lucide-react";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [alert, setAlert] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post("https://mirza-holding.onrender.com/api/login", {
                email,
                password,
            });
            if (response.status === 200) {
                setAlert({ type: "success", message: "Login successful!" });
                sessionStorage.setItem("user", email);  
                setTimeout(() => navigate("/dashboard"), 2000);
            } else {
                setAlert({ type: "error", message: "Login failed. Please try again." });
            }
        } catch (error) {
            setAlert({ type: "error", message: "Login failed. Please try again." });
        } finally {
            setIsLoading(false);
        }
    };

    const AlertMessage = ({ message, type, onClose }) => (
        <div className={`mb-4 p-4 rounded-lg ${type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <div className="flex justify-between items-center">
                <span>{message}</span>
                <button onClick={onClose} className="ml-2 text-lg font-bold">&times;</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
            <Navbar />
            
            <div className="min-h-screen flex flex-col md:flex-row pt-[10vh]">
                {/* Left side - Animation/Visual */}
                <div className="flex-1 bg-gradient-to-br from-black via-gray-900 to-gray-800 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
                    {/* Background decorative elements */}
                    <div className="absolute inset-0">
                        {[...Array(20)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-2 h-2 bg-white/10 rounded-full animate-float"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 5}s`,
                                    animationDuration: `${5 + Math.random() * 3}s`
                                }}
                            />
                        ))}
                    </div>

                    {/* Grid pattern overlay */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
                            backgroundSize: '40px 40px'
                        }}></div>
                    </div>

                    <div className="relative z-10 text-center text-white max-w-md">
                        {/* Main visual element */}
                        <div className="w-32 h-32 bg-gradient-to-br from-gray-600 to-black rounded-full mx-auto mb-8 flex items-center justify-center shadow-2xl">
                            <UserCheck className="w-16 h-16 text-white" />
                        </div>
                        
                        <h2 className="text-3xl font-bold mb-4 font-playfair">Welcome Back</h2>
                        <p className="text-gray-300 mb-8 leading-relaxed">
                            Access your financial dashboard and manage your investments with confidence.
                        </p>
                        
                        <div className="space-y-4">
                            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
                                <h3 className="font-semibold mb-2">New to Mirza Holding?</h3>
                                <p className="text-sm text-gray-300 mb-4">Join thousands of satisfied investors</p>
                                <Link to="/signup">
                                    <button className="group w-full bg-white/20 hover:bg-white/30 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2">
                                        <span>Create Account</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side - Login Form */}
                <div className="flex-1 flex items-center justify-center bg-white/80 backdrop-blur-lg p-4 md:p-8 relative">
                    {/* Glass morphism background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-gray-100/20 backdrop-blur-xl"></div>
                    
                    <div className="relative z-10 max-w-md w-full">
                        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-200/50">
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-black/10 rounded-full mb-6 backdrop-blur-sm">
                                    <Lock className="w-4 h-4 text-black" />
                                    <span className="text-black font-semibold text-sm">Secure Login</span>
                                </div>
                                
                                <h1 className="text-3xl font-bold mb-2 text-black font-playfair">Welcome Back</h1>
                                <p className="text-gray-600">Enter your credentials to access your account</p>
                            </div>

                            {alert && (
                                <AlertMessage
                                    message={alert.message}
                                    type={alert.type}
                                    onClose={() => setAlert(null)}
                                />
                            )}

                            <form onSubmit={handleLogin} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-300"
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-300"
                                            placeholder="Enter your password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            ) : (
                                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="group w-full bg-gradient-to-r from-black to-gray-800 text-white py-3 px-6 rounded-xl font-semibold hover:from-gray-800 hover:to-black transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Signing In...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Sign In</span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-6 text-center">
                                <p className="text-gray-600">
                                    Don't have an account?{" "}
                                    <Link to="/signup" className="font-semibold text-black hover:text-gray-800 transition-colors duration-300">
                                        Sign up here
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
