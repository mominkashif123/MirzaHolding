import React from 'react';
import { Quote, Award, Target, TrendingUp } from 'lucide-react';
import { chairman } from '../assets/index.js';

const ChairmanMessage = () => {
    const [isInView, setIsInView] = React.useState(false);
    const [ref, setRef] = React.useState(null);

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                }
            },
            { threshold: 0.3 }
        );

        if (ref) {
            observer.observe(ref);
        }

        return () => {
            if (ref) {
                observer.unobserve(ref);
            }
        };
    }, [ref]);

    return (
        <div
            ref={setRef}
            className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
        >
            <div className="max-w-7xl mx-auto">
                {/* Section header */}
                <div className={`text-center mb-16 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mb-6">
                        <Award className="w-5 h-5 text-black" />
                        <span className="text-black font-semibold">Leadership Message</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-black font-playfair mb-4">
                        Chairman's <span className="text-gray-600">Vision</span>
                    </h2>
                </div>

                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left side - Chairman Image */}
                    <div className="relative transition-all duration-1000 delay-300 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}">
                        <div className="relative">
                            {/* Chairman image added here */}
                            <div className="w-full max-w-md mx-auto aspect-[3/4] rounded-3xl relative overflow-hidden shadow-2xl">
                                <img
                                    src={chairman}
                                    alt="Chairman"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                <div className="absolute bottom-6 left-6 text-white">
                                    <p className="font-semibold text-lg">Chairman & CEO</p>
                                    <p className="text-gray-300">Mirza Holding</p>
                                </div>
                                <div className="absolute top-6 right-6 w-12 h-12 bg-white/10 rounded-full backdrop-blur-sm flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-white" />
                                </div>
                            </div>

                            {/* Floating stats */}
                            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-black">4+</div>
                                    <div className="text-sm text-gray-600">Years</div>
                                </div>
                            </div>

                            <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-gray-600 to-black text-white rounded-2xl shadow-xl p-4" style={{ animationDelay: '1s' }}>
                                <div className="text-center">
                                    <div className="text-2xl font-bold">100%</div>
                                    <div className="text-sm opacity-90">Growth</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Content */}
                    <div className={`space-y-8 transition-all duration-1000 delay-500 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>

                        {/* Quote icon */}
                        <div className="flex">
                            <Quote className="w-12 h-12 text-gray-600 opacity-50" />
                        </div>

                        {/* Main message */}
                        <div className="space-y-6">
                            <h3 className="text-2xl md:text-3xl font-bold text-black font-playfair leading-relaxed">
                                Mirza Holding aims to support every local investor and small business in Pakistan
                            </h3>

                            <p className="text-lg text-gray-700 leading-relaxed">
                                Mirza Holding's main aim is to support every business in Pakistan.
                                We plan on boosting the confidence of local investors and
                                facilitating easy payment systems in Pakistan to make
                                opportunities accessible to everyone.
                            </p>

                            <p className="text-lg text-gray-700 leading-relaxed">
                                Mirza Holding was started in
                                2020, within 5 years in the industry we've managed to increase our
                                AUMs and we plan on expanding our operations all over Pakistan.
                            </p>
                        </div>

                        {/* Key metrics */}
                        <div className="grid grid-cols-3 gap-6">
                            {[
                                { icon: '🎯', label: 'Mission Driven', value: '100%' },
                                { icon: '💼', label: 'AUM Growth', value: '4 Years' },
                                { icon: '🚀', label: 'Expansion', value: 'Pakistan' }
                            ].map((metric, index) => (
                                <div
                                    key={metric.label}
                                    className="text-center p-4 bg-white rounded-xl shadow-lg hover-lift"
                                    style={{ animationDelay: `${index * 0.2}s` }}
                                >
                                    <div className="text-2xl mb-2">{metric.icon}</div>
                                    <div className="font-bold text-black">{metric.value}</div>
                                    <div className="text-sm text-gray-600">{metric.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Signature area */}
                        <div className="pt-8">
                            <div className="h-16 bg-gradient-to-r from-gray-200 to-transparent rounded-lg flex items-center px-4">
                                <div className="text-2xl font-bold text-black font-playfair">
                                    Chairman & CEO
                                </div>
                            </div>
                        </div>

                        {/* Vision points */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { icon: <Target className="w-5 h-5" />, text: 'Investor Confidence' },
                                { icon: <TrendingUp className="w-5 h-5" />, text: 'Payment Systems' },
                                { icon: <Award className="w-5 h-5" />, text: 'Accessible Opportunities' },
                                { icon: '🌟', text: 'Nationwide Expansion' }
                            ].map((point, index) => (
                                <div
                                    key={index}
                                    className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg hover:bg-white/80 transition-all duration-300"
                                >
                                    <div className="text-gray-600">{point.icon}</div>
                                    <span className="text-gray-700 font-medium">{point.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChairmanMessage;