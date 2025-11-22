import React, { useState } from "react";
import axios from "axios";

export default function AddTeacherPage() {
  const [teacher, setTeacher] = useState({
  name: "",
  subject: "",
  email: "",
  phone: "",
  qualification: "",
  address: "",
});

    // const [formData, setFormData] = useState({});
  

  const [errors, setErrors] = useState({});

  const validate = () => {
    const err = {};

    if (!teacher.name.trim()) err.name = "Teacher name is required";
    if (!teacher.subject.trim()) err.subject = "Subject is required";

    if (teacher.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(teacher.email))
      err.email = "Enter a valid email";

    if (teacher.phone && teacher.phone.length !== 10)
      err.phone = "Phone number must be 10 digits";

    return err;
  };


  const handleSubmit = async (e) => {
  e.preventDefault();

  const err = validate();
  setErrors(err);

  if (Object.keys(err).length > 0) return;

  try {
    const response = await axios.post(
      "http://localhost:3000/api/teacher/addteacher",
      teacher,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    alert("Teacher added successfully!");

    setTeacher({
      name: "",
      subject: "",
      email: "",
      phone: "",
      qualification: "",
      address: "",
    });

  } catch (error) {
    console.error(error);
    alert("Server error. Check your backend!");
  }
};


  return (
    <div className="min-h-screen flex justify-center items-start p-10 bg-gray-100">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Add New Teacher
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Teacher Name */}
            <div>
              <label className="block text-sm text-gray-600">
                Teacher Name
              </label>
              <input
                type="text"
                value={teacher.name}
                onChange={(e) =>
                  setTeacher({ ...teacher, name: e.target.value })
                }
                placeholder="Enter teacher name"
                className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-300"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm text-gray-600">
                {" "}
                Specialised Subject
              </label>
              <input
                type="text"
                value={teacher.subject}
                onChange={(e) =>
                  setTeacher({ ...teacher, subject: e.target.value })
                }
                placeholder="Enter subject"
                className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-300"
              />
              {errors.subject && (
                <p className="text-sm text-red-500 mt-1">{errors.subject}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-600">Email </label>
              <input
                type="email"
                value={teacher.email}
                onChange={(e) =>
                  setTeacher({ ...teacher, email: e.target.value })
                }
                placeholder="Enter email address"
                className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-300"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm text-gray-600">
                Phone (optional)
              </label>
              <input
                type="number"
                value={teacher.phone}
                onChange={(e) =>
                  setTeacher({ ...teacher, phone: e.target.value })
                }
                placeholder="10-digit phone number"
                className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-300"
              />
              {errors.phone && (
                <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Qualification */}
          <div>
            <label className="block text-sm text-gray-600">Qualification</label>
            <input
              type="text"
              value={teacher.qualification}
              onChange={(e) =>
                setTeacher({ ...teacher, qualification: e.target.value })
              }
              placeholder="e.g., M.Sc., B.Ed"
              className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Specialised Subject */}

          {/* Address */}
          <div>
            <label className="block text-sm text-gray-600">Address</label>
            <textarea
              value={teacher.address}
              onChange={(e) =>
                setTeacher({ ...teacher, address: e.target.value })
              }
              placeholder="Enter full address"
              className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-300"
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-lg"
          >
            Add Teacher
          </button>
        </form>
      </div>
    </div>
  );
}
