import React, { useState, useEffect, useMemo } from "react";
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
        status: p.status || "active",
      }));

      setPayments(data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleAccept = async (id) => {
    try {
      await axios.put(
        `http://localhost:3000/api/payment/accept/${id}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("Payment Accepted");
      fetchPayments();
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(
        `http://localhost:3000/api/payment/reject/${id}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("Payment Rejected");
      fetchPayments();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddPayment = () => {
    navigate("/student-dashboard/add-payment");
  };

  const columns = useMemo(
    () => [
      { name: "S.No", selector: (r) => r.sno, width: "80px" },

      {
        name: "Receipt",
        cell: (row) => (
          <button
            onClick={() => navigate(`/payment/recipt/${row._id}`)}
            className="bg-teal-600 text-white px-2 py-1 rounded"
          >
            🧾
          </button>
        ),
        width: "100px",
      },

      { name: "Student ID", selector: (r) => r.studentId, width: "150px" },
      { name: "Fee ID", selector: (r) => r.feeId, width: "150px" },
      { name: "Amount", selector: (r) => `₹${r.paidAmount}`, width: "100px" },
      { name: "Transaction ID", selector: (r) => r.transactionId, width: "200px" },
      { name: "Deposit Date", selector: (r) => r.paymentDate, width: "150px" },

      {
        name: "Status",
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
            {row.status.toUpperCase()}
          </span>
        ),
        width: "150px",
      },

      {
        name: "Action",
        cell: (row) => (
          <div className="flex flex-col md:flex-row gap-2">
            <button
              onClick={() => handleAccept(row._id)}
              className="bg-green-600 text-white px-2 py-1 rounded"
            >
              ✅
            </button>

            <button
              onClick={() => handleReject(row._id)}
              className="bg-red-600 text-white px-2 py-1 rounded"
            >
              ❌
            </button>
          </div>
        ),
        width: "180px",
      },
    ],
    [navigate]
  );

  return (
    <div className="p-4 sm:p-6 md:p-8">

      {/* BUTTON */}
      <div className="flex justify-end mb-6">
        <button
          onClick={handleAddPayment}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          ➕ Add Payment
        </button>
      </div>

      {/* FIXED: TABLE WRAPPER — NEVER CUTS ON TAB */}
      <div className="w-screen sm:w-full overflow-x-auto -mx-4 sm:mx-0">
        <div className="min-w-[1500px]">
          <DataTable
            columns={columns}
            data={payments}
            pagination
            highlightOnHover
            striped
            dense
            responsive={false}
            fixedHeader
            fixedHeaderScrollHeight="500px"
          />
        </div>
      </div>

    </div>
  );
};

export default PaymentListAdmin;
