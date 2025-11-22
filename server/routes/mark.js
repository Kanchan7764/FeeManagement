import express from "express";
import { addMarks, getMarksByClass, getMarksByStudent,getProgressCard } from "../controllers/markController.js";

const router = express.Router();

// Add marks
router.post("/add", addMarks);

// Get marks by class
router.get("/class/:className", getMarksByClass);

// Get marks by student
router.get("/progress/:studentId", getProgressCard);

router.get("/student/:studentId", getMarksByStudent);


export default router;
