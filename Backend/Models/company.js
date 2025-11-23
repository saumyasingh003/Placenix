import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    }, 
    startRegistrationDate: {
      type: Date,
      required: [true, "Start registration date is required"],
    },
    endRegistrationDate: {
      type: Date,
      required: [true, "End registration date is required"],
    },
    hiringProcess: {
      apptitude: { type: Boolean, default: false },
      coding: { type: Boolean, default: false },
      personalInterview: { type: Boolean, default: false },
      groupDiscussion: { type: Boolean, default: false },
    },
    visitDate: {
      type: Date,
      required: [true, "Company visit date is required"], 
    }, 
    type: {
      type: String,
      enum: ["job", "internship", "both"],
      required: [true, "Type must be 'job', 'internship' or 'both'"],
    },
    packageOffered: {
      type: String,
      validate: {
        validator: function (value) {
          if (this.type === "job" || this.type === "both") {
            return !!value;
          }
          return true;
        },
        message: "Package offered is required for job or both type",
      },
    },
    internshipStipend: {
      type: String,
      validate: {
        validator: function (value) {
          if (this.type === "internship" || this.type === "both") {
            return !!value;
          }
          return true;
        },
        message: "Internship stipend is required for internship or both type",
      },
    },
    skillsRequired: {
      type: [String],
      required: [true, "Skills required field is mandatory"],
    },
    jobCategory: {
      type: String,
      enum: ["tech", "non-tech"],
      required: [true, "Job category must be 'tech' or 'non-tech'"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    status: {
      type: String,
      default: "Apply", // 🟢 Always starts as "Apply"
    },
  },
  { timestamps: true }
);

export default mongoose.model("Company", companySchema);
