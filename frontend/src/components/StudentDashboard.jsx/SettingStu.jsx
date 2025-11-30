import React, { useState } from "react";
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-6">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-lg shadow-md">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">
          Change Password
        </h2>

        {error && <p className="text-red-500 mb-4 text-center sm:text-left">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Old Password */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              Old Password
            </label>
            <input
              type="password"
              name="oldPassword"
              placeholder="Enter old password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-teal-300"
              onChange={handleChange}
              required
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-teal-300"
              onChange={handleChange}
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-teal-300"
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white transition duration-200 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700"
            }`}
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingStu;
