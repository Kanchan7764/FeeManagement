import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  addStudent,
  upload,
  getStudents,
  getStudent,
  updateStudent,
  getStudentByStudentId,
  fetchStudentByClassId,
  getStudentById,
  deleteStudent,
  getrollNo,
  updateStudentStatus,getStudentByUserId,getStudentForId,getStudentsByClass
} from '../controllers/studentController.js';

const router = express.Router();

// ✅ Add student with image upload
router.post('/add', upload.single('image'), authMiddleware, addStudent);

// ✅ Get next roll number for a class
router.get('/next-roll/:classId', getrollNo);

// ✅ Get all students
router.get('/', authMiddleware, getStudents);

router.get("/byclass/:classId", getStudentsByClass);

// ✅ Get student by MongoDB _id

// ✅ Get student by Student ID (custom field)
router.get('/studentId/:studentId', authMiddleware, getStudentByStudentId);

// ✅ Get students by class ID
router.get('/classes/:classId', authMiddleware, fetchStudentByClassId);
router.get('/IdCard/:userId', authMiddleware, getStudentByUserId);
router.get("/IdCard/student/:studentId", authMiddleware, getStudentForId);



// ✅ Update student by _id
router.put('/update/:userId', authMiddleware, updateStudent);

// ✅ Update student status
router.patch('/status/:id', authMiddleware, updateStudentStatus);
router.get('/:id', authMiddleware, getStudent);

// ✅ Delete student by _id
router.delete('/id/:id', authMiddleware, deleteStudent);

export default router;
