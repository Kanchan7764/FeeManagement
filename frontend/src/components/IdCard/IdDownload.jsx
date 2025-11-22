import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/authContext";
import { useNavigate ,useLocation} from "react-router-dom";

const IdDownload = () => {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const navigate = useNavigate()
  const location = useLocation();
  const data = location.state?.statement;

  if (!data) return <p>No statement data available!</p>;
  console.log("data",data)

//   useEffect(() => {
//     fetchStudentData();
//   }, []);

//   const fetchStudentData = async () => {
//     try {
//       const res = await axios.get(`http://localhost:3000/api/student/IdCard/${user._id}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });

//       if (res.data.success) {
//         setStudent(res.data.student);
//         console.log("res",res)
//                 // navigate(`/ID/${user._id}`, { state: { statement: res.data } });

//       } else {
//         console.error("Student not found");
//       }
//     } catch (err) {
//       console.error("Error fetching student:", err);
//     }
//   };

//   if (!student) {
//     return <p className="text-center mt-10">Loading student information...</p>;
//   }

useEffect(() => {
  const handleAfterPrint = () => {
  // Option 1: use user.role directly
  if (user.role === "admin") {
    navigate("/admin-dashboard");
  } else {
    navigate("/student-dashboard");
  }

  
};


  window.addEventListener("afterprint", handleAfterPrint);
  return () => window.removeEventListener("afterprint", handleAfterPrint);
}, [navigate]);

  return (
    <div className="flex justify-center p-10">
      <div className="w-80 h-70 border rounded-lg shadow-lg p-4 bg-white relative print:w-full print:h-auto">
        {/* School Logo */}
        <div className="flex flex-col items-center mb-6">
  <h1 className="text-xl font-bold mb-3">My School Name</h1>
  <img
    src={
      data.student.userId?.profileImage
        ? `http://localhost:3000/${data.student.userId.profileImage}`
        : "/default.png"
    }
    alt="profile"
    className="rounded-full w-20 h-20 object-cover"
  />
</div>


        {/* Student Info */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div>
            <p className="text-sm font-semibold">Student Name</p>
            <p>{data.student.userId.name}</p>
          </div>
          <div>
            <p className="text-sm font-semibold">Student ID</p>
            <p>{data.student.studentId}</p>
          </div>
          <div>
            <p className="text-sm font-semibold">Class</p>
            <p>{data.student.classs.class_name || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-semibold">Email</p>
            <p>{data.student.userId.email || "N/A"}</p>
          </div>
        </div>

        {/* QR Code or Photo */}
        {/* <div className="absolute right-4 bottom-4 flex flex-col items-center"> */}
          {/* <img
            src={student.photo || "/default-avatar.png"} // replace with photo path
            alt="Student"
            className="w-16 h-16 rounded-full border"
          /> */}
          {/* <p className="text-xs mt-1">ID Card</p>
        </div> */}

        {/* Footer */}
        {/* <p className="absolute bottom-2 left-4 text-xs text-gray-500">
          © 2025 My School Name
        </p> */}
      </div>

      {/* Print Button */}
     <button
  onClick={() => window.print()}
  className="ml-6 self-start bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
>
  Print ID Card
</button>
    </div>
  );
};

export default IdDownload;
