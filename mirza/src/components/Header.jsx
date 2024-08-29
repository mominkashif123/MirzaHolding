import React, { useEffect, useState } from 'react';
import { bgimg } from '../assets/index.js';

const Header = () => {
    const [fadeIn, setFadeIn] = useState(false);

    useEffect(() => {
        setFadeIn(true);
    }, []);

    return (
        <div 
            className="h-[90vh] mt-[10vh] bg-cover bg-center flex items-center" 
            style={{ backgroundImage: `url(${bgimg})` }}
        >
            <div 
                className={`w-1/2 p-8 text-white transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
            >
                <h1 className="text-6xl font-bold font-baskervville">Mirza Holding</h1>
                <p className="mt-4 text-lg font-alata">
                    This is where your descriptive text goes. You can add more content here to explain what the section is about.
                </p>
            </div>
        </div>
    );
};

export default Header;
