import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gray-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/3 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
        {/* 404 Animation */}
        <div className="mb-8 relative">
          <div className="text-[12rem] md:text-[16rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500 leading-none animate-fade-in">
            404
          </div>
          <div className="absolute inset-0 text-[12rem] md:text-[16rem] font-bold text-white/5 leading-none animate-pulse">
            404
          </div>
        </div>

        {/* Error Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center border border-white/20">
            <AlertCircle className="w-10 h-10 text-white animate-pulse" />
          </div>
        </div>

        {/* Main Message */}
        <div className="mb-8 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-playfair animate-fade-in">
            Page Not Found
          </h1>
          <p className="text-xl text-gray-300 mb-2 animate-fade-in delay-200">
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className="text-gray-400 animate-fade-in delay-300">
            The page might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Current Path Display */}
        <div className="mb-8 animate-fade-in delay-400">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-4 inline-block">
            <span className="text-gray-400 text-sm">Attempted URL: </span>
            <span className="text-white font-mono">{location.pathname}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in delay-500">
          <Link
            to="/"
            className="group flex items-center space-x-3 bg-white text-black px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            <span>Go Home</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="group flex items-center space-x-3 bg-white/10 backdrop-blur-lg text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 border border-white/20 transform hover:scale-105 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Quick Links */}
        <div className="mt-12 animate-fade-in delay-700">
          <p className="text-gray-400 mb-4">Or try these popular pages:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { name: 'About Us', path: '/about' },
              { name: 'Retail', path: '/retail' },
              { name: 'Private', path: '/private' },
              { name: 'Corporate', path: '/corporate' },
              { name: 'Contact', path: '/contact' }
            ].map((link, index) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-400 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 text-sm border border-transparent hover:border-white/20"
                style={{ animationDelay: `${800 + index * 100}ms` }}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;