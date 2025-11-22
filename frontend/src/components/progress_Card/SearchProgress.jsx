import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchProgressPage = () => {
  const [studentId, setStudentId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/marks/progress/${studentId}`
      );

      if (res.data.success) {
        // Navigate to progress page with studentId param
        navigate(`/progress/${studentId}`);
      }
    } catch (err) {
      setError("Student Progress Report not found");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-xl mx-auto bg-white shadow-lg p-6 rounded-xl">
        <h1 className="text-2xl font-bold mb-4 text-center">Search Progress Card</h1>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter Student ID"
            className="w-full border p-2 rounded-lg"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />

          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Search
          </button>
        </div>

        {error && (
          <p className="text-red-600 mt-3 text-center font-semibold">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchProgressPage;
