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
} from "react-icons/fa";
import { useAuth } from "../../context/authContext";

const SidebarStu = () => {
  const { user } = useAuth();

  // State to track which dropdown is open
  const [openDropdown, setOpenDropdown] = useState("");

  const toggleDropdown = (name) => {
    if (openDropdown === name) setOpenDropdown("");
    else setOpenDropdown(name);
  };

  return (
    <div className="bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 w-64 overflow-auto">
      <div className="bg-teal-600 h-12 flex items-center justify-center">
        <h3 className="text-2xl font-pacific">Fee Manage System</h3>
      </div>

      <div className="px-4 mt-2 space-y-1">

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

        {/* Payments */}
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
  );
};

export default SidebarStu;
