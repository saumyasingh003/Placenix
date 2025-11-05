// Models/coverLetter.js
import mongoose from "mongoose";

const coverLetterSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["completed", "in-progress"],
      default: "completed",
    },
  },
  { timestamps: true }
);

const CoverLetter = mongoose.model("CoverLetter", coverLetterSchema);
export default CoverLetter;
