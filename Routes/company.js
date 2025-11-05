import express from "express";
import {
  addCompany,
  getAllCompanies,
  getCompanyById,
} from "../Controller/company.js";
import { adminOnly, protect } from "../Middleware/auth.js";

const router = express.Router();

// ✅ Admin adds company info
router.post("/add", protect,  adminOnly ,  addCompany);
// ✅ Get all companies
router.get("/all", protect, getAllCompanies);
router.get("/:id", protect, getCompanyById);

export default router;
