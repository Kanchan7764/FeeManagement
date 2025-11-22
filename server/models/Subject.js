import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    className: { type: String, required: true },
    teacher: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Subject", subjectSchema);
