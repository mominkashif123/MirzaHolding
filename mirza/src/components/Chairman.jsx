import React from 'react';
import { chairman, sign } from '../assets'; // Replace with the correct path to your images
import { slideIn } from '../utils/motion.js';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const ChairmanMessage = () => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.5,
    });

    return (
        <div ref={ref} id="chairman" className="overflow-hidden flex flex-col md:flex-row items-center justify-center min-h-screen p-8 bg-gray-200">
            {/* Left side - Image */}
            <motion.div
                variants={slideIn('left', 'spring', 0.4, 0.75)}
                initial="hidden"
                animate={inView ? 'show' : 'hidden'}
                className="flex flex-col items-center justify-center w-full md:w-1/2"
            >
                <img src={chairman} alt="Chairman" className="w-full h-auto object-cover max-w-md" />
            </motion.div>

            {/* Right side - Text */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-center p-4">
                <motion.div
                    variants={slideIn('right', 'spring', 0.4, 0.75)}
                    initial="hidden"
                    animate={inView ? 'show' : 'hidden'}
                    className="flex flex-col justify-center items-center w-full h-full"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 font-baskervville">
                        CHAIRMAN'S MESSAGE
                    </h2>
                    <h3 className="text-xl md:text-2xl font-semibold text-black mb-4 font-baskervville">
                        Mirza Holding aims to support every local investor and small business in Pakistan
                    </h3>
                    <p className="text-base md:text-lg text-black mb-6 font-alata">
                        Mirza Holding's main aim is to support every business in Pakistan.
                        We plan on boosting the confidence of local investors and
                        facilitating easy payment systems in Pakistan to make
                        opportunities accessible to everyone. Mirza Holding was started in
                        2020, within 4 years in the industry we've managed to increase our
                        AUMs and we plan on expanding our operations all over Pakistan.
                    </p>
                    <div className="flex flex-col items-center">
                        <img src={sign} alt="Signature" className="w-70 h-auto mb-2" />
                        {/* <p className="text-black text-lg font-alata">Chairman & CEO of Mirza Holding</p> */}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ChairmanMessage;
