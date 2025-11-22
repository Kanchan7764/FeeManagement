import Teacher  from "../models/Teacher.js";

export const addTeacher = async (req, res) => {
  try {
    console.log("req",req.body)
    const teacher = new Teacher(req.body);
    await teacher.save();
    console.log("teacher",teacher)

    res.status(201).json({
      message: "Teacher added successfully",
      teacher,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
}

export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({ name: 1 });

    if (!teachers || teachers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No teachers found",
      });
    }

    // console.log("Teachers fetched:", teachers.length);

    return res.status(200).json({
      success: true,
      count: teachers.length,
      data: teachers,
    });

  } catch (error) {
    console.error("❌ Error fetching teachers:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch teachers",
      error: error.message,
    });
  }
};
