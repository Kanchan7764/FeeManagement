import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ViewFee = () => {
  const { id } = useParams();
  const [studentFee, setStudentFee] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const feesPerPage = 10;

  const fetchFees = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/fee/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.data.success) {
        setStudentFee(response.data.studentFee || []);
      }
    } catch (error) {
      console.error("❌ Error fetching fee history:", error);
      alert(error.response?.data?.error || "Failed to fetch fee data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  // Pagination
  const indexOfLastFee = currentPage * feesPerPage;
  const indexOfFirstFee = indexOfLastFee - feesPerPage;
  const currentFees = studentFee.slice(indexOfFirstFee, indexOfLastFee);
  const totalPages = Math.ceil(studentFee.length / feesPerPage);
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="max-w-6xl mx-auto mt-6 sm:mt-10 p-4 sm:p-8 bg-white rounded-md shadow-md space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800">Fee History</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading fee history...</p>
      ) : studentFee.length === 0 ? (
        <p className="text-center text-gray-500">No fee records found.</p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-md text-sm sm:text-base">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border">S.No</th>
                  <th className="py-2 px-4 border">Fee ID</th>
                  <th className="py-2 px-4 border">Fee Type</th>
                  <th className="py-2 px-4 border">Total Amount</th>
                  <th className="py-2 px-4 border">Amount Paid</th>
                  <th className="py-2 px-4 border">Remaining</th>
                  <th className="py-2 px-4 border">Due Date</th>
                  <th className="py-2 px-4 border">Completed Date</th>
                </tr>
              </thead>
              <tbody>
                {currentFees.map((fee, index) => {
                  const amountPaid = fee.payments?.reduce((acc, p) => acc + p.amount, 0) || 0;
                  const remaining = (fee.fees || 0) - amountPaid;

                  return (
                    <tr key={fee._id} className="text-center hover:bg-gray-50 transition">
                      <td className="py-1 px-2 sm:py-2 sm:px-4 border">{(currentPage - 1) * feesPerPage + index + 1}</td>
                      <td className="py-1 px-2 sm:py-2 sm:px-4 border">{fee.feeId || "-"}</td>
                      <td className="py-1 px-2 sm:py-2 sm:px-4 border">{fee.fee || "Regular Fee"}</td>
                      <td className="py-1 px-2 sm:py-2 sm:px-4 border">₹{fee.fees}</td>
                      <td className="py-1 px-2 sm:py-2 sm:px-4 border">₹{fee.paidAmount}</td>
                      <td className="py-1 px-2 sm:py-2 sm:px-4 border">₹{remaining}</td>
                      <td className="py-1 px-2 sm:py-2 sm:px-4 border">{fee.duedate ? new Date(fee.duedate).toLocaleDateString() : "N/A"}</td>
                      <td className="py-1 px-2 sm:py-2 sm:px-4 border">{fee.completedDate ? new Date(fee.completedDate).toLocaleDateString() : "N/A"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="sm:hidden space-y-4">
            {currentFees.map((fee, index) => {
              const amountPaid = fee.payments?.reduce((acc, p) => acc + p.amount, 0) || 0;
              const remaining = (fee.fees || 0) - amountPaid;

              return (
                <div key={fee._id} className="border rounded-lg p-4 shadow-sm bg-gray-50">
                  <p><span className="font-semibold">S.No:</span> {(currentPage - 1) * feesPerPage + index + 1}</p>
                  <p><span className="font-semibold">Fee ID:</span> {fee.feeId || "-"}</p>
                  <p><span className="font-semibold">Fee Type:</span> {fee.fee || "Regular Fee"}</p>
                  <p><span className="font-semibold">Total Amount:</span> ₹{fee.fees}</p>
                  <p><span className="font-semibold">Amount Paid:</span> ₹{fee.paidAmount}</p>
                  <p><span className="font-semibold">Remaining:</span> ₹{remaining}</p>
                  <p><span className="font-semibold">Due Date:</span> {fee.duedate ? new Date(fee.duedate).toLocaleDateString() : "N/A"}</p>
                  <p><span className="font-semibold">Completed Date:</span> {fee.completedDate ? new Date(fee.completedDate).toLocaleDateString() : "N/A"}</p>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-teal-600 text-white" : "bg-gray-200"}`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewFee;
