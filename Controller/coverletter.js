// Controller/coverLetterControlle";
import CoverLetter from "../Models/coverletter.js";
import User from "../Models/user.js";
import { model } from "../actions/geminiClient.js";

// 🧾 Generate Cover Letter
export const generateCoverLetter = async (req, res) => {
  try {
    const userId = req.user.id; // coming from your auth middleware
    const { jobTitle, companyName, jobDescription } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const prompt = `
      Write a professional cover letter for a ${jobTitle} position at ${companyName}.
      
      About the candidate:
      - Industry: ${user.industry || "Not specified"}
      - Years of Experience: ${user.experience || "Not specified"}
      - Skills: ${user.skills?.join(", ") || "Not specified"}
      - Professional Background: ${user.bio || "Not provided"}
      
      Job Description:
      ${jobDescription}
      
      Requirements:
      1. Use a professional, enthusiastic tone
      2. Highlight relevant skills and experience
      3. Show understanding of the company's needs
      4. Keep it concise (max 400 words)
      5. Use proper business letter formatting in markdown
      6. Include specific examples of achievements
      7. Relate candidate's background to job requirements
    `;

    const result = await model.generateContent(prompt);
    const content = result.response.text().trim();

    const coverLetter = await CoverLetter.create({
      user: userId,
      jobTitle,
      companyName,
      jobDescription,
      content,
      status: "completed",
    });

    res.status(201).json({
      success: true,
      message: "Cover letter generated successfully",
      data: coverLetter,
    });
  } catch (error) {
    console.error("Error generating cover letter:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to generate cover letter",
      error: error.message,
    });
  }
};

// 🗂️ Get all cover letters of a user
export const getCoverLetters = async (req, res) => {
  try {

    const userId = req.user.id;
    const coverLetters = await CoverLetter.find({ user: userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: coverLetters,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch cover letters",
      error: error.message,
    });
  }
};

// 📄 Get single cover letter by ID
export const getCoverLetter = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const coverLetter = await CoverLetter.findOne({ _id: id, user: userId });
    if (!coverLetter)
      return res.status(404).json({ message: "Cover letter not found" });

    res.status(200).json({ success: true, data: coverLetter });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get cover letter",
      error: error.message,
    });
  }
};

// ❌ Delete cover letter
export const deleteCoverLetter = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await CoverLetter.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!deleted)
      return res.status(404).json({ message: "Cover letter not found" });

    res.status(200).json({
      success: true,
      message: "Cover letter deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete cover letter",
      error: error.message,
    });
  }
};
