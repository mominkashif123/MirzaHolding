import React, { useRef, useEffect, useState } from "react";
import lottie from "lottie-web";
import loginAnimation from "../assets/login.json";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AlertMessage from "../components/Customalert.jsx"; 

const AdminLogin = () => {
    const animationContainer = useRef(null);
    const animationInstance = useRef(null);
    const typingTimeout = useRef(null);
    const [isTyping, setIsTyping] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            // const response = await axios.post("http://localhost:5000/api/adminlogin", {
            const response = await axios.post("https://mirza-holding.onrender.com/api/adminlogin", {
                email,
                password,
            });
            if (response.status === 200) {
                setAlert({ type: "success", message: "Login successful!" });
                sessionStorage.setItem("user", email);  
                setTimeout(() => navigate("/admindashboard"), 2000); // Redirect after 2 seconds
            } else {
                setAlert({ type: "error", message: "Login failed. Please try again." });
            }
        } catch (error) {
            setAlert({ type: "error", message: "Login failed. Please try again." });
        }
    };

    return (
        <div className="h-screen flex flex-col md:flex-row">
            <div className="flex-1 bg-gray-200 flex flex-col items-center justify-center p-4 md:p-8">
                <div ref={animationContainer} className="w-full h-full max-w-md"></div>
            </div>

            <div className="flex-1 flex items-center justify-center bg-gray-100 p-4 md:p-8">
                <div className="max-w-md w-full px-6 py-8 bg-white rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
                    {alert && (
                        <AlertMessage
                            message={alert.message}
                            type={alert.type}
                            onClose={() => setAlert(null)}
                        />
                    )}
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
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
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
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
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
