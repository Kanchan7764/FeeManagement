import mongoose, { Schema } from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  feeId: { type: Schema.Types.ObjectId, ref: "Fees", required: true },
  paymentId:{type:String},

  feeType: {
    type: String,
    required: true,
  },
  payment:{type:String},

  totalFee: { 
    type: Number, 
    required: true, // ✅ total fee from Fees model (fixed per student per feeType)
  },

  paidAmount: { 
    type: Number, 
    required: true, // ✅ amount paid in this particular transaction
  },

  remaining: { 
    type: Number, 
    required: true, // ✅ remaining balance after this transaction
  },

  status: {
    type: String,
    enum: ["accepted", "rejected","pending","completed"],
    
  },

  paymentdate: {
    type: Date,
    required: true,
  },

  month: { type: String },
  year: { type: Number },

  paymentPlan: {
    type: String,
    enum: ["Monthly", "Quarterly", "Half-Yearly", "Yearly"],
    default: "Monthly",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Automatically update `updatedAt` when record changes
paymentSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Payments = mongoose.model("Payment", paymentSchema);
export default Payments;
