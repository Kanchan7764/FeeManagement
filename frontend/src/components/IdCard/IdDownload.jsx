import React, { useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { useNavigate, useLocation } from "react-router-dom";

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

  // Navigate after print
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

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-200 p-4 sm:p-6">
      
      {/* Download Button */}
      <div className="mb-6">
        <button
          onClick={handleDownload}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          ⬇️ Download ID
        </button>
      </div>

      <div
        className="w-full max-w-[800px] bg-white rounded-2xl shadow-2xl overflow-hidden print:(w-full max-w-none shadow-none) print:bg-white"
        style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
      >
        {/* Top Header */}
        <div
          className="w-full h-32 flex flex-col justify-center px-6 sm:px-10 text-white"
          style={{
            background: "linear-gradient(to right, #0b4b72, #1b7fa6, #00a3c8)",
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact",
          }}
        >
          <h1 className="text-xl sm:text-2xl font-semibold tracking-wide">
            School Name
          </h1>
          <h1 className="text-xl sm:text-2xl font-bold mt-3">Student ID</h1>
        </div>

        {/* Main Body */}
        <div className="px-4 sm:px-10 py-6 relative bg-white print:bg-white">
          {/* Background Pattern */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #0b4b72 0px, #0b4b72 10px, #1b7fa6 10px, #1b7fa6 20px)",
              backgroundSize: "120px 120px",
              WebkitPrintColorAdjust: "exact",
              printColorAdjust: "exact",
            }}
          ></div>

          {/* Student Photo */}
          <div className="relative flex justify-center -mt-20 mb-6">
            <div className="w-28 h-28 sm:w-40 sm:h-40 rounded-full bg-white border-[6px] border-white shadow-xl overflow-hidden print:border print:shadow-none">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm sm:text-[17px] text-gray-700 leading-6 sm:leading-8 font-medium relative">
            <div className="text-left sm:text-right font-semibold pr-0 sm:pr-2">
              <p>Name :</p>
              <p>Student ID :</p>
              <p>D.O.B :</p>
              <p>Address :</p>
            </div>

            <div className="text-left">
              <p>{data.student.userId.name}</p>
              <p>{data.student.studentId}</p>
              <p>{data.student.userId.dob || "N/A"}</p>
              <p>{data.student.userId.address || "N/A"}</p>
            </div>
          </div>

          {/* Barcode */}
          <div className="flex justify-center mt-4 sm:mt-5">
            <div className="w-[280px] sm:w-[340px] h-[50px] sm:h-[60px] bg-white p-1 shadow print:shadow-none">
              <div
                className="w-full h-full"
                style={{
                  background:
                    "repeating-linear-gradient(90deg, black 0px, black 3px, white 3px, white 5px)",
                  WebkitPrintColorAdjust: "exact",
                  printColorAdjust: "exact",
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div
          className="w-full h-8 sm:h-10 print:bg-[linear-gradient(to_right,_#30b86f,_#1b7fa6,_#0b4b72)]"
          style={{
            background: "linear-gradient(to right, #30b86f, #1b7fa6, #0b4b72)",
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact",
          }}
        ></div>
      </div>
    </div>
  );
};

export default IdDownload;
