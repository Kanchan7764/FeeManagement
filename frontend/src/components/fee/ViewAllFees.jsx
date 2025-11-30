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
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (response?.data?.success) {
          const allFees = response.data.allFees || [];
          const data = allFees.map((fee, index) => ({
            _id: fee._id,
            sno: index + 1,
            studentName: fee.studentId?.userId?.name || "N/A",
            studentId: fee.studentId?.studentId || "N/A",
            rollNo: fee.studentId?.rollNo || "N/A",
            feeId: fee.feeId,
            feeType: fee.fee || "Regular Fee",
            amount: Number(fee.fees) || 0,
            paidAmount: Number(fee.paidAmount) || 0,
            status: fee.status || "Pending",
            dueDate: fee.duedate ? new Date(fee.duedate) : null,
          }));

          setFees(data);
          setFilteredFees(data);

          // Summary calculations
          const totalAmount = allFees.reduce((acc, f) => acc + (f.fees || 0), 0);
          const totalPaid = allFees.reduce((acc, f) => acc + (f.paidAmount || 0), 0);
          const pendingAmount = allFees.reduce((acc, f) => {
            const remaining = Math.max((f.fees || 0) - (f.paidAmount || 0), 0);
            return acc + (f.status?.toLowerCase() !== "completed" ? remaining : 0);
          }, 0);
          const overdueCount = data.filter(
            (f) => f.status.toLowerCase() === "pending" && f.dueDate && f.dueDate < new Date()
          ).length;

          setSummary({ totalAmount, totalPaid, pendingAmount, nextPayment: null, overdueCount });
        }
      } catch (error) {
        console.error(error);
        alert("Failed to fetch fees.");
      } finally {
        setLoading(false);
      }
    };
    fetchFees();
  }, []);

  const columns = [
    { name: "S.No", selector: (row) => row.sno, sortable: true, width: "70px" },
    { name: "Student Name", selector: (row) => row.studentName, sortable: true },
    { name: "Student ID", selector: (row) => row.studentId, sortable: true },
    { name: "Fee ID", selector: (row) => row.feeId, sortable: true },
    { name: "Fee Type", selector: (row) => row.feeType },
    { name: "Amount", selector: (row) => `₹${row.amount}`, sortable: true },
    { name: "Paid Amount", selector: (row) => `₹${row.paidAmount}`, sortable: true },
    {
      name: "Remaining",
      selector: (row) => `₹${Math.max(row.amount - row.paidAmount, 0)}`,
      sortable: true,
    },
    {
      name: "Assign Date",
      selector: (row) => (row.dueDate ? row.dueDate.toLocaleDateString() : "N/A"),
      sortable: true,
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-4">All Students Fee Dashboard</h3>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-orange-500 text-white p-4 sm:p-6 rounded-2xl shadow-md">
          <h4 className="text-lg font-semibold">Total Amount</h4>
          <p className="text-2xl sm:text-3xl font-bold mt-2">₹{summary.totalAmount.toLocaleString()}</p>
        </div>
        <div className="bg-green-500 text-white p-4 sm:p-6 rounded-2xl shadow-md">
          <h4 className="text-lg font-semibold">Total Paid</h4>
          <p className="text-2xl sm:text-3xl font-bold mt-2">₹{summary.totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-blue-500 text-white p-4 sm:p-6 rounded-2xl shadow-md">
          <h4 className="text-lg font-semibold">Pending Amount</h4>
          <p className="text-2xl sm:text-3xl font-bold mt-2">₹{summary.pendingAmount.toLocaleString()}</p>
        </div>
        <div className="bg-red-500 text-white p-4 sm:p-6 rounded-2xl shadow-md">
          <h4 className="text-lg font-semibold">Overdue Fees</h4>
          <p className="text-2xl sm:text-3xl font-bold mt-2">{summary.overdueCount}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-2 mt-4">
        <input
          type="text"
          placeholder="Search by Class or Student ID"
          className="px-4 py-2 border rounded w-full sm:w-64"
          onChange={(e) => {
            const keyword = e.target.value.toLowerCase();
            const filtered = fees.filter(
              (fee) =>
                fee.studentName.toLowerCase().includes(keyword) ||
                fee.studentId.toLowerCase().includes(keyword)
            );
            setFilteredFees(filtered);
          }}
        />
        <Link
          to="/admin-dashboard/fee/add"
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded w-full sm:w-auto text-center"
        >
          Add New Fee
        </Link>
      </div>

      {/* DESKTOP TABLE (≥1024px) */}
      <div className="hidden lg:block overflow-x-auto">
        {loading ? (
          <div className="text-center py-4">Loading fees...</div>
        ) : (
          <Datatable columns={columns} data={filteredFees} pagination responsive />
        )}
      </div>

      {/* TABLET VIEW (640px–1023px) → 2 Column Cards */}
      <div className="hidden sm:grid lg:hidden grid-cols-2 gap-4">
        {filteredFees.map((fee) => (
          <div key={fee._id} className="bg-white p-4 rounded-lg shadow space-y-1">
            <p><strong>S.No:</strong> {fee.sno}</p>
            <p><strong>Student Name:</strong> {fee.studentName}</p>
            <p><strong>Student ID:</strong> {fee.studentId}</p>
            <p><strong>Fee ID:</strong> {fee.feeId}</p>
            <p><strong>Fee Type:</strong> {fee.feeType}</p>
            <p><strong>Amount:</strong> ₹{fee.amount}</p>
            <p><strong>Paid:</strong> ₹{fee.paidAmount}</p>
            <p><strong>Remaining:</strong> ₹{Math.max(fee.amount - fee.paidAmount, 0)}</p>
            <p><strong>Assign Date:</strong> {fee.dueDate ? fee.dueDate.toLocaleDateString() : "N/A"}</p>
            <p><strong>Status:</strong> {fee.status}</p>
          </div>
        ))}
      </div>

      {/* MOBILE VIEW (<640px) */}
      <div className="sm:hidden space-y-4">
        {filteredFees.map((fee) => (
          <div key={fee._id} className="bg-white p-4 rounded-lg shadow">
            <p><span className="font-semibold">S.No:</span> {fee.sno}</p>
            <p><span className="font-semibold">Student Name:</span> {fee.studentName}</p>
            <p><span className="font-semibold">Student ID:</span> {fee.studentId}</p>
            <p><span className="font-semibold">Fee ID:</span> {fee.feeId}</p>
            <p><span className="font-semibold">Fee Type:</span> {fee.feeType}</p>
            <p><span className="font-semibold">Amount:</span> ₹{fee.amount}</p>
            <p><span className="font-semibold">Paid:</span> ₹{fee.paidAmount}</p>
            <p><span className="font-semibold">Remaining:</span> ₹{Math.max(fee.amount - fee.paidAmount, 0)}</p>
            <p><span className="font-semibold">Assign Date:</span> {fee.dueDate ? fee.dueDate.toLocaleDateString() : "N/A"}</p>
            <p><span className="font-semibold">Status:</span> {fee.status}</p>
          </div>
        ))}

        {filteredFees.length === 0 && (
          <p className="text-center py-4 text-gray-600">No fees found.</p>
        )}
      </div>
    </div>
  );
};

export default ViewAllFees;
