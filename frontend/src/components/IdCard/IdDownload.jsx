import React, { useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { useNavigate, useLocation } from "react-router-dom";
import QRCode from "react-qr-code"; // Import QRCode

const CARD_WIDTH = 360;
const CARD_HEIGHT = 550;

const IdDownload = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state?.statement;

  if (!data)
    return (
      <p className="text-center mt-10 text-gray-600">
        No statement data available!
      </p>
    );

  useEffect(() => {
    const handleAfterPrint = () => {
      if (user.role === "admin") navigate("/admin-dashboard");
      else navigate("/student-dashboard");
    };
    window.addEventListener("afterprint", handleAfterPrint);
    return () => window.removeEventListener("afterprint", handleAfterPrint);
  }, [navigate, user.role]);

  const handleDownload = () => {
    window.print();
  };

  // Encode student details as JSON for the QR code
  const studentInfo = JSON.stringify({
    name: data.student.userId.name,
    studentId: data.student.studentId,
    dob: data.student.dob ? new Date(data.student.dob).toLocaleDateString("en-GB") 
      : "N/A",
    address: data.student.address || "N/A",
  });

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-200 p-4 sm:p-6">
      <div className="mb-6">
        <button
          onClick={handleDownload}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          ⬇️ Download ID
        </button>
      </div>

      <div
        className="bg-white rounded-2xl shadow-2xl overflow-hidden relative print:shadow-none"
        style={{
          width: `${CARD_WIDTH}px`,
          height: `${CARD_HEIGHT}px`,
        }}
      >
        {/* Top Header */}
        <div
          className="w-full h-32 flex flex-col justify-center px-6 text-white"
          style={{
            background: "linear-gradient(to right, #0b4b72, #1b7fa6, #00a3c8)",
          }}
        >
          <h1 className="text-xl font-semibold tracking-wide">School Name</h1>
          <h1 className="text-xl font-bold mt-3">Student ID</h1>
        </div>

        {/* Main Body */}
        <div className="px-4 py-6 relative bg-white print:bg-white">
          {/* Student Photo */}
          <div className="relative flex justify-center -mt-20 mb-6">
            <div className="w-28 h-28 rounded-full bg-white border-[6px] border-white shadow-xl overflow-hidden print:border print:shadow-none">
              <img
                src={
                  data.student.userId?.profileImage
                    ? `http://localhost:3000/${data.student.userId.profileImage}`
                    : "/default.png"
                }
                alt="Student"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Info Text */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700 leading-6 font-medium">
            <div className="text-left sm:text-right font-semibold pr-0">
              <p>Name :</p>
              <p>Student ID :</p>
              <p>D.O.B :</p>
              <p>Address :</p>
            </div>
            <div className="text-left">
  <p>{data.student.userId.name}</p>
  <p>{data.student.studentId}</p>
  <p>
    {data.student.dob
      ? new Date(data.student.dob).toLocaleDateString("en-GB") // formats as dd/mm/yyyy
      : "N/A"}
  </p>
  <p>{data.student.address || "N/A"}</p>
</div>

          </div>

          {/* QR Code */}
          <div className="flex justify-center mt-4">
            <QRCode value={studentInfo} size={120} />
          </div>
        </div>

        {/* Bottom Strip */}
        <div
          className="w-full h-8"
          style={{
            background: "linear-gradient(to right, #30b86f, #1b7fa6, #0b4b72)",
          }}
        ></div>
      </div>
    </div>
  );
};

export default IdDownload;
