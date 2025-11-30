import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaUserCircle, FaCalendarAlt, FaExclamationTriangle } from "react-icons/fa";
import { MdPendingActions, MdPayments } from "react-icons/md";
import { useAuth } from "../../context/authContext";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const SummaryStu = () => {
  const { user } = useAuth();
  const [fees, setFees] = useState([]);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [overdueAmount, setOverdueAmount] = useState(0);
  const [nextPayment, setNextPayment] = useState(null);
  const { id } = useParams();
  const [student, setStudent] = useState(null);

  // Fetch student info
  useEffect(() => {
    if (!user?._id) return;
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/student/${user._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.data.success) setStudent(res.data.student);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStudent();
  }, [user]);

  // Fetch fee info
  useEffect(() => {
    if (!user?._id) return;
    const fetchFees = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/fee/${user._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.data.success && Array.isArray(res.data.studentFee)) {
          const studentFee = res.data.studentFee;
          let paid = 0,
            pending = 0;
          const formatted = studentFee.map((fee, idx) => {
            const amount = fee.fees || 0;
            if (["completed", "paid"].includes(fee.status?.toLowerCase())) paid += amount;
            else pending += amount;

            return {
              sno: idx + 1,
              feeType: fee.fee || "Regular Fee",
              amount,
              status: fee.status || "Pending",
              dueDate: fee.duedate ? new Date(fee.duedate).toLocaleDateString() : "—",
              completedDate: fee.completedDate
                ? new Date(fee.completedDate).toLocaleDateString()
                : "—",
            };
          });
          setFees(formatted);
          setTotalPaid(paid);
          setTotalPending(pending);
          setOverdueAmount(pending);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchFees();
  }, [user]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">
      {/* Student Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-md rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8"
      >
        <div className="flex items-center gap-4 mb-4 sm:mb-0">
          <FaUserCircle className="text-teal-600 text-4xl sm:text-5xl" />
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              {user?.name || "Student Name"}
            </h2>
            <p className="text-sm sm:text-base text-gray-500">
              Class: <span className="font-medium">{student?.classs?.class_name || "N/A"}</span>
            </p>
            <p className="text-xs sm:text-sm text-gray-400">
              Registration: {student?.studentId || "N/A"}
            </p>
          </div>
        </div>
        <Link
          to={`/student-dashboard/profile/${user?._id}`}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base transition"
        >
          View Profile
        </Link>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-10">
        {[
          { title: "Pending Amount", value: totalPending, icon: <MdPendingActions size={35} />, bg: "bg-yellow-400" },
          { title: "Total Paid", value: totalPaid, icon: <MdPayments size={35} />, bg: "bg-green-500" },
          {
            title: "Next Payment",
            value: nextPayment ? nextPayment.amount : null,
            icon: <FaCalendarAlt size={35} />,
            bg: "bg-blue-500",
            extra: nextPayment
              ? `Due ${new Date(nextPayment.dueDate).toLocaleDateString()}`
              : "No upcoming payments",
          },
          { title: "Overdue Fees", value: overdueAmount, icon: <FaExclamationTriangle size={35} />, bg: "bg-red-500" },
        ].map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx }}
            className={`${card.bg} text-white p-4 sm:p-5 rounded-2xl shadow-md flex justify-between items-center`}
          >
            <div>
              <p className="text-sm sm:text-lg font-medium">{card.title}</p>
              {card.value !== null ? (
                <h2 className="text-xl sm:text-2xl font-bold mt-1">₹{card.value.toLocaleString()}</h2>
              ) : null}
              {card.extra && <p className="text-xs sm:text-sm opacity-90">{card.extra}</p>}
              {!card.value && !card.extra && <p className="text-xs sm:text-sm opacity-90">—</p>}
            </div>
            {card.icon}
          </motion.div>
        ))}
      </div>

      {/* Fee Details Table */}
      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 overflow-x-auto">
        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">All Fee Details</h3>
        <table className="w-full min-w-max border-collapse text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="py-2 px-3 border-b">S No</th>
              <th className="py-2 px-3 border-b">Fee Type</th>
              <th className="py-2 px-3 border-b">Amount</th>
              <th className="py-2 px-3 border-b">Due Date</th>
              <th className="py-2 px-3 border-b">Payment Date</th>
              <th className="py-2 px-3 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {fees.length > 0 ? (
              fees.map((f, i) => (
                <tr key={i} className="border-b hover:bg-gray-50 transition text-gray-700">
                  <td className="py-2 px-3">{i + 1}</td>
                  <td className="py-2 px-3">{f.feeType || "N/A"}</td>
                  <td className="py-2 px-3">₹{f.amount}</td>
                  <td className="py-2 px-3">{f.dueDate}</td>
                  <td className="py-2 px-3">{f.completedDate}</td>
                  <td className="py-2 px-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        ["completed", "paid"].includes(f.status?.toLowerCase())
                          ? "bg-green-100 text-green-700"
                          : f.status?.toLowerCase() === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {f.status || "N/A"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No fee records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SummaryStu;
