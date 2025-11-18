import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import axios from "axios";

const paymentPlans = [
  { label: "Monthly", discount: 0, installments: 12 },
  { label: "Quarterly", discount: 2, installments: 3 },
  { label: "Half-Yearly", discount: 5, installments: 2 },
  { label: "Yearly", discount: 10, installments: 1 },
];

const AddPayment = () => {
  const { user } = useAuth();
  const [availableFees, setAvailableFees] = useState([]);
  const [selectedFee, setSelectedFee] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(paymentPlans[0].label);
  const [installmentAmount, setInstallmentAmount] = useState(0);
  const [amountToPay, setAmountToPay] = useState("");
  const [discountedFee, setDiscountedFee] = useState(0);
  const [paymentDate, setPaymentDate] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);

  // Fetch pending fees
  const fetchPendingFees = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/fee/${user._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.data.success) {
        const pending = res.data.studentFee.filter(f => f.status === "pending");
        setAvailableFees(pending);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch pending fees");
    }
  };

  useEffect(() => { fetchPendingFees(); }, []);

  // Fetch payment history for selected fee
  const fetchPaymentHistory = async (feeId) => {
    if (!feeId) return;
    try {
      const res = await axios.get(`http://localhost:3000/api/payment/history/${feeId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.data.success) {
        const sortedPayments = res.data.payments.sort(
          (a, b) => new Date(b.paymentdate) - new Date(a.paymentdate)
        );
        setPaymentHistory(sortedPayments);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update discounted fee & installment when fee or plan changes
  useEffect(() => {
    if (!selectedFee) return;

    if (selectedFee.discountApplied) {
      setDiscountedFee(Number(selectedFee.fees).toFixed(2));
      setInstallmentAmount(Number(selectedFee.installmentAmount).toFixed(2));
      setAmountToPay(Number(selectedFee.installmentAmount).toFixed(2));
      setSelectedPlan(selectedFee.discountPlan);
    } else {
      const plan = paymentPlans.find(p => p.label === selectedPlan);
      const discounted = selectedFee.fees * (1 - plan.discount / 100);
      const installment = discounted / plan.installments;

      setDiscountedFee(Number(discounted.toFixed(2)));
      setInstallmentAmount(Number(installment.toFixed(2)));
      setAmountToPay(Number(installment.toFixed(2)));
    }

    fetchPaymentHistory(selectedFee._id);
  }, [selectedFee, selectedPlan]);

  const remainingAmount = selectedFee
    ? selectedFee.discountApplied
      ? selectedFee.fees - (selectedFee.paidAmount || 0)
      : discountedFee
    : 0;

  const handlePaymentSubmit = async () => {
    if (!selectedFee || !amountToPay || !paymentDate) {
      setError("Please select fee, plan, amount, and date.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/api/payment/add",
        {
          userId: user._id,
          studentId: selectedFee.studentId,
          feeId: selectedFee._id,
          feeType: selectedFee.fee,
          amountToPay: Number(amountToPay),
          paymentdate: paymentDate,
          paymentPlan: selectedFee.discountApplied ? selectedFee.discountPlan : selectedPlan,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      if (res.data.success) {
        setSuccessMessage(`✅ Payment successful! Payment ID: ${res.data.payment.paymentId}`);
        setPaymentHistory(prev => [res.data.payment, ...prev]);
        fetchPendingFees();
        setSelectedFee(null);
        setSelectedPlan(paymentPlans[0].label);
        setAmountToPay("");
        setDiscountedFee(0);
        setInstallmentAmount(0);
        setPaymentDate("");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Payment failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add Payment</h2>

      {successMessage && (
        <div className="mb-4 p-4 rounded-md bg-green-100 border border-green-400 text-green-800">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 rounded-md bg-red-100 border border-red-400 text-red-800">
          {error}
        </div>
      )}

      {/* Payment History */}
      {paymentHistory.length > 0 && (
        <div className="mb-6 border p-4 rounded bg-gray-50">
          <h3 className="font-semibold text-lg mb-2">Payment History</h3>
          <ul className="space-y-2">
            {paymentHistory.map(p => (
              <li key={p._id} className="p-2 border rounded flex justify-between items-center bg-white">
                <div>
                  <p><strong>ID:</strong> {p.paymentId}</p>
                  <p><strong>Amount:</strong> ₹{p.paidAmount}</p>
                  <p><strong>Date:</strong> {new Date(p.paymentdate).toLocaleDateString()}</p>
                </div>
                <span className={`px-2 py-1 rounded text-white ${
                  p.status === "completed" ? "bg-green-600" :
                  p.status === "pending" ? "bg-yellow-500" :
                  "bg-gray-500"
                }`}>
                  {p.status.toUpperCase()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Payment Form */}
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Fee Type</label>
          <select
            value={selectedFee?._id || ""}
            onChange={e => {
              const fee = availableFees.find(f => f._id === e.target.value);
              setSelectedFee(fee);
              if (fee) setAmountToPay(fee.fees - fee.paidAmount);
            }}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          >
            <option value="">Select Fee</option>
            {availableFees.map(f => (
              <option key={f._id} value={f._id}>
                {f.fee.replace("_"," ").toUpperCase()} — Pending ₹{f.fees - f.paidAmount}
              </option>
            ))}
          </select>
        </div>

        {selectedFee && !selectedFee.discountApplied && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Plan</label>
            <select
              value={selectedPlan}
              onChange={e => setSelectedPlan(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            >
              {paymentPlans.map(p => (
                <option key={p.label} value={p.label}>
                  {p.label} — {p.discount}% discount — {p.installments} installments
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedFee && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Total Fee (after discount)</label>
              <input
                type="number"
                value={discountedFee}
                readOnly
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Remaining Amount</label>
              <input
                type="number"
                value={remainingAmount}
                readOnly
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount to Pay</label>
              <input
                type="number"
                value={amountToPay}
                onChange={e => {
                  let val = Number(e.target.value);
                  if (val > remainingAmount) val = remainingAmount;
                  if (val < 0) val = 0;
                  setAmountToPay(val);
                }}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Date</label>
              <input
                type="date"
                value={paymentDate}
                onChange={e => setPaymentDate(e.target.value)}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              />
            </div>
          </>
        )}

        <button
          onClick={handlePaymentSubmit}
          className="w-full mt-4 py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-md font-semibold"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default AddPayment;
