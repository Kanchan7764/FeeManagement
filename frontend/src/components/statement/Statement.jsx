import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PaymentStatementPage = () => {
  const [feeId, setFeeId] = useState("");
  const [data, setData] = useState(null);
  const [message, setMessage] = useState(""); // message for no payments
  const navigate = useNavigate();

  const searchStatement = async () => {
    if (!feeId.trim()) return setMessage("Please enter Fee ID");

    try {
      const res = await axios.get(
        `http://localhost:3000/api/payment/statement/${feeId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        setData(res.data);
        setMessage(""); // clear previous messages
        navigate(`/statement/${feeId}`, { state: { statement: res.data } });
      } else {
        setData(null);
        setMessage(res.data.message || `No payments found for Fee ID: ${feeId}`);
      }
    } catch (error) {
      console.error("Error fetching statement:", error);
      setData(null);
      setMessage("No payment record found for this Fee ID!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-5">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Payment Statement</h1>

        {/* Search Box */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            placeholder="Enter Fee ID"
            className="border px-4 py-2 rounded w-full sm:flex-1 focus:outline-blue-500"
            value={feeId}
            onChange={(e) => setFeeId(e.target.value)}
          />
          <button
            onClick={searchStatement}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full sm:w-auto"
          >
            Search
          </button>
        </div>

        {/* Message */}
        {message && (
          <p className="text-red-600 font-semibold text-center mb-2">{message}</p>
        )}

        {/* Optional: show summary if data exists */}
        {data && data.payments?.length > 0 && (
          <div className="overflow-x-auto mt-4">
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Transaction ID</th>
                  <th className="border p-2">Amount</th>
                  <th className="border p-2">Mode</th>
                </tr>
              </thead>
              <tbody>
                {data.payments.map((p, i) => (
                  <tr key={i} className="odd:bg-gray-50">
                    <td className="border p-2">{new Date(p.date).toLocaleDateString()}</td>
                    <td className="border p-2">{p.transactionId}</td>
                    <td className="border p-2">₹{p.amount}</td>
                    <td className="border p-2">{p.mode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentStatementPage;
