import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Datatable from "react-data-table-component";
import axios from "axios";

const ViewAllFees = () => {
  const [fees, setFees] = useState([]);
  const [filteredFees, setFilteredFees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({
    totalAmount: 0,
    totalPaid: 0,
    pendingAmount: 0,
    nextPayment: null,
    overdueCount: 0,
  });

  useEffect(() => {
    const fetchFees = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3000/api/fee/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response?.data?.success) {
          const allFees = response.data.allFees || [];

          const data = allFees.map((fee, index) => ({
            _id: fee._id,
            sno: index + 1,
            studentName: fee.studentId?.userId?.name || "N/A",
            studentId: fee.studentId?.studentId || "N/A",
            rollNo: fee.studentId?.rollNo || "N/A",
            feeId:fee.feeId,
            // className: fee.classId?.class_name || "N/A",
            feeType: fee.fee || "Regular Fee",
            amount: Number(fee.fees) || 0,
            paidAmount: Number(fee.paidAmount) || 0,
            status: fee.status || "Pending",
            dueDate: fee.duedate ? new Date(fee.duedate) : null,
            completedDate: fee.completedDate ? new Date(fee.completedDate) : null,
            createdAt: new Date(fee.createdAt),
          }));

          setFees(data);
          setFilteredFees(data);

          // ===== Summary Calculation =====
          const totalAmount = allFees.reduce((acc, f) => acc + (f.fees || 0), 0);
          const totalPaid = allFees.reduce((acc, f) => acc + (f.paidAmount || 0), 0);

          // ✅ Actual remaining unpaid balance across all students
          const pendingAmount = allFees.reduce((acc, f) => {
            const total = f.fees || 0;
            const paid = f.paidAmount || 0;
            const remaining = Math.max(total - paid, 0);
            return acc + (f.status?.toLowerCase() !== "completed" ? remaining : 0);
          }, 0);

          const nextPayment = data
            .filter((f) => f.status.toLowerCase() === "pending" && f.dueDate)
            .sort((a, b) => a.dueDate - b.dueDate)[0]?.dueDate;

          const overdueCount = data.filter(
            (f) =>
              f.status.toLowerCase() === "pending" &&
              f.dueDate &&
              f.dueDate < new Date()
          ).length;

          setSummary({
            totalAmount,
            totalPaid,
            pendingAmount,
            nextPayment,
            overdueCount,
          });
        } else {
          alert("No fee data found");
        }
      } catch (error) {
        console.error("❌ Error fetching fees:", error);
        alert(
          error.response?.data?.error ||
            "Failed to fetch fee data. Check backend."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFees();
  }, []);

  // === DataTable Columns ===
  const columns = [
  { name: "S.No", selector: (row) => row.sno, sortable: true, width: "70px" },
  { name: "Student Name", selector: (row) => row.studentName, sortable: true },
  
  // Show Student ID instead of Roll No
  { name: "Student ID", selector: (row) => row.studentId, sortable: true },
  
  // Show Fee ID
  { name: "Fee ID", selector: (row) => row.feeId, sortable: true },
  
  // { name: "Class", selector: (row) => row.className, sortable: true },
  { name: "Fee Type", selector: (row) => row.feeType },
  { name: "Amount", selector: (row) => `₹${row.amount}`, sortable: true },
  { name: "Paid Amount", selector: (row) => `₹${row.paidAmount}`, sortable: true },
  { name: "Remaining", selector: (row) => `₹${Math.max(row.amount - row.paidAmount, 0)}`, sortable: true },
  { name: "Assign Date", selector: (row) => row.dueDate ? row.dueDate.toLocaleDateString() : "N/A", sortable: true },
  // {
  //   name: "Status",
  //   selector: (row) => row.status,
  //   sortable: true,
  //   cell: (row) => (
  //     <span className={`px-3 py-1 rounded-full text-white font-medium ${row.status.toLowerCase() === "completed" ? "bg-green-500" : "bg-red-500"}`}>
  //       {row.status}
  //     </span>
  //   ),
  // },
  // { name: "Completed Date", selector: (row) => row.completedDate ? row.completedDate.toLocaleDateString() : "N/A", sortable: true },
];


  return (
    <div className="p-5 space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-4">All Students Fee Dashboard</h3>
      </div>

      {/* === Summary Cards === */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-orange-500 text-white p-6 rounded-2xl shadow-md">
          <h4 className="text-lg font-semibold">Total Amount</h4>
          <p className="text-3xl font-bold mt-2">
            ₹{summary.totalAmount.toLocaleString()}
          </p>
          <p className="text-sm opacity-80 mt-1">All assigned fees</p>
        </div>

        <div className="bg-green-500 text-white p-6 rounded-2xl shadow-md">
          <h4 className="text-lg font-semibold">Total Paid</h4>
          <p className="text-3xl font-bold mt-2">
            ₹{summary.totalPaid.toLocaleString()}
          </p>
          <p className="text-sm opacity-80 mt-1">Completed payments</p>
        </div>

        <div className="bg-blue-500 text-white p-6 rounded-2xl shadow-md">
          <h4 className="text-lg font-semibold">Pending Amount</h4>
          <p className="text-3xl font-bold mt-2">
            ₹{summary.pendingAmount.toLocaleString()}
          </p>
          <p className="text-sm opacity-80 mt-1">Unpaid balances</p>
        </div>

        <div className="bg-red-500 text-white p-6 rounded-2xl shadow-md">
          <h4 className="text-lg font-semibold">Overdue Fees</h4>
          <p className="text-3xl font-bold mt-2">{summary.overdueCount}</p>
          <p className="text-sm opacity-80 mt-1">Payments overdue</p>
        </div>
      </div>

      {/* === Table Section === */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by Class or Student ID"
          className="px-4 py-2 border rounded w-64"
          onChange={(e) => {
            const keyword = e.target.value.toLowerCase();
            const filtered = fees.filter(
              (fee) =>
                fee.className.toLowerCase().includes(keyword) ||
                fee.studentId.toLowerCase().includes(keyword)
            );
            setFilteredFees(filtered);
          }}
        />
        <Link
          to="/admin-dashboard/fee/add"
          className="px-4 py-2 bg-teal-600 rounded text-white"
        >
          Add New Fee
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 justify-between items-center mb-4">
  {/* <div className="flex gap-3">
    <button
      onClick={async () => {
        try {
          const res = await fetch("http://localhost:3000/api/fee/download/all", {
            method: "GET",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          if (!res.ok) throw new Error("Failed to download fee history");
          const blob = await res.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "All_Fee_History.pdf";
          document.body.appendChild(a);
          a.click();
          a.remove();
        } catch (err) {
          console.error("❌ Error downloading fee history:", err);
        }
      }}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
    >
       Download Fee History
    </button>

    <button
      onClick={async () => {
        try {
          const res = await fetch("http://localhost:3000/api/payment/download/all", {
            method: "GET",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          if (!res.ok) throw new Error("Failed to download payment history");
          const blob = await res.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "All_Payment_History.pdf";
          document.body.appendChild(a);
          a.click();
          a.remove();
        } catch (err) {
          console.error("❌ Error downloading payment history:", err);
        }
      }}
      className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
    >
       Download Payment History
    </button>
  </div> */}

  {/* <input
    type="text"
    placeholder="Search by Class or Student ID"
    className="px-4 py-2 border rounded w-64"
    onChange={(e) => {
      const keyword = e.target.value.toLowerCase();
      const filtered = fees.filter(
        (fee) =>
          fee.className.toLowerCase().includes(keyword) ||
          fee.studentId.toLowerCase().includes(keyword)
      );
      setFilteredFees(filtered);
    }}
  /> */}
</div>


      {loading ? (
        <div>Loading fees...</div>
      ) : (
        <Datatable columns={columns} data={filteredFees} pagination />
      )}
    </div>
  );
};

export default ViewAllFees;
