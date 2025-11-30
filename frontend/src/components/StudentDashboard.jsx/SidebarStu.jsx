import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaUser,
  FaFileInvoiceDollar,
  FaCreditCard,
  FaSlidersH,
  FaTachometerAlt,
  FaChevronDown,
  FaChevronUp,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../../context/authContext";

const SidebarStu = () => {
  const { user } = useAuth();
  const [openDropdown, setOpenDropdown] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false); // for mobile toggle

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? "" : name);
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="sm:hidden flex items-center justify-between bg-teal-600 text-white p-3">
        <h3 className="text-lg font-bold">Fee Manage System</h3>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-gray-800 text-white 
          w-64 transform transition-transform duration-300
          z-50 sm:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          sm:relative sm:translate-x-0
        `}
      >
        <div className="bg-teal-600 h-12 flex items-center justify-center sm:hidden">
          <h3 className="text-xl font-pacific">Fee Manage System</h3>
        </div>

        <div className="px-4 mt-2 space-y-1 overflow-y-auto h-full">
          {/* Dashboard */}
          <NavLink
            to="/student-dashboard"
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 pl-3 py-2.5 rounded`
            }
            end
          >
            <FaTachometerAlt />
            <span>Dashboard</span>
          </NavLink>

          {/* Profile Dropdown */}
          <div>
            <button
              onClick={() => toggleDropdown("profile")}
              className="w-full flex justify-between items-center pl-3 py-2.5 rounded hover:bg-teal-700"
            >
              <div className="flex items-center space-x-4">
                <FaUser />
                <span>My Profile</span>
              </div>
              {openDropdown === "profile" ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {openDropdown === "profile" && (
              <div className="pl-10 flex flex-col space-y-1">
                <NavLink
                  to={`/student-dashboard/profile/${user._id}`}
                  className={({ isActive }) =>
                    `${isActive ? "bg-teal-500" : ""} py-1 rounded pl-2`
                  }
                >
                  View Profile
                </NavLink>
                <NavLink
                  to={`/student-dashboard/edit/${user._id}`}
                  className={({ isActive }) =>
                    `${isActive ? "bg-teal-500" : ""} py-1 rounded pl-2`
                  }
                >
                  Edit Profile
                </NavLink>
                <NavLink
                  to={`/student-dashboard/studentId/${user._id}`}
                  className={({ isActive }) =>
                    `${isActive ? "bg-teal-500" : ""} py-1 rounded pl-2`
                  }
                >
                  Download Id
                </NavLink>
              </div>
            )}
          </div>

          {/* Fees Dropdown */}
          <div>
            <button
              onClick={() => toggleDropdown("fees")}
              className="w-full flex justify-between items-center pl-3 py-2.5 rounded hover:bg-teal-700"
            >
              <div className="flex items-center space-x-4">
                <FaFileInvoiceDollar />
                <span>Fees</span>
              </div>
              {openDropdown === "fees" ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {openDropdown === "fees" && (
              <div className="pl-10 flex flex-col space-y-1">
                <NavLink
                  to={`/student-dashboard/fee/${user._id}`}
                  className={({ isActive }) =>
                    `${isActive ? "bg-teal-500" : ""} py-1 rounded pl-2`
                  }
                >
                  Assign Fees
                </NavLink>
                <NavLink
                  to={`/student-dashboard/payment/statement`}
                  className={({ isActive }) =>
                    `${isActive ? "bg-teal-500" : ""} py-1 rounded pl-2`
                  }
                >
                  Statement
                </NavLink>
              </div>
            )}
          </div>

          {/* Payments Dropdown */}
          <div>
            <button
              onClick={() => toggleDropdown("payments")}
              className="w-full flex justify-between items-center pl-3 py-2.5 rounded hover:bg-teal-700"
            >
              <div className="flex items-center space-x-4">
                <FaCreditCard />
                <span>Payments</span>
              </div>
              {openDropdown === "payments" ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {openDropdown === "payments" && (
              <div className="pl-10 flex flex-col space-y-1">
                <NavLink
                  to="/student-dashboard/add-payment"
                  className={({ isActive }) =>
                    `${isActive ? "bg-teal-500" : ""} py-1 rounded pl-2`
                  }
                >
                  Add Payment
                </NavLink>
                <NavLink
                  to="/student-dashboard/payment"
                  className={({ isActive }) =>
                    `${isActive ? "bg-teal-500" : ""} py-1 rounded pl-2`
                  }
                >
                  Payment List
                </NavLink>
              </div>
            )}
          </div>

          {/* Settings */}
          <NavLink
            to="/student-dashboard/setting"
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 pl-3 py-2.5 rounded`
            }
          >
            <FaSlidersH />
            <span>Settings</span>
          </NavLink>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-40 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default SidebarStu;
