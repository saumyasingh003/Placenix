import Profile from "../Models/profile.js";
import cloudinary from "../config/Cloudinary.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//get all profiles
export const getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find();

    res.status(200).json({
      success: true,
      totalProfiles: profiles.length, // ✅ total number of profiles
      data: profiles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




/* -------------------------------------------------------------------------- */
/* ✅ Get Logged-in User's Profile                                            */
/* -------------------------------------------------------------------------- */
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "No profile found for this user",
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });

  } catch (error) {
    console.error("❌ Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
      error: error.message,
    });
  }
};




/* ✅ Add Profile (with local file storage)  */

export const addProfile = async (req, res) => {
  try {
    const fields = req.body || {};
    const file = req.file || null;
    const user = req.user;
    console.log(user)

    console.log("📦 Received body:", fields); // 👀 Debug: See all fields in console

    const {
      branch,
      cgpa,
      collegeName,
      linkedinLink,
      githubLink,
      leetcodeLink,
      contact,
      backlogs, 
    } = fields;

    // 🔍 Check if profile already exists for this user
    const existingProfile = await Profile.findOne({ user: user._id });
    if (existingProfile) {
      return res
        .status(400) 
        .json({ success: false, message: "Profile already exists" });
    }

    // ✅ Handle Resume Upload (either file or URL) 
    let resumeUrl = null;
    let resumePublicId = null;

    if (file) {
      try {
        // Create resumes directory if it doesn't exist
        const resumesDir = path.join(__dirname, "..", "resumes");
        if (!fs.existsSync(resumesDir)) {
          fs.mkdirSync(resumesDir, { recursive: true });
        }

        // Generate unique filename
        const fileExtension = path.extname(file.originalname) || ".pdf";
        const uniqueFileName = `${user._id}_${Date.now()}${fileExtension}`;
        const filePath = path.join(resumesDir, uniqueFileName);

        // Write file to disk
        fs.writeFileSync(filePath, file.buffer);

        // Store only the path part (e.g., /resumes/filename.pdf)
        resumeUrl = `/resumes/${uniqueFileName}`;
        resumePublicId = uniqueFileName; // Store filename for potential deletion later
      } catch (err) {
        console.error("❌ File save error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Resume upload failed" });
      }
    } else if (fields.resume) {
      resumeUrl = fields.resume;
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Resume file or URL required" });
    }
   

    
    // ✅ Normalize and determine job preference
    const rawJobPref = (fields.jobPreference || "").trim().toLowerCase();
    const finalJobPreference = rawJobPref === "non-tech" ? "non-tech" : "tech";
  

    // ✅ Create new profile
    const profile = await Profile.create({
      user: user._id,
      name: user.name,
      email: user.email,
      branch,
      cgpa,
      collegeName,
      linkedinLink,
      githubLink,
      leetcodeLink,
      contact,
      backlogs,
      resume: resumeUrl,
      resumePublicId,
      jobPreference: finalJobPreference, // ✅ Correct and consistent key
    });

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      data: profile,
    });
  } catch (error) {
    console.error("❌ Error adding profile:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



/* -------------------------------------------------------------------------- */
/* ✅ Update Profile                                                          */
/* -------------------------------------------------------------------------- */
export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const bodyData = req.body || {};
    const file = req.file || null;

    const profile = await Profile.findById(id);
    if (!profile)
      return res.status(404).json({ success: false, message: "Profile not found" });

    // 🗑 Delete old resume if uploading a new one
    if (file) {
      try {
        if (profile.resumePublicId) {
          await cloudinary.uploader.destroy(profile.resumePublicId, {
            resource_type: "raw",
          });
        }
      } catch (e) {
        console.warn("Failed to delete old Cloudinary asset:", e.message);
      }

      // ✅ Upload new resume
      try {
        const dataUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
        const result = await cloudinary.uploader.upload(dataUri, {
          folder: "resumes",
          resource_type: "auto",
        });
        bodyData.resume = result.secure_url;
        bodyData.resumePublicId = result.public_id;
      } catch (err) {
        console.error("Cloudinary upload error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Resume upload failed" });
      }
    }

    // ✅ Allow jobPreference to be updated
    if (bodyData.jobPreference && !["tech", "non-tech"].includes(bodyData.jobPreference)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job preference. Use 'tech' or 'non-tech'.",
      });
    }

    const updatedProfile = await Profile.findByIdAndUpdate(id, bodyData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* -------------------------------------------------------------------------- */
/* ✅ Delete Profile                                                          */
/* -------------------------------------------------------------------------- */
export const deleteProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await Profile.findById(id);
    if (!profile)
      return res.status(404).json({ success: false, message: "Profile not found" });

    // 🗑 Delete resume from Cloudinary if exists
    if (profile.resumePublicId) {
      await cloudinary.uploader.destroy(profile.resumePublicId, { resource_type: "raw" });
    }

    await profile.deleteOne();

    res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* -------------------------------------------------------------------------- */
/* ✅ Get Job Preference Statistics (Tech vs Non-Tech)                        */
/* -------------------------------------------------------------------------- */
export const getJobPreferenceStats = async (req, res) => {
  try {
    const profiles = await Profile.find({}, "jobPreference");

    if (!profiles.length) {
      return res
        .status(404)
        .json({ success: false, message: "No profiles found" });
    }

    const total = profiles.length;
    const techCount = profiles.filter(
      (p) => p.jobPreference?.toLowerCase() === "tech"
    ).length;
    const nonTechCount = profiles.filter(
      (p) => p.jobPreference?.toLowerCase() === "non-tech"
    ).length;

    const techPercentage = ((techCount / total) * 100).toFixed(2);
    const nonTechPercentage = ((nonTechCount / total) * 100).toFixed(2);

    res.status(200).json({
      success: true,
      totalStudents: total,
      tech: {
        count: techCount,
        percentage: `${techPercentage}%`,
      },
      nonTech: {
        count: nonTechCount,
        percentage: `${nonTechPercentage}%`,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching job preference stats:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
