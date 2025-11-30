import React from "react";
import { useLocation } from "react-router-dom";

const StatementDownload = () => {
  const location = useLocation();
  const data = location.state?.statement;

  if (!data) return <p className="text-center mt-10 text-red-600">No statement data available!</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-5 flex justify-center">
      <div className="w-full max-w-3xl bg-white border rounded shadow p-6 print:p-0 print:shadow-none">
        <h1 className="text-3xl font-bold text-center mb-6">School Management System</h1>

        {/* Student Summary */}
        <div className="border p-4 rounded mb-6">
          <h3 className="font-semibold mb-3 text-lg">Fee Payment Statement</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <p><strong>Student Name:</strong> {data.studentName}</p>
            <p><strong>Student ID:</strong> {data.studentId}</p>
            <p><strong>Fee ID:</strong> {data.feeId}</p>
            <p><strong>Total Deposit:</strong> ₹{data.totalDeposit}</p>
          </div>
        </div>

        {/* Payment List */}
        <div className="border p-4 rounded mb-6 overflow-x-auto">
          <h3 className="font-semibold mb-3 text-lg">Payment Details</h3>
          <table className="w-full border min-w-[500px]">
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
                <tr key={i} className="odd:bg-gray-50">
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
        <div className="text-center sm:text-right">
          <button
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded print:hidden"
            onClick={() => window.print()}
          >
            Download / Print Statement
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatementDownload;
