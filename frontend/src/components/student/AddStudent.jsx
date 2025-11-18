import React, { useEffect, useState } from "react";
import { fetchClass } from "../../utils/StudentHelper";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddStudent = () => {
  const [classs, setClasses] = useState([]);
  const [formData, setFormData] = useState({});
  const [rollNo, setRollNo] = useState(""); // store auto-generated roll number
  const [successMessage, setSuccessMessage] = useState(""); // 👈 success message
  const navigate = useNavigate();

  useEffect(() => {
    const getClasses = async () => {
      const classs = await fetchClass();
      setClasses(classs);
    };
    getClasses();
  }, []);

  const handleChange = async (e) => {
    const { name, files, value } = e.target;

    if (name === "image") {
      setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }

    // When class is selected, fetch the next roll number
    if (name === "classs" && value) {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/student/next-roll/${value}`
        );
        if (res.data.success) {
          setRollNo(res.data.rollNo);
          setFormData((prev) => ({ ...prev, rollNo: res.data.rollNo }));
        }
      } catch (err) {
        console.error("Error fetching next roll number:", err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataObj.append(key, formData[key]);
    });

    try {
      const response = await axios.post(
        "http://localhost:3000/api/student/add",
        formDataObj,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        // 👇 show success message instead of navigating away
        setSuccessMessage(
          `Registration successful! Student ID: ${formData.studentId}, Roll No: ${rollNo}`
        );

        // Clear form fields (optional)
        setFormData({});
        setRollNo("");
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add new Student</h2>

      {/* 👇 Success message */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* --- Name --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              placeholder="Enter your name"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* --- Student ID --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Student ID
            </label>
            <input
              type="text"
              name="studentId"
              value={formData.studentId || ""}
              onChange={handleChange}
              placeholder="Student ID"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* --- Father's Name --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Father's Name
            </label>
            <input
              type="text"
              name="fatherName"
              value={formData.fatherName || ""}
              onChange={handleChange}
              placeholder="Enter your Father name"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* --- Mother's Name --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mother's name
            </label>
            <input
              type="text"
              name="MotherName"
              value={formData.MotherName || ""}
              onChange={handleChange}
              placeholder="Enter your Mother name"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* --- Email --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              placeholder="Enter your Email"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* --- Phone --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone No
            </label>
            <input
              type="tel"
              name="phoneNo"
              value={formData.phoneNo || ""}
              onChange={handleChange}
              placeholder="Enter your Phone No"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* --- DOB --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob || ""}
              onChange={handleChange}
              placeholder="DOB"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* --- Password --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password || ""}
              onChange={handleChange}
              placeholder="*****"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* --- Gender --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="Others">Others</option>
            </select>
          </div>

          {/* --- Class --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Class
            </label>
            <select
              name="classs"
              value={formData.classs || ""}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Class</option>
              {classs.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.class_name}
                </option>
              ))}
            </select>
          </div>

          {/* --- Roll No (Auto-generated) --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Roll No
            </label>
            <input
              type="text"
              name="rollNo"
              value={rollNo}
              readOnly
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          {/* --- Role --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              name="role"
              value={formData.role || ""}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="student">Student</option>
            </select>
          </div>

          {/* --- Image --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Image
            </label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              accept="image/*"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>

        <button className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded">
          Add Student
        </button>
      </form>
    </div>
  );
};

export default AddStudent;
