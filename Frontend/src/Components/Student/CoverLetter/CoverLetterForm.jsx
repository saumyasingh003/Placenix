// View Layer - Presentational Component for Cover Letter Form
import { FaFileAlt } from "react-icons/fa";

const CoverLetterForm = ({ formData, onChange, onSubmit, isLoading }) => {
  return (
    <div className="col-span-2 w-full">
      <form
        onSubmit={onSubmit}
        className="w-full space-y-6 bg-white p-6 rounded-lg border shadow-sm"
      >
        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName || ""}
            onChange={onChange}
            placeholder="Enter the company name"
            className="w-full px-3 py-2 border rounded-md bg-background"
            disabled={isLoading}
            required
          />
        </div>

        {/* Job Title */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Job Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="jobTitle"
            value={formData.jobTitle || ""}
            onChange={onChange}
            placeholder="Enter the job title you're applying for"
            className="w-full px-3 py-2 border rounded-md bg-background"
            disabled={isLoading}
            required
          />
        </div>

        {/* Job Description */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Job Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="jobDescription"
            value={formData.jobDescription || ""}
            onChange={onChange}
            rows="7"
            placeholder="Paste the job description here"
            className="w-full px-3 py-2 border rounded-md bg-background"
            disabled={isLoading}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-3 bg-black text-white rounded-md hover:bg-gray-900 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Generating..." : "Generate Cover Letter"}
        </button>
      </form>
    </div>
  );
};

export default CoverLetterForm;








