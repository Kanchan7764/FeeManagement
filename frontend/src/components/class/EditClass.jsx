import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditClass = () => {
  const { id } = useParams();
  const [cls, setClassData] = useState({ class_name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClassData({ ...cls, [name]: value });
  };

  useEffect(() => {
    const fetchClass = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/class/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          setClassData(response.data.cls);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchClass();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:3000/api/class/${id}`,
        cls,
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
    <>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading...</p>
        </div>
      ) : (
        <div className="max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto mt-10 bg-white p-4 sm:p-6 md:p-8 rounded-md shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Edit Class</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="class_name"
                className="text-sm font-medium text-gray-700 block mb-1"
              >
                Class Name
              </label>
              <input
                type="text"
                name="class_name"
                onChange={handleChange}
                value={cls.class_name}
                placeholder="Enter Class Name"
                className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="description"
                className="text-sm font-medium text-gray-700 block mb-1"
              >
                Description
              </label>
              <textarea
                name="description"
                onChange={handleChange}
                value={cls.description}
                placeholder="Enter Description"
                rows="4"
                className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
            >
              Update Class
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default EditClass;
