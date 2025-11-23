
import express from "express";
import multer from "multer";
import { addProfile, updateProfile, deleteProfile, getAllProfiles , getJobPreferenceStats, getMyProfile } from "../Controller/profile.js";
import { adminOnly, protect } from "../Middleware/auth.js";

const router = express.Router();
const storage = multer.memoryStorage(); // for streaming to Cloudinary
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.get("/all",
    // protect , adminOnly , 
      getAllProfiles);
router.post("/add", protect, upload.single("resume"), addProfile);
router.put("/update/:id",  protect , upload.single("resume"), updateProfile);
router.delete("/delete/:id", protect ,  deleteProfile);
router.get("/me", protect, getMyProfile);
router.get("/jobpreferencestats", 
    // protect, adminOnly , 
     getJobPreferenceStats);

export default router;
