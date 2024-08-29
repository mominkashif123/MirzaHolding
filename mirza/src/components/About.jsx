import React from "react";
import Navbar from "./Navbar.jsx";
import { about } from "../assets/index.js";

const AboutSection = () => {
    return (
        <>
            <Navbar />
            <div className="relative h-[90vh] mt-[10vh] flex flex-col lg:flex-row overflow-hidden">
                <div 
                    className="w-full lg:w-1/3 bg-cover bg-center relative h-1/2 lg:h-full"
                    style={{ backgroundImage: `url(${about})` }}
                >
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-black opacity-40"></div>
                </div>

                <div className="w-full lg:w-2/3 bg-gray-200 text-black flex flex-col items-center justify-center px-4 py-8 lg:px-8 lg:py-12">
                    <div className="text-center max-w-screen-lg lg:max-w-4xl">
                        <div className="mb-8">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 font-baskervville">
                                WHAT WE DO
                            </h1>
                            <h2 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-semibold mb-6 font-baskervville">
                                A company built to redefine the financial landscape of Pakistan
                            </h2>
                        </div>
                        <div className="mb-8">
                            <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-justify font-alata">
                                Mirza Holding launched in 2020 is a financial institute specialising in asset and wealth management. From local investments and businesses to financing global projects and companies, Mirza Holding has acted as an intermediary between businesses and clients since the very beginning. Mirza Holding wealth and asset management is divided into two divisions as asset management focuses on managing businesses whereas wealth management oversees all aspects of finance. We offer two services corporate and private banking services. Our corporate services are designed to cater all financing and professional needs required by local businesses whereas private banking services are specifically launched to improve the financial health of local investors and to provide monetary solutions.
                            </p>
                        </div>
                        <div className="flex justify-center">
                            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-semibold whitespace-nowrap font-baskervville">
                                MODERNISING THE WAY MONEY WORKS IN PAKISTAN
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AboutSection;
