import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile", // Student’s profile
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company", // Company they applied to
      required: true,
    },
    status: {
      type: String,
      enum: ["Applied", "Shortlisted", "Interview", "Hired", "Rejected"],
      default: "Applied", // Initial state
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);
