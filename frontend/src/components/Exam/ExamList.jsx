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

  const toggleExpandClass = (className) => {
    setExpandedClass(expandedClass === className ? null : className);
  };

  const examsByClass = exams.reduce((acc, exam) => {
    if (!acc[exam.className]) acc[exam.className] = [];
    acc[exam.className].push(exam);
    return acc;
  }, {});

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Exam List</h2>

      <div className="flex flex-col space-y-4">
        {Object.keys(examsByClass).map((className) => (
          <div key={className} className="bg-gray-100 rounded-lg shadow overflow-hidden">
            {/* Class Header */}
            <div className="flex justify-between items-center p-4 cursor-pointer" onClick={() => toggleExpandClass(className)}>
              <span className="font-semibold">{className}</span>
              <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
                {expandedClass === className ? "Hide Exams" : "Show Exams"}
              </button>
            </div>

            {/* Exam List */}
            {expandedClass === className && (
              <div className="bg-white border-t border-gray-200">
                {examsByClass[className].map((exam) => (
                  <div
                    key={exam._id}
                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 border-b last:border-b-0"
                  >
                    <div className="mb-1 sm:mb-0">
                      <span className="font-medium">Subject: </span>
                      {exam.subjectId?.name || "N/A"}
                    </div>
                    <div className="mb-1 sm:mb-0">
                      <span className="font-medium">Teacher: </span>
                      {exam.teacherId?.name || "N/A"}
                    </div>
                    <div className="mb-1 sm:mb-0">
                      <span className="font-medium">Exam Type: </span>
                      {exam.examType}
                    </div>
                    <div className="mb-1 sm:mb-0">
                      <span className="font-medium">Date: </span>
                      {exam.examDate}
                    </div>
                    <div>
                      <span className="font-medium">Time: </span>
                      {exam.examTime}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
