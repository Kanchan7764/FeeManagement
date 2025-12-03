import Marks from "../models/Marks.js";

import Class from "../models/Class.js";
import Student from "../models/Students.js";

export const addMarks = async (req, res) => {
  try {
    console.log("Received Body:", req.body);

    const { studentId, className, subjectId, examType, marksObtained, totalMarks } = req.body;

    // Convert className -> classId
    const classData = await Class.findOne({ class_name: className });

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found!"
      });
    }

    const classId = classData._id;

    // Check duplicate marks
    const existingMarks = await Marks.findOne({
      studentId,
      subjectId,
      examType
    });

    if (existingMarks) {
      return res.status(400).json({
        success: false,
        message: "Marks already added for this student, subject, and exam type!"
      });
    }

    // Save marks using classId
    const marks = await Marks.create({
      studentId,
      classId,
      subjectId,
      examType,
      marksObtained,
      totalMarks
    });

    return res.status(201).json({
      success: true,
      message: "Marks Added Successfully",
      data: marks
    });

  } catch (error) {
    console.log("Server Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add marks",
      error: error.message,
    });
  }
};
;


export const getMarksByClass = async (req, res) => {
  try {
    const marks = await Marks.find({ className: req.params.className })
      .populate("studentId")
      .populate("subjectId");

    return res.status(200).json({
      success: true,
      count: marks.length,
      data: marks
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Error fetching marks by class"
    });
  }
};

export const getMarksByStudent = async (req, res) => {
  try {
    const marks = await Marks.find({ studentId: req.params.studentId })
      .populate("subjectId");

    return res.status(200).json({
      success: true,
      count: marks.length,
      data: marks
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Error fetching student marks"
    });
  }
};


export const getProgressCard = async (req, res) => {
  try {
    const { studentId } = req.params;

    // 1. Find student by studentId (string)
    const studentDetail = await Student.findOne({ studentId });

    if (!studentDetail) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }
    const records = await Marks.find({ studentId: studentDetail._id })
      .populate({
        path: "studentId",
        select: "studentId fatherName MotherName phoneNo gender rollNo userId",
        populate: { path: "userId", select: "name" }
      })
      .populate("classId", "class_name")
      .populate("subjectId", "name");

    if (!records || records.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No progress records found for this student",
      });
    }

    const subjects = records.map((record) => ({
      subject: record.subjectId.name,
      examType: record.examType,
      marksObtained: record.marksObtained,
      totalMarks: record.totalMarks,
    }));

    const response = {
      studentId: studentDetail.studentId,
      name: records[0].studentId.userId.name,  // FIXED
      roll: studentDetail.rollNo,
      class: records[0].classId.class_name,
      subjects,
    };

    return res.status(200).json({
      success: true,
      data: response,
    });

  } catch (error) {
    console.error("Error fetching progress card:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};



