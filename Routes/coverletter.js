// Routes/coverLetter.js
import express from "express";
import {
  generateCoverLetter,
  getCoverLetters,
  getCoverLetter,
  deleteCoverLetter,
} from "../Controller/coverletter.js";
import { protect  } from "../Middleware/auth.js";

const router = express.Router();

router.post("/generate" , protect , generateCoverLetter);
router.get("/all",protect, getCoverLetters);
router.get("/:id", protect, getCoverLetter);
router.delete("/:id", protect, deleteCoverLetter);

export default router;
