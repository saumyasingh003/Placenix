import express from "express";
import {
  getResume,
  improveWithAI,
  updateResume,
} from "../Controller/resume.js";
import { protect } from "../Middleware/auth.js";

const router = express.Router();

router.get("/get",  getResume);
router.put("/update", protect ,  updateResume);
router.post("/ai", protect ,  improveWithAI);

export default router;

