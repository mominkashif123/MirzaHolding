
import React, { useState, useEffect } from 'react';
import { Bell, Calendar, Download, Eye, Clock, Search, Filter } from 'lucide-react';

const Newsletters = () => {
    const [newsletters, setNewsletters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Mock data for newsletters - replace with actual API call
    useEffect(() => {
        const mockNewsletters = [
            {
                id: 1,
                title: "Market Outlook Q4 2024",
                summary: "Comprehensive analysis of Pakistan's financial markets and investment opportunities for the fourth quarter.",
                category: "Market Analysis",
                publishDate: "2024-12-10",
                readTime: "8 min read",
                isNew: true,
                downloadUrl: "#",
                viewUrl: "#"
            },
            {
                id: 2,
                title: "Investment Strategies for 2025",
                summary: "Strategic insights and recommendations for portfolio optimization in the upcoming year.",
                category: "Investment Guide",
                publishDate: "2024-12-05",
                readTime: "12 min read",
                isNew: true,
                downloadUrl: "#",
                viewUrl: "#"
            },
            {
                id: 3,
                title: "Economic Trends & Analysis",
                summary: "Deep dive into Pakistan's economic indicators and their impact on investment decisions.",
                category: "Economic Report",
                publishDate: "2024-11-28",
                readTime: "15 min read",
                isNew: false,
                downloadUrl: "#",
                viewUrl: "#"
            },
            {
                id: 4,
                title: "Mirza Holding Monthly Update",
                summary: "Monthly performance review and upcoming opportunities for our valued clients.",
                category: "Company Update",
                publishDate: "2024-11-20",
                readTime: "6 min read",
                isNew: false,
                downloadUrl: "#",
                viewUrl: "#"
            },
            {
                id: 5,
                title: "Sector Focus: Technology & Innovation",
                summary: "Exploring investment opportunities in Pakistan's growing technology sector.",
                category: "Sector Analysis",
                publishDate: "2024-11-15",
                readTime: "10 min read",
                isNew: false,
                downloadUrl: "#",
                viewUrl: "#"
            }
        ];

        // Simulate loading
        setTimeout(() => {
            setNewsletters(mockNewsletters);
            setLoading(false);
        }, 1000);
    }, []);

    const categories = ['all', 'Market Analysis', 'Investment Guide', 'Economic Report', 'Company Update', 'Sector Analysis'];

    const filteredNewsletters = newsletters.filter(newsletter => {
        const matchesSearch = newsletter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            newsletter.summary.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || newsletter.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-200">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-black to-gray-700 rounded-xl flex items-center justify-center">
                        <Bell className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-black font-playfair">Newsletters</h3>
                        <p className="text-gray-600">Stay updated with our latest insights and market analysis</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{newsletters.length} newsletters published</span>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex-1 relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search newsletters..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent bg-white"
                    >
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category === 'all' ? 'All Categories' : category}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Newsletter List */}
            <div className="space-y-6">
                {filteredNewsletters.length > 0 ? (
                    filteredNewsletters.map((newsletter) => (
                        <div 
                            key={newsletter.id}
                            className="bg-gray-50/80 rounded-xl p-6 hover:bg-gray-100/80 transition-all duration-300 border border-gray-200 hover:shadow-lg"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <h4 className="text-xl font-bold text-black">{newsletter.title}</h4>
                                        {newsletter.isNew && (
                                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                                                New
                                            </span>
                                        )}
                                    </div>
                                    
                                    <p className="text-gray-700 mb-4 leading-relaxed">{newsletter.summary}</p>
                                    
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                        <div className="flex items-center space-x-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>{formatDate(newsletter.publishDate)}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Clock className="w-4 h-4" />
                                            <span>{newsletter.readTime}</span>
                                        </div>
                                        <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">
                                            {newsletter.category}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col sm:flex-row gap-3 lg:ml-6">
                                    <button 
                                        onClick={() => window.open(newsletter.viewUrl, '_blank')}
                                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors font-medium"
                                    >
                                        <Eye className="w-4 h-4" />
                                        <span>Read</span>
                                    </button>
                                    <button 
                                        onClick={() => window.open(newsletter.downloadUrl, '_blank')}
                                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-xl transition-colors font-medium"
                                    >
                                        <Download className="w-4 h-4" />
                                        <span>Download</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                            <Bell className="w-10 h-10 text-gray-400" />
                        </div>
                        <h4 className="text-xl font-semibold text-gray-700 mb-3">No newsletters found</h4>
                        <p className="text-gray-500 mb-6">
                            {searchTerm || selectedCategory !== 'all' 
                                ? "Try adjusting your search criteria"
                                : "Newsletter publications will appear here"
                            }
                        </p>
                        {(searchTerm || selectedCategory !== 'all') && (
                            <button 
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory('all');
                                }}
                                className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors font-semibold"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Newsletter Subscription CTA */}
            <div className="mt-12 bg-gradient-to-br from-black via-gray-800 to-black rounded-2xl p-8 text-white">
                <div className="text-center">
                    <Bell className="w-12 h-12 mx-auto mb-4 text-white" />
                    <h3 className="text-2xl font-bold mb-3 font-playfair">Stay Informed</h3>
                    <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                        Get the latest market insights, investment strategies, and company updates delivered directly to your inbox.
                    </p>
                    <button className="bg-white text-black px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors font-semibold">
                        Subscribe to Newsletter
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Newsletters;