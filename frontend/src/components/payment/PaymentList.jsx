import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/payment/student/${user._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
console.log("res",res)
      // Filter payments only for logged-in student
      const studentPayments = (res.data.allPayment || [])
      console.log("payment",studentPayments)

      const data = studentPayments.map((p, idx) => ({
        _id: p._id,
        sno: idx + 1,
        studentId: p.studentId?.studentId || "N/A",
        studentName: p.studentId?.userId?.name || "Unknown",
        feeId: p.feeId?.feeId || "N/A",
        paidAmount: p.paidAmount || 0,
        paymentId: p.paymentId || "N/A",
        paymentDate: p.paymentdate
          ? new Date(p.paymentdate).toLocaleDateString()
          : "N/A",
      }));

      setPayments(data);
    } catch (err) {
      console.error("Error fetching payments:", err);
    }
  };

  const handleAddPayment = () => {
    navigate("/student-dashboard/add-payment");
  };

  const handleDownloadHistory = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/payment/receipt/all/${user._id}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (!res.ok) throw new Error("Failed to download payment history");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `All_Payment_Statement_${user._id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("❌ Error downloading payment history:", err);
    }
  };

  const columns = [
    { name: "S.No", selector: (r) => r.sno, width: "70px" },
    {
      name: "Receipt",
      cell: (row) => (
        <button
          className="bg-teal-600 text-white px-2 py-1 rounded hover:bg-teal-700"
          onClick={() => navigate(`/payment/recipt/${row._id}`)}
        >
          🧾
        </button>
      ),
      width: "80px",
    },
    { name: "Student ID", selector: (r) => r.studentId, sortable: true },
    { name: "Fee ID", selector: (r) => r.feeId, sortable: true },
    { name: "Deposit Amount", selector: (r) => `₹${r.paidAmount}`, sortable: true },
    { name: "Transaction ID", selector: (r) => r.paymentId, sortable: true },
    { name: "Deposit Date", selector: (r) => r.paymentDate, sortable: true },
  ];

  return (
    <div className="p-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleAddPayment}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          ➕ Add Payment
        </button>

        <button
          onClick={handleDownloadHistory}
          disabled={payments.length === 0}
          className={`px-4 py-2 rounded ${
            payments.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-teal-600 hover:bg-teal-700 text-white"
          }`}
        >
          Download Payment History
        </button>
      </div>

      {/* Data Table */}
      {payments.length === 0 ? (
        <p className="text-center font-semibold text-gray-600 mt-8">
          No payments found for this student.
        </p>
      ) : (
        <DataTable
          columns={columns}
          data={payments}
          pagination
          highlightOnHover
          striped
        />
      )}
    </div>
  );
};

export default PaymentList;
