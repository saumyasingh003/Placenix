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


    const today = new Date();
const formattedDate = today.toLocaleDateString("en-US", {
  day: "numeric",
  month: "long",
  year: "numeric"
});

const prompt = `
Generate a professional job application email using the following structure and details.

Candidate Information:
- Name: ${user.name || "Candidate"}
- Email: ${user.email || "candidate@email.com"}
- Phone: ${user.contact || "Not provided"}
- Industry: ${user.industry || "Tech / Data Science / Analytics"}
- Experience: ${user.experience || "Several years of hands-on experience"}
- Skills: ${user.skills?.join(", ") || "Python, Java, problem-solving"}
- Background: ${user.bio || "Hardworking and quick learner"}

Job Details:
- Role: ${jobTitle}
- Company: ${companyName}
- Job Description: ${jobDescription}

Write the email in the following format (maintain exact line breaks):

${user.name}
${user.email}

${formattedDate}

Hiring Manager, ${companyName}

Dear Sir/Ma’am,

Paragraph 1:
Write a strong introduction expressing interest in the position, referencing the role and company. Mention the candidate’s background and industry experience. Show confidence, professionalism, and alignment with the company’s goals.

Paragraph 2:
Explain how the candidate's backend or technical experience is transferable. Mention core skills such as logic building, problem-solving, software design, or teamwork. Highlight adaptability and willingness to learn frontend skills quickly.

Paragraph 3:
Include one or two general achievements (even if not frontend-related). Express eagerness to contribute to the company, appreciation for their time, and a mention of the attached resume.

End with:

Sincerely,
${user.name}

Important:
- DO NOT use markdown, bullets, or asterisks.
- Use simple text with clean line breaks.
- The final output must be a polished, human-like email ready to copy and send.
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



// ✏️ Manually Update an Existing Cover Letter (NO AI)
export const manualUpdateCoverLetter = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Updated content is required",
      });
    }

    const updated = await CoverLetter.findOneAndUpdate(
      { _id: id, user: userId },
      { content, status: "manually-updated" },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Cover letter not found" });
    }

    res.status(200).json({
      success: true,
      message: "Cover letter updated successfully",
      data: updated,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update cover letter",
      error: error.message,
    });
  }
};
