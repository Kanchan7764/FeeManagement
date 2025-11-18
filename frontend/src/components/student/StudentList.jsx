import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import axios from "axios";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredStudent, setFilteredStudent] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3000/api/student", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (response.data.success && Array.isArray(response.data.students)) {
          const mapped = response.data.students.map((stu, index) => ({
            _id: stu._id,
            sno: index + 1,
            name: stu.userId?.name || "N/A",
            studentId: stu.studentId || "N/A",
            status: stu.status || "active",
            fatherName: stu.fatherName || "N/A",
            motherName: stu.MotherName || "N/A",
            rollNo: stu.rollNo,
            class_name: stu.classs?.class_name || "N/A",
            dob: stu.dob ? new Date(stu.dob).toLocaleDateString() : "N/A",
            profileImage: (
              <img
                src={
                  stu.userId?.profileImage
                    ? `http://localhost:3000/${stu.userId.profileImage}`
                    : "/default.png"
                }
                alt="profile"
                className="rounded-full w-10 h-10 object-cover"
              />
            ),
          }));
          setStudents(mapped);
          setFilteredStudent(mapped);
        } else {
          setStudents([]);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleFilter = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const records = students.filter(
      (stu) =>
        stu.name.toLowerCase().includes(searchValue) ||
        stu.class_name.toLowerCase().includes(searchValue)
    );
    setFilteredStudent(records);
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await axios.patch(
        `http://localhost:3000/api/student/status/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      if (res.data.success) {
        const updatedStudents = students.map((stu) =>
          stu._id === id ? { ...stu, status: newStatus } : stu
        );
        setStudents(updatedStudents);
        setFilteredStudent(updatedStudents);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  const columns = [
    { name: "S.No", selector: (row) => row.sno, sortable: true },
    { name: "Profile", selector: (row) => row.profileImage },
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Student ID", selector: (row) => row.studentId, sortable: true },
    { name: "Class", selector: (row) => row.class_name, sortable: true },
    { name: "Roll No", selector: (row) => row.rollNo, sortable: true },
    { name: "Status", selector: (row) => row.status, sortable: true },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex space-x-3">
          <FaCheckCircle
            className="text-green-600 cursor-pointer"
            size={20}
            title="Activate"
            onClick={() => updateStatus(row._id, "active")}
          />
          <FaTimesCircle
            className="text-red-600 cursor-pointer"
            size={20}
            title="Block"
            onClick={() => updateStatus(row._id, "blocked")}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold"> Student List</h3>
      </div>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by class or student name"
          className="px-4 py-0.5 border rounded"
          onChange={handleFilter}
        />
        <Link
          to="/admin-dashboard/add-student"
          className="px-4 py-1 bg-teal-600 rounded text-white"
        >
          Add New Student
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={filteredStudent}
        progressPending={loading}
        pagination
        highlightOnHover
        dense
      />
    </div>
  );
};

export default StudentList;
