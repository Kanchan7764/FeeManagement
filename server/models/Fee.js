import mongoose, { Schema } from "mongoose";

const feeSchema = new mongoose.Schema({
  studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  fee: { type: String },
  fees: { type: Number, required: true },
  feeId:{type:String},
  status: { type: String },
  duedate: { type: Date, required: false },
  completedDate: { type: Date, required: false },
  paidAmount: { type: Number, default: 0 },
  paymentdate: { type: Date },
  month: { type: String },
  year: { type: Number },
  verificationStatus: { type: String, default: "pending" },
  classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },

  // --- New fields for discount lock and installments ---
  discountApplied: { type: Boolean, default: false },
  discountPlan: { type: String, default: null },
  installments: { type: Number, default: 1 },
  installmentAmount: { type: Number, default: 0 },
  installmentsPaid: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

feeSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Fees = mongoose.model("Fees", feeSchema);
export default Fees;
