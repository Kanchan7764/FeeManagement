import React from 'react'
import { useAuth } from '../context/authContext'
import AdminSidebar from '../components/dashboard/AdminSidebar'
import Navbar from '../components/dashboard/Navbar'
import AdminSummary from '../components/dashboard/AdminSummary'
import { Outlet } from 'react-router-dom'

const AdminDashboard = () => {
  const {user} = useAuth()
  
  return (
    <div className="flex h-screen overflow-hidden">
      {/* ✅ FIXED SIDEBAR */}
      <div className="w-64 fixed top-0 left-0 h-full bg-gray-800 text-white shadow-lg z-20">
        <AdminSidebar />
      </div>

      {/* ✅ MAIN SECTION */}
      <div className="flex-1 ml-64 flex flex-col bg-gray-100 text-gray-900">
        {/* ✅ STICKY NAVBAR — NO SPACE */}
        <div className="sticky top-0 z-10 bg-white shadow-md m-0 p-0">
          <Navbar />
        </div>

        {/* ✅ SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto m-0">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
