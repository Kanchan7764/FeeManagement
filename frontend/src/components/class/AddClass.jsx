import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AddClass = () => {
  const [classData, setClassData] = useState({
    class_name: "",
    desciption: "",
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
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-96">
      <h2 className="text-2xl font-bold mb-6">Add New Class</h2>
      <form action="" onSubmit={handleSubmit}>
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
            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mt-3">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            name="description"
            onChange={handleChange}
            id=""
            placeholder="Description"
            rows="4"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Class
        </button>
      </form>
    </div>
  );
};

export default AddClass;
