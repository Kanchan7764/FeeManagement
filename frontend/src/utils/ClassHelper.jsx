import { useNavigate } from "react-router-dom";
import axios from "axios";

export const columns = [
  {
    name: "S No",
    selector: (row) => row.sno,
  },
  {
    name: "Class Name",
    selector: (row)=>row.class_name,
    sortable:true
  },
  {
    name: "description",
    selector: (row) => row.description,
  },
  {
    name: "Action",
    selector: (row) => row.action,
  },
];

export const ClassButtons = ({ _id, onClassDelete }) => {
  const navigate = useNavigate();
  const handleDelete = async (id) => {
    const confirm = window.confirm("Do you want to delete?");
    if (confirm) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/api/class/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        //  console.log(response.data)
        if (response.data.success) {
          onClassDelete(id);
          setClassData((prev) => prev.filter((cls) => cls._id !== id));
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
      }
    }
  };
  return (
    <div className="flex space-x-3">
      <button
        className="px-3 py-1 bg-teal-600 text-white"
        onClick={() => navigate(`/admin-dashboard/class/${_id}`)}
      >
        Edit
      </button>
      <button
        className="px-3 py-1 bg-red-500 text-white"
        onClick={() => handleDelete(_id)}
      >
        Delete
      </button>
    </div>
  );
};
