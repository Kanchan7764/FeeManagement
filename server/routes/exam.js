import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { addExam,getAllExams} from '../controllers/examController.js'


const router = express.Router()


router.post("/add-exam",authMiddleware, addExam);
router.get("/all", getAllExams);

export default router
