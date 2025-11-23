import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Resume from "../Models/resume.js";
import Profile from "../Models/profile.js";
import { model } from "../actions/geminiClient.js"; // Gemini model

dotenv.config();

/* -------------------------------------------------------------------------- */
/* ✅ Helper to extract userId from JWT with Debugging                        */
/* -------------------------------------------------------------------------- */
const getUserIdFromToken = (req) => {
  try {
    const authHeader = req.headers.authorization;
    

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Unauthorized: Token missing or malformed");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      throw new Error("Unauthorized: Invalid token payload");
    }

    return decoded.id;
  } catch (error) {
    console.error("❌ Token Error:", error.message);
    throw new Error("Unauthorized: No valid token provided");
  }
};

/* -------------------------------------------------------------------------- */
/* 🧾 GET Resume — Fetch both Profile + Resume data                           */
/* -------------------------------------------------------------------------- */
export const getResume = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);

    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found. Please complete your profile first.",
      });
    }

    const resume = await Resume.findOne({ user: userId });

    res.status(200).json({
      success: true,
      message: "Resume fetched successfully",
      data: { profile, resume },
    });
  } catch (error) {
    console.error("❌ Error fetching resume:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch resume",
      error: error.message,
    });
  }
};
  
/* -------------------------------------------------------------------------- */
/* 🤖 IMPROVE Resume Section using AI + SAVE Resume                           */
/* -------------------------------------------------------------------------- */
export const improveWithAI = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);

    const {
      experience = [],
      projects = [],
      achievements = [],
      positionOfResponsibility = [],
      keySkills = [],
      summary = "",
      portfolioLink = "",
    } = req.body;

    // ✅ Fetch Profile Details
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found. Please complete your profile first.",
      });
    }

    // ✅ Extract Required Profile Data
    const {
      branch,
      cgpa,
      collegeName,
      contact,
      backlogs,
      linkedinLink,
      githubLink,
      leetcodeLink,
    } = profile;

    // ✅ Collect all sections for AI improvement
    const allItems = [
      ...experience.map((e) => ({ text: e.description, type: "experience", meta: e })),
      ...projects.map((p) => ({ text: p.description, type: "project", meta: p })),
      ...achievements.map((a) => ({ text: a.description, type: "achievement", meta: a })),
      ...positionOfResponsibility.map((p) => ({ text: p.description, type: "position", meta: p })),
    ];

    const improvedResults = [];
    const aiImprovedSections = {
      experience: [],
      projects: [],
      achievements: [],
    };

    // ✅ Generate AI improvements
    for (const item of allItems) {
      if (!item.text || !item.type) continue; // skip invalid ones

     let prompt = "";

if (item.type === "achievement" || item.type === "position") {
  // ---------------- ACHIEVEMENT / POR → ONE BIG SENTENCE ----------------
  prompt = `
You are an expert resume writer. Rewrite the following ${item.type} description for a ${branch || "technology"} student.

Your output MUST follow these rules:
- Return ONLY **one single powerful sentence**.
- Make it high-impact, achievement-centric, and technically strong.
- Use strong action verbs (Achieved, Delivered, Led, Engineered, Executed, Designed, etc.).
- Add measurable or quantifiable results wherever possible.
- Do NOT add bullet points.
- Do NOT add heading, prefixes, or explanation.

Example style:
Engineered a high-performance analytics module that boosted reporting efficiency by 45% and improved system reliability across production environments.

Now improve the description below:
"${item.text}"
`;
} else {
  // ---------------- EXPERIENCE / PROJECTS → 3 BULLETS ----------------
  prompt = `
You are an expert resume writer. Rewrite the following ${item.type} description for a ${branch || "technology"} student.

Your output MUST follow these rules:
- Return ONLY **3 bullet points** (no heading, no title).
- Each bullet must be short (7–8 words), crisp, and high-impact.
- Use strong action verbs (Designed, Built, Developed, Optimized, Automated, etc.).
- Add measurable/quantifiable impact wherever possible.
- Focus on achievements, not tasks.
- Make it sound technically strong and industry-ready.
- Do NOT add more than 3 points.

Example style:
• Designed scalable backend APIs improving request speed by 40%.
• Engineered responsive UI system enhancing user workflow efficiency.
• Automated deployment pipelines reducing manual release time by 60%.

Now improve the description below:
"${item.text}"
`;
}

      

      const result = await model.generateContent(prompt);

      const improvedContent =
        result?.response?.text?.().trim() ||
        result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "AI did not return a valid response.";

      improvedResults.push({
        type: item.type,
        original: item.text,
        improved: improvedContent,
        meta: item.meta,
      });

      // Group results by section
      if (aiImprovedSections[item.type]) {
        aiImprovedSections[item.type].push(improvedContent);
      }
    }

    // ✅ Save everything in Resume collection
    const resume = await Resume.findOneAndUpdate(
      { user: userId },
      {
        user: userId,
        branch,
        cgpa,
        collegeName,
        contact,
        backlogs,
        linkedinLink,
        githubLink,
        leetcodeLink,
        portfolioLink,
        keySkills,
        summary,
        experience,
        projects,
        positionOfResponsibility,
        achievements,
        aiImprovedSections,
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "AI improvements generated and resume saved successfully",
      improvedResults,
      resume,
    });
  } catch (error) {
    console.error("❌ Error improving/saving resume:", error);
    res.status(500).json({
      success: false,
      message: "Failed to improve and save resume",
      error: error.message,
    });
  }
};


/* -------------------------------------------------------------------------- */
/* ✏️ UPDATE Resume — Partial Update                                         */
/* -------------------------------------------------------------------------- */
export const updateResume = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const updates = req.body;

    const resume = await Resume.findOneAndUpdate({ user: userId }, updates, {
      new: true,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found. Please save resume first.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      data: resume,
    });
  } catch (error) {
    console.error("❌ Error updating resume:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update resume",
      error: error.message,
    });
  }
};



