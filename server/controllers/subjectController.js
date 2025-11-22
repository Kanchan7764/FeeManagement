import Subject from "../models/Subject.js";

export const addSubject = async (req, res) => {
  try {
    const { name, code, className, teacher } = req.body;

    if (!name || !code || !className || !teacher) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newSubject = new Subject({
      name,
      code,
      className,
      teacher,
    });

    console.log(newSubject)
    await newSubject.save();

    return res.status(201).json({
      success: true,
      message: "Subject added successfully",
      data: newSubject,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


export const getSubjectsByClass = async (req, res) => {
  try {
    const subjects = await Subject.find({ className: req.params.className });

    return res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Error fetching subjects by class"
    });
  }
};
