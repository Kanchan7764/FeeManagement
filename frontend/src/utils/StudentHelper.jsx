import axios from "axios";
import { useNavigate } from "react-router-dom";

// ---------------------------
// Columns definition
// ---------------------------
export const columns = [
  { name: "S No", selector: (row) => row.sno, width: "75px" },
  { name: "Image", cell: (row) => row.profileImage, width: "100px" },
  { name: "Name", selector: (row) => row.name, sortable: true, width: "150px" },
  { name: "Father Name", selector: (row) => row.fatherName, width: "150px" },
  { name: "Mother Name", selector: (row) => row.motherName, width: "150px" },
  { name: "Class Name", selector: (row) => row.class_name, width: "100px" },
  { name: "Roll No", selector: (row) => row.rollNo, width: "100px" },
  { name: "DOB", selector: (row) => row.dob, width: "100px" },
  { name: "Action", cell: (row) => row.action },
];

// ---------------------------
// Fetch all classes
// ---------------------------
export const fetchClass = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/class", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.data.success && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      return [];
    }
  } catch (error) {
    if (error.response && error.response.data?.error) {
      alert(error.response.data.error);
    } else {
      alert("Error fetching classes");
    }
    return [];
  }
};

// ---------------------------
// Fetch students by class ID
// ---------------------------
export const getStudents = async (classId) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/student/classes/${classId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.data.success && Array.isArray(response.data.students)) {
      return response.data.students;
    } else {
      return [];
    }
  } catch (error) {
    if (error.response && error.response.data?.error) {
      alert(error.response.data.error);
    } else {
      alert("Error fetching students");
    }
    return [];
  }
};

// ---------------------------
// Student action buttons
// ---------------------------
export const StudentButtons = ({ Id, onDeleteSuccess }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      const res = await axios.delete(`http://localhost:3000/api/student/${Id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        alert(res.data.message || "Student deleted successfully!");
        // Update parent state
        if (onDeleteSuccess) onDeleteSuccess(Id);
      }
    } catch (err) {
      console.error("Error deleting student:", err);
      alert(err.response?.data?.error || "Failed to delete student");
    }
  };

;

  return (
    <div className="flex space-x-2">
      <button
        className="px-3 py-1 bg-teal-600 text-white rounded hover:bg-teal-700"
        onClick={() => navigate(`/admin-dashboard/student/${Id}`)}
      >
        View
      </button>
      <button
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => navigate(`/admin-dashboard/student/edit/${Id}`)}
      >
        Edit
      </button>
      <button
        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        onClick={() => navigate(`/admin-dashboard/student/fee/${Id}`)}
      >
        Fees
      </button>
      <button
        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        onClick={handleDelete}
      >
        Delete
      </button>
    </div>
  );
};
