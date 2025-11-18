import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddFee = () => {
  const navigate = useNavigate();

  const [studentDetails, setStudentDetails] = useState(null);
  const [formData, setFormData] = useState({
    studentId: "",
    classId: "",
    fee: "",
    fees: 0,
    duedate: "",
    completedDate: "",
    status: "",
  });
  const [autoFee, setAutoFee] = useState(0);
  const [successMessage, setSuccessMessage] = useState(null); // ✅ success message

  // Fetch student details
  const handleStudentIdChange = async (e) => {
    const studentId = e.target.value.trim();
    setFormData((prev) => ({ ...prev, studentId }));

    if (!studentId) {
      setStudentDetails(null);
      setFormData((prev) => ({ ...prev, classId: "" }));
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:3000/api/student/studentId/${studentId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      if (res.data.success) {
        const student = res.data.student;
        setStudentDetails(student);
        setFormData((prev) => ({
          ...prev,
          classId: student.classs?._id || "",
        }));
      } else {
        setStudentDetails(null);
      }
    } catch (err) {
      console.error("Error fetching student:", err);
      setStudentDetails(null);
    }
  };

  // Fee Type handler
  const handleFeeType = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, fee: value }));

    if (value === "hostel_fee") setFormData((prev) => ({ ...prev, fees: 12000 }));
    else if (value === "bus_fee") setFormData((prev) => ({ ...prev, fees: 15000 }));
    else if (value === "tuition_fee" && formData.classId) calculateTuitionFee(formData.classId);
    else setFormData((prev) => ({ ...prev, fees: 0 }));
  };

  const calculateTuitionFee = (classId) => {
    const classMap = {
      nursery: 0, lkg: 0, ukg: 0,
      one: 1, two: 2, three: 3, four: 4, five: 5,
      six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
      eleven: 11, twelve: 12,
    };

    const className = studentDetails?.classs?.class_name?.toLowerCase();
    const classNum = classMap[className];
    if (classNum === undefined) return;

    const fee = 20000 + (classNum - 1) * 5000;
    setFormData((prev) => ({ ...prev, fees: fee }));
    setAutoFee(fee);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit
  // inside handleSubmit
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!studentDetails) {
    alert("Please enter a valid Student ID");
    return;
  }

  const payload = {
    ...formData,
    studentId: studentDetails._id,
    classId: studentDetails.classs?._id || "",
  };

  try {
    const res = await axios.post(
      "http://localhost:3000/api/fee/add",
      payload,
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );

    if (res.data.success) {
      setSuccessMessage({
        type: "success",
        text: `✅ Fee assigned successfully to ${studentDetails.userId?.name} with Fee ID ${res.data.newFee.feeId}`
      });

      // Reset fee fields only
      setFormData((prev) => ({
        ...prev,
        fee: "",
        fees: 0,
        duedate: "",
        completedDate: "",
        status: "",
      }));
    }
  } catch (err) {
    const errorMsg =
      err.response?.data?.error ||
      "Failed to add fee. This fee type may already be assigned.";
    setSuccessMessage({ type: "error", text: `❌ ${errorMsg}` });
  }
};


  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add Fee</h2>

      {successMessage && (
  <div
    className={`mb-4 p-4 rounded-md ${
      successMessage.type === "success"
        ? "bg-green-100 border border-green-400 text-green-800"
        : "bg-red-100 border border-red-400 text-red-800"
    }`}
  >
    {successMessage.text}
  </div>
)}


      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Student ID input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Student ID</label>
            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleStudentIdChange}
              placeholder="Enter Student ID"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Class */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Class</label>
            <input
              type="text"
              value={studentDetails?.classs?.class_name || ""}
              disabled
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          {/* Roll Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Roll No</label>
            <input
              type="text"
              value={studentDetails?.rollNo || ""}
              disabled
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={studentDetails?.userId?.email || ""}
              disabled
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          {/* Fee Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Fee Type</label>
            <select
              name="fee"
              value={formData.fee}
              onChange={handleFeeType}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Fee Type</option>
              {/* <option value="school_fee">School Fee</option> */}
              <option value="hostel_fee">Hostel Fee</option>
              <option value="bus_fee">Bus Fee</option>
              <option value="tuition_fee">Tuition Fee</option>
            </select>
          </div>

          {/* Fees */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Fees (₹)</label>
            <input
              type="number"
              name="fees"
              value={formData.fees}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
            {/* {autoFee > 0 && (
              <p className="text-sm text-gray-500 mt-1">💡 Auto-calculated fee: ₹{autoFee}</p>
            )} */}
          </div>

          {/* Assign Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Assign Date</label>
            <input
              type="date"
              name="duedate"
              value={formData.duedate}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Fee
        </button>
      </form>
    </div>
  );
};

export default AddFee;
