import React from "react";
import { bgimg } from "../assets/index.js";
import Navbar from "./Navbar.jsx";
import '../styles/contact.css';
import { Link } from 'react-router-dom';

const ContactUs = () => {
    return (
        <>
            <Navbar />
            <div className="min-h-[90vh] bg-gray-200 flex flex-col md:flex-row mt-[10vh]">
                <div className="md:w-2/3 w-full flex flex-col px-8 py-12">
                    <div className="flex flex-col justify-center items-center flex-1 mb-12">
                        <h1 className="text-6xl font-bold mb-4 font-baskervville text-center">LOGIN TO YOUR ACCOUNT</h1>
                        <button className="login-button">
                            <Link to="/login">
                                <span>LOGIN YOUR WALLET</span>
                            </Link>
                        </button>
                    </div>
                    <div className="flex flex-col justify-center flex-1">
                        <h2 className="text-3xl font-bold mb-4 text-center font-baskervville">Contact Us</h2>
                        <p className="text-lg text-center font-alata">
                            Mirza Holding • Head Office
                            <br />
                            Ruby Centre, 4th Floor II
                            <br />
                            Chundrigar Rd. Opp Chamber of
                            <br />
                            Commerce, Karachi City, Sindh.
                            <br /><br />
                            Tel: +92311-3553546
                            <br />
                            Email: mhwealthmanagement@gmail.com
                            <br />
                            Social: @mirzaholdingplc
                        </p>
                    </div>
                </div>
                <div className="md:w-1/3 w-full bg-cover bg-center hidden md:block" style={{ backgroundImage: `url(${bgimg})` }}>
                </div>
            </div>
        </>
    );
};

export default ContactUs;
