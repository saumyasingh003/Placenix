import Company from "../Models/company.js";
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
