import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaChalkboard,
  FaFileInvoiceDollar,
  FaTachometerAlt,
  FaUsers,
  FaAngleDown,
  FaAngleUp,
  FaUserGraduate,
  FaIdCard,
  FaBook,
  FaClipboardList,
  FaMoneyCheckAlt,
  FaRegMoneyBillAlt,
  FaRegFileAlt,
  FaRegBuilding,
  FaCreditCard,
} from "react-icons/fa";

const AdminSidebar = ({ closeSidebar }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <div className="bg-gray-800 text-white h-screen fixed left-0 top-0 w-64 space-y-2 overflow-y-auto">

      {/* Header */}
      <div className="bg-teal-600 h-12 flex items-center justify-center">
        <h3 className="text-xl font-semibold">Fee Manage System</h3>
      </div>

      <div className="px-4">

        {/* Dashboard */}
        <NavLink
          to="/admin-dashboard"
          onClick={closeSidebar}
          className={({ isActive }) =>
            `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 pl-3 py-2.5 rounded`
          }
          end
        >
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>

        {/* Student Dropdown */}
        <div>
          <button
            onClick={() => toggleDropdown("student")}
            className="flex items-center justify-between w-full pl-3 py-2.5 rounded hover:bg-teal-500"
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
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `${isActive ? "bg-teal-500" : ""} flex items-center space-x-2 py-2 px-3 rounded hover:bg-teal-600`
                }
              >
                <FaUserGraduate />
                <span>Student List</span>
              </NavLink>
              <NavLink
                to="/admin-dashboard/Id/:id"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `${isActive ? "bg-teal-500" : ""} flex items-center space-x-2 py-2 px-3 rounded hover:bg-teal-600`
                }
              >
                <FaIdCard />
                <span>Student ID</span>
              </NavLink>
              <NavLink
                to="/admin-dashboard/add-student"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `${isActive ? "bg-teal-500" : ""} flex items-center space-x-2 py-2 px-3 rounded hover:bg-teal-600`
                }
              >
                <FaBook />
                <span>Add Student</span>
              </NavLink>
              <NavLink
                to="/admin-dashboard/progresscard"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `${isActive ? "bg-teal-500" : ""} flex items-center space-x-2 py-2 px-3 rounded hover:bg-teal-600`
                }
              >
                <FaClipboardList />
                <span>Progress Card</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Marks Dropdown */}
        <div>
          <button
            onClick={() => toggleDropdown("marks")}
            className="flex items-center justify-between w-full pl-3 py-2.5 rounded hover:bg-teal-500"
          >
            <div className="flex items-center space-x-4">
              <FaClipboardList />
              <span>Marks</span>
            </div>
            {openDropdown === "marks" ? <FaAngleUp /> : <FaAngleDown />}
          </button>
          {openDropdown === "marks" && (
            <div className="pl-12 flex flex-col space-y-1">
              <NavLink
                to="/admin-dashboard/addmarks"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `${isActive ? "bg-teal-500" : ""} flex items-center space-x-2 py-2 px-3 rounded hover:bg-teal-600`
                }
              >
                <FaClipboardList />
                <span>Add Marks</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Exam Dropdown */}
        <div>
          <button
            onClick={() => toggleDropdown("exam")}
            className="flex items-center justify-between w-full pl-3 py-2.5 rounded hover:bg-teal-500"
          >
            <div className="flex items-center space-x-4">
              <FaRegFileAlt />
              <span>Exam</span>
            </div>
            {openDropdown === "exam" ? <FaAngleUp /> : <FaAngleDown />}
          </button>
          {openDropdown === "exam" && (
            <div className="pl-12 flex flex-col space-y-1">
              <NavLink
                to="/admin-dashboard/addexam"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `${isActive ? "bg-teal-500" : ""} flex items-center space-x-2 py-2 px-3 rounded hover:bg-teal-600`
                }
              >
                <FaBook />
                <span>Add Exam</span>
              </NavLink>
              <NavLink
                to="/admin-dashboard/exam"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `${isActive ? "bg-teal-500" : ""} flex items-center space-x-2 py-2 px-3 rounded hover:bg-teal-600`
                }
              >
                <FaClipboardList />
                <span>Exam List</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Teacher Dropdown */}
        <div>
          <button
            onClick={() => toggleDropdown("teacher")}
            className="flex items-center justify-between w-full pl-3 py-2.5 rounded hover:bg-teal-500"
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
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `${isActive ? "bg-teal-500" : ""} flex items-center space-x-2 py-2 px-3 rounded hover:bg-teal-600`
                }
              >
                <FaUserGraduate />
                <span>Teacher List</span>
              </NavLink>
              <NavLink
                to="/admin-dashboard/add-teacher"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `${isActive ? "bg-teal-500" : ""} flex items-center space-x-2 py-2 px-3 rounded hover:bg-teal-600`
                }
              >
                <FaBook />
                <span>Add Teacher</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Subject Dropdown */}
        <div>
          <button
            onClick={() => toggleDropdown("subject")}
            className="flex items-center justify-between w-full pl-3 py-2.5 rounded hover:bg-teal-500"
          >
            <div className="flex items-center space-x-4">
              <FaBook />
              <span>Subject</span>
            </div>
            {openDropdown === "subject" ? <FaAngleUp /> : <FaAngleDown />}
          </button>
          {openDropdown === "subject" && (
            <div className="pl-12 flex flex-col space-y-1">
              <NavLink
                to="/admin-dashboard/subject"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `${isActive ? "bg-teal-500" : ""} flex items-center space-x-2 py-2 px-3 rounded hover:bg-teal-600`
                }
              >
                <FaRegBuilding />
                <span>Subject List</span>
              </NavLink>
              <NavLink
                to="/admin-dashboard/addsubject"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `${isActive ? "bg-teal-500" : ""} flex items-center space-x-2 py-2 px-3 rounded hover:bg-teal-600`
                }
              >
                <FaBook />
                <span>Add Subject</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Class Dropdown */}
        <div>
          <button
            onClick={() => toggleDropdown("class")}
            className="flex items-center justify-between w-full pl-3 py-2.5 rounded hover:bg-teal-500"
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
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `${isActive ? "bg-teal-500" : ""} flex items-center space-x-2 py-2 px-3 rounded hover:bg-teal-600`
                }
              >
                <FaChalkboard />
                <span>Class List</span>
              </NavLink>
              <NavLink
                to="/admin-dashboard/add-class"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `${isActive ? "bg-teal-500" : ""} flex items-center space-x-2 py-2 px-3 rounded hover:bg-teal-600`
                }
              >
                <FaBook />
                <span>Add Class</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Fee Dropdown */}
        <div>
          <button
            onClick={() => toggleDropdown("fee")}
            className="flex items-center justify-between w-full pl-3 py-2.5 rounded hover:bg-teal-500"
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
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `${isActive ? "bg-teal-500" : ""} flex items-center space-x-2 py-2 px-3 rounded hover:bg-teal-600`
                }
              >
                <FaMoneyCheckAlt />
                <span>Assign Fee List</span>
              </NavLink>
              <NavLink
                to="/admin-dashboard/fee/add"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `${isActive ? "bg-teal-500" : ""} flex items-center space-x-2 py-2 px-3 rounded hover:bg-teal-600`
                }
              >
                <FaRegMoneyBillAlt />
                <span>Assign Fee</span>
              </NavLink>
              <NavLink
                to="/admin-dashboard/payment/all"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `${isActive ? "bg-teal-500" : ""} flex items-center space-x-2 py-2 px-3 rounded hover:bg-teal-600`
                }
              >
                <FaCreditCard />
                <span>Deposit List</span>
              </NavLink>
              <NavLink
                to="/admin-dashboard/payment/statement"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `${isActive ? "bg-teal-500" : ""} flex items-center space-x-2 py-2 px-3 rounded hover:bg-teal-600`
                }
              >
                <FaFileInvoiceDollar />
                <span>Statement</span>
              </NavLink>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminSidebar;
