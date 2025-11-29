import React, { useContext, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        { email, password }
      );

      if (response.data.success) {
        login(response.data.user);

        localStorage.setItem("token", response.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: response.data.user.name,
            role: response.data.user.role,
          })
        );

        if (response.data.user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/student-dashboard");
        }
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        setError(error.response.data.error);
      } else {
        setError("Server Error");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen 
      bg-gradient-to-b from-teal-600 from-50% to-gray-100 to-50% px-4">

      {/* Title */}
      <h2 className="font-pacific text-2xl sm:text-3xl text-white mb-6 text-center">
        Fee Management System
      </h2>

      {/* Login Card */}
      <div className="w-full max-w-sm bg-white shadow-lg rounded-lg p-6">

        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">
          Login
        </h2>

        {error && <p className="text-red-500 text-center mb-2">{error}</p>}

        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter Your Email"
              className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-teal-500"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="********"
              className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-teal-500"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Remember + Forgot */}
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox" />
              <span className="ml-2 text-gray-700 text-sm">Remember me</span>
            </label>
            <a href="#" className="text-teal-600 text-sm hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded text-lg transition"
          >
            Login
          </button>

        </form>
      </div>
    </div>
  );
};

export default Login;
