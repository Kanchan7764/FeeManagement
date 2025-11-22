
import Student from "../models/Students.js"
import User from '../models/User.js'
import Class from '../models/Class.js'
import Fees from "../models/Fee.js"
import Payments from "../models/Payment.js"
import bcrypt from 'bcrypt'
import multer from 'multer'
import path from "path"
import mongoose from "mongoose";





const storage = multer.diskStorage({
    destination:(req, file ,cb)=>{
        cb(null,"public/uploads")
    },
    filename:(req, file ,cb)=>{
        cb(null, Date.now() + path.extname(file.originalname))
    }
    
})

const upload = multer({storage:storage})

// controllers/studentController.js





export const getStudentsByClass = async (req, res) => {
  try {
    const className = req.params.classId; // receiving className
    console.log("Received className:", className);

    if (!className) {
      return res.status(400).json({
        success: false,
        message: "Class name is required",
      });
    }

    // Find class by class_name
    const classData = await Class.findOne({ class_name: className });

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    console.log("Mapped classId:", classData._id);

    // Fetch students + populate userId → name
    const students = await Student.find({ classs: classData._id })
      .populate({
        path: "userId",
        select: "name",   // get only name
      })
      .select("rollNo userId"); // include rollNo & userId only

    return res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch students by class",
      error: error.message,
    });
  }
};





export const getStudentByStudentId = async (req, res) => {
  console.log("Controller hit with studentId:", req.params.studentId); // <-- access studentId
  try {
    const { studentId } = req.params;

    const student = await Student.findOne({ studentId })
      .populate("userId", "name email")
      .populate("classs", "class_name");

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    console.log(student); // prints the student object
    res.json({ success: true, student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};




const addStudent = async(req, res)=>{
    try{
    const {
        name,
        fatherName,
        MotherName,
        email,
        phoneNo,
        studentId,
        rollNo,
        dob,
        gender,
        classs,
        role,
        password,
        
    }= req.body

    const user = await User.findOne({email})
    if(user){
        return res.status(400).json({success:false , error:"User already registered"})
    }
    const hashPassword = await bcrypt.hash(password,10)

    
    
    const newUser = new User({
        name , email,
        password:hashPassword,
        role,
        profileImage: req.file? req.file.filename: ""


    })
    // console.log(newUser)
    const savedUser = await newUser.save()
    const newStudent = new Student({
        userId:savedUser._id,
        studentId,
        rollNo,
        name , email,
        password:hashPassword,
        role,
        fatherName,
        MotherName,
        gender,
        phoneNo,
        dob,
        classs,
         profileImage: req.file ? req.file.filename : "",
     
    })
     console.log(newStudent)
    await newStudent.save();
    return res.status(200).json({success:true,message:"Student created."})
    
    }
    catch(error){
        console.log(error)
       return res.status(500).json({success:false, error:"Server error  in adding student."})
    }
}
const getStudents=async(req, res)=>{
  try {
      const students = await Student.find().populate('userId',{password:0}).populate("classs");
      // console.log(classes)
      return res.status(200).json({ success: true, students });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, error: "get student server error" });
    }
}

const getStudent=async(req, res)=>{
    const {id} = req.params;
  try {
    let student;
      student = await Student.findById({_id:id}).populate('userId',{password:0}).populate("classs");
      // console.log(classes)
      if(!student){
        student = await Student.findOne({userId:id}).populate('userId',{password:0}).populate("classs");

      }
      return res.status(200).json({ success: true, student });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, error: "get student server error" });
    }
}


  const updateStudent= async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, fatherName, MotherName, dob, phoneNo, classs } = req.body;

    // Mongoose will cast string to ObjectId automatically
    const student = await Student.findOne({ userId });
    console.log("student", student);

    if (!student) return res.status(404).json({ success: false, error: "Student not found" });

    // Update student fields if provided
    if (fatherName) student.fatherName = fatherName;
    if (MotherName) student.MotherName = MotherName;
    if (dob) student.dob = dob;
    if (phoneNo) student.phoneNo = phoneNo;
    if (classs) student.classs = classs;

    await student.save();

    // Update User name
    if (name && student.userId) {
      await User.findByIdAndUpdate(student.userId, { name });
    }

    return res.status(200).json({ success: true, student });
  } catch (err) {
    console.error("Failed to update student:", err);
    return res.status(500).json({ success: false, error: "Failed to update student" });
  }
};




// Example in studentController.js
export const updateStudentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const student = await Student.findByIdAndUpdate(id, { status }, { new: true });
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });

    res.json({ success: true, student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// controllers/studentController.js


// Get student data for logged-in user
export const getStudentByUserId = async (req, res) => {
  try {
    const userId = req.user._id; // from authMiddleware

    const student = await Student.findOne({ userId })
      .populate("userId", "name email profileImage ")
      .populate("classs","class_name") // only populate user info
      .lean();

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // if (student.profileImage) {
    //   student.profileImage = `http://localhost:3000/public/uploads/${student.profileImage}`;
    // }
    res.json({ success: true, student });
  } catch (err) {
    console.error("Error fetching student:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getStudentForId = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findOne({ studentId })
      .populate("userId", "name email profileImage")
      .populate("classs", "class_name")
      .lean();

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.json({ success: true, student });
  } catch (err) {
    console.error("Error fetching student:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


const fetchStudentByClassId = async(req, res)=>{
    const {id} = req.params;
  try {
      const students = await Student.find({classs:id});
      // console.log(classes)
      return res.status(200).json({ success: true, students });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, error: "get studentbyclassId server error" });
    }
}


const getrollNo = async (req, res) => {
  try {
    const { classId } = req.params;

    // Find latest student in this class
    const lastStudent = await Student.findOne({ classs: classId })
      .sort({ rollNo: -1 })
      .select("rollNo");

    let nextRoll = 1;
    if (lastStudent && lastStudent.rollNo) {
      nextRoll = parseInt(lastStudent.rollNo) + 1;
    }

    // Pad to 4 digits: 1 -> 0001
    const formattedRoll = String(nextRoll).padStart(4, "0");

    res.json({ success: true, rollNo: formattedRoll });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}




export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Delete associated fees first
    await Fees.deleteMany({ studentId: id });
        await Payments.deleteMany({ studentId: id });


    // 2️⃣ Delete the student
    const student = await Student.findByIdAndDelete(id);
    if (!student) return res.status(404).json({ success: false, error: "Student not found" });

    // 3️⃣ Delete the associated user
    if (student.userId) {
      await User.findByIdAndDelete(student.userId);
    }

    res.status(200).json({ success: true, message: "Student deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// controllers/studentController.js


// GET /api/student/:id
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find student by ID and populate user and class references
    const student = await Student.findById(id)
      .populate("userId", "name email")        // fetch user name & email
      .populate("classId", "class_name")       // fetch class name
      .lean();

    if (!student) {
      return res.status(404).json({ success: false, error: "Student not found" });
    }

    res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};






export{addStudent,upload ,getStudents,getStudent,updateStudent ,fetchStudentByClassId ,getrollNo ,getStudentById}