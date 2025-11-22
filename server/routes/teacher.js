import express from "express";
import { addTeacher, getAllTeachers } from "../controllers/teacherController.js";
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router();

// Add New Teacher
router.post("/addteacher",authMiddleware, addTeacher);
router.get("/allteacher",authMiddleware, getAllTeachers);


export default router;
