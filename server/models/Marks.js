import mongoose from "mongoose";

const MarksSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    classId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Class",
  required: true
}
,
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    examType: {
      type: String, 
      required: true, 
      enum: ["FA1", "FA2", "HalfYearly", "FA3","FA4","Annual" ]
    },
    marksObtained: {
      type: Number,
      required: true,
    },
    totalMarks: {
      type: Number,
      default: 100
    }
  },
  { timestamps: true }
);

export default mongoose.model("Marks", MarksSchema);
