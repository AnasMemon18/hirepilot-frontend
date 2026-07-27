import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Briefcase } from 'lucide-react';

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo & Mobile Menu */}
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md hover:bg-blue-500 lg:hidden transition-colors"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            {/* Logo */}
            <div 
              onClick={() => navigate('/')} 
              className="flex items-center gap-2 ml-2 cursor-pointer"
            >
              <Briefcase className="h-8 w-8" />
              <span className="text-xl font-bold">HirePilot</span>
              <span className="text-xs bg-blue-400 px-2 py-0.5 rounded-full ml-1 hidden sm:inline">
                AI
              </span>
            </div>
          </div>

          {/* Right side - User/Profile */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm">
              <span className="text-blue-200">AI Powered</span>
              <span className="h-4 w-px bg-blue-400"></span>
              <span className="text-blue-200">v1.0</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-sm font-semibold">
              HR
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;