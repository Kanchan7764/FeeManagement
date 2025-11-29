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
            rollNo: stu.rollNo || "N/A",
            class_name: stu.classs?.class_name || "N/A",
            dob: stu.dob ? new Date(stu.dob).toLocaleDateString() : "N/A",
            profileImage: stu.userId?.profileImage
              ? `http://localhost:3000/${stu.userId.profileImage}`
              : "/default.png",
          }));
          setStudents(mapped);
          setFilteredStudent(mapped);
        } else {
          setStudents([]);
          setFilteredStudent([]);
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
    { name: "S.No", selector: (row) => row.sno, sortable: true, width: "60px" },
    {
      name: "Profile",
      selector: (row) => (
        <img
          src={row.profileImage}
          alt="profile"
          className="rounded-full w-8 h-8 sm:w-10 sm:h-10 object-cover"
        />
      ),
      width: "60px",
    },
    { name: "Name", selector: (row) => row.name, sortable: true, wrap: true },
    { name: "Student ID", selector: (row) => row.studentId, sortable: true, wrap: true },
    { name: "Class", selector: (row) => row.class_name, sortable: true, wrap: true },
    { name: "Roll No", selector: (row) => row.rollNo, sortable: true, wrap: true },
    { name: "Status", selector: (row) => row.status, sortable: true, wrap: true },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex space-x-2">
          <FaCheckCircle
            className="text-green-600 cursor-pointer"
            size={18}
            title="Activate"
            onClick={() => updateStatus(row._id, "active")}
          />
          <FaTimesCircle
            className="text-red-600 cursor-pointer"
            size={18}
            title="Block"
            onClick={() => updateStatus(row._id, "blocked")}
          />
        </div>
      ),
      ignoreRowClick: true,
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        paddingLeft: '8px',
        paddingRight: '8px',
        fontSize: '12px',
      }
    },
    cells: {
      style: {
        paddingLeft: '8px',
        paddingRight: '8px',
        fontSize: '12px',
      }
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold">Student List</h3>
      </div>

      {/* Filter and Add Button */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
        <input
          type="text"
          placeholder="Search by class or student name"
          className="px-4 py-2 border rounded w-full sm:w-1/2"
          onChange={handleFilter}
        />
        <Link
          to="/admin-dashboard/add-student"
          className="px-4 py-2 bg-teal-600 rounded text-white w-full sm:w-auto text-center"
        >
          Add New Student
        </Link>
      </div>

      {/* Mobile stacked cards */}
      <div className="grid grid-cols-1 gap-4 sm:hidden">
        {filteredStudent.map((stu) => (
          <div key={stu._id} className="border rounded p-4 shadow">
            <div className="flex items-center space-x-3">
              <img
                src={stu.profileImage}
                alt="profile"
                className="rounded-full w-12 h-12 object-cover"
              />
              <div className="flex-1">
                <p className="font-bold">{stu.name}</p>
                <p>Student ID: {stu.studentId}</p>
                <p>Class: {stu.class_name}</p>
                <p>Roll No: {stu.rollNo}</p>
                <p>Status: {stu.status}</p>
              </div>
            </div>
            <div className="flex space-x-2 mt-2">
              <FaCheckCircle
                className="text-green-600 cursor-pointer"
                onClick={() => updateStatus(stu._id, "active")}
              />
              <FaTimesCircle
                className="text-red-600 cursor-pointer"
                onClick={() => updateStatus(stu._id, "blocked")}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <DataTable
          columns={columns}
          data={filteredStudent}
          progressPending={loading}
          pagination
          highlightOnHover
          dense
          responsive={false} // prevent automatic hiding
          customStyles={customStyles}
        />
      </div>
    </div>
  );
};

export default StudentList;
