import Student from "../models/Students.js";
import Payment from "../models/Payment.js";
import Fees from "../models/Fee.js"; // make sure the path matches your project
import PDFDocument from "pdfkit";




export const downloadPaymentReceipt = async (req, res) => {
  try {
    const { paymentId } = req.params;
    if (!paymentId)
      return res.status(400).json({ success: false, error: "Payment ID required" });

    // Fetch the selected payment
    const currentPayment = await Payment.findById(paymentId)
      .populate({
        path: "studentId",
        select: "studentId fatherName MotherName phoneNo classs",
        populate: { path: "classs", select: "class_name section" }
      });

    if (!currentPayment)
      return res.status(404).json({ success: false, error: "Payment not found" });

    // Fetch the fee record
    const fee = await Fees.findById(currentPayment.feeId);
    if (!fee)
      return res.status(404).json({ success: false, error: "Fee record not found" });

    // Create PDF
    const PDFDocument = (await import("pdfkit")).default;
    const doc = new PDFDocument({ margin: 25, size: "A4" });
    const filename = `Receipt_${paymentId}.pdf`;

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res);

    // ---------- HEADER ----------
    doc.fontSize(18).text("School Fee Receipt", { align: "center" }).moveDown(0.5);
    doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString("en-IN")}`, { align: "center" }).moveDown(1);

    // ---------- STUDENT INFO ----------
    const s = currentPayment.studentId || {};
    const c = s.classs || {};
    const classInfo = c.class_name ? `${c.class_name}${c.section ? "-" + c.section : ""}` : "-";

    doc.fontSize(10)
      .text(`Student ID: ${s.studentId || "-"}`)
      .text(`Father: ${s.fatherName || "-"}`)
      .text(`Mother: ${s.MotherName || "-"}`)
      .text(`Phone: ${s.phoneNo || "-"}`)
      .text(`Class: ${classInfo}`)
      .moveDown(0.5);

    // ---------- PAYMENT INFO ----------
    const tableTop = doc.y + 10;
    const columns = {
      feeType: 50, total: 180, paid: 250, remaining: 320, status: 400, paymentDate: 470
    };

    doc.fontSize(9).font("Helvetica-Bold")
      .text("Fee Type", columns.feeType, tableTop)
      .text("Total ₹", columns.total, tableTop)
      .text("Paid ₹", columns.paid, tableTop)
      .text("Remaining ₹", columns.remaining, tableTop)
      .text("Status", columns.status, tableTop)
      .text("Payment Date", columns.paymentDate, tableTop);

    doc.moveTo(30, tableTop + 12).lineTo(550, tableTop + 12).stroke();

    // ---------- ROW ----------
    const paymentDate = currentPayment.paymentdate
      ? new Date(currentPayment.paymentdate).toLocaleDateString("en-GB")
      : "-";
    const remaining = currentPayment.remaining ?? (currentPayment.totalFee - currentPayment.paidAmount);

    doc.fontSize(9).font("Helvetica")
      .text(currentPayment.feeType?.replace("_", " ").toUpperCase() || "-", columns.feeType, tableTop + 20)
      .text(fee.fees || 0, columns.total, tableTop + 20)
      .text(currentPayment.paidAmount || 0, columns.paid, tableTop + 20)
      .text(remaining, columns.remaining, tableTop + 20)
      .text(currentPayment.status || "-", columns.status, tableTop + 20)
      .text(paymentDate, columns.paymentDate, tableTop + 20);

    // ---------- FOOTER ----------
    const footerY = doc.page.height - 80;
    doc.fontSize(10)
      .text(`Payment ID: ${currentPayment._id}`, 25, footerY)
      .text("Authorized Signature: ____________________", 25, footerY + 20);

    doc.end();
  } catch (err) {
    console.error("❌ Error generating receipt:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};





// 📄 Generate a single PDF containing all payments for a user









export const getAllReceiptsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const student = await Student.findOne({ userId });

    if (!student)
      return res.status(404).json({ success: false, message: "Student not found" });

    // Fetch payments sorted oldest first
    const payments = await Payment.find({ studentId: student._id })
      .populate("feeId")
      .sort({ paymentdate: 1 }); // oldest first

    if (!payments.length) {
      return res.status(404).json({ success: false, message: "No payments found" });
    }

    // Map payments to PDF rows
    const allPayments = payments.map((p, i) => {
      const totalFee = p.feeId?.fees || p.totalFee || 0;
      const paidAmount = p.paidAmount || 0;

      return {
        sno: i + 1,
        feeType: p.feeType?.replace("_", " ").toUpperCase() || "N/A",
        totalFee,
        paidAmount,
        status: p.status || "Pending",
        paymentDate: p.paymentdate
          ? new Date(p.paymentdate).toLocaleDateString()
          : "N/A",
      };
    });

    // PDF setup
    const doc = new PDFDocument({ margin: 25, size: "A4", layout: "portrait" });
    const filename = `${student.studentId || "Student"}_Payment_Statement.pdf`;
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res);

    // -------- HEADER --------
    doc.fontSize(18).text("Student Payment Statement", { align: "center" });
    doc.moveDown(0.3);
    doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: "center" });
    doc.moveDown(0.8);

    // -------- STUDENT INFO --------
    doc.fontSize(10)
      .text(`Student ID: ${student.studentId || "-"}`, 30, doc.y, { continued: true })
      .text(`    Father: ${student.fatherName || "-"}`, { continued: true })
      .text(`    Mother: ${student.MotherName || "-"}`);
    doc.text(`Phone: ${student.phoneNo || "-"}`);
    doc.moveDown(0.5);

    // -------- TABLE HEADER --------
    const tableTop = doc.y + 10;
    const columns = {
      sno: 30,
      feeType: 60,
      total: 180,
      paid: 230,
      remaining: 280,
      status: 340,
      paymentDate: 420,
    };

    doc.fontSize(9).font("Helvetica-Bold")
      .text("S.No", columns.sno, tableTop)
      .text("Fee Type", columns.feeType, tableTop)
      .text("Total ₹", columns.total, tableTop)
      .text("Paid ₹", columns.paid, tableTop)
      .text("Remaining ₹", columns.remaining, tableTop)
      .text("Status", columns.status, tableTop)
      .text("Payment Date", columns.paymentDate, tableTop);

    doc.moveTo(30, tableTop + 12).lineTo(550, tableTop + 12).stroke();

    // -------- TABLE ROWS --------
    let y = tableTop + 20;

    // Track cumulative remaining per fee type
    const feeRemainingMap = {}; // { "BUS FEE": total - sumPaid, ... }

    allPayments.forEach((p) => {
      const feeType = p.feeType;
      const total = p.totalFee;
      const paid = p.paidAmount;

      if (!feeRemainingMap[feeType]) feeRemainingMap[feeType] = total;

      const remaining = feeRemainingMap[feeType] - paid;
      feeRemainingMap[feeType] = remaining;

      if (y > 720) { // leave space for message at bottom
        doc.addPage();
        y = 60;
      }

      doc.fontSize(9).font("Helvetica")
        .text(p.sno, columns.sno, y)
        .text(feeType, columns.feeType, y)
        .text(total, columns.total, y)
        .text(paid, columns.paid, y)
        .text(remaining, columns.remaining, y)
        .text(p.status, columns.status, y)
        .text(p.paymentDate, columns.paymentDate, y);

      y += 16;
    });

    // -------- THANK YOU MESSAGE AT BOTTOM --------
    if (y < 750) {
      // add space to push to bottom
      doc.moveTo(30, 770).stroke();
      doc.fontSize(9)
        .text("Thank you for your payments!", 30, 780, { align: "center" })
        .text("This is a system-generated statement.", { align: "center" });
    } else {
      doc.addPage();
      doc.fontSize(9)
        .text("Thank you for your payments!", 30, 780, { align: "center" })
        .text("This is a system-generated statement.", { align: "center" });
    }

    doc.end();

  } catch (err) {
    console.error("❌ Error generating payment statement:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};





























export const downloadAllFeeHistory = async (req, res) => {
  try {
    const fees = await Fees.find()
      .populate({
        path: "studentId",
        select: "studentId rollNo userId",
        populate: {
          path: "userId", // nested populate
          select: "name", // fetch student name from User
        },
      })
      .populate({
        path: "classId",
        select: "class_name section",
      })
      .sort({ completedDate: -1 });

    if (!fees.length) {
      return res.status(404).json({
        success: false,
        message: "No fee records found",
      });
    }

    const doc = new PDFDocument({ margin: 25, size: "A4", layout: "portrait" });
    const filename = `All_Fee_History_${new Date()
      .toISOString()
      .split("T")[0]}.pdf`;

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res);

    // 🧾 Header
    doc
      .fontSize(18)
      .text("All Fee Records", { align: "center" })
      .moveDown(0.3);
    doc
      .fontSize(10)
      .text(`Generated on: ${new Date().toLocaleString("en-IN")}`, {
        align: "center",
      })
      .moveDown(0.8);

    // 🧩 Table Header (10 columns)
    const tableTop = 110;
    const columns = {
      sno: 35, name: 60, id: 140, roll: 200, class: 245, feeType: 300, total: 365, paid: 400, status: 450, completed: 500,
    };

    doc
      .fontSize(9)
      .text("S.No", columns.sno, tableTop)
      .text("Name", columns.name, tableTop)
      .text("Student ID", columns.id, tableTop)
      .text("Roll", columns.roll, tableTop)
      .text("Class", columns.class, tableTop)
      .text("Fee Type", columns.feeType, tableTop)
      .text("Total ₹", columns.total, tableTop)
      .text("Paid ₹", columns.paid, tableTop)
      .text("Status", columns.status, tableTop)
      .text("Completed", columns.completed, tableTop);

    doc.moveTo(30, tableTop + 12).lineTo(570, tableTop + 12).stroke();

    // 📄 Table Rows
    let y = tableTop + 18;

    fees.forEach((f, i) => {
      const s = f.studentId || {};
      const c = f.classId || {};

      // ✅ Access nested name
      const name = s.userId?.name || "-";
      const classInfo = `${c.class_name || ""}${c.section ? "-" + c.section : ""}`;

      // ✅ Format completed date as DD/MM/YY
      const completedDate = f.completedDate
        ? new Date(f.completedDate)
            .toLocaleDateString("en-GB")
            .split("/")
            .map((p, i) => (i === 2 ? p.slice(-2) : p))
            .join("/")
        : "N/A";

      // ✅ Add new page if overflow
      if (y > 760) {
        doc.addPage();
        y = 60;
      }

      doc
        .fontSize(8.5)
        .text(i + 1, columns.sno, y)
        .text(name, columns.name, y, { width: 85 }) // ✅ fixed name
        .text(s.studentId || "-", columns.id, y, { width: 70 })
        .text(s.rollNo || "-", columns.roll, y, { width: 35 })
        .text(classInfo || "-", columns.class, y, { width: 55 })
        .text(f.fee || "-", columns.feeType, y, { width: 55 })
        .text(f.fees || 0, columns.total, y, { width: 40 })
        .text(f.paidAmount || 0, columns.paid, y, { width: 45 })
        .text(f.status || "Pending", columns.status, y, { width: 55 })
        .text(completedDate, columns.completed, y, { width: 50 });

      y += 16;
    });

    doc.end();
  } catch (err) {
    console.error("❌ Error generating fee report:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};








export const downloadAllPaymentsReport = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate({
        path: "studentId",
        select: "rollNo classs userId",
        populate: [
          { path: "userId", select: "name" },
          { path: "classs", select: "class_name section" },
        ],
      })
      .populate({
        path: "feeId", // populate total fees if needed
        select: "fees",
      })
      .sort({ paymentdate: -1 });

    if (!payments.length)
      return res.status(404).json({ success: false, message: "No payment records found" });

    const PDFDocument = (await import("pdfkit")).default;
    const doc = new PDFDocument({ margin: 25, size: "A4" });

    const filename = `All_Payment_History_${new Date().toISOString().split("T")[0]}.pdf`;
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res);

    // Header
    doc.fontSize(18).text("All Payment Records ", { align: "center" }).moveDown(0.5);
    doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString("en-IN")}`, { align: "center" }).moveDown(0.8);

    // Table Header
    const tableTop = 110;
    const columns = {
      sno: 30,
      name: 60,
      roll: 150,
      class: 180,
      feeType: 250,
      total: 310,
      paid: 350,
      remaining: 400,
      status: 450,
      date: 500,
    };

    doc.fontSize(9)
      .text("S.No", columns.sno, tableTop)
      .text("Name", columns.name, tableTop)
      .text("Roll No", columns.roll, tableTop)
      .text("Class", columns.class, tableTop)
      .text("Fee Type", columns.feeType, tableTop)
      .text("Total ₹", columns.total, tableTop)
      .text("Paid ₹", columns.paid, tableTop)
      .text("Remaining ₹", columns.remaining, tableTop)
      .text("Status", columns.status, tableTop)
      .text("Date", columns.date, tableTop);

    doc.moveTo(25, tableTop + 12).lineTo(565, tableTop + 12).stroke();

    // Table rows
    let y = tableTop + 18;
    payments.forEach((p, i) => {
      const s = p.studentId || {};
      const u = s.userId || {};
      const c = s.classs || {};
      const f = p.feeId || {};

      const classInfo = c.class_name ? `${c.class_name}${c.section ? "-" + c.section : ""}` : "-";
      const paymentDate = p.paymentdate
        ? new Date(p.paymentdate).toLocaleDateString("en-GB").split("/").map((part, idx) => idx === 2 ? part.slice(-2) : part).join("/")
        : "-";

      if (y > 760) {
        doc.addPage();
        y = 60;
      }

      doc.fontSize(8.5)
        .text(i + 1, columns.sno, y)
        .text(u.name || "-", columns.name, y, { width: 100 })
        .text(s.rollNo || "-", columns.roll, y)
        .text(classInfo || "-", columns.class, y)
        .text(p.feeType || "-", columns.feeType, y)
        .text(p.totalFee || f.fees|| 0, columns.total, y) // total fee
        .text(p.paidAmount || 0, columns.paid, y)           // paid
        .text(p.remaining || 0, columns.remaining, y)       // remaining
        .text(p.status || "-", columns.status, y)
        .text(paymentDate, columns.date, y);

      y += 16;
    });

    doc.end();
  } catch (err) {
    console.error("❌ Error generating all payments report:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};




