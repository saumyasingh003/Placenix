import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../Controller/user.js";
import { protect } from "../Middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", protect, logoutUser);

export default router;
