import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaBuilding,
  FaArrowLeft,
  FaCalendar,
  FaBriefcase,
  FaMoneyBillWave,
  FaChevronRight,
} from "react-icons/fa";
import axios from "axios";
import { toast } from "sonner";

const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState("Apply");
  const [isApplying, setIsApplying] = useState(false);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // DATE FORMATTER
  // -----------------------------
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // -----------------------------
  // CHECK REGISTRATION STATUS
  // -----------------------------
  const getStatus = (endDate) => {
    if (!endDate) return "Closed";
    return new Date(endDate) >= new Date() ? "Apply" : "Closed";
  };

  // -----------------------------
  // BUTTON UI LOGIC
  // -----------------------------
  const getApplyButtonUI = (status, isApplying) => {
    switch (status) {
      case "Apply":
        return {
          text: isApplying ? "Applying..." : "Apply Now",
          class: "bg-[#00916E] hover:bg-[#007A59] text-white",
          disabled: isApplying,
        };

      case "Applied":
        return {
          text: "Applied",
          class: "bg-blue-100 text-blue-700 border border-blue-400 cursor-not-allowed",
          disabled: true,
        };

      case "Shortlisted":
        return {
          text: "Shortlisted",
          class: "bg-yellow-100 text-yellow-700 border border-yellow-400 cursor-not-allowed",
          disabled: true,
        };

      case "Interview":
        return {
          text: "Interview Scheduled",
          class: "bg-purple-100 text-purple-700 border border-purple-400 cursor-not-allowed",
          disabled: true,
        };

      case "Hired":
        return {
          text: "Hired",
          class: "bg-green-100 text-green-700 border border-green-500 cursor-not-allowed",
          disabled: true,
        };

      case "Rejected":
        return {
          text: "Rejected",
          class: "bg-red-100 text-red-700 border border-red-400 cursor-not-allowed",
          disabled: true,
        };

      case "Closed":
        return {
          text: "Registration Closed",
          class: "bg-gray-400 text-white cursor-not-allowed",
          disabled: true,
        };

      default:
        return {
          text: "Apply Now",
          class: "bg-[#00916E] hover:bg-[#007A59] text-white",
          disabled: false,
        };
    }
  };

  // -----------------------------
  // FETCH COMPANY DETAILS + STATUS
  // -----------------------------
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) {
          toast.error("Please login to view company details");
          navigate("/login");
          return;
        }

        const token = currentUser.token;
        const headers = { Authorization: `Bearer ${token}` };

        const [companyRes, statusRes] = await Promise.all([
          axios.get(`http://localhost:5000/company/${id}`, { headers }),
          axios.get(`http://localhost:5000/application/mine/${id}`, { headers }),
        ]);

        const comp = companyRes.data?.data;
        comp.status = getStatus(comp.endRegistrationDate);
        setCompany(comp);

        const userAppStatus = statusRes.data?.data?.status;

        setApplicationStatus(userAppStatus || comp.status || "Apply");
      } catch (err) {
        toast.error(err.response?.data?.message || "Unable to load company details");
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id, navigate]);

  // -----------------------------
  // APPLY HANDLER
  // -----------------------------
  const handleApply = async () => {
    if (!company || applicationStatus !== "Apply") return;

    setIsApplying(true);

    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const token = currentUser.token;

      await axios.post(
        "http://localhost:5000/application/apply",
        { companyId: company._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Application Submitted!");

      setApplicationStatus("Applied");
      setCompany((prev) => ({ ...prev, status: "Applied" }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to submit application");
    } finally {
      setIsApplying(false);
    }
  };

  // -----------------------------
  // LOADING + NOT FOUND STATE
  // -----------------------------
  if (loading) return <p className="p-6 text-center text-gray-600">Loading...</p>;
  if (!company) return <p className="p-6 text-center text-gray-600">Company not found</p>;

  // -----------------------------
  // PRODUCTIVE LOGIC — SHOW FIELDS
  // -----------------------------
  const isJob = company.type?.toLowerCase() === "job";
  const isInternship = company.type?.toLowerCase() === "internship";
  const isBoth = company.type?.toLowerCase() === "both";

  const showPackage = isJob || isBoth;
  const showStipend = isInternship || isBoth;

  const buttonUI = getApplyButtonUI(applicationStatus, isApplying);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
      >
        <FaArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* MAIN CARD */}
      <div className="bg-white border rounded-2xl shadow-md p-8 space-y-8">

        {/* HEADER */}
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center">
            <FaBuilding className="text-gray-700 w-10 h-10" />
          </div>

          <div>
            <h1 className="text-3xl font-bold">{company.companyName}</h1>
            <p className="text-gray-600 capitalize">{company.jobCategory}</p>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* LEFT */}
          <div className="space-y-4">
            <Detail label="Job Type" value={company.type} icon={<FaBriefcase />} />

            {showPackage && (
              <Detail
                label="Package"
                value={`${company.packageOffered || "Not mentioned"} LPA`}
                icon={<FaMoneyBillWave />}
              />
            )}
{showStipend && (
  <Detail
    label="Internship Stipend"
    value={
      company.internshipStipend
        ? `${company.internshipStipend}/month`
        : "Not Mentioned"
    }
  />
)}

          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            <Detail
              label="Registration Period"
              value={`${formatDate(company.startRegistrationDate)} — ${formatDate(
                company.endRegistrationDate
              )}`}
              icon={<FaCalendar />}
            />
            <Detail label="Visit Date" value={formatDate(company.visitDate)} />

            <Detail
              label="Skills Required"
              value={Array.isArray(company.skillsRequired)
                ? company.skillsRequired.join(", ")
                : company.skillsRequired}
            />
          </div>
        </div>

        {/* DESCRIPTION */}
        <Section title="Description">{company.description}</Section>

        {/* HIRING PROCESS */}
        <Section title="Hiring Process">
          {company.hiringProcess ? (
            <div className="flex flex-wrap items-center gap-3">
              {[
                { key: "apptitude", label: "Aptitude Test" },
                { key: "coding", label: "Coding Round" },
                { key: "personalInterview", label: "Personal Interview" },
                { key: "groupDiscussion", label: "Group Discussion" },
              ]
                .filter((stage) => company.hiringProcess[stage.key])
                .map((stage, idx, arr) => (
                  <span key={stage.key} className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-gray-100 border">
                      {stage.label}
                    </span>
                    {idx !== arr.length - 1 && <FaChevronRight className="text-gray-400" />}
                  </span>
                ))}
            </div>
          ) : (
            <p className="text-gray-600">Not specified</p>
          )}
        </Section>

        {/* APPLY BUTTON */}
        <div className="flex justify-end">
          <button
            onClick={handleApply}
            disabled={buttonUI.disabled}
            className={`px-6 py-2 rounded-lg font-medium transition ${buttonUI.class}`}
          >
            {buttonUI.text}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------------- Helper Components ---------------- */

const Detail = ({ label, value, icon }) => (
  <div>
    <p className="text-sm font-semibold text-gray-500">{label}</p>
    <p className="flex items-center gap-2 text-gray-800">
      {icon} {value}
    </p>
  </div>
);

const Section = ({ title, children }) => (
  <div>
    <p className="text-sm font-semibold text-gray-500">{title}</p>
    <div className="mt-2 text-gray-800">{children}</div>
  </div>
);

export default CompanyDetails;
