import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

const FundDetailModal = ({ fund, onClose }) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [onClose]);

    if (!fund) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                onClick={onClose}
                aria-hidden="true"
            />
            
            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-black to-gray-800 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white font-playfair">Fund details</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>
                
                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                    {/* Basic Facts section */}
                    <div className="px-6 py-4 bg-gradient-to-r from-black to-gray-800">
                        <h3 className="text-lg font-semibold text-white">Basic Facts</h3>
                    </div>
                    <div className="border border-gray-200">
                        {fund.basicFacts?.map((fact, index) => (
                            <div 
                                key={fact.label}
                                className={`flex px-6 py-4 border-b border-gray-200 last:border-b-0 ${
                                    index % 2 === 1 ? 'bg-gray-50' : 'bg-white'
                                }`}
                            >
                                <div className="w-1/3 font-semibold text-gray-700 min-w-[140px]">
                                    {fact.label}
                                </div>
                                <div className="flex-1 text-gray-800">
                                    {fact.value}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Invest Now CTA */}
                    <div className="px-6 py-6 bg-gray-50">
                        <Link
                            to="/contact"
                            className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-black to-gray-800 text-white font-semibold rounded-xl hover:from-gray-800 hover:to-black transition-colors duration-300"
                            onClick={onClose}
                        >
                            Invest Now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FundDetailModal;
