import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddClass = () => {
  const [classData, setClassData] = useState({
    class_name: "",
    description: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClassData({ ...classData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/class/add",
        classData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        navigate("/admin-dashboard/class");
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white p-6 sm:p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Add New Class</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="class_name"
              className="text-sm font-medium text-gray-700"
            >
              Class Name
            </label>
            <input
              type="text"
              name="class_name"
              onChange={handleChange}
              placeholder="Enter Class Name"
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              name="description"
              onChange={handleChange}
              placeholder="Description"
              rows="4"
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
          >
            Add Class
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddClass;
