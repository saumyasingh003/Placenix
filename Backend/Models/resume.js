import mongoose from "mongoose";

/* ---------------------- Experience Subdocument ---------------------- */
const experienceSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  role: { type: String, required: true },
  duration: { type: String }, // e.g. "June 2024 - Aug 2024"
  description: { type: String },
  achievements: [{ type: String }], // bullet points
});

/* ------------------------ Projects Subdocument ---------------------- */
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  techStack: [{ type: String }], // e.g. ["React", "Node.js"]
  description: { type: String },
  link: { type: String }, // GitHub or live demo
  outcome: { type: String }, // Optional - "Improved performance by 30%"
});

/* ------------------- Responsibility Subdocument --------------------- */
const responsibilitySchema = new mongoose.Schema({
  title: { type: String, required: true }, // Example: "Team Lead"
  organization: { type: String },
  duration: { type: String },
  description: { type: String },
});

/* ----------------------- Achievement Subdocument -------------------- */
const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date },
  category: {
    type: String,
    enum: ["academic", "technical", "leadership", "other"],
    default: "other",
  },
});

/* ---------------------------- Resume Schema ------------------------- */
const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ Basic Info
    branch: { type: String, required: true },
    cgpa: { type: Number, required: true },
    collegeName: { type: String, required: true },
    contact: { type: String, required: true },
    backlogs: { type: Number, default: 0 },

    // ✅ Links
    linkedinLink: { type: String },
    githubLink: { type: String },
    leetcodeLink: { type: String },
    portfolioLink: { type: String }, // optional

    // ✅ Core Sections
    experience: [experienceSchema],
    projects: [projectSchema],
    positionOfResponsibility: [responsibilitySchema],
    achievements: [achievementSchema],

    // ✅ Skills & Summary
    keySkills: [{ type: String }],
    summary: { type: String, default: "" },

    // ✅ AI Improvement Support
    aiImprovedSections: {
      experience: [{ type: String }],
      projects: [{ type: String }],
      achievements: [{ type: String }],
    },
  },
  { timestamps: true }
);

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;
