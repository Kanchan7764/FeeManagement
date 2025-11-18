import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import {
  addFee,
  getFee,
  getAllFees,
  handleVerify,
   // ⬅️ new controller
   updateFeeWithDiscount
} from "../controllers/feeController.js";

import { downloadAllFeeHistory } from "../controllers/ReceiptController.js";
const router = express.Router();

// ✅ Admin can add fees
router.post("/add", authMiddleware, addFee);

// ✅ Fetch all fee records (admin only)
router.get("/all", authMiddleware, getAllFees);

// ✅ Download all fee history as PDF (like a bank statement)
router.get("/download/all", authMiddleware, adminMiddleware, downloadAllFeeHistory);

// ✅ Admin approval/rejection of fee verification
router.post("/verify/:id", authMiddleware, adminMiddleware, handleVerify);
// ✅ Update fee with discounted total
router.patch("/update/:feeId", authMiddleware, updateFeeWithDiscount);


// ⚠️ Generic route should come LAST
router.get("/:id", authMiddleware, getFee);

export default router;
