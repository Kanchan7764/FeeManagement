import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaUserCircle,
  FaCalendarAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
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

  const {id}= useParams()
    const [student ,setStudent] = useState(null)

    useEffect(() => {
  if (!user || !user._id) return; // wait for user to be available

  const fetchStudent = async () => {
    try {
      const response = await axios.get(
  `http://localhost:3000/api/student/${user._id}`,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
);

      console.log("🎓 Student API response:", response.data);

      if (response.data.success) {
        setStudent(response.data.student);
        console.log("✅ Student stored in state:", response.data.student);
      }
    } catch (error) {
      console.error("❌ Error fetching student:", error);
    }
  };

  fetchStudent();
}, [user]); // run again when user changes




   useEffect(() => {
  if (!user || !user._id) return; 
  const fetchFees = async () => {
    try {
      const userId = user._id;
      console.log("➡️ Sending ID to backend:", user._id);

      const response = await axios.get(
        `http://localhost:3000/api/fee/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      

      if (response.data.success && Array.isArray(response.data.studentFee)) {
        const { studentFee } = response.data;

        let totalPaid = 0;
        let totalPending = 0;

        const formatted = studentFee.map((fee, index) => {
          const amount = fee.fees || 0;
          if (fee.status?.toLowerCase() === "completed" || fee.status?.toLowerCase() === "paid")
            totalPaid += amount;
          else if (fee.status?.toLowerCase() === "pending"|| "dues") totalPending += amount;

          return {
            sno: index + 1,
            feeType: fee.fee || "Regular Fee",
            amount: fee.fees || 0,
            status: fee.status || "Pending",
            dueDate: fee.duedate ? new Date(fee.duedate).toLocaleDateString() : "—",
            completedDate: fee.completedDate
              ? new Date(fee.completedDate).toLocaleDateString()
              : "—",
          };
                 

        });


        setFees(formatted);
        setTotalPaid(totalPaid);
        setTotalPending(totalPending);
        setOverdueAmount(totalPending);
      } else {
        console.warn(" No valid fee data found");
      }
    } catch (err) {
      console.error(" Error fetching student fees:", err);
    }
  };

  fetchFees();
}, [user]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
     
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-md rounded-2xl px-6 py-5 flex justify-between items-center mb-8"
      >
        <div className="flex items-center gap-4">
          <div className="text-5xl text-teal-600">
            <FaUserCircle />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {user?.name || "Student Name"}
            </h2>
            <p className="text-sm text-gray-500">
              Class: <span className="font-medium">{student?.classs.class_name || "N/A"}</span>
            </p>
            <p className="text-xs text-gray-400">
              Registration: {student?.studentId || "N/A"}
            </p>
          </div>
        </div>

        <Link
          to={`/student-dashboard/profile/${user?._id}`}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg text-sm transition"
        >
          View Profile
        </Link>
      </motion.div>

      {/* --- SUMMARY CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Pending Amount */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-yellow-400 text-white p-5 rounded-2xl shadow-md flex justify-between items-center"
        >
          <div>
            <p className="text-lg font-medium">Pending Amount</p>
            <h2 className="text-2xl font-bold mt-1">
              ₹{totalPending.toLocaleString()}
            </h2>
            <p className="text-sm opacity-90">Due fees to be paid</p>
          </div>
          <MdPendingActions size={40} />
        </motion.div>

        {/* Total Paid */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-green-500 text-white p-5 rounded-2xl shadow-md flex justify-between items-center"
        >
          <div>
            <p className="text-lg font-medium">Total Paid</p>
            <h2 className="text-2xl font-bold mt-1">
              ₹{totalPaid.toLocaleString()}
            </h2>
            <p className="text-sm opacity-90">All completed payments</p>
          </div>
          <MdPayments size={40} />
        </motion.div>

        {/* Next Payment */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-500 text-white p-5 rounded-2xl shadow-md flex justify-between items-center"
        >
          <div>
            <p className="text-lg font-medium">Next Payment</p>
            {nextPayment ? (
              <>
                <h2 className="text-2xl font-bold mt-1">
                  ₹{(nextPayment.amount || nextPayment.fees).toLocaleString()}
                </h2>
                <p className="text-sm opacity-90">
                  Due {new Date(nextPayment.dueDate).toLocaleDateString()}
                </p>
              </>
            ) : (
              <p className="text-sm">No upcoming payments</p>
            )}
          </div>
          <FaCalendarAlt size={40} />
        </motion.div>

        {/* Overdue Fees */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-red-500 text-white p-5 rounded-2xl shadow-md flex justify-between items-center"
        >
          <div>
            <p className="text-lg font-medium">Overdue Fees</p>
            <h2 className="text-2xl font-bold mt-1">
              ₹{overdueAmount.toLocaleString()}
            </h2>
            <p className="text-sm opacity-90">
              {overdueAmount > 0 ? "Overdue payments" : "No overdue fees"}
            </p>
          </div>
          <FaExclamationTriangle size={40} />
        </motion.div>
      </div>

      {/* --- FEE DETAILS TABLE --- */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">All Fee Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
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
              {fees.map((f, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition text-gray-700"
                >
                  <td className="py-2 px-3">{index + 1}</td>
                  <td className="py-2 px-3">{f.feeType || "N/A"}</td>
                  <td className="py-2 px-3">₹{f.amount || f.fees}</td>
                  <td className="py-2 px-3">
                    {f.dueDate ? new Date(f.dueDate).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="py-2 px-3">
                    {f.completedDate
                      ? new Date(f.completedDate).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="py-2 px-3 font-medium">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        f.status?.toLowerCase() === "completed" ||
                        f.status?.toLowerCase() === "paid"
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
              ))}
              {fees.length === 0 && (
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
    </div>
  );
};

export default SummaryStu;
