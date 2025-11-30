import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AddSubjectPage() {
  const [subject, setSubject] = useState({
    name: "",
    code: "",
    teacher: "",
    className: "",
  });

  const [errors, setErrors] = useState({});
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);

  // Fetch teachers and classes when page loads
  useEffect(() => {
    fetchTeachers();
    fetchClasses();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/teacher/allteacher");
      setTeachers(res.data.data);
    } catch (err) {
      console.log("Failed to load teachers");
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/class/");
      setClasses(res.data.data || []);
    } catch (err) {
      console.log("Failed to load classes");
      setClasses([]);
    }
  };

  // Validate form fields
  const validate = () => {
    const err = {};
    if (!subject.name.trim()) err.name = "Subject name is required";
    if (!subject.code) err.code = "Subject Code is required";
    if (!subject.className) err.className = "Please select a class";
    if (!subject.teacher) err.teacher = "Please select a teacher";
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    try {
      const res = await axios.post(
        "http://localhost:3000/api/subject/addsubject",
        subject,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert(res.data.message);
      setSubject({ name: "", code: "", teacher: "", className: "" });
    } catch (error) {
      console.log(error);
      alert("Failed to add subject");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start p-5 sm:p-10 bg-gray-100">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-6 sm:p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Add New Subject
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">

          {/* Subject Name */}
          <div>
            <label className="block text-sm text-gray-600">Subject Name</label>
            <input
              type="text"
              value={subject.name}
              onChange={(e) => setSubject({ ...subject, name: e.target.value })}
              placeholder="Enter subject name"
              className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Subject Code */}
          <div>
            <label className="block text-sm text-gray-600">Subject Code</label>
            <input
              type="text"
              value={subject.code}
              onChange={(e) => setSubject({ ...subject, code: e.target.value })}
              placeholder="Enter subject code"
              className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.code && <p className="text-sm text-red-500 mt-1">{errors.code}</p>}
          </div>

          {/* Class Dropdown */}
          <div>
            <label className="block text-sm text-gray-600">Class</label>
            <select
              value={subject.className}
              onChange={(e) => setSubject({ ...subject, className: e.target.value })}
              className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls.class_name}>
                  {cls.class_name}
                </option>
              ))}
            </select>
            {errors.className && (
              <p className="text-sm text-red-500 mt-1">{errors.className}</p>
            )}
          </div>

          {/* Teacher Dropdown */}
          <div>
            <label className="block text-sm text-gray-600">Teacher</label>
            <select
              value={subject.teacher}
              onChange={(e) => setSubject({ ...subject, teacher: e.target.value })}
              className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Teacher</option>
              {teachers.map((t) => (
                <option key={t._id} value={t.name}>
                  {t.name} – {t.subject}
                </option>
              ))}
            </select>
            {errors.teacher && (
              <p className="text-sm text-red-500 mt-1">{errors.teacher}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            Add Subject
          </button>

        </form>
      </div>
    </div>
  );
}
