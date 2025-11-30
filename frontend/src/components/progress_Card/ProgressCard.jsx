import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ProgressCard = () => {
  const { studentId } = useParams();
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProgress();
  }, [studentId]);

  const fetchProgress = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/marks/progress/${studentId}`
      );
      setStudentData(res.data.data);
      setError("");
    } catch (err) {
      setError("Student not found");
    }
  };

  const getExamTypes = () => {
    if (!studentData) return [];
    return [...new Set(studentData.subjects.map((s) => s.examType))];
  };

  const groupSubjects = () => {
    const grouped = {};
    studentData.subjects.forEach((item) => {
      if (!grouped[item.subject]) grouped[item.subject] = {};
      grouped[item.subject][item.examType] = item.marksObtained;
      grouped[item.subject]["total"] =
        (grouped[item.subject]["total"] || 0) + item.marksObtained;
    });
    return grouped;
  };

  const handleDownload = () => {
    window.print();
    setTimeout(() => navigate("/admin-dashboard"), 500);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 print:bg-white">
      {error && <p className="text-red-600 text-center">{error}</p>}

      {studentData && (
        <div className="max-w-3xl mx-auto bg-white rounded-lg overflow-hidden shadow-xl print:shadow-none">
          {/* ===================== HEADER ===================== */}
          <div
            className="relative text-white p-6 print:text-white"
            style={{
              backgroundColor: "#6d869c",
              WebkitPrintColorAdjust: "exact",
              printColorAdjust: "exact",
            }}
          >
            {/* Left Gradient Lines */}
            <div className="absolute left-0 top-0 h-full w-20 opacity-40 print:opacity-100">
              <div
                className="h-full"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)",
                  transform: "rotate(20deg)",
                  transformOrigin: "left",
                  WebkitPrintColorAdjust: "exact",
                  printColorAdjust: "exact",
                }}
              ></div>
            </div>

            <div className="relative z-10 text-center">
              <h1 className="text-2xl font-bold tracking-wider">
                REPORT CARD
              </h1>
              <p className="text-sm tracking-wide mt-1">School Name</p>
            </div>
          </div>

          {/* ===================== STUDENT INFORMATION ===================== */}
          <div className="p-6 border-b print:border-b print:border-gray-300">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
              <p className="text-sm">
                <span className="font-bold">Student: </span>
                {studentData.name}
              </p>
              <p className="text-sm">
                <span className="font-bold">Level: </span>
                {studentData.class}
              </p>
              <p className="text-sm">
                <span className="font-bold">Roll No: </span>
                {studentData.roll}
              </p>
            </div>
            <p className="text-sm">
              <span className="font-bold">Student ID: </span>
              {studentData.studentId}
            </p>
          </div>

          {/* ===================== MARKS TABLE ===================== */}
          <div className="p-6 overflow-x-auto">
            <table
              className="w-full border text-sm"
              style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
            >
              <thead>
                <tr
                  className="text-center"
                  style={{
                    backgroundColor: "#d4dce3",
                    WebkitPrintColorAdjust: "exact",
                    printColorAdjust: "exact",
                  }}
                >
                  <th className="border p-2 text-left">Subject</th>
                  {getExamTypes().map((type, index) => (
                    <th key={index} className="border p-2">
                      {type}
                    </th>
                  ))}
                  <th className="border p-2">Total</th>
                </tr>
              </thead>

              <tbody>
                {Object.entries(groupSubjects()).map(([subject, exams], i) => (
                  <tr key={i} className="text-center">
                    <td className="border p-2 text-left">{subject}</td>
                    {getExamTypes().map((type, index) => (
                      <td key={index} className="border p-2">
                        {exams[type] || "-"}
                      </td>
                    ))}
                    <td className="border p-2 font-semibold">{exams.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ===================== GRADING + COMMENTS ===================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
            <div
              className="border p-4 text-sm"
              style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
            >
              <h3 className="font-bold mb-2 text-[#6d869c] print:text-[#6d869c]">
                GRADING SCALE:
              </h3>
              <p>A: 80% - 100%</p>
              <p>B: 70% - 79%</p>
              <p>C: 60% - 69%</p>
              <p>D: 50% - 59%</p>
            </div>

            <div
              className="border p-4 text-sm"
              style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
            >
              <h3 className="font-bold mb-2 text-[#6d869c] print:text-[#6d869c]">
                Comments:
              </h3>
              <p>______________________________</p>
              <p>______________________________</p>
              <p>______________________________</p>
            </div>
          </div>

          {/* ===================== FOOTER STRIP ===================== */}
          <div
            className="h-6"
            style={{
              backgroundColor: "#6d869c",
              WebkitPrintColorAdjust: "exact",
              printColorAdjust: "exact",
            }}
          ></div>
        </div>
      )}

      {/* ===================== PRINT BUTTON ===================== */}
      <div className="p-6 text-center print:hidden">
        <button
          onClick={handleDownload}
          className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
        >
          Download / Print Progress Card
        </button>
      </div>
    </div>
  );
};

export default ProgressCard;
