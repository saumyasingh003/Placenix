import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },

    branch: { type: String, required: true },
    cgpa: { type: Number, required: true, min: 0, max: 10 },
    collegeName: { type: String, required: true },

    linkedinLink: { type: String, required: true },
    githubLink: { type: String, required: true },
    leetcodeLink: { type: String, required: true },

    contact: {
      type: String,
      required: true,
      match: [/^[0-9]{10}$/, "Invalid contact number"],
    },

    backlogs: { type: Number, default: 0, min: 0 },
    resume: { type: String, required: true },

    // ✅ Cloudinary public id (optional)
    resumePublicId: { type: String },

    // ✅ New field: Job Preference
    jobPreference: {
      type: String,
      enum: ["tech", "non-tech"],
      required: true,
      default: "tech",
    },
  },
  { timestamps: true }
);

// ✅ Prevent admins from creating profiles
profileSchema.pre("save", async function (next) {
  const user = await mongoose.model("User").findById(this.user);
  if (user && user.role !== "student") {
    return next(new Error("Only students can create a profile."));
  }
  next();
});

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
