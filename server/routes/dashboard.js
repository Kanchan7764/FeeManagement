import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import {getDashboardData} from '../controllers/dashboardController.js'


const router = express.Router()
// router.post('/add' , authMiddleware,addFee)
router.get("/dashboard", getDashboardData); // fetch all fees

// router.get('/:id' , authMiddleware,getFee)





export default router