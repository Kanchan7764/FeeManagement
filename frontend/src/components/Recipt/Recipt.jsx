import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const ReceiptPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // current logged-in user
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchReceipt();

    const handleAfterPrint = () => {
      if (user.role === "admin") navigate("/admin-dashboard/payment");
      else if (user.role === "student") navigate("/student-dashboard/payment");
      else navigate("/"); // fallback
    };

    window.addEventListener("afterprint", handleAfterPrint);
    return () => window.removeEventListener("afterprint", handleAfterPrint);
  }, [user]);

  const fetchReceipt = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/payment/receipt/${id}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setData(res.data);
    } catch (err) {
      console.error("Error fetching receipt:", err);
    }
  };

  if (!data)
    return <p className="p-10 text-xl text-center">Loading Receipt...</p>;

  return (
    <div className="flex justify-center p-4 bg-gray-100 min-h-screen print:bg-white">
      <div
        id="receipt"
        className="w-full max-w-3xl bg-white shadow-lg border rounded p-6 print:w-full print:shadow-none print:border-none"
      >
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4">
          School Management System
        </h1>

        {/* Fee Deposit Summary */}
        <div className="border p-4 mb-4 rounded">
          <h3 className="font-semibold mb-3 text-lg">Fee Deposit Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <p><strong>Student:</strong> {data.studentName}</p>
            <p><strong>Registration ID:</strong> {data.studentId}</p>
            <p><strong>Fee ID:</strong> {data.feeId}</p>
            <p><strong>Paid Amount:</strong> ₹{data.paidAmount}</p>
            <p><strong>Total Fee:</strong> ₹{data.totalFee}</p>
            <p><strong>Remaining:</strong> ₹{data.remaining}</p>
          </div>
        </div>

        {/* Payment Details Table */}
        <div className="border p-4 rounded mb-6 overflow-x-auto">
          <h3 className="font-semibold text-lg mb-2">Payment Details</h3>
          <table className="w-full border table-auto min-w-[500px]">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Date</th>
                <th className="border p-2 text-left">Transaction ID</th>
                <th className="border p-2 text-left">Terms</th>
                <th className="border p-2 text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data?.payments?.map((p, i) => (
                <tr key={i}>
                  <td className="border p-2">{new Date(p.date).toLocaleDateString()}</td>
                  <td className="border p-2">{p.transactionId}</td>
                  <td className="border p-2">{p.mode}</td>
                  <td className="border p-2">₹{p.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Signature */}
        <div className="mt-10 text-right pr-6">
          <div className="border-t border-black w-48 ml-auto"></div>
          <p className="mt-1 font-semibold">Authorized Signature</p>
        </div>

        {/* Print Button */}
        <button
          className="mt-6 w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 print:hidden"
          onClick={() => window.print()}
        >
          Print Receipt
        </button>
      </div>
    </div>
  );
};

export default ReceiptPage;
