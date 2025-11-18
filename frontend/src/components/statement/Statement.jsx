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
        // Optional: navigate to another page if you want
        navigate(`/statement/${feeId}`, { state: { statement: res.data } });
      } else {
        setData(null);
        setMessage(res.data.message || `No payments found for Fee ID: ${feeId}`);
      }
    } catch (error) {
      console.error("Error fetching statement:", error);
      setData(null);
      setMessage("No data found or you do not have access!");
    }
  };

  return (
    <div className="p-10 flex flex-col items-center">
      {/* ---------- SEARCH BOX ---------- */}
      <div className="flex gap-3 mb-8 ">
        <input
          type="text"
          placeholder="Enter Fee ID"
          className="border px-4 py-2 rounded w-64"
          value={feeId}
          onChange={(e) => setFeeId(e.target.value)}
        />
        <button
          onClick={searchStatement}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* ---------- MESSAGE ---------- */}
      {message && (
        <p className="text-red-600 font-semibold mb-4 text-center">{message}</p>
      )}

      
    </div>
  );
};

export default PaymentStatementPage;
