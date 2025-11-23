import express from "express";
import {
 
  addCompany,
  getAllCompanies,
  getCompanyById,
  getEarliestCompanyVisit,
  getEarliestCompanyAdmin
} from "../Controller/company.js";
import { adminOnly, protect } from "../Middleware/auth.js";

const router = express.Router();

// ✅ Admin adds company info
router.post("/add", protect,  adminOnly , addCompany);
// ✅ Get all companies
router.get("/all", protect, getAllCompanies);
router.get("/earliest"  , protect, getEarliestCompanyVisit);
router.get("/earliest-admin"  , protect, getEarliestCompanyAdmin);
router.get("/:id", protect, getCompanyById);



export default router;
