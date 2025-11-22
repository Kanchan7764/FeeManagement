import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TeacherListPage() {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Fetch teacher data
  useEffect(() => {
  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/api/teacher/allteacher");

      // Use only the "data" array
      setTeachers(res.data.data);
      setFilteredTeachers(res.data.data);
    } catch (err) {
      setError("Failed to load teachers");
    } finally {
      setLoading(false);
    }
  };

  fetchTeachers();
}, []);


  // Search filter
  useEffect(() => {
    const query = search.toLowerCase();
    const result = teachers.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.subject.toLowerCase().includes(query) ||
        t.email.toLowerCase().includes(query)
    );
    setFilteredTeachers(result);
  }, [search, teachers]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Teacher List</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name, subject, or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 mb-4 border rounded-lg"
      />

      {/* Table */}
      <div className="overflow-auto rounded-lg shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Subject</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Phone</th>
              <th className="p-3 border">Qualification</th>
            </tr>
          </thead>

          <tbody>
            {filteredTeachers.map((t) => (
              <tr key={t._id} className="hover:bg-gray-50">
                <td className="p-3 border">{t.name}</td>
                <td className="p-3 border">{t.subject}</td>
                <td className="p-3 border">{t.email}</td>
                <td className="p-3 border">{t.phone}</td>
                <td className="p-3 border">{t.qualification}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTeachers.length === 0 && (
          <p className="text-center py-4">No teachers found.</p>
        )}
      </div>
    </div>
  );
}
