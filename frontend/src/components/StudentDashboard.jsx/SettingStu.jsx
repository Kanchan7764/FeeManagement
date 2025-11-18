import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";

const SettingStu = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [setting, setSetting] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSetting({ ...setting, [name]: value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (setting.newPassword !== setting.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(
        "http://localhost:3000/api/setting/change-password",
        {
          oldPassword: setting.oldPassword,
          newPassword: setting.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setLoading(false);

      if (response.data.success) {
        alert("Password changed successfully!");
        navigate("/student-dashboard");
      } else {
        setError(response.data.error || "Something went wrong");
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("Server Error");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Change Password</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="text-sm font-medium block text-gray-700">
            Old Password
          </label>
          <input
            type="password"
            name="oldPassword"
            placeholder="Enter old password"
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium block text-gray-700">
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            placeholder="Enter new password"
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium block text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm new password"
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-teal-600 hover:bg-teal-700"
          }`}
        >
          {loading ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default SettingStu;
