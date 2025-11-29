import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    MotherName: "",
    dob: "",
    phoneNo: "",
    classId: "",
  });

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/class", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.data.success) {
          setClasses(res.data.classes);
        }
      } catch (err) {
        console.error("Failed to fetch classes", err);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/student/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (res.data.success) {
          const s = res.data.student;
          setStudent(s);
          setFormData({
            name: s.userId?.name || "",
            fatherName: s.fatherName || "",
            MotherName: s.MotherName || "",
            dob: s.dob ? new Date(s.dob).toISOString().split("T")[0] : "",
            phoneNo: s.phoneNo || "",
            classId: s.classs?._id || "",
          });
        }
      } catch (err) {
        console.error(err);
        alert("Failed to fetch student data");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: formData.name,
        fatherName: formData.fatherName,
        MotherName: formData.MotherName,
        dob: formData.dob,
        phoneNo: formData.phoneNo,
        classs: formData.classId,
      };

      const res = await axios.put(
        `http://localhost:3000/api/student/update/${id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (res.data.success) {
        alert("Student updated successfully!");
        navigate("/student-dashboard");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update student");
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!student) return <div className="text-center mt-10">No student data found</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-6 sm:p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center sm:text-left">Edit Student</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md text-sm sm:text-base"
              required
            />
          </div>

          {/* Father's Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Father's Name</label>
            <input
              type="text"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md text-sm sm:text-base"
              required
            />
          </div>

          {/* Mother's Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Mother's Name</label>
            <input
              type="text"
              name="MotherName"
              value={formData.MotherName}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md text-sm sm:text-base"
              required
            />
          </div>

          {/* Phone No */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone No</label>
            <input
              type="tel"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md text-sm sm:text-base"
              required
            />
          </div>

          {/* DOB */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md text-sm sm:text-base"
              required
            />
          </div>

          {/* Class */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Class</label>
            <select
              name="classId"
              value={formData.classId}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md text-sm sm:text-base"
              required
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.class_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded transition"
        >
          Update Student
        </button>
      </form>
    </div>
  );
};

export default EditStudent;
