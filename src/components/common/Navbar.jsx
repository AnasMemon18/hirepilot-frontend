import React from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Briefcase, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";


const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md hover:bg-blue-500 lg:hidden transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-2 ml-2 cursor-pointer"
            >
              <Briefcase className="h-8 w-8" />
              <span className="text-xl font-bold">HirePilot</span>
              <span className="text-xs bg-blue-400 px-2 py-0.5 rounded-full ml-1 hidden sm:inline">
                AI
              </span>
            </div>
          </div>

          {/* Right side - User Profile & Logout */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm">
              <span className="text-blue-200">AI Powered</span>
              <span className="h-4 w-px bg-blue-400"></span>
              <span className="text-blue-200">v1.0</span>
            </div>

            {/* ✅ Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-500 hover:bg-red-600 rounded-lg transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>

        
            <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-sm font-semibold text-white">
              {user?.firstName && user?.lastName
                ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
                : user?.firstName
                  ? user.firstName.substring(0, 2).toUpperCase()
                  : "U"}
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
