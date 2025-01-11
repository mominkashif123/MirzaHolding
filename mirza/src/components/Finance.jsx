import React from 'react';
import Navbar from './Navbar.jsx';
import { bgimg, Q1, Q2, Q3 } from '../assets/index.js';

const FinancialOverview = () => {
    return (
        <>
            <Navbar />
            <div 
                className="bg-cover bg-center h-[50vh] flex items-center mt-[10vh]" 
                style={{ backgroundImage: `url(${bgimg})` }}
            >
                <div className="max-w-7xl mx-auto text-white grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div>
                        <h2 className="text-2xl font-bold">Assets under management</h2>
                        <p className="text-4xl mt-2">720,000PKR</p>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">Revenue for Q4 FY24</h2>
                        <p className="text-4xl mt-2">339,370PKR</p>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">Investor benchmark Q4</h2>
                        <p className="text-4xl mt-2">15.5%</p>
                    </div>
                </div>
            </div>

            {/* Bottom Section with Information */}
            <div className="bg-gray-100 h-[50vh] flex items-center">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="mt-10 md:mt-0"> {/* Add margin-top on small screens */}
                        <h3 className="text-2xl font-bold mb-4">Investor Relations</h3>
                        <ul className="text-lg">
                            <li>
                                <a href={Q1} download>
                                    • Q1 FY24 Report
                                </a>
                            </li>
                            <li>
                                <a href={Q2} download>
                                    • Q2 FY24 Report
                                </a>
                            </li>
                            <li>
                                <a href={Q3} download>
                                    • Q3 FY24 Report
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold mb-4">Press Releases</h3>
                        <ul className="text-lg">
                            <li>• Annual Year Report 2021</li>
                            <li>• Annual Year Report 2022</li>
                            <li>• Annual Year Report 2023</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold mb-4">Letter to Investors</h3>
                        <ul className="text-lg">
                            <li>• Q2 FY24 Letter to Shareholders</li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FinancialOverview;
