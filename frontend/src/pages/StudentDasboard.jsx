import React from 'react'
import SidebarStu from '../components/StudentDashboard.jsx/SidebarStu'
import {Outlet} from 'react-router-dom'
import Navbar from '../components/dashboard/Navbar'

const StudentDasboard = () => {
  return (
    <div className='flex'>
      <SidebarStu/>
      <div className='flex-1 ml-64 bg-gray-100 h-screen'>
       <Navbar/>
       <Outlet/>
      </div>
    </div>
  )
}

export default StudentDasboard
