import Fees from "../models/Fee.js";
import Student from "../models/Students.js";
import mongoose from "mongoose";
import Payments from "../models/Payment.js";



const addFee = async (req, res) => {
  try {
    const { studentId, classId, fee, fees, status, duedate, completedDate } = req.body;

    if (!studentId || !classId || !fees) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    // Check if this student already has this fee type
    const existingFee = await Fees.findOne({ studentId, fee });

    if (existingFee) {
      return res.status(400).json({
        success: false,
        error: `This student already has assigned fee of type "${fee}".`,
      });
    }

    // Generate Fee ID FE1234 style
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    const feeId = `FE${randomNumber}`;

    const newFee = new Fees({
      studentId,
      classId,
      fee,
      fees,
      feeId,
      status: status || "pending",
      duedate,
      completedDate,
      paidAmount: 0,
      discountApplied: false,
      discountPlan: null,
    });

    await newFee.save();
    console.log("fee", newFee);

    return res.status(200).json({ success: true, newFee });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};









const getFee = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Invalid ID format" });
    }

    // Find student by userId or studentId
    let student = await Student.findOne({ userId: id }) || await Student.findById(id);
    if (!student) {
      return res.status(404).json({ success: false, error: "Student not found for given ID" });
    }

    let studentFees = await Fees.find({ studentId: student._id })
      .populate({
        path: "studentId",
        select: "studentId userId classs",
        populate: {
          path: "classs",
          select: "class_name description"
        }
      })
      .populate("classId", "class_name")
      .sort({ createdAt: -1 });

      console.log("fee0",studentFees.paidAmount)
    // Calculate totalPaid and remaining from payments
   studentFees = studentFees.map(fee => {
  // Sum up the paid amounts from the payments array
  const totalPaid = fee.paidAmount;

  // Remaining amount = total fee - total paid
  const remaining = (fee.fees || 0) - totalPaid;

  console.log("Fee:", fee.feeId, "Total Paid:", totalPaid, "Remaining:", remaining);

  return {
    ...fee.toObject(), // convert mongoose doc to plain object
    totalPaid,
    remaining
  };
});

    return res.status(200).json({
      success: true,
      studentFee: studentFees
    });

  } catch (error) {
    console.error("❌ Fetch Fee Error:", error);
    return res.status(500).json({ success: false, error: "Server error fetching fee history" });
  }
};



const getAllFees = async (req, res) => {
console.log(req.body);
  try {
    // const studentId= await Student.findOne({studentId})
    // console.log("studentId");
    const allFees = await Fees.find()
      .populate({
        path: "studentId",         // this is the _id reference in Fees
        select: "_id studentId rollNo userId", // select fields from Student
        populate: {
          path: "userId",
          select: "name",          // populate student's name from User
        },
      })
      .populate("classId", "class_name") // populate class name
      .sort({ createdAt: -1 });

    console.log("✅ Fees fetched:", allFees);

    return res.status(200).json({ success: true, allFees });
  } catch (error) {
    console.error("❌ getAllFees error:", error);
    return res.status(500).json({ success: false, error: "getAllFees server error" });
  }
};



// controllers/feeController.js
 const handleVerify = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({ success: false, error: "Invalid action" });
    }

    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, error: "Unauthorized" });
    }

    const fee = await Fees.findById(id);
    if (!fee) return res.status(404).json({ success: false, error: "Fee not found" });

    if (fee.status.toLowerCase() !== "completed") {
      return res.status(400).json({ success: false, error: "Fee is not completed yet" });
    }

    fee.verificationStatus = action === "approve" ? "approved" : "rejected";
    await fee.save();

    return res.status(200).json({ success: true, message: `Fee ${action} successfully` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};


// PATCH /api/fee/update/:feeId
 // adjust import as needed

export const updateFeeWithDiscount = async (req, res) => {
  try {
    const { feeId } = req.params;
    const { discountedFee } = req.body;

    if (!discountedFee) {
      return res.status(400).json({ success: false, error: "Discounted fee required" });
    }

    // Find fee
    const fee = await Fee.findById(feeId);
    if (!fee) {
      return res.status(404).json({ success: false, error: "Fee not found" });
    }

    // Only update if fee is not fully paid
    if (fee.status === "completed") {
      return res.status(400).json({ success: false, error: "Cannot update a completed fee" });
    }

    fee.fees = discountedFee;
    await fee.save();

    return res.status(200).json({ success: true, fee });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};


export { addFee, getFee, getAllFees ,handleVerify };
