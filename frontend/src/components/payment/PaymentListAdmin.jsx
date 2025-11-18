import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";

const PaymentListAdmin = () => {
  const [payments, setPayments] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPayments();
  }, []);
const fetchPayments = async () => {
  try {
    const res = await axios.get(`http://localhost:3000/api/payment/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    const data = (res.data.allPayment || []).map((p, idx) => ({
      _id: p._id,
      sno: idx + 1,
      studentId: p.studentId?.studentId || "N/A",
      studentName: p.studentId?.userId?.name || "Unknown",
      feeId: p.feeId?.feeId || "N/A",
      paidAmount: p.paidAmount || 0,
      transactionId: p.paymentId || "N/A",
      paymentDate: p.paymentdate
        ? new Date(p.paymentdate).toLocaleDateString()
        : "N/A",
        status: p.status || "active", // 🔥 ADD THIS

    }));

    console.log("data", data);

    setPayments(data);
  } catch (err) {
    console.error("Error fetching payments:", err);
  }
};


const handleAccept = async (id) => {
  try {
    await axios.put(
      `http://localhost:3000/api/payment/accept/${id}`,
      {},
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );

    alert("Payment Accepted Successfully!");
    fetchPayments(); // refresh table
  } catch (error) {
    console.error("Accept error:", error);
  }
};

const handleReject = async (id) => {
  try {
    await axios.put(
      `http://localhost:3000/api/payment/reject/${id}`,
      {},
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );

    alert("Payment Rejected Successfully!");
    fetchPayments(); // refresh table
  } catch (error) {
    console.error("Reject error:", error);
  }
};

  

  const handleAddPayment = () => {
    navigate("/student-dashboard/add-payment");
  };

  const columns = [
  { name: "S.No", selector: (r) => r.sno, width: "70px" },

  {
    name: "Receipt",
    cell: (row) => (
      <button
        onClick={() => navigate(`/payment/recipt/${row._id}`)}
        className="bg-teal-600 text-white px-2 py-1 rounded hover:bg-teal-700"
      >
        🧾
      </button>
    ),
    width: "80px",
  },

  { name: "Student ID", selector: (r) => r.studentId, sortable: true },
  { name: "Fee ID", selector: (r) => r.feeId, sortable: true },
  { name: "Deposit Amount", selector: (r) => `₹${r.paidAmount}`, sortable: true },
  { name: "Transaction ID", selector: (r) => r.transactionId, sortable: true },
  { name: "Deposit Date", selector: (r) => r.paymentDate, sortable: true },

  // 🔥 STATUS COLUMN
  {
    name: "Status",
    selector: (row) => row.status,
    cell: (row) => (
      <span
        className={`px-3 py-1 rounded-full text-white text-sm ${
          row.status === "accepted"
            ? "bg-green-600"
            : row.status === "rejected"
            ? "bg-red-600"
            : "bg-yellow-500"
        }`}
      >
        {row.status?.toUpperCase()}
      </span>
    ),
    sortable: true,
    width: "150px",
  },

  // 🔥 ACTION COLUMN
  {
    name: "Action",
    cell: (row) => (
      <div className="flex gap-2">

        {/* Accept Button */}
        <button
          onClick={() => handleAccept(row._id)}
          className=" text-white px-2 py-1 rounded "
          title="Accept Payment"
        >
          ✅
        </button>

        {/* Reject Button */}
        <button
          onClick={() => handleReject(row._id)}
          className=" text-white px-2 py-1 rounded "
          title="Reject Payment"
        >
          ❌
        </button>

      </div>
    ),
    width: "150px",
  },
];


  return (
    <div className="p-6">
      {/* 🔹 Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleAddPayment}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          ➕ Add Payment
        </button>

        
      </div>

      {/* 🔹 Data Table */}
      <DataTable
        columns={columns}
        data={payments}
        pagination
        highlightOnHover
        striped
      />
    </div>
  );
};

export default PaymentListAdmin;
