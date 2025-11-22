import express from "express";
import { addSubject ,getSubjectsByClass } from "../controllers/subjectController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/addsubject", authMiddleware, addSubject);
router.get("/byclass/:className", getSubjectsByClass);


export default router;
