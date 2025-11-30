import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TeacherListPage() {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3000/api/teacher/allteacher");
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

  if (loading) return <p className="text-center mt-10 text-gray-700">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">
        Teacher List
      </h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name, subject, or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full sm:w-1/2 p-3 mb-6 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
      />

      {/* Table for medium+ screens */}
      <div className="hidden sm:block overflow-x-auto rounded-lg shadow">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Subject</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Phone</th>
              <th className="p-3 border">Qualification</th>
            </tr>
          </thead>

          <tbody>
            {filteredTeachers.map((t) => (
              <tr key={t._id} className="hover:bg-gray-50 even:bg-gray-50 odd:bg-white">
                <td className="p-3 border">{t.name}</td>
                <td className="p-3 border">{t.subject}</td>
                <td className="p-3 border break-words">{t.email}</td>
                <td className="p-3 border">{t.phone || "-"}</td>
                <td className="p-3 border">{t.qualification || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTeachers.length === 0 && (
          <p className="text-center py-4 text-gray-600">No teachers found.</p>
        )}
      </div>

      {/* Mobile stacked cards for screens < sm */}
      <div className="sm:hidden space-y-4">
        {filteredTeachers.map((t) => (
          <div
            key={t._id}
            className="border p-4 rounded-lg bg-white shadow-sm"
          >
            <p className="font-semibold">Name: <span className="font-normal">{t.name}</span></p>
            <p className="font-semibold">Subject: <span className="font-normal">{t.subject}</span></p>
            <p className="font-semibold">Email: <span className="font-normal break-words">{t.email}</span></p>
            <p className="font-semibold">Phone: <span className="font-normal">{t.phone || "-"}</span></p>
            <p className="font-semibold">Qualification: <span className="font-normal">{t.qualification || "-"}</span></p>
          </div>
        ))}

        {filteredTeachers.length === 0 && (
          <p className="text-center py-4 text-gray-600">No teachers found.</p>
        )}
      </div>
    </div>
  );
}
