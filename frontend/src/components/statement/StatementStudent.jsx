import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StatementStudent = () => {
  const [feeId, setFeeId] = useState("");
  const [message, setMessage] = useState(""); // for no payment messages
  const navigate = useNavigate();

  const searchStatement = async () => {
    if (!feeId.trim()) return setMessage("Please enter Fee ID");

    try {
      const res = await axios.get(
        `http://localhost:3000/api/payment/student/statement/${feeId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (res.data.success) {
        setMessage(""); // clear previous messages
        // Navigate to statement page
        navigate(`/statement/${feeId}`, { state: { statement: res.data } });
      } else {
        setMessage(res.data.message || `No payments found for Fee ID: ${feeId}`);
      }
    } catch (error) {
      console.error("Error fetching statement:", error);
      setMessage("No data found or you do not have access!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5 flex justify-center items-start">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Search Payment Statement</h1>

        {/* Search Box */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            placeholder="Enter Fee ID"
            className="flex-1 border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <p className="text-red-600 font-semibold text-center">{message}</p>
        )}
      </div>
    </div>
  );
};

export default StatementStudent;
