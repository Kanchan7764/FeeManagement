import React from "react";
import { useLocation } from "react-router-dom";

const StatementDownload = () => {
  const location = useLocation();
  const data = location.state?.statement;

  if (!data) return <p>No statement data available!</p>;

  return (
    <div className="p-10 max-w-3xl mx-auto bg-white border rounded shadow">
      <h1 className="text-3xl font-bold text-center mb-4">School Management System</h1>

      {/* Student Summary */}
      <div className="border p-4 rounded mb-4">
        <h3 className="font-semibold mb-2 text-lg">Fee Payment Statement</h3>
        <div className="grid grid-cols-2 gap-4">
          <p><strong>Student Name:</strong> {data.studentName}</p>
          <p><strong>Student ID:</strong> {data.studentId}</p>
          <p><strong>Fee ID:</strong> {data.feeId}</p>
          <p><strong>Total Deposit:</strong> ₹{data.totalDeposit}</p>
        </div>
      </div>

      {/* Payment List */}
      <div className="border p-4 rounded mb-4">
        <h3 className="font-semibold mb-2 text-lg">Payment Details</h3>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Date</th>
              <th className="border p-2">Transaction ID</th>
              <th className="border p-2">Mode</th>
              <th className="border p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.payments.map((p, i) => (
              <tr key={i}>
                <td className="border p-2">{new Date(p.date).toLocaleDateString()}</td>
                <td className="border p-2">{p.paymentId}</td>
                <td className="border p-2">{p.mode}</td>
                <td className="border p-2">₹{p.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Print Button */}
      <div className="text-right">
        <button
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => window.print()}
        >
          Download  Statement
        </button>
      </div>
    </div>
  );
};

export default StatementDownload;
