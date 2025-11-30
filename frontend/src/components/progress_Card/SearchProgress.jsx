import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchProgressPage = () => {
  const [studentId, setStudentId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!studentId.trim()) {
      setError("Please enter a Student ID");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:3000/api/marks/progress/${studentId}`
      );

      if (res.data.success) {
        navigate(`/progress/${studentId}`);
      } else {
        setError("Student Progress Report not found");
      }
    } catch (err) {
      setError("Student Progress Report not found");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-lg p-6 rounded-xl">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          Search Progress Card
        </h1>

        {/* Input and Button */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Enter Student ID"
            className="flex-1 border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />

          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Search
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-600 mt-4 text-center font-medium">{error}</p>
        )}
      </div>
    </div>
  );
};

export default SearchProgressPage;
