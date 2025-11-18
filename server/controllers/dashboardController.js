import Student from "../models/Students.js";
import Fees from "../models/Fee.js";

export const getDashboardData = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();

    const collectedFees = await Fees.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$fees" } } },
    ]);
    const totalCollected = collectedFees.length > 0 ? collectedFees[0].total : 0;

    // 👇 Fix: sum all unpaid or pending
    const pendingFees = await Fees.aggregate([
      { $match: { status: { $ne: "completed" } } },
      { $group: { _id: null, total: { $sum: "$fees" } } },
    ]);
    console.log(pendingFees)
    const totalPending = pendingFees.length > 0 ? pendingFees[0].total : 0;
    console.log("total",totalPending)

    const defaulters = await Fees.distinct("studentId", {
      status: { $ne: "completed" },
    });

    res.status(200).json({
      success: true,
      totalStudents,
      totalCollected,
      totalPending,
      defaulters: defaulters.length,
    });
  } catch (error) {
    console.error("❌ Error fetching dashboard data:", error);
    res.status(500).json({ success: false, error: "Server error fetching dashboard data" });
  }
};
