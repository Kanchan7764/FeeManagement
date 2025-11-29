import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { Link } from "react-router-dom";
import {
  FaUserGraduate,
  FaRupeeSign,
  FaExclamationTriangle,
} from "react-icons/fa";
import { MdPendingActions, MdPayments } from "react-icons/md";
import { BarChart2 } from "lucide-react";

const AdminSummary = () => {
  const [data, setData] = useState({
    totalStudents: 0,
    totalCollected: 0,
    pendingFees: 0,
    defaulters: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/admin/dashboard");
        const d = res.data || {};

        setData({
          totalStudents: d.totalStudents || 0,
          totalCollected: d.totalCollected || 0,
          pendingFees: d.totalPending || 0,
          defaulters: d.defaulters || 0,
        });

        setChartData([
          { name: "Collected", amount: d.totalCollected || 0 },
          { name: "Pending", amount: d.totalPending || 0 },
          { name: "Defaulters", amount: (d.defaulters || 0) * 1000 },
        ]);

        setPieData([
          { name: "Collected", value: d.totalCollected || 0 },
          { name: "Pending", value: d.totalPending || 0 },
        ]);
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const COLORS = ["#22c55e", "#facc15", "#ef4444"];

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-200 bg-[#0f172a] min-h-screen">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-400 bg-[#0f172a] min-h-screen">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-5 bg-[#0f172a] min-h-screen text-gray-100">

      <h1 className="text-xl sm:text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* TOP CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">

        <div className="bg-blue-600 p-4 sm:p-5 rounded-xl text-center shadow-lg">
          <FaUserGraduate className="text-3xl mx-auto mb-2" />
          <h3 className="text-lg font-semibold">Total Students</h3>
          <p className="text-2xl font-bold mt-2">{data.totalStudents}</p>
          <span className="text-sm opacity-80">Active enrollment</span>
        </div>

        <div className="bg-green-600 p-4 sm:p-5 rounded-xl text-center shadow-lg">
          <FaRupeeSign className="text-3xl mx-auto mb-2" />
          <h3 className="text-lg font-semibold">Total Collected</h3>
          <p className="text-2xl font-bold mt-2">₹{data.totalCollected}</p>
          <span className="text-sm opacity-80">This academic year</span>
        </div>

        <div className="bg-yellow-500 p-4 sm:p-5 rounded-xl text-center shadow-lg">
          <MdPendingActions className="text-3xl mx-auto mb-2" />
          <h3 className="text-lg font-semibold">Pending Fees</h3>
          <p className="text-2xl font-bold mt-2">₹{data.pendingFees}</p>
          <span className="text-sm opacity-80">Requires attention</span>
        </div>

        <div className="bg-red-600 p-4 sm:p-5 rounded-xl text-center shadow-lg">
          <FaExclamationTriangle className="text-3xl mx-auto mb-2" />
          <h3 className="text-lg font-semibold">Defaulters</h3>
          <p className="text-2xl font-bold mt-2">{data.defaulters}</p>
          <span className="text-sm opacity-80">Overdue payments</span>
        </div>

      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        <div className="bg-[#1e293b] p-4 sm:p-6 rounded-xl shadow-lg">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Fee Overview</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#1e293b] p-4 sm:p-6 rounded-xl shadow-lg">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Fee Distribution</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={85}
                dataKey="value"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-[#1e293b] p-4 sm:p-6 rounded-xl shadow-lg">
  <h2 className="text-lg sm:text-xl font-semibold mb-4">Quick Actions</h2>

  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">

    <Link
      className="flex flex-col items-center justify-center p-4 rounded-xl bg-blue-500 bg-opacity-10 hover:bg-opacity-20 transition"
      to="/admin-dashboard/add-student"
    >
      <FaUserGraduate className="text-blue-400 mb-2" size={26} />
      <span>Add Student</span>
    </Link>

    <Link
      className="flex flex-col items-center justify-center p-4 rounded-xl bg-green-500 bg-opacity-10 hover:bg-opacity-20 transition"
      to="/admin-dashboard/fee/add"
    >
      <MdPayments className="text-green-400 mb-2" size={26} />
      <span>Create Fee</span>
    </Link>

    <Link
      className="flex flex-col items-center justify-center p-4 rounded-xl bg-purple-500 bg-opacity-10 hover:bg-opacity-20 transition"
      to="/admin-dashboard/fee/all"
    >
      <FaRupeeSign className="text-purple-400 mb-2" size={26} />
      <span>View Payments</span>
    </Link>

    <Link
      className="flex flex-col items-center justify-center p-4 rounded-xl bg-yellow-500 bg-opacity-10 hover:bg-opacity-20 transition"
      to="/admin-dashboard/analytics"
    >
      <BarChart2 className="text-yellow-400 mb-2" size={26} />
      <span>Analytics</span>
    </Link>

  </div>
</div>


    </div>
  );
};

export default AdminSummary;
