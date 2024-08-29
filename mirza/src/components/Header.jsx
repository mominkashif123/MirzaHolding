import React, { useEffect, useState } from 'react';
import { bgimg } from '../assets/index.js';

const Header = () => {
    const [fadeIn, setFadeIn] = useState(false);

    useEffect(() => {
        setFadeIn(true);
    }, []);

    return (
        <div 
            className="h-[90vh] mt-[10vh] bg-cover bg-center flex justify-center items-center" 
            style={{ backgroundImage: `url(${bgimg})` }}
        >
            <div 
                className={`w-3/4 p-8 text-white text-center transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
            >
                <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-bold font-baskervville">Mirza Holding</h1>
                <p className="mt-4 text-lg sm:text-xl md:text-2xl lg:text-4xl font-alata">
                    A company built to build you.
                </p>
            </div>
        </div>
    );
};

export default Header;
