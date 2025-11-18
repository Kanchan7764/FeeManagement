import mongoose, { Schema } from "mongoose";
const studentschema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  studentId: { type: String, required: true, unique: true },
  fatherName: { type: String },
  MotherName: { type: String },
  phoneNo: {
    type: String,
  },
    rollNo: { type: String, required: false },
status:{
  type:String
},
  dob: { type: Date },
  gender: { type: String },
  classs: { type: Schema.Types.ObjectId, ref: "Class", required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Student = mongoose.model("Student", studentschema);
export default Student;
