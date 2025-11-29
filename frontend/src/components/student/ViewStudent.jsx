import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

const ViewStudent = () => {
  const { id } = useParams()
  const [student, setStudent] = useState(null)

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/student/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          setStudent(response.data.student);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
      } 
    };
    fetchStudent();
  }, [id]);

  if (!student) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className='max-w-4xl mx-auto mt-10 bg-white p-6 sm:p-8 rounded-md shadow-md'>
      <h2 className='text-2xl font-bold mb-8 text-center'>Student Details</h2>
      
      <div className='flex flex-col md:flex-row gap-6 items-center md:items-start'>
        {/* Profile Image */}
        <div className='flex justify-center md:justify-start w-full md:w-1/3'>
          <img
            src={`http://localhost:3000/${student.userId.profileImage}`}
            alt={student.userId.name}
            className='rounded-full border w-full max-w-xs object-cover'
          />
        </div>

        {/* Student Details */}
        <div className='flex-1 w-full'>
          {[
            { label: "Name", value: student.userId.name },
            { label: "Student ID", value: student.studentId },
            { label: "Father's Name", value: student.fatherName },
            { label: "Mother's Name", value: student.MotherName },
            { label: "Class", value: student.classs.class_name },
            { label: "Date Of Birth", value: new Date(student.dob).toLocaleDateString() },
            { label: "Gender", value: student.gender },
          ].map((item, index) => (
            <div key={index} className='flex flex-col sm:flex-row sm:space-x-2 mb-4'>
              <p className='text-lg font-bold w-full sm:w-1/3'>{item.label}:</p>
              <p className='font-medium w-full sm:w-2/3'>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ViewStudent
