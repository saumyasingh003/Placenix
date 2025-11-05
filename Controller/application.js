import Application from "../Models/application.js";
import Company from "../Models/company.js";
import Profile from "../Models/profile.js";

// 🧩 Student applies for a company
export const applyForCompany = async (req, res) => {
  try {
    const user = req.user; // from middleware
    const { companyId } = req.body;

    // ✅ Ensure student profile exists
    const studentProfile = await Profile.findOne({ user: user._id });
    if (!studentProfile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    // ✅ Check if company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // ✅ Prevent duplicate application
    const existing = await Application.findOne({
      student: studentProfile._id,
      company: companyId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this company",
      });
    }

    // ✅ Create new application
    const application = await Application.create({
      student: studentProfile._id,
      company: companyId,
      status: "Applied", // initial state
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// 🧩 Admin updates application status
export const updateApplicationStatus = async (req, res) => {
  try {
    const user = req.user;
    const { applicationId } = req.params;
    const { status } = req.body;

    // ✅ Only admin can update
    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admin can update status.",
      });
    }

    const validStatuses = ["Applied", "Shortlisted", "Interview", "Hired", "Rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value.",
      });
    }

    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    ).populate("student company");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Application status updated to '${status}'`,
      data: application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// 🧩 Student views their applications and current status
export const getStudentApplications = async (req, res) => {
  try {
    const user = req.user;

    // ✅ Get student’s profile
    const studentProfile = await Profile.findOne({ user: user._id });
    if (!studentProfile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    // ✅ Fetch all applications with populated company details
    const applications = await Application.find({ student: studentProfile._id })
      .populate("company", "companyName description package internshipStipend jobType visitDate")
      .sort({ createdAt: -1 });

    if (!applications.length) {
      return res.status(200).json({
        success: true,
        message: "No applications found",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Applications fetched successfully",
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// 🧩 Get student’s application for a specific company
export const getApplicationByCompanyId = async (req, res) => {
  try {
    const user = req.user;
    const { companyId } = req.params;

    // ✅ Ensure student profile exists
    const studentProfile = await Profile.findOne({ user: user._id });
    if (!studentProfile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    // ✅ Find if the student has applied to this company
    const application = await Application.findOne({
      student: studentProfile._id,
      company: companyId,
    }).populate("company", "companyName description packageOffered internshipStipend type visitDate");

    // ✅ If no application found → student hasn’t applied yet
    if (!application) {
      return res.status(200).json({
        success: true,
        message: "You have not applied for this company yet",
        data: {
          companyId,
          status: "Apply", // default status when not applied
        },
      });
    }

    // ✅ If found → return the application and current status
    res.status(200).json({
      success: true,
      message: "Application fetched successfully",
      data: {
        companyId: application.company._id,
        companyName: application.company.companyName,
        status: application.status,
        companyDetails: application.company,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// 🧩 Admin: Get all students with a specific application status
export const getStudentsByStatus = async (req, res) => {
  try {
    const user = req.user;
    const { status } = req.params; // example: Applied, Shortlisted, Hired, etc.

    // ✅ Only admin can access
    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admin can view this data.",
      });
    }

    // ✅ Validate status
    const validStatuses = ["Applied", "Shortlisted", "Interview", "Hired", "Rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    // ✅ Find all applications matching that status
    const applications = await Application.find({ status })
      .populate("student", "name email branch cgpa collegeName contact")
      .populate("company", "companyName type packageOffered internshipStipend visitDate")
      .sort({ updatedAt: -1 });

    if (!applications.length) {
      return res.status(200).json({
        success: true,
        message: `No students found with status '${status}'`,
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: `Students with status '${status}' fetched successfully`,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
