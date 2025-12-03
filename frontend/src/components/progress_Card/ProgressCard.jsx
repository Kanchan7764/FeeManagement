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

      if (!res.data?.success || !res.data?.data) {
        setError("Student Not Found");
        return;
      }

      const raw = res.data.data;
      const subjectMap = {};
      const examTypesSet = new Set();

      // Prepare subject-wise data
      raw.subjects.forEach((s) => {
        examTypesSet.add(s.examType);

        if (!subjectMap[s.subject]) {
          subjectMap[s.subject] = { subject: s.subject };
        }

        subjectMap[s.subject][s.examType] = s.marksObtained;
      });

      const availableExamTypes = Array.from(examTypesSet);
      const subjectWise = Object.values(subjectMap);

      // Calculate total per subject
      subjectWise.forEach((s) => {
        let total = 0;
        availableExamTypes.forEach((exam) => (total += s[exam] || 0));
        s.total = total;
      });

      // NEW LOGIC — Calculate actual obtained marks & max marks
      let obtainedMarks = 0;
      let maxMarks = 0;

      raw.subjects.forEach((s) => {
        obtainedMarks += s.marksObtained;
        maxMarks += s.totalMarks;
      });

      const overallPercentage = (obtainedMarks / maxMarks) * 100;

      const finalRemark =
        overallPercentage >= 90
          ? "Outstanding"
          : overallPercentage >= 75
          ? "Excellent"
          : overallPercentage >= 60
          ? "Very Good"
          : "Needs Improvement";

      setStudentData({
        ...raw,
        subjectWise,
        availableExamTypes,
        overallPercentage,
        finalRemark,
      });
    } catch (err) {
      console.log(err);
      setError("Error fetching student data");
    }
  };

  const handleDownload = () => {
    window.print();
    setTimeout(() => navigate("/admin-dashboard"), 800);
  };

  if (!studentData)
    return <p className="text-center mt-10 text-gray-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-200 p-4 sm:p-6 print:bg-white">
      <div className="max-w-3xl mx-auto bg-white p-4 sm:p-6 border shadow-lg print:shadow-none print:border-black">

        <h1 className="text-center text-lg sm:text-xl font-bold underline mb-4">
          ACADEMIC PERFORMANCE – REPORT CARD
        </h1>

        {/* STUDENT INFO */}
        <div className="mb-4 text-sm sm:text-base">
          <p><b>Student Name:</b> {studentData.name}</p>
          <p><b>Class:</b> {studentData.class}</p>
          <p><b>Roll No:</b> {studentData.roll}</p>
          <p><b>Student ID:</b> {studentData.studentId}</p>
        </div>

        {/* RESPONSIVE TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full border border-black text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-300 text-center font-semibold">
                <th className="border p-2">Subject</th>

                {studentData.availableExamTypes.map((exam) => (
                  <th key={exam} className="border p-2">{exam}</th>
                ))}

                <th className="border p-2">Total</th>
              </tr>
            </thead>

            <tbody>
              {studentData.subjectWise.map((s, i) => (
                <tr key={i} className="text-center">
                  <td className="border p-2 text-left">{s.subject}</td>

                  {studentData.availableExamTypes.map((exam) => (
                    <td key={exam} className="border p-2">
                      {s[exam] ?? "-"}
                    </td>
                  ))}

                  <td className="border p-2 font-semibold">{s.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FINAL RESULT */}
        <h2 className="font-bold text-lg text-center my-4">FINAL RESULT</h2>

        <div className="border border-black bg-gray-100 p-4 text-sm">
          <p><b>Overall Percentage:</b> {studentData.overallPercentage.toFixed(2)}%</p>
          <p><b>Final Remark:</b> {studentData.finalRemark}</p>
        </div>

        {/* SIGNATURES */}
        <div className="grid grid-cols-3 gap-4 sm:gap-10 mt-8 text-center text-xs sm:text-sm">
          <div>
            ____________________  
            <p>Guardian Sign</p>
          </div>
          <div>
            ____________________  
            <p>Class Teacher Sign</p>
          </div>
          <div>
            ____________________  
            <p>Principal Sign</p>
          </div>
        </div>
      </div>

      {/* PRINT BUTTON */}
      <div className="text-center mt-6 print:hidden">
        <button
          onClick={handleDownload}
          className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg"
        >
          Download / Print Progress Card
        </button>
      </div>
    </div>
  );
};

export default ProgressCard;
