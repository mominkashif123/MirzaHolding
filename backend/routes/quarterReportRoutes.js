import express from "express";
import { 
    uploadQuarterReport, 
    getAllQuarterReports, 
    getQuarterReportPDF, 
    deleteQuarterReport 
} from '../controllers/quarterReportController.js';

const router = express.Router();

// Get all quarter reports (metadata only)
router.get('/quarterreports', getAllQuarterReports);

// Get a specific quarter report PDF
router.get('/quarterreports/:quarter', getQuarterReportPDF);

// Upload/update a quarter report (admin only - you may want to add auth middleware)
router.post('/quarterreports', uploadQuarterReport);

// Delete a quarter report (admin only - you may want to add auth middleware)
router.delete('/quarterreports/:quarter', deleteQuarterReport);

export default router;
