import Application from "../Models/application.js";
import Company from "../Models/company.js";
import Profile from "../Models/profile.js";
import User from "../Models/user.js";

// 🏢 Add a new company (Admin only)
export const addCompany = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // ✅ Only admin can add company info
    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can add company details.",
      });
    }

    const {
      companyName,
      description,
      startRegistrationDate,
      endRegistrationDate,
      hiringProcess,
      visitDate,
      type,
      packageOffered,
      internshipStipend,
      skillsRequired,
      jobCategory,
    } = req.body;

    // ✅ Create new company with status "Apply"
    const company = await Company.create({
      companyName,
      description,
      startRegistrationDate,
      endRegistrationDate,
      hiringProcess,
      visitDate,
      type,
      packageOffered,
      internshipStipend,
      skillsRequired,
      jobCategory,
      createdBy: req.user._id,
      status: "Apply", // 🟢 Default status
    });

    res.status(201).json({
      success: true,
      message: "Company details added successfully.",
      data: company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Get all companies (visible to both admin & students)
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalCompanies: companies.length,
      data: companies.map((company) => ({
        ...company.toObject(),
        status: company.status || "Apply", // 🟢 Ensure status always present
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 🧾 Get single company details
export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...company.toObject(),
        status: company.status || "Apply", // 🟢 Include status
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};






export const getEarliestCompanyVisit = async (req, res) => { 
  try {
    const today = new Date();
    const studentId = req.user?._id;
    console.log("Student ID from token:", studentId);

    // 1️⃣ Get earliest upcoming company
    const earliestCompany = await Company.find({
      visitDate: { $gte: today },
    })
      .sort({ visitDate: 1 })
      .limit(1);

    if (!earliestCompany || earliestCompany.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No upcoming company visits found.",
      });
    }

    const company = earliestCompany[0];

    // 2️⃣ Get student profile
    const studentProfile = await Profile.findOne({ user: studentId }).select("_id");
    console.log("Student Profile:", studentProfile);
    const studentProfileId = studentProfile?._id;
    console.log("Student Profile ID:", studentProfileId);

    // 3️⃣ Count total applied students
    const totalApplied = await Application.countDocuments({
      company: company._id,
    });

    // 4️⃣ Check if this student applied
    let application = null;
    if (studentProfileId) {
      application = await Application.findOne({
        student: studentProfileId,
        company: company._id,
      });
    }

    const hasApplied = Boolean(application);
    console.log("Application found for student:", hasApplied);

    // 5️⃣ Check if registration closed
    const endDate = new Date(company.endRegistrationDate);
    endDate.setHours(23, 59, 59, 999);
    const isClosed = endDate < new Date();

    // 6️⃣ Determine studentStatus
    let studentStatus = "Not Applied";

    if (hasApplied) {
      studentStatus = "Applied";
    } else if (isClosed) {
      studentStatus = "Closed";
    }

    // 7️⃣ Current application stage
    const applicationStage = hasApplied ? application.status : null;

    // 8️⃣ Job type
    const jobType = company.jobCategory;

    // 9️⃣ Format visit date
    const visitDate = new Date(company.visitDate).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    // 🔟 FINAL RESPONSE (ONLY hiringProcess added)
    return res.status(200).json({
      success: true,
      data: {
        companyId: company._id,
        companyName: company.companyName,
        visitDate,
        totalStudentsApplied: totalApplied,
        jobType,
        studentStatus,
        applicationStage,

        // ✅ Added (your request)
        hiringProcess: company.hiringProcess || [],
      },
    });

  } catch (error) {
    console.error("EARLIEST COMPANY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getEarliestCompanyAdmin = async (req, res) => { 
  try {
    const today = new Date();
    const userId = req.user?._id;
    

    // 1️⃣ Get earliest upcoming company
    const earliestCompany = await Company.find({
      visitDate: { $gte: today },
    })
      .sort({ visitDate: 1 })
      .limit(1);

    if (!earliestCompany || earliestCompany.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No upcoming company visits found.",
      });
    }

    const company = earliestCompany[0];


    // 3️⃣ Count total applied students from Application collection
    const totalApplied = await Application.countDocuments({
      company: company._id,
    });

  

  

    // 5️⃣ Check if registration has closed
    const endDate = new Date(company.endRegistrationDate);
    endDate.setHours(23, 59, 59, 999); // treat as end of day


    // 8️⃣ jobType is jobCategory from your schema
    const jobType = company.jobCategory; // "tech" | "non-tech"

    // 9️⃣ Format visit date
    const visitDate = new Date(company.visitDate).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    // 🔟 Return final correct output
    return res.status(200).json({
      success: true,
      data: {
        companyId: company._id,
        companyName: company.companyName,
        visitDate,
        totalStudentsApplied: totalApplied,
        jobType      
      },
    });

  } catch (error) {
    console.error("EARLIEST COMPANY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


