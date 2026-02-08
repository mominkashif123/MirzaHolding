import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

const PSXLivePrices = () => {
  const [stocks, setStocks] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const symbols = ['KSE100', 'KEL', 'PSO', 'OGDC', 'KSE30'];

  const fetchStocks = async () => {
    try {
      // const res = await fetch('https://mirza-holding.onrender.com/api/psx');
      const res = await fetch('http://localhost:5000/api/psx');
      const data = await res.json();
      setStocks(data);
      setIsLoading(false);
    } catch (err) {
      // Fallback data for demo purposes
      setStocks({
        KSE100: { price: 45234.56, priceChange: 234.56 },
        KEL: { price: 4.35, priceChange: -0.12 },
        KSE30: { price: 15678.90, priceChange: 89.45 },
        PSO: { price: 185.67, priceChange: 2.34 },
        OGDC: { price: 89.23, priceChange: -1.45 }
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
    // Removed setInterval to only fetch once on mount
  }, []);

  if (isLoading) {
    return (
      <div className="bg-black border-y border-gray-700 py-4">
        <div className="flex items-center justify-center space-x-4">
          <Activity className="w-5 h-5 text-gray-400 animate-pulse" />
          <span className="text-gray-400 font-medium">Loading market data...</span>
        </div>
      </div>
    );
  }

  const tickerItems = symbols.map((symbol, idx) => {
    const stock = stocks[symbol];
    const price = stock?.price?.toFixed(2);
    const change = stock?.priceChange?.toFixed(2);
    const isPositive = (stock?.priceChange || 0) >= 0;

    return (
      <div 
        key={`${symbol}-${idx}`} 
        className="flex items-center space-x-3 mx-6 whitespace-nowrap group hover:scale-105 transition-transform duration-300"
      >
        <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 hover:border-gray-500 transition-all duration-300">
          <div className="flex items-center space-x-2">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-green-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-400" />
            )}
            <span className="font-bold text-white text-sm">{symbol}</span>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-white font-mono text-sm">
              {price || 'N/A'}
            </span>
            <span className={`text-xs font-mono ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? '+' : ''}{change || '0.00'}
            </span>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="relative bg-black border-y border-gray-700 py-4 overflow-hidden">
      {/* Market status indicator */}
      <div className="absolute top-2 left-4 flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-green-400 text-xs font-medium">LIVE MARKET DATA</span>
      </div>

      {/* Scrolling ticker */}
      <div className="flex mt-6">
        <div className="ticker-content flex items-center">
          {tickerItems}
          {tickerItems}
        </div>
        <div className="ticker-content flex items-center">
          {tickerItems}
          {tickerItems}
        </div>
      </div>

      <style>{`
        @keyframes seamless-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100%);
          }
        }
        
        .ticker-content {
          animation: seamless-scroll 30s linear infinite;
        }
        
        .ticker-content:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default PSXLivePrices;