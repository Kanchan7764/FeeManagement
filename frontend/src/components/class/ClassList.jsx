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

  return (
    <>
      {classLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="p-5">
          <div className="text-center">
            <h3 className="text-2xl font-bold">Manage Class</h3>
          </div>
          <div className="flex justify-between items-center">
            <input
              type="text"
              placeholder="search by class Name"
              className="px-4 py-0.5 border"
              onChange={filterClasses}
            />
            <Link
              to="/admin-dashboard/add-class"
              className="px-4 py-1 bg-teal-600 rounded text-white"
            >
              Add New Class
            </Link>
          </div>
          <div className="mt-5">
            <Datatable columns={columns} data={filteredClass} pagination />
          </div>
        </div>
      )}
    </>
  );
};

export default ClassList;
