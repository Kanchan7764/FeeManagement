import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ExamListPage() {
  const [exams, setExams] = useState([]);
  const [expandedClass, setExpandedClass] = useState(null); // Track expanded class

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/exam/all");
      setExams(res.data.data);
    } catch (err) {
      console.error("Failed to load exams", err);
    }
  };

  // Toggle which class's exams are shown
  const toggleExpandClass = (className) => {
    setExpandedClass(expandedClass === className ? null : className);
  };

  // Group exams by class
  const examsByClass = exams.reduce((acc, exam) => {
    if (!acc[exam.className]) acc[exam.className] = [];
    acc[exam.className].push(exam);
    return acc;
  }, {});

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Exam List</h2>

      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-center">
            <th className="p-3 border">Class</th>
            <th className="p-3 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(examsByClass).map((className) => (
            <>
              <tr key={className} className="text-center bg-gray-100">
                <td className="p-3 border font-semibold">{className}</td>
                <td className="p-3 border">
                  <button
                    className="bg-blue-600 text-white px-4 py-1 rounded"
                    onClick={() => toggleExpandClass(className)}
                  >
                    {expandedClass === className ? "Hide Exams" : "Show Exams"}
                  </button>
                </td>
              </tr>

              {expandedClass === className && (
                <tr>
                  <td colSpan="2" className="p-4 border">
                    <table className="w-full border border-gray-300">
                      <thead>
                        <tr className="bg-gray-200 text-center">
                          <th className="p-2 border">Subject</th>
                          <th className="p-2 border">Teacher</th>
                          <th className="p-2 border">Exam Type</th>
                          <th className="p-2 border">Date</th>
                          <th className="p-2 border">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {examsByClass[className].map((exam) => (
                          <tr key={exam._id} className="text-center">
                            <td className="p-2 border">{exam.subjectId?.name}</td>
                            <td className="p-2 border">{exam.teacherId?.name}</td>
                            <td className="p-2 border">{exam.examType}</td>
                            <td className="p-2 border">{exam.examDate}</td>
                            <td className="p-2 border">{exam.examTime}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
