import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
     examType: {
  type: String,
  required: true,
  enum: ["Mid-Term", "Final", "Formative"]
},
  className: {
    type: String,
    required: true
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true
  },
 

  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true
  },
  examDate: {
    type: String,
    required: true
  },
  examTime: {
    type: String,
    required: true
  }
}, { timestamps: true });


 const Exam =mongoose.model("Exam", examSchema);
 export default Exam
