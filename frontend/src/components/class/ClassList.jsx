import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Datatable from "react-data-table-component";
import { ClassButtons, columns } from "../../utils/ClassHelper";
import axios from "axios";

const ClassList = () => {
  const [classData, setClassData] = useState([]);
  const [classLoading, setClsLoading] = useState(false);
  const [filteredClass, setFilteredClass] = useState([]);

  const onClassDelete = async (id) => {
    const data = classData.filter((cls) => cls._id !== id);
    setClassData(data);
    setFilteredClass(data);
  };

  useEffect(() => {
    const fetchClass = async () => {
      setClsLoading(true);
      try {
        const response = await axios.get("http://localhost:3000/api/class", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data.success) {
          let sno = 1;
          const data = response.data.data.map((cls) => ({
            _id: cls._id,
            sno: sno++,
            class_name: cls.class_name,
            description: cls.description,
            action: (
              <ClassButtons _id={cls._id} onClassDelete={onClassDelete} />
            ),
          }));
          setClassData(data);
          setFilteredClass(data);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
      } finally {
        setClsLoading(false);
      }
    };
    fetchClass();
  }, []);

  const filterClasses = (e) => {
    const records = classData.filter((cls) =>
      cls.class_name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredClass(records);
  };

  if (classLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="p-4 sm:p-6">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold">Manage Class</h3>
      </div>

      {/* Filter and Add Button */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
        <input
          type="text"
          placeholder="Search by Class Name"
          className="px-4 py-2 border rounded w-full sm:w-1/2"
          onChange={filterClasses}
        />
        <Link
          to="/admin-dashboard/add-class"
          className="px-4 py-2 bg-teal-600 rounded text-white w-full sm:w-auto text-center"
        >
          Add New Class
        </Link>
      </div>

      {/* Table for larger screens */}
      <div className="hidden sm:block overflow-x-auto">
        <Datatable
          columns={columns}
          data={filteredClass}
          pagination
          responsive
          highlightOnHover
          dense
        />
      </div>

      {/* Mobile stacked cards */}
      <div className="sm:hidden space-y-4">
        {filteredClass.map((cls) => (
          <div
            key={cls._id}
            className="border p-4 rounded-lg bg-white shadow-sm"
          >
            <p className="font-semibold">
              Class: <span className="font-normal">{cls.class_name}</span>
            </p>
            <p className="font-semibold">
              Description: <span className="font-normal">{cls.description}</span>
            </p>
            <div className="mt-2">{cls.action}</div>
          </div>
        ))}

        {filteredClass.length === 0 && (
          <p className="text-center py-4 text-gray-600">No classes found.</p>
        )}
      </div>
    </div>
  );
};

export default ClassList;
