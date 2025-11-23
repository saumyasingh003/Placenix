import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const RegisterCompany = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    description: "",
    startRegistrationDate: "",
    endRegistrationDate: "",
    visitDate: "",
    type: "",
    packageOffered: "",
    internshipStipend: "",
    jobCategory: "",
    skillsRequired: [],
    hiringProcess: {
      apptitude: false,
      coding: false,
      personalInterview: false,
      groupDiscussion: false
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If user changes type, clear related fields
    if (name === "type") {
      setFormData(prev => ({
        ...prev,
        type: value,
        packageOffered: value === "internship" ? "" : prev.packageOffered,
        internshipStipend: value === "job" ? "" : prev.internshipStipend,
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, skillsRequired: skills }));
  };

  const handleHiringProcessChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      hiringProcess: { ...prev.hiringProcess, [name]: checked }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (!currentUser) return toast.error("You must be logged in as Admin");
      if (currentUser.role.toLowerCase() !== "admin")
        return toast.error("Only admin can register a company");

      const res = await axios.post(
        "http://localhost:5000/company/add",
        formData,
        {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        }
      );

      toast.success(res.data.message || "Company registered!");

      // RESET FORM
      setFormData({
        companyName: "",
        description: "",
        startRegistrationDate: "",
        endRegistrationDate: "",
        visitDate: "",
        type: "",
        packageOffered: "",
        internshipStipend: "",
        jobCategory: "",
        skillsRequired: [],
        hiringProcess: {
          apptitude: false,
          coding: false,
          personalInterview: false,
          groupDiscussion: false
        }
      });

    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding company");
    }
  };

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="w-full p-6 bg-white border-b border-gray-300 rounded-xl shadow-sm">
        <h1 className="text-3xl font-semibold text-gray-900">Register Company</h1>
        <p className="text-gray-600 text-sm mt-1">Add details for the placement drive</p>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md border border-gray-200 rounded-xl p-8 mt-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* COMPANY NAME */}
          <div className="space-y-1">
            <label className="text-gray-700 font-medium">Company Name *</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              className="w-full h-11 px-3 rounded-lg border bg-gray-50 border-gray-300"
            />
          </div>

          {/* TYPE FIELD UPDATED */}
          <div className="space-y-1">
            <label className="text-gray-700 font-medium">Company Type *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full h-11 px-3 rounded-lg border bg-gray-50 border-gray-300"
            >
              <option value="">Select Type</option>
              <option value="job">Job</option>
              <option value="internship">Internship</option>
              <option value="both">Both</option>
            </select>
          </div>

          {/* DESCRIPTION */}
          <div className="md:col-span-2 space-y-1">
            <label className="text-gray-700 font-medium">Description *</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full rounded-lg border bg-gray-50 border-gray-300 px-3 py-2"
            />
          </div>

          {/* DATES */}
          <div className="space-y-1">
            <label className="text-gray-700 font-medium">Registration Starts *</label>
            <input
              type="date"
              name="startRegistrationDate"
              value={formData.startRegistrationDate}
              onChange={handleChange}
              required
              className="w-full h-11 px-3 rounded-lg border bg-gray-50 border-gray-300"
            />
          </div>

          <div className="space-y-1">
            <label className="text-gray-700 font-medium">Registration Ends *</label>
            <input
              type="date"
              name="endRegistrationDate"
              value={formData.endRegistrationDate}
              onChange={handleChange}
              required
              className="w-full h-11 px-3 rounded-lg border bg-gray-50 border-gray-300"
            />
          </div>

          {/* VISIT DATE */}
          <div className="space-y-1">
            <label className="text-gray-700 font-medium">Visit Date</label>
            <input
              type="date"
              name="visitDate"
              value={formData.visitDate}
              onChange={handleChange}
              className="w-full h-11 px-3 rounded-lg border bg-gray-50 border-gray-300"
            />
          </div>

          {/* JOB CATEGORY */}
          <div className="space-y-1">
            <label className="text-gray-700 font-medium">Job Category *</label>
            <input
              type="text"
              name="jobCategory"
              value={formData.jobCategory}
              onChange={handleChange}
              required
              placeholder="e.g., non-tech"
              className="w-full h-11 px-3 rounded-lg border bg-gray-50 border-gray-300"
            />
          </div>

          {/* PACKAGE (Enable/Disable Based on Type) */}
          <div className="space-y-1">
            <label className="text-gray-700 font-medium">Package Offered</label>
            <input
              type="text"
              name="packageOffered"
              value={formData.packageOffered}
              onChange={handleChange}
              disabled={formData.type === "internship"}
              placeholder="e.g., 6 LPA"
              className={`w-full h-11 px-3 rounded-lg border bg-gray-50 border-gray-300 ${
                formData.type === "internship" ? "opacity-40 cursor-not-allowed" : ""
              }`}
            />
          </div>

          {/* STIPEND (Enable/Disable Based on Type) */}
          <div className="space-y-1">
            <label className="text-gray-700 font-medium">Internship Stipend</label>
            <input
              type="text"
              name="internshipStipend"
              value={formData.internshipStipend}
              onChange={handleChange}
              disabled={formData.type === "job"}
              placeholder="e.g., 15000/month"
              className={`w-full h-11 px-3 rounded-lg border bg-gray-50 border-gray-300 ${
                formData.type === "job" ? "opacity-40 cursor-not-allowed" : ""
              }`}
            />
          </div>

          {/* HIRING PROCESS CHECKBOXES */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-gray-700 font-medium">Hiring Process *</label>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              {[
                ["apptitude", "Aptitude"],
                ["coding", "Coding Round"],
                ["personalInterview", "Personal Interview"],
                ["groupDiscussion", "Group Discussion"]
              ].map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 text-gray-700">
                  <input
                    type="checkbox"
                    name={key}
                    checked={formData.hiringProcess[key]}
                    onChange={handleHiringProcessChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* SKILLS */}
          <div className="md:col-span-2 space-y-1">
            <label className="text-gray-700 font-medium">Skills Required *</label>
            <input
              type="text"
              placeholder="Communication, Business Knowledge, etc."
              onChange={handleSkillsChange}
              className="w-full h-11 px-3 rounded-lg border bg-gray-50 border-gray-300"
            />
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-4 pt-6">
          <button
            type="button"
            onClick={() =>
              setFormData({
                companyName: "",
                description: "",
                startRegistrationDate: "",
                endRegistrationDate: "",
                visitDate: "",
                type: "",
                packageOffered: "",
                internshipStipend: "",
                jobCategory: "",
                skillsRequired: [],
                hiringProcess: {
                  apptitude: false,
                  coding: false,
                  personalInterview: false,
                  groupDiscussion: false
                }
              })
            }
            className="px-5 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
          >
            Reset
          </button>

          <button
            type="submit"
            className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-lg"
          >
            Register Company
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterCompany;
