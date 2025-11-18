import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

import {
  addPayment,
  getAllPayments,
  getPayments,
  getPaymentsForStudent,
  allpayment,
  getSingleReceipt,
  acceptPayment,
  rejectPayment,getPaymentStatement,
  getStatementByFeeId,
  getStudentPayments
} from "../controllers/paymentController.js";

import {
  downloadPaymentReceipt,
  downloadAllPaymentsReport,
  getAllReceiptsByUser,
} from "../controllers/ReceiptController.js";

const router = express.Router();

// ------------------- PAYMENT ROUTES ------------------- //

// 📌 Get all payments
router.get("/", authMiddleware, getAllPayments);

// 📌 Add new payment
router.post("/add", authMiddleware, addPayment);

// 📌 Get single payment receipt

// 📌 Accept payment
router.put("/accept/:id", authMiddleware, acceptPayment);

// 📌 Reject payment
router.put("/reject/:id", authMiddleware, rejectPayment);

// 📌 Get statement of ALL transactions for a feeId (FE1234)
router.get("/statement/:feeId", authMiddleware, getStatementByFeeId);
router.get("/student/statement/:feeId",authMiddleware, getPaymentStatement);
router.get("/receipt/:paymentId", authMiddleware, getSingleReceipt);



// ------------------- RECEIPTS ------------------- //

// 📌 Download PDF for a single payment receipt
router.get("/download/receipt/:paymentId", authMiddleware, downloadPaymentReceipt);

// 📌 All receipts for a user
router.get("/receipt/all/:userId", authMiddleware, getAllReceiptsByUser);

// 📌 Admin — download all payments report (Excel/PDF)
router.get("/download/all", authMiddleware, adminMiddleware, downloadAllPaymentsReport);

// ------------------- STUDENT ------------------- //

// 📌 Get all payments for a single student
router.get("/student/:userId", authMiddleware, getStudentPayments);

// ------------------- FINAL FALLBACK ROUTE ------------------- //

// 📌 Get payment by ID (must be last)
router.get("/:id", authMiddleware, getPayments);

export default router;
