import Exam from "../models/Exam.js";

export const addExam = async (req, res) => {
  try {
    const { classId, subjectId, teacherId, examType, examDate, examTime } = req.body;

    // 🔍 Check if exam already exists for same class + subject + exam type
    const existingExam = await Exam.findOne({
      className: classId,
      subjectId,
      examType
    });

    if (existingExam) {
      return res.status(400).json({
        success: false,
        message: "This exam already exists for this class and subject!"
      });
    }

    // 🔍 NEW CHECK: Teacher already assigned on same date & time
    const teacherBusy = await Exam.findOne({
      teacherId,
      examDate,
      examTime
    });

    if (teacherBusy) {
      return res.status(400).json({
        success: false,
        message: "This teacher already has an exam scheduled at this date & time!"
      });
    }

    // ✔ Create new exam
    const exam = await Exam.create({
      className: classId,
      subjectId,
      teacherId,
      examType,
      examDate,
      examTime
    });

    return res.status(201).json({
      success: true,
      message: "Exam Added Successfully",
      data: exam
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add exam",
      error: error.message
    });
  }
};



export const getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find()
      .populate("subjectId", "name code")
      .populate("teacherId", "name subject");

    return res.status(200).json({
      success: true,
      count: exams.length,
      data: exams
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch exams"
    });
  }
};


