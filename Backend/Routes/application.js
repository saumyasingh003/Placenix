import express from "express";
import {
  applyForCompany,
  updateApplicationStatus,
  getStudentApplications,
  getApplicationByCompanyId,
  getStudentsByStatus,
  getApplicantsByCompanyId,
} from "../Controller/application.js";
import { adminOnly, protect } from "../Middleware/auth.js";

const router = express.Router();

// Student applies
router.post("/apply", protect, applyForCompany);

// Admin updates application status
router.put("/status/:applicationId",
  protect , adminOnly , 
    updateApplicationStatus);

// Student views all their applications
router.get("/mine", protect, getStudentApplications);

// Get applications by company ID
router.get("/mine/:companyId", protect, getApplicationByCompanyId);


// 🧩 Admin: Get all students by application status
router.get("/students/status/:status",
   protect, adminOnly,
    getStudentsByStatus);

// 🧩 Admin: Get all applicants for a specific company
router.get("/company/:companyId", 
protect, adminOnly, 
  getApplicantsByCompanyId);


export default router;
