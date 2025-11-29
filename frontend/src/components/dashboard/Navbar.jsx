import React from "react";
import { useAuth } from "../../context/authContext";
import { Menu } from "lucide-react";

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <div className="w-full flex items-center justify-between bg-teal-600 text-white px-3 sm:px-4 md:px-6 h-12 sticky top-0 z-10 shadow-md">
      
      {/* LEFT SIDE: Mobile menu + Welcome */}
      <div className="flex items-center space-x-2">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="md:hidden flex-shrink-0"
        >
          <Menu size={24} className="text-white" />
        </button>

        {/* Welcome text */}
        <p className="font-medium text-sm sm:text-base truncate max-w-[150px] sm:max-w-xs">
          Welcome {user?.name}
        </p>
      </div>

      {/* RIGHT SIDE: Logout */}
      <button
        className="flex-shrink-0 px-2 sm:px-3 py-1 rounded bg-teal-700 hover:bg-teal-800 transition text-xs sm:text-sm md:text-base"
        onClick={logout}
      >
        Logout
      </button>

    </div>
  );
};

export default Navbar;
