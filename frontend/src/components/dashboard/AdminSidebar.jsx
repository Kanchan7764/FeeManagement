import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaBuilding,
  FaChalkboard,
  FaCoins,
  FaCreditCard,
  FaDollarSign,
  FaFileInvoiceDollar,
  FaMoneyBill,
  FaMoneyBillAlt,
  FaReceipt,
  FaSlidersH,
  FaTachometerAlt,
  FaUsers,
  FaAngleDown,
  FaAngleUp,
} from "react-icons/fa";

const AdminSidebar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <div className="bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 space-y-2 w-64">
      <div className="bg-teal-600 h-12 flex items-center justify-center">
        <h3 className="text-2xl text-center font-pacific">Fee Manage System</h3>
      </div>
      <div className="px-4">
        {/* Dashboard */}
        <NavLink
          to="/admin-dashboard"
          className={({ isActive }) =>
            `${
              isActive ? "bg-teal-500 pl-3" : ""
            } flex items-center justify-between space-x-4 pl-3 py-2.5 rounded`
          }
          end
        >
          <div className="flex items-center space-x-4">
            <FaTachometerAlt />
            <span>Dashboard</span>
          </div>
        </NavLink>

        {/* Student Dropdown */}
        <div>
          <button
            onClick={() => toggleDropdown("student")}
            className="flex items-center justify-between w-full space-x-4 pl-3 py-2.5 rounded hover:bg-teal-500"
          >
            <div className="flex items-center space-x-4">
              <FaUsers />
              <span>Student</span>
            </div>
            {openDropdown === "student" ? <FaAngleUp /> : <FaAngleDown />}
          </button>
          {openDropdown === "student" && (
            <div className="pl-12 flex flex-col space-y-1">
              <NavLink
                to="/admin-dashboard/student"
                className={({ isActive }) =>
                  `${
                    isActive ? "bg-teal-500" : ""
                  } py-2 px-3 rounded hover:bg-teal-600`
                }
              >
                Student List
              </NavLink>
              <NavLink
                to="/admin-dashboard/Id/:id"
                className={({ isActive }) =>
                  `${
                    isActive ? "bg-teal-500" : ""
                  } py-2 px-3 rounded hover:bg-teal-600`
                }
              >
                Student ID
              </NavLink>
              <NavLink
                to="/admin-dashboard/add-student"
                className={({ isActive }) =>
                  `${
                    isActive ? "bg-teal-500" : ""
                  } py-2 px-3 rounded hover:bg-teal-600`
                }
              >
                Add Student
              </NavLink>
               <NavLink
                to="/admin-dashboard/progresscard"
                className={({ isActive }) =>
                  `${
                    isActive ? "bg-teal-500" : ""
                  } py-2 px-3 rounded hover:bg-teal-600`
                }
              >
                 Progress Card 
              </NavLink>
            </div>
          )}
        </div>

        <div>
          <button
            onClick={() => toggleDropdown("marks")}
            className="flex items-center justify-between w-full space-x-4 pl-3 py-2.5 rounded hover:bg-teal-500"
          >
            <div className="flex items-center space-x-4">
              <FaUsers />
              <span>Marks</span>
            </div>
            {openDropdown === "marks" ? <FaAngleUp /> : <FaAngleDown />}
          </button>
          {openDropdown === "marks" && (
            <div className="pl-12 flex flex-col space-y-1">
              <NavLink
                to="/admin-dashboard/addmarks"
                className={({ isActive }) =>
                  `${
                    isActive ? "bg-teal-500" : ""
                  } py-2 px-3 rounded hover:bg-teal-600`
                }
              >
                Marks Add
              </NavLink>
              
              
            </div>
          )}
        </div>

        <div>
          <button
            onClick={() => toggleDropdown("exam")}
            className="flex items-center justify-between w-full space-x-4 pl-3 py-2.5 rounded hover:bg-teal-500"
          >
            <div className="flex items-center space-x-4">
              <FaUsers />
              <span>Exam</span>
            </div>
            {openDropdown === "exam" ? <FaAngleUp /> : <FaAngleDown />}
          </button>
          {openDropdown === "exam" && (
            <div className="pl-12 flex flex-col space-y-1">
              <NavLink
                to="/admin-dashboard/addexam"
                className={({ isActive }) =>
                  `${
                    isActive ? "bg-teal-500" : ""
                  } py-2 px-3 rounded hover:bg-teal-600`
                }
              >
                Add Exam
              </NavLink>
              <NavLink
                to="/admin-dashboard/exam"
                className={({ isActive }) =>
                  `${
                    isActive ? "bg-teal-500" : ""
                  } py-2 px-3 rounded hover:bg-teal-600`
                }
              >
                Exam List
              </NavLink>
              
              
            </div>
          )}
        </div>

        <div>
          <button
            onClick={() => toggleDropdown("teacher")}
            className="flex items-center justify-between w-full space-x-4 pl-3 py-2.5 rounded hover:bg-teal-500"
          >
            <div className="flex items-center space-x-4">
              <FaUsers />
              <span>Teacher</span>
            </div>
            {openDropdown === "teacher" ? <FaAngleUp /> : <FaAngleDown />}
          </button>
          {openDropdown === "teacher" && (
            <div className="pl-12 flex flex-col space-y-1">
              <NavLink
                to="/admin-dashboard/teacher"
                className={({ isActive }) =>
                  `${
                    isActive ? "bg-teal-500" : ""
                  } py-2 px-3 rounded hover:bg-teal-600`
                }
              >
                Teacher List
              </NavLink>
              
              <NavLink
                to="/admin-dashboard/add-teacher"
                className={({ isActive }) =>
                  `${
                    isActive ? "bg-teal-500" : ""
                  } py-2 px-3 rounded hover:bg-teal-600`
                }
              >
                Add Teacher
              </NavLink>
            </div>
          )}
        </div>

         <div>
          <button
            onClick={() => toggleDropdown("subject")}
            className="flex items-center justify-between w-full space-x-4 pl-3 py-2.5 rounded hover:bg-teal-500"
          >
            <div className="flex items-center space-x-4">
              <FaUsers />
              <span>Subject</span>
            </div>
            {openDropdown === "subject" ? <FaAngleUp /> : <FaAngleDown />}
          </button>
          {openDropdown === "subject" && (
            <div className="pl-12 flex flex-col space-y-1">
              <NavLink
                to="/admin-dashboard/subject"
                className={({ isActive }) =>
                  `${
                    isActive ? "bg-teal-500" : ""
                  } py-2 px-3 rounded hover:bg-teal-600`
                }
              >
                Subject List
              </NavLink>
              
              <NavLink
                to="/admin-dashboard/addsubject"
                className={({ isActive }) =>
                  `${
                    isActive ? "bg-teal-500" : ""
                  } py-2 px-3 rounded hover:bg-teal-600`
                }
              >
                Add Subject
              </NavLink>
            </div>
          )}
        </div>

        {/* Class Dropdown */}
        <div>
          <button
            onClick={() => toggleDropdown("class")}
            className="flex items-center justify-between w-full space-x-4 pl-3 py-2.5 rounded hover:bg-teal-500"
          >
            <div className="flex items-center space-x-4">
              <FaChalkboard />
              <span>Class</span>
            </div>
            {openDropdown === "class" ? <FaAngleUp /> : <FaAngleDown />}
          </button>
          {openDropdown === "class" && (
            <div className="pl-12 flex flex-col space-y-1">
              <NavLink
                to="/admin-dashboard/class"
                className={({ isActive }) =>
                  `${
                    isActive ? "bg-teal-500" : ""
                  } py-2 px-3 rounded hover:bg-teal-600`
                }
              >
                Class List
              </NavLink>
              <NavLink
                to="/admin-dashboard/add-class"
                className={({ isActive }) =>
                  `${
                    isActive ? "bg-teal-500" : ""
                  } py-2 px-3 rounded hover:bg-teal-600`
                }
              >
                Add Class
              </NavLink>
            </div>
          )}
        </div>

        <div>
          <button
            onClick={() => toggleDropdown("fee")}
            className="flex items-center justify-between w-full space-x-4 pl-3 py-2.5 rounded hover:bg-teal-500"
          >
            <div className="flex items-center space-x-4">
              <FaFileInvoiceDollar />
              <span>Fee</span>
            </div>
            {openDropdown === "fee" ? <FaAngleUp /> : <FaAngleDown />}
          </button>
          {openDropdown === "fee" && (
            <div className="pl-12 flex flex-col space-y-1">
              <NavLink
                to="/admin-dashboard/fee/all"
                className={({ isActive }) =>
                  `${
                    isActive ? "bg-teal-500" : ""
                  } py-2 px-3 rounded hover:bg-teal-600`
                }
              >
                Assign Fee List{" "}
              </NavLink>
              <NavLink
                to="/admin-dashboard/fee/add"
                className={({ isActive }) =>
                  `${
                    isActive ? "bg-teal-500" : ""
                  } py-2 px-3 rounded hover:bg-teal-600`
                }
              >
                Assign Fee
              </NavLink>

              <NavLink
                to="/admin-dashboard/payment/all"
                className={({ isActive }) =>
                  `${
                    isActive ? "bg-teal-500" : ""
                  } py-2 px-3 rounded hover:bg-teal-600`
                }
              >
                Deposit List
              </NavLink>
              <NavLink
                to="/admin-dashboard/payment/statement"
                className={({ isActive }) =>
                  `${
                    isActive ? "bg-teal-500" : ""
                  } py-2 px-3 rounded hover:bg-teal-600`
                }
              >
                Statement
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
