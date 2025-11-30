import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";

const StudentIDCard = () => {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/student/IdCard/${user._id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (res.data.success) {
        setStudent(res.data.student);
        navigate(`/ID/${user._id}`, { state: { statement: res.data } });
      } else {
        console.error("Student not found");
      }
    } catch (err) {
      console.error("Error fetching student:", err);
    }
  };

  if (!student) {
    return <p className="text-center mt-10 text-gray-500">Loading student information...</p>;
  }

  return (
    <div className="p-4 sm:p-10 flex flex-col items-center">
      <div className="w-full max-w-md border rounded-lg shadow-lg p-4 bg-white relative print:max-w-full print:h-auto">
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
  );
};

export default StudentIDCard;
