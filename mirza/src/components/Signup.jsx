import React, { useRef, useEffect, useState } from "react";
import lottie from "lottie-web";
import loginAnimation from "../assets/login.json";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AlertMessage from "../components/Customalert.jsx";
import Navbar from "../components/Navbar.jsx";

const SignupPage = () => {
    const animationContainer = useRef(null);
    const animationInstance = useRef(null);
    const typingTimeout = useRef(null);
    const [isTyping, setIsTyping] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [showOtpPopup, setShowOtpPopup] = useState(false);
    const [alert, setAlert] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        animationInstance.current = lottie.loadAnimation({
            container: animationContainer.current,
            animationData: loginAnimation,
            loop: true,
            autoplay: false,
        });

        return () => {
            if (animationInstance.current) {
                animationInstance.current.destroy();
            }
        };
    }, []);

    useEffect(() => {
        if (animationInstance.current) {
            if (isTyping) {
                animationInstance.current.play();
            } else {
                animationInstance.current.pause();
            }
        }
    }, [isTyping]);

    const handleInputChange = (setter) => (event) => {
        setIsTyping(true);
        setter(event.target.value);

        if (typingTimeout.current) {
            clearTimeout(typingTimeout.current);
        }

        typingTimeout.current = setTimeout(() => {
            setIsTyping(false);
        }, 2000);
    };

    const handleSignup = async (event) => {
        event.preventDefault();

        const passwordRegex = /^(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

        if (!passwordRegex.test(password)) {
            setAlert({ type: "error", message: "Password must be at least 8 characters long, include one uppercase letter, and one special character." });
            return;
        }
        
        try {
            console.log("Sending OTP...", email, password);
            // const response = await axios.post("http://localhost:5000/api/sendOtp", {
            const response = await axios.post("https://mirza-holding.onrender.com/api/sendOtp", {
                email,
                password,
            });
            if (response.status === 200) {
                setShowOtpPopup(true);
                setAlert({ type: "success", message: "OTP sent to your email!" });
            }
            else {
                setAlert({ type: "error", message: "Signup failed. Please try again." });
            }
        } catch (error) {
            console.error("Error sending OTP:", error);
            if (error.response.status === 400 && error.response.data.error === "User already exists.") {
                setAlert({ type: "error", message: "User already exists." });
            } else {
                setAlert({ type: "error", message: "Signup failed. Please try again." });
            }
        }
    };

    const handleOtpSubmit = async () => {
        try {
            // const response = await axios.post("http://localhost:5000/api/verifyOtpAndCreateUser", {
            const response = await axios.post("https://mirza-holding.onrender.com/api/verifyOtpAndCreateUser", {
                email,
                otp,
            });
            if (response.status === 200) {
                setAlert({ type: "success", message: "Signup successful!" });
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setAlert({ type: "error", message: "OTP verification failed. Please try again." });
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            setAlert({ type: "error", message: "OTP verification failed. Please try again." });
        }
    };

    return (
        <>
        <Navbar />
        <div className="h-screen flex flex-col md:flex-row">
            <div className="flex-1 bg-gray-200 flex flex-col items-center justify-center p-4 md:p-8">
                <div ref={animationContainer} className="w-full h-full max-w-md"></div>
                <div className="mt-6 text-center">
                    <h2 className="text-xl font-semibold mb-2">Already have an account?</h2>
                    <Link to="/login">
                        <button className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800">
                            Login
                        </button>
                    </Link>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center bg-gray-100 p-4 md:p-8">
                <div className="max-w-md w-full px-6 py-8 bg-white rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
                    {alert && (
                        <AlertMessage
                            message={alert.message}
                            type={alert.type}
                            onClose={() => setAlert(null)}
                        />
                    )}
                    <form onSubmit={handleSignup}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={handleInputChange(setEmail)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={handleInputChange(setPassword)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800"
                        >
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>

            {/* OTP Verification Popup */}
            {showOtpPopup && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-semibold mb-4">Enter OTP</h2>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 mb-4"
                            placeholder="Enter OTP"
                        />
                        <button
                            onClick={handleOtpSubmit}
                            className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800"
                        >
                            Verify OTP
                        </button>
                    </div>
                </div>
            )}
        </div>
        </>
    );
};

export default SignupPage;
