import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  qualification: { type: String },
  specialised: { type: String },
  address: { type: String },
}, { timestamps: true });

 const Teacher =mongoose.model("Teacher", teacherSchema);
 export default Teacher