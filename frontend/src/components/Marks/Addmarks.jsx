import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AddMarksPage() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState("");


  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  const [marksData, setMarksData] = useState({
    className: "",
    studentId: "",
    subjectId: "",
    examType: "",
    marksObtained: "",
    totalMarks: ""
  });

  // ------------------------------------
  // handleChange FIXED
  // ------------------------------------
  const handleChange = (e) => {
  const { name, value } = e.target;
  setMarksData((prev) => ({
    ...prev,
    [name]: value,
  }));
};


//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setMarksData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

  // Fetch Classes
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/class");
      if (res.data.success) {
        setClasses(res.data.data);
      }
    } catch (err) {
      console.log("Failed to load classes", err);
    }
  };

  // Fetch Students by Class
  const fetchStudentsByClass = async (className) => {
    setLoadingStudents(true);
    try {
      const res = await axios.get(
        `http://localhost:3000/api/student/byclass/${className}`
      );
      setStudents(res.data.data || []);
    } catch (err) {
      setStudents([]);
    }
    setLoadingStudents(false);
  };

  // Fetch Subjects by Class
  const fetchSubjectsByClass = async (className) => {
  setLoadingSubjects(true);

  try {
    const res = await axios.get(
      `http://localhost:3000/api/subject/byclass/${className}`
    );

    if (res.data.success) {
      setSubjects(res.data.data);
    } else {
      setSubjects([]);
    }
  } catch (error) {
    console.error("Error fetching subjects:", error);
    setSubjects([]);
  }

  setLoadingSubjects(false);
};


  // Class Change
  const handleClassChange = (value) => {
    setMarksData({
      ...marksData,
      className: value,
      studentId: "",
      subjectId: "",
    });

    fetchStudentsByClass(value);
    fetchSubjectsByClass(value);
  };

  // Submit Marks
  const handleSubmit = async (e) => {
    e.preventDefault();

   try {
  const res = await axios.post("http://localhost:3000/api/marks/add", marksData);
  setError(""); // clear error
  alert("Marks Added Successfully!");
} catch(err) {
  const msg = err.response?.data?.message || "Failed to add marks";
  setError(msg);
}

  };
  

  return (
    <div className="min-h-screen bg-gray-100 p-10 flex justify-center">
  <div className="max-w-4xl w-full bg-white shadow-lg p-8 rounded-xl">

    {/* Error Message */}
    {error && (
      <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
        {error}
      </div>
    )}

    <h1 className="text-2xl font-bold text-center mb-6">Add Student Marks</h1>

    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* Select Class */}
      <div>
        <label className="block mb-1 font-medium">Select Class</label>
        <select
          value={marksData.className}
          onChange={(e) => handleClassChange(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Choose Class</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls.class_name}>
              {cls.class_name}
            </option>
          ))}
        </select>
      </div>

      {/* Select Student */}
      <div>
        <label className="block mb-1 font-medium">Select Student</label>
        <select
          name="studentId"
          value={marksData.studentId}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          disabled={loadingStudents || students.length === 0}
        >
          <option value="">
            {loadingStudents ? "Loading students..." : "Choose Student"}
          </option>
          {students.map((st) => (
            <option key={st._id} value={st._id}>
              {st?.userId?.name} ({st?.rollNo})
            </option>
          ))}
        </select>
      </div>

      {/* Select Subject */}
      <div>
        <label className="block mb-1 font-medium">Select Subject</label>
        <select
          name="subjectId"
          value={marksData.subjectId}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          disabled={loadingSubjects || subjects.length === 0}
        >
          <option value="">
            {loadingSubjects ? "Loading subjects..." : "Choose Subject"}
          </option>
          {subjects.map((sub) => (
            <option key={sub._id} value={sub._id}>
              {sub.name}
            </option>
          ))}
        </select>
      </div>

      {/* Exam Type */}
      <div>
        <label className="block mb-1 font-medium">Exam Type</label>
        <select
          name="examType"
          value={marksData.examType}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Exam</option>
          <option value="MidTerm">Mid Term</option>
          <option value="Final">Final</option>
          <option value="UnitTest">Unit Test</option>
        </select>
      </div>

      {/* Marks Obtained */}
      <div>
        <label className="block mb-1 font-medium">Marks Obtained</label>
        <input
          type="number"
          name="marksObtained"
          value={marksData.marksObtained}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Enter marks obtained"
          min="0"
        />
      </div>

      {/* Total Marks */}
      <div>
        <label className="block mb-1 font-medium">Total Marks</label>
        <input
          type="number"
          name="totalMarks"
          value={marksData.totalMarks}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Enter total marks"
          min="1"
        />
      </div>

      {/* Submit Button — Full Width */}
      <div className="md:col-span-2">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg"
        >
          Add Marks
        </button>
      </div>

    </form>
  </div>
</div>

  );
}
