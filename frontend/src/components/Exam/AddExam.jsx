import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AddExamPage() {
  const [exam, setExam] = useState({
    classId: "",
    subjectId: "",
    teacherId: "",
    examType: "",
    examDate: "",
    examTime: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  // Fetch Classes + Teachers
  useEffect(() => {
    fetchClasses();
    fetchTeachers();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/class");
      setClasses(res.data.data);
    } catch (err) {
      console.error("Failed to load classes");
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/teacher/allteacher");
      setTeachers(res.data.data);
    } catch (err) {
      console.error("Failed to load teachers");
    }
  };

  const fetchSubjectsByClass = async (className) => {
    setLoadingSubjects(true);
    try {
      const res = await axios.get(
        `http://localhost:3000/api/subject/byclass/${className}`
      );
      setSubjects(res.data.data);
    } catch (err) {
      console.error("Failed to load subjects");
      setSubjects([]);
    }
    setLoadingSubjects(false);
  };

  const handleClassChange = (value) => {
    setExam({ ...exam, classId: value, subjectId: "" });
    fetchSubjectsByClass(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const res = await axios.post("http://localhost:3000/api/exam/add-exam", exam);
      alert("Exam Added Successfully!");
      setExam({
        classId: "",
        subjectId: "",
        teacherId: "",
        examType: "",
        examDate: "",
        examTime: "",
      });
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage("Failed to add exam");
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start p-4 sm:p-6 md:p-10 bg-gray-100">
      <div className="w-full max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl bg-white shadow-lg rounded-xl p-6 sm:p-8 md:p-10">
        <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold mb-6 text-center">
          Add New Exam
        </h1>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-200 text-red-700 p-3 mb-4 rounded-lg text-center font-semibold">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Exam Type */}
          <div>
            <label className="block mb-1 font-medium">Exam Type</label>
            <select
              className="w-full p-2 border rounded-lg"
              value={exam.examType}
              onChange={(e) => setExam({ ...exam, examType: e.target.value })}
            >
              <option value="">Select Exam Type</option>
              <option value="Formative">Formative</option>
              <option value="Mid-Term">Mid-Term</option>
              <option value="Final">Final</option>
            </select>
          </div>

          {/* Class Dropdown */}
          <div>
            <label className="block mb-1 font-medium">Select Class</label>
            <select
              className="w-full p-2 border rounded-lg"
              value={exam.classId}
              onChange={(e) => handleClassChange(e.target.value)}
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls.class_name}>
                  {cls.class_name}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Dropdown */}
          <div>
            <label className="block mb-1 font-medium">Select Subject</label>
            <select
              className="w-full p-2 border rounded-lg"
              value={exam.subjectId}
              onChange={(e) => setExam({ ...exam, subjectId: e.target.value })}
              disabled={loadingSubjects || subjects.length === 0}
            >
              <option value="">
                {loadingSubjects ? "Loading subjects..." : "Select Subject"}
              </option>
              {subjects.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Teacher Dropdown */}
          <div>
            <label className="block mb-1 font-medium">Assign Teacher</label>
            <select
              className="w-full p-2 border rounded-lg"
              value={exam.teacherId}
              onChange={(e) => setExam({ ...exam, teacherId: e.target.value })}
            >
              <option value="">Select Teacher</option>
              {teachers.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Exam Date */}
          <div>
            <label className="block mb-1 font-medium">Exam Date</label>
            <input
              type="date"
              value={exam.examDate}
              onChange={(e) => setExam({ ...exam, examDate: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* Exam Time */}
          <div>
            <label className="block mb-1 font-medium">Exam Time</label>
            <input
              type="time"
              value={exam.examTime}
              onChange={(e) => setExam({ ...exam, examTime: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* Submit Button */}
          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 text-lg md:text-xl"
            >
              Add Exam
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
