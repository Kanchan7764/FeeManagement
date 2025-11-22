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

  // -------------------------
  // Print & Navigate
  // -------------------------
  const handleDownload = () => {
    window.print();

    // Wait for print dialog to close
    setTimeout(() => {
      navigate("/admin-dashboard");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5 print:bg-white">

      {error && <p className="text-red-600 text-center">{error}</p>}

      {studentData && (
        <div
          id="progressCardContent"
          className="max-w-4xl mx-auto mt-8 bg-white p-6 shadow-lg rounded-xl print:shadow-none print:p-0"
        >
          <h2 className="text-xl font-bold mb-3">Student Details</h2>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <p><strong>Name:</strong> {studentData.name}</p>
            <p><strong>Class:</strong> {studentData.class}</p>
            <p><strong>Roll No:</strong> {studentData.roll}</p>
            <p><strong>Student ID:</strong> {studentData.studentId}</p>
          </div>

          <h3 className="text-lg font-semibold mb-2">Marks</h3>

          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Subject</th>

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
                <tr key={i}>
                  <td className="border p-2">{subject}</td>

                  {getExamTypes().map((type, index) => (
                    <td key={index} className="border p-2">
                      {exams[type] || "-"}
                    </td>
                  ))}

                  <td className="border p-2 font-bold">{exams.total}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Hide this button in print */}
          <button
            onClick={handleDownload}
            className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 print:hidden"
          >
            Download / Print Progress Card
          </button>
        </div>
      )}
    </div>
  );
};

export default ProgressCard;
