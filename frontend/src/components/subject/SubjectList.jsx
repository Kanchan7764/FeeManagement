import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ClassSubjectPage() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/class");
      setClasses(res.data.data); // using updated controller structure
    } catch (err) {
      console.log("Failed to load classes");
    }
  };

  const fetchSubjectsByClass = async (className) => {
    setSelectedClass(className);
    setLoading(true);

    try {
      const res = await axios.get(
        `http://localhost:3000/api/subject/byclass/${className}`
      );
      setSubjects(res.data.data); // response: { success, data }
    } catch (err) {
      console.log("Failed to load subjects");
      setSubjects([]);
    }

    setLoading(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Class List</h2>

      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3 border">#</th>
            <th className="p-3 border">Class Name</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>

        <tbody>
          {classes.map((cls, index) => (
            <tr key={cls._id} className="text-center">
              <td className="p-3 border">{index + 1}</td>
              <td className="p-3 border">{cls.class_name}</td>
              <td className="p-3 border">
                <button
                  onClick={() => fetchSubjectsByClass(cls.class_name)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  View Subjects
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/*================ SHOW SUBJECTS BELOW =================*/}
      {selectedClass && (
        <div className="mt-6 p-4 border rounded bg-gray-100 shadow">
          <h3 className="text-xl font-semibold mb-3">
            Subjects for Class: <span className="text-blue-600">{selectedClass}</span>
          </h3>

          {loading ? (
            <p>Loading...</p>
          ) : subjects.length === 0 ? (
            <p>No subjects found for this class.</p>
          ) : (
            <table className="w-full border border-gray-300 mt-3">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3 border">#</th>
                  <th className="p-3 border">Subject Name</th>
                  <th className="p-3 border">Code</th>
                </tr>
              </thead>

              <tbody>
                {subjects.map((s, i) => (
                  <tr key={s._id} className="text-center">
                    <td className="p-3 border">{i + 1}</td>
                    <td className="p-3 border">{s.name}</td>
                    <td className="p-3 border">{s.code}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
