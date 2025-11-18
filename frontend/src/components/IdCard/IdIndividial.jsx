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
        console.log("res",res.data);
        
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
    <div className="p-10 flex flex-col items-center">
      {/* Search Box */}
      <div className="flex gap-3 mb-8">
        <input
          type="text"
          placeholder="Enter Student ID"
          className="border px-4 py-2 rounded w-64"
          value={studentIdInput}
          onChange={(e) => setStudentIdInput(e.target.value)}
        />
        <button
          onClick={fetchStudent}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* Message */}
      {message && <p className="text-red-600 font-semibold mb-4">{message}</p>}

      {/* ID Card */}
      {student && (
        <div className="flex flex-col items-center">
          <div className="w-80 h-70 border rounded-lg shadow-lg p-4 bg-white relative print:w-full print:h-auto">
            <div className="flex flex-col items-center mb-6">
              <h1 className="text-xl font-bold mb-3">My School Name</h1>
              <img
                src={
                  student.userId?.profileImage
                    ? `http://localhost:3000/${student.userId.profileImage}`
                    : "/default.png"
                }
                alt="profile"
                className="rounded-full w-20 h-20 object-cover"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div>
                <p className="text-sm font-semibold">Student Name</p>
                <p>{student.userId.name}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Student ID</p>
                <p>{student.studentId}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Class</p>
                <p>{student.classs?.class_name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Email</p>
                <p>{student.userId.email || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Print Button */}
          <button
        onClick={() => window.print()}
        className="ml-6 self-start bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Print ID Card
      </button>
        </div>
      )}
    </div>
  );
};

export default StudentIDDownload;
