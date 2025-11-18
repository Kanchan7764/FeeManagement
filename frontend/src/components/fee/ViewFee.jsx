import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ViewFee = () => {
  const { id } = useParams();
  const [studentFee, setStudentFee] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const feesPerPage = 10; // Show 10 records per page

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const isAdmin = user.role === "admin";

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

  // Handle admin approve/reject
  const handleVerify = async (feeId, action) => {
    try {
      const res = await axios.post(
        `http://localhost:3000/api/fee/verify/${feeId}`,
        { action },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      if (res.data.success) {
        alert(res.data.message);
        const updatedFees = studentFee.map(fee =>
          fee._id === feeId
            ? { ...fee, verificationStatus: action === "approve" ? "approved" : "rejected" }
            : fee
        );
        setStudentFee(updatedFees);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update verification status");
    }
  };

  // Pagination
  const indexOfLastFee = currentPage * feesPerPage;
  const indexOfFirstFee = indexOfLastFee - feesPerPage;
  const currentFees = studentFee.slice(indexOfFirstFee, indexOfLastFee);
  const totalPages = Math.ceil(studentFee.length / feesPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Fee History</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading fee history...</p>
      ) : studentFee.length === 0 ? (
        <p className="text-center text-gray-500">No fee records found.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border">S.No</th>
                  <th className="py-2 px-4 border">Fee ID</th>
                  <th className="py-2 px-4 border">Fee Type</th>
                  <th className="py-2 px-4 border">Total Amount</th>
                  <th className="py-2 px-4 border">Amount Paid</th>
                  <th className="py-2 px-4 border">Remaining</th>
                  <th className="py-2 px-4 border">Due Date</th>
                  {/* <th className="py-2 px-4 border">Status</th> */}
                  <th className="py-2 px-4 border">Completed Date</th>
                  {/* <th className="py-2 px-4 border">Admin Verification</th> */}
                </tr>
              </thead>
              <tbody>
                {currentFees.map((fee, index) => {
                  const status = fee.status?.toLowerCase() || "pending";
                  const statusColor =
                    status === "completed" || status === "paid"
                      ? "bg-green-100 text-green-700 border-green-400"
                      : "bg-red-100 text-red-600 border-red-400";

                  const showButtons =
                    isAdmin &&
                    status === "completed" &&
                    (!fee.verificationStatus || fee.verificationStatus === "pending");

                  const amountPaid = fee.payments?.reduce((acc, p) => acc + p.amount, 0) || 0;
                  const remaining = (fee.fees || 0) - amountPaid;

                  return (
                    <tr key={fee._id} className="text-center hover:bg-gray-50 transition">
                      <td className="py-2 px-4 border">{(currentPage - 1) * feesPerPage + index + 1}</td>
                      <td className="py-2 px-4 border">{fee.feeId || "-"}</td>
                      <td className="py-2 px-4 border">{fee.fee || "Regular Fee"}</td>
                      <td className="py-2 px-4 border">₹{fee.fees}</td>
                      <td className="py-2 px-4 border">₹{fee.paidAmount}</td>
                      <td className="py-2 px-4 border">₹{fee.remaining}</td>
                      <td className="py-2 px-4 border">
                        {fee.duedate ? new Date(fee.duedate).toLocaleDateString() : "N/A"}
                      </td>
                      {/* <td className="py-2 px-4 border">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${statusColor}`}>
                          {fee.status || "Unpaid"}
                        </span>
                      </td> */}
                      <td className="py-2 px-4 border">
                        {fee.completedDate ? new Date(fee.completedDate).toLocaleDateString() : "N/A"}
                      </td>
                      {/* <td className="py-2 px-4 border">
                        {showButtons ? (
                          <div className="flex justify-center gap-2">
                            <button className="px-2 py-1 bg-green-600 text-white rounded" onClick={() => handleVerify(fee._id, "approve")}>
                              Approve
                            </button>
                            <button className="px-2 py-1 bg-red-600 text-white rounded" onClick={() => handleVerify(fee._id, "reject")}>
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span
                            className={`px-2 py-1 rounded-full text-white ${
                              fee.verificationStatus === "approved"
                                ? "bg-green-500"
                                : fee.verificationStatus === "rejected"
                                ? "bg-red-500"
                                : "bg-gray-500"
                            }`}
                          >
                            {fee.verificationStatus || "pending"}
                          </span>
                        )}
                      </td> */}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-3 mt-5 flex-wrap">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">
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

            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewFee;
