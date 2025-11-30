import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const StudentIDDownload = () => {
  const { user } = useAuth(); // logged-in student
  const [studentIdInput, setStudentIdInput] = useState("");
  const [student, setStudent] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const fetchStudent = async () => {
    if (!studentIdInput.trim()) return setMessage("Please enter Student ID");

    try {
      const res = await axios.get(
        `http://localhost:3000/api/student/IdCard/student/${studentIdInput}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        setStudent(res.data.student);
        setMessage("");
        navigate(`/ID/${user._id}`, { state: { statement: res.data } });
      } else {
        setStudent(null);
        setMessage("Student not found or no data available");
      }
    } catch (err) {
      console.error(err);
      setStudent(null);
      setMessage("Error fetching student information");
    }
  };

  return (
    <div className="p-4 sm:p-10 flex flex-col items-center">
      {/* Search Box */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8 w-full sm:w-auto justify-center">
        <input
          type="text"
          placeholder="Enter Student ID"
          className="border px-4 py-2 rounded w-full sm:w-64"
          value={studentIdInput}
          onChange={(e) => setStudentIdInput(e.target.value)}
        />
        <button
          onClick={fetchStudent}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto"
        >
          Search
        </button>
      </div>

      {/* Message */}
      {message && <p className="text-red-600 font-semibold mb-4">{message}</p>}

      {/* ID Card */}
      {student && (
        <div className="flex flex-col items-center w-full max-w-md">
          <div className="w-full border rounded-lg shadow-lg p-4 bg-white relative print:max-w-full print:h-auto">
            {/* School Logo */}
            <div className="flex flex-col items-center mb-6">
              <h1 className="text-lg sm:text-xl font-bold mb-3 text-center">My School Name</h1>
              <img
                src={
                  student.userId?.profileImage
                    ? `http://localhost:3000/${student.userId.profileImage}`
                    : "/default.png"
                }
                alt="profile"
                className="rounded-full w-16 h-16 sm:w-20 sm:h-20 object-cover"
              />
            </div>

            {/* Student Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 text-sm sm:text-base">
              <div>
                <p className="font-semibold">Student Name</p>
                <p>{student.userId.name}</p>
              </div>
              <div>
                <p className="font-semibold">Student ID</p>
                <p>{student.studentId}</p>
              </div>
              <div>
                <p className="font-semibold">Class</p>
                <p>{student.classs?.class_name || "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold">Email</p>
                <p>{student.userId.email || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Print Button */}
          <button
            onClick={() => window.print()}
            className="mt-4 sm:mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full sm:w-auto"
          >
            Print ID Card
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentIDDownload;
