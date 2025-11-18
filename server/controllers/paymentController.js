import Payment from "../models/Payment.js";
import Student from "../models/Students.js";
import Fees from '../models/Fee.js'
import mongoose from "mongoose";




// ✅ Add new payment
// models

export const getSingleReceipt = async (req, res) => {
  try {
    const paymentId = req.params.paymentId;

    const payment = await Payment.findById(paymentId)
  .populate({
    path: "studentId",
    select: "studentId userId",
    populate: {
      path: "userId",
      select: "name email phone"   // 👈 choose fields you want
    }
  })
  .populate("feeId", "feeId feeType totalFee");

console.log(payment);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json({
      studentName: payment.studentId.userId.name,
      studentId: payment.studentId.studentId,
      feeId: payment.feeId.feeId,

      feeType: payment.feeType,
      totalFee: payment.totalFee,
      paidAmount: payment.paidAmount,
      remaining: payment.remaining,
      month: payment.month,
      year: payment.year,
      paymentPlan: payment.paymentPlan,

      payments: [
        {
          date: payment.paymentdate,
          mode: payment.paymentPlan, // you didn't store mode, so using plan
          amount: payment.paidAmount,
          transactionId: payment.paymentId, // using _id as transaction id
        },
      ],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
;



export const allpayment= async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("studentId", "studentId name")
      .populate("feeId", "feeId");

      console.log("payment",payment)
    res.status(200).json({
      success: true,
      Payments: payments,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}



// Generate unique payment ID: e.g., PAY-20251117-ABC123


// Generate unique payment ID
// Generate Payment ID like Fee ID: PAY + 4-digit random number
const generatePaymentId = () => {
  const randomNumber = Math.floor(1000 + Math.random() * 9000); // 1000-9999
  return `PAY${randomNumber}`;
};

const addPayment = async (req, res) => {
  try {
    const { userId, studentId, feeId, feeType, amountToPay, paymentdate, paymentPlan } = req.body;

    if (!userId || !feeId || !amountToPay || !paymentdate) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const fee = await Fees.findById(feeId);
    if (!fee) return res.status(404).json({ success: false, error: "Fee record not found" });

    // Initialize variables
    let discount = 0;
    let totalFee = fee.fees;
    let installments = 1;

    if (!fee.discountApplied) {
      // Apply discount based on plan
      if (paymentPlan === "Quarterly") discount = 2;
      else if (paymentPlan === "Half-Yearly") discount = 5;
      else if (paymentPlan === "Yearly") discount = 10;

      totalFee = Number((fee.fees * (1 - discount / 100)).toFixed(2));

      // Determine installments
      if (paymentPlan === "Quarterly") installments = 3;
      else if (paymentPlan === "Half-Yearly") installments = 2;
      else if (paymentPlan === "Monthly") installments = 12;

      fee.fees = totalFee;
      fee.discountApplied = true;
      fee.discountPlan = paymentPlan;
      fee.discountPercentage = discount;
      fee.installmentAmount = Number((totalFee / installments).toFixed(2));
    } else {
      discount = fee.discountPercentage || 0;
      totalFee = fee.fees;
      installments = Math.round(totalFee / fee.installmentAmount);
    }

    const installmentAmount = Number(fee.installmentAmount.toFixed(2));
    let remainingFee = Number((totalFee - (fee.paidAmount || 0)).toFixed(2));

    let amount = Number(amountToPay);
    if (amount <= 0) return res.status(400).json({ success: false, error: "Amount must be greater than 0" });
    if (amount > remainingFee) amount = remainingFee;
    amount = Number(amount.toFixed(2));

    // Update Fee
    fee.paidAmount = Number(((fee.paidAmount || 0) + amount).toFixed(2));
    const newRemaining = Number((totalFee - fee.paidAmount).toFixed(2));
    fee.status = newRemaining === 0 ? "completed" : "pending";
    if (fee.status === "completed") fee.completedDate = paymentdate;

    await fee.save();

    // Create Payment with ID like Fee ID
    const payment = await Payment.create({
      userId,
      studentId,
      feeType,
      totalFee,
      paidAmount: amount,
      remaining: newRemaining,
      status: fee.status,
      paymentdate,
      feeId,
      paymentPlan: fee.discountPlan,
      month: new Date(paymentdate).toLocaleString("default", { month: "long" }),
      year: new Date(paymentdate).getFullYear(),
      paymentId: generatePaymentId(), // <-- uses new format like FE1234
    });

    return res.status(200).json({
      success: true,
      message: "Payment recorded successfully",
      payment,
      remaining: newRemaining,
      amount,
      installmentAmount,
      discountedFee: totalFee,
    });

  } catch (err) {
    console.error("❌ Error adding payment:", err);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};





export const getPaymentStatement = async (req, res) => {
  try {
    const { feeId } = req.params;
    console.log("fee",feeId)

    const feeDoc = await Fees.findOne({ feeId });

    if (!feeDoc) {
      return res.status(404).json({ message: "Fee not found" });
    }
console.log("fee",feeDoc)
    const payments = await Payment.find({ feeId: feeDoc._id })
      .populate("studentId", "studentId userId")
      .populate("userId", "name")
      .populate("feeId", "feeId");

      // console.log("payments",payments)
    if (!payments.length) {
      return res.json({
        success: false,
                message: `No payment found for Fee ID: ${feeId}`

      });
    }

    const studentName = payments[0].userId?.name || "N/A";
    const studentId = payments[0].studentId?.studentId || "N/A";

    const totalDeposit = payments.reduce((sum, p) => sum + (p.paidAmount || 0), 0);

    const formattedPayments = payments.map(p => ({
      date: p.paymentdate?.toISOString().split("T")[0] || "",
      paymentId: p.paymentId,
      mode: p.paymentPlan || "N/A",
      amount: p.paidAmount || 0
    }));

    res.json({
      success: true,
      studentName,
      studentId,
      feeId,
      totalDeposit,
      payments: formattedPayments
    });
    console.log("payme",formattedPayments)
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching statement", error });
  }
//   try {
//     const { feeId } = req.params;
//     const userId = req.user._id; // from authMiddleware

//     if (!feeId || !userId) {
//       return res.status(400).json({ success: false, error: "Missing feeId or userId" });
//     }

//     // Make sure userId is a valid ObjectId
//     const userObjectId = new mongoose.Types.ObjectId(userId);

//     // Find the student linked to this user
//     const student = await Student.findOne({ userId: userObjectId });
//     if (!student) {
//       return res.status(404).json({ success: false, error: "Student not found" });
//     }
//        const fee = await Fees.findOne({ feeId });

//     // Ensure feeId is a string, in case it is stored as a string in Payment
//     const payment = await Payment.findOne({
//       feeId: fee,
//       studentId: new mongoose.Types.ObjectId(student._id),
//     });
// console.log("payme",payment)
//     if (!payment) {
//       return res.status(404).json({ success: false, error: "Payment not found" });
//     }

//     // Calculate totalPaid and remaining
//     const totalPaid = payment.payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
//     const remaining = (payment.totalDeposit || 0) - totalPaid;

//     return res.status(200).json({
//       success: true,
//       studentName: userId.name,
//       studentId: student.studentId,
//       feeId: payment.feeId,
//       totalDeposit: payment.totalDeposit,
//       totalPaid,
//       remaining,
//       payments: payment.payments || [],
//     });
//   } catch (err) {
//     console.error("Payment statement error:", err);
//     return res.status(500).json({ success: false, error: "Server error" });
//   }
};





// ==========================
//      ACCEPT PAYMENT
// ==========================
export const acceptPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    payment.status = "accepted";
    await payment.save();

    res.status(200).json({
      message: "Payment accepted successfully",
      payment,
    });
  } catch (err) {
    console.error("Error in acceptPayment:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================
//      REJECT PAYMENT
// ==========================
export const rejectPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    payment.status = "rejected";
    await payment.save();

    res.status(200).json({
      message: "Payment rejected successfully",
      payment,
    });
  } catch (err) {
    console.error("Error in rejectPayment:", err);
    res.status(500).json({ message: "Server error" });
  }
};




export const getStatementByFeeId = async (req, res) => {
  try {
    const { feeId } = req.params;

    const feeDoc = await Fees.findOne({ feeId });

    if (!feeDoc) {
      return res.status(404).json({ 
        success: false,
        message: "Fee not found" 
      });
    }

    const payments = await Payment.find({ feeId: feeDoc._id })
      .populate("studentId", "studentId userId")
      .populate("userId", "name")
      .populate("feeId", "feeId");

    if (!payments.length) {
      return res.status(200).json({
        success: false,
        message: `No payment found for Fee ID: ${feeId}`
      });
    }

    const studentName = payments[0].userId?.name || "N/A";
    const studentId = payments[0].studentId?.studentId || "N/A";

    const totalDeposit = payments.reduce((sum, p) => sum + (p.paidAmount || 0), 0);

    const formattedPayments = payments.map(p => ({
      date: p.paymentdate?.toISOString().split("T")[0] || "",
      paymentId: p.paymentId,
      mode: p.paymentPlan || "N/A",
      amount: p.paidAmount || 0
    }));

    res.status(200).json({
      success: true,
      studentName,
      studentId,
      feeId,
      totalDeposit,
      payments: formattedPayments
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching statement", 
      error 
    });
  }
};




// const checkMonthlyCompletion = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { month, year } = req.query;

//     if (!month || !year) 
//       return res.status(400).json({ success: false, error: "Month and year required" });

//     const student = await Student.findOne({ userId });
//     if (!student) 
//       return res.status(404).json({ success: false, error: "Student not found" });

//     // Convert month name to 0-based index
//     const monthNames = [
//       "January","February","March","April","May","June",
//       "July","August","September","October","November","December"
//     ];
//     const monthIndex = monthNames.indexOf(month);
//     if (monthIndex === -1) 
//       return res.status(400).json({ success: false, error: "Invalid month" });

//     const startDate = new Date(year, monthIndex, 1);
//     const endDate = new Date(year, monthIndex + 1, 1);

//     // Fetch all fees for that student whose due date is in the month
//     const fees = await Fees.find({
//       studentId: student._id,
//       duedate: { $gte: startDate, $lt: endDate }
//     });

//     console.log("All fetched fees for student:", fees.map(f => ({
//       fee: f.fee,
//       status: f.status,
//       paidAmount: f.paidAmount,
//       totalFee: f.fees
//     })));

//     if (fees.length === 0) {
//       return res.status(200).json({ success: true, allCompleted: false, message: "No fees found for this month." });
//     }

//     // Check if all fees are fully paid AND not pending
//     const allCompleted = fees.every(f => 
//       f.status.toLowerCase() !== "pending" && Number(f.paidAmount) >= Number(f.fees)
//     );

//     return res.status(200).json({ success: true, allCompleted });

//   } catch (err) {
//     console.error("❌ checkMonthlyCompletion error:", err);
//     return res.status(500).json({ success: false, error: err.message });
//   }
// };





const getPaymentsForStudent = async (req, res) => {
  try {
    const { id } = req.params; // userId
    const { month, year } = req.query;

    const student = await Student.findOne({ userId: id });
    if (!student) return res.status(404).json({ success: false, error: "Student not found" });

    // Build query with optional filters
    const query = { studentId: student._id };
    if (month) query.month = month;
    if (year) query.year = Number(year);

    // Fetch all payments sorted newest first
    const payments = await Payment.find(query)
      .populate("studentId")
      .sort({ paymentdate: -1 });

    // Only include payments that are not fully paid
    const availablePayments = payments.filter(p => {
      const totalFee = p.totalFee || p.feeId?.fees || 0;
      const paid = p.paidAmount || 0;
      const remaining = p.remaining ?? (totalFee - paid);
      return remaining > 0 || p.status !== "completed";
    });

    res.json({ success: true, payments: availablePayments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};






  
// Example Express controller


export const getStudentPayments = async (req, res) => {
  try {
    const userId = req.user._id; // obtained from authMiddleware

    // 1️⃣ Find the student linked to this user
    const student = await Student.findOne({ userId });
    console.log("student",student._id)
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // 2️⃣ Find payments for this student

    const payments = await Payment.find({ studentId: student._id })
      .populate("studentId", "studentId userId")
      .populate("feeId", "feeId");

    // 3️⃣ Return response
    console.log("payment",payments)
    res.json({ success: true, allPayment: payments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

  





const getAllPayments = async (req, res) => {
  console.log("📩 getAllPayments API hit"); // 👈 Add this line

  try {
    const allPayment = await Payment.find()
  .populate({
    path: "studentId",
    select: "studentId userId",
    populate: { path: "userId", select: "name" }
  })
  .populate({
    path: "feeId",
    model: "Fees",
    select: "fee fees feeId month year installments installmentAmount"
  });


    console.log("✅ Payments fetched:", allPayment); 

    return res.status(200).json({ success: true, allPayment });
  } catch (error) {
    console.error("❌ getAllPayments error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};







const getPayments = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Find the student linked to this user
    const student = await Student.findOne({ userId: id });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // 2️⃣ Find all payments for this student, populate Fee and Student details
    const Payments = await Payment.find({ studentId: student._id })
      .populate({
        path: "feeId",
        select: "feeType fees month year", // total fee info
      })
      .populate({
        path: "studentId",
        select: "name rollNumber",
      })
      .sort({ createdAt: -1 });

    // 3️⃣ If no payments, send empty array
    if (!Payments.length) {
      return res.status(200).json({ success: true, Payments: [] });
    }

    // 4️⃣ Send populated data
    return res.status(200).json({ success: true, Payments });
  } catch (error) {
    console.error("❌ getPayments error:", error);
    return res
      .status(500)
      .json({ success: false, error: "getPayments server error" });
  }
};




// GET /api/payment/:id
const getPaymentsByUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const payments = await Payment.find({ userId })
      .populate({
        path: "feeId",
        select: "fees feeType month year", // fetch total fee
      })
      .populate({
        path: "studentId",
        select: "name rollNumber",
      });

    if (!payments.length) {
      return res.status(200).json({ success: true, Payments: [] });
    }

    res.status(200).json({
      success: true,
      Payments: payments,
    });
  } catch (err) {
    console.error("❌ Error fetching payments:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { addPayment, getAllPayments ,getPayments  ,getPaymentsForStudent };
