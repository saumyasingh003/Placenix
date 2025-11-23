import { useState } from "react";
import { FaFileAlt, FaFilePdf } from "react-icons/fa";
import { toast } from "sonner";

const Portfolio = () => {
  const [activeTab, setActiveTab] = useState("cover-letter");

  // Cover Letter Form State
  const [coverLetterData, setCoverLetterData] = useState({
    name: "",
    jobTitle: "",
    jobDescription: "",
  });

  // Resume Form State
  const [resumeData, setResumeData] = useState({
    // Personal Information
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    mobile: "",
    dob: "",
    gender: "",
    address: "",
    // Academic Information
    tenthMarks: "",
    twelfthMarks: "",
    currentDegree: "",
    collegeName: "",
    currentSemester: "",
    cgpa: "",
    backlogs: "",
    // Skills
    technicalSkills: "",
    softSkills: "",
    // Projects / Internships
    projectTitle: "",
    projectDescription: "",
    techStack: "",
    internshipExperience: "",
    // Achievements / Certifications
    certifications: "",
    achievements: "",
    // Declaration
    declaration: false,
  });

  const handleCoverLetterSubmit = (e) => {
    e.preventDefault();
    if (!coverLetterData.name || !coverLetterData.jobTitle || !coverLetterData.jobDescription) {
      toast.error("Please fill all required fields");
      return;
    }
    toast.success("Cover letter generated successfully!");
    console.log("Cover Letter Data:", coverLetterData);
  };

  const handleResumeSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = [
      { field: resumeData.firstName, name: "First Name" },
      { field: resumeData.lastName, name: "Last Name" },
      { field: resumeData.email, name: "Email" },
      { field: resumeData.mobile, name: "Mobile Number" },
      { field: resumeData.tenthMarks, name: "10th Marks" },
      { field: resumeData.twelfthMarks, name: "12th Marks" },
      { field: resumeData.currentDegree, name: "Current Degree" },
      { field: resumeData.collegeName, name: "College Name" },
      { field: resumeData.currentSemester, name: "Current Semester" },
      { field: resumeData.cgpa, name: "CGPA" },
      { field: resumeData.technicalSkills, name: "Technical Skills" },
      { field: resumeData.projectTitle, name: "Project Title" },
      { field: resumeData.projectDescription, name: "Project Description" },
    ];

    const missingFields = requiredFields.filter(f => !f.field);
    if (missingFields.length > 0) {
      toast.error(`Please fill required fields: ${missingFields.map(f => f.name).join(", ")}`);
      return;
    }

    if (!resumeData.declaration) {
      toast.error("Please accept the declaration");
      return;
    }

    toast.success("Resume created successfully!");
    console.log("Resume Data:", resumeData);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Portfolio</h1>
        <p className="text-muted-foreground">Create professional cover letters and resumes</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("cover-letter")}
          className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 ${
            activeTab === "cover-letter"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <FaFileAlt className="w-4 h-4" />
          Cover Letter
        </button>
        <button
          onClick={() => setActiveTab("resume")}
          className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 ${
            activeTab === "resume"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <FaFilePdf className="w-4 h-4" />
          Create Resume
        </button>
      </div>

      {/* Cover Letter Form */}
      {activeTab === "cover-letter" && (
        <form onSubmit={handleCoverLetterSubmit} className="bg-card p-6 rounded-lg border space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={coverLetterData.name}
              onChange={(e) => setCoverLetterData({ ...coverLetterData, name: e.target.value })}
              className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Job Title <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={coverLetterData.jobTitle}
              onChange={(e) => setCoverLetterData({ ...coverLetterData, jobTitle: e.target.value })}
              className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="e.g., Software Engineer"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Job Description <span className="text-destructive">*</span>
            </label>
            <textarea
              value={coverLetterData.jobDescription}
              onChange={(e) => setCoverLetterData({ ...coverLetterData, jobDescription: e.target.value })}
              className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring min-h-[150px]"
              placeholder="Paste the job description here..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Generate Cover Letter
          </button>
        </form>
      )}

      {/* Resume Form */}
      {activeTab === "resume" && (
        <form onSubmit={handleResumeSubmit} className="bg-card p-6 rounded-lg border space-y-8">
          {/* Personal Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  First Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={resumeData.firstName}
                  onChange={(e) => setResumeData({ ...resumeData, firstName: e.target.value })}
                  className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Middle Name</label>
                <input
                  type="text"
                  value={resumeData.middleName}
                  onChange={(e) => setResumeData({ ...resumeData, middleName: e.target.value })}
                  className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Last Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={resumeData.lastName}
                  onChange={(e) => setResumeData({ ...resumeData, lastName: e.target.value })}
                  className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email ID <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  value={resumeData.email}
                  onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Mobile Number <span className="text-destructive">*</span>
                </label>
                <input
                  type="tel"
                  value={resumeData.mobile}
                  onChange={(e) => setResumeData({ ...resumeData, mobile: e.target.value })}
                  className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={resumeData.dob}
                  onChange={(e) => setResumeData({ ...resumeData, dob: e.target.value })}
                  className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Gender</label>
                <select
                  value={resumeData.gender}
                  onChange={(e) => setResumeData({ ...resumeData, gender: e.target.value })}
                  className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Address</label>
                <input
                  type="text"
                  value={resumeData.address}
                  onChange={(e) => setResumeData({ ...resumeData, address: e.target.value })}
                  className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Academic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  10th Marks/Percentage <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={resumeData.tenthMarks}
                  onChange={(e) => setResumeData({ ...resumeData, tenthMarks: e.target.value })}
                  className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g., 85%"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  12th Marks/Percentage <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={resumeData.twelfthMarks}
                  onChange={(e) => setResumeData({ ...resumeData, twelfthMarks: e.target.value })}
                  className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g., 90%"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Current Degree/Course <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={resumeData.currentDegree}
                  onChange={(e) => setResumeData({ ...resumeData, currentDegree: e.target.value })}
                  className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g., B.Tech in Computer Science"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  College/University Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={resumeData.collegeName}
                  onChange={(e) => setResumeData({ ...resumeData, collegeName: e.target.value })}
                  className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Current Semester <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={resumeData.currentSemester}
                  onChange={(e) => setResumeData({ ...resumeData, currentSemester: e.target.value })}
                  className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g., 6"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  CGPA till now <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={resumeData.cgpa}
                  onChange={(e) => setResumeData({ ...resumeData, cgpa: e.target.value })}
                  className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g., 8.5"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Backlogs</label>
                <input
                  type="text"
                  value={resumeData.backlogs}
                  onChange={(e) => setResumeData({ ...resumeData, backlogs: e.target.value })}
                  className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g., 0"
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Technical Skills <span className="text-destructive">*</span>
                </label>
                <textarea
                  value={resumeData.technicalSkills}
                  onChange={(e) => setResumeData({ ...resumeData, technicalSkills: e.target.value })}
                  className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px]"
                  placeholder="e.g., React, Node.js, Python, SQL"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Soft Skills</label>
                <textarea
                  value={resumeData.softSkills}
                  onChange={(e) => setResumeData({ ...resumeData, softSkills: e.target.value })}
                  className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px]"
                  placeholder="e.g., Communication, Teamwork, Problem Solving"
                />
              </div>
            </div>
          </div>

          {/* Projects / Internships */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Projects / Internships</h2>
            <div>
              <label className="block text-sm font-medium mb-2">
                Project Title <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={resumeData.projectTitle}
                onChange={(e) => setResumeData({ ...resumeData, projectTitle: e.target.value })}
                className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Project Description <span className="text-destructive">*</span>
              </label>
              <textarea
                value={resumeData.projectDescription}
                onChange={(e) => setResumeData({ ...resumeData, projectDescription: e.target.value })}
                className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tech Stack</label>
              <input
                type="text"
                value={resumeData.techStack}
                onChange={(e) => setResumeData({ ...resumeData, techStack: e.target.value })}
                className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="e.g., React, Node.js, MongoDB"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Internship Experience</label>
              <textarea
                value={resumeData.internshipExperience}
                onChange={(e) => setResumeData({ ...resumeData, internshipExperience: e.target.value })}
                className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px]"
                placeholder="Describe your internship experience..."
              />
            </div>
          </div>

          {/* Achievements / Certifications */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Achievements / Certifications</h2>
            <div>
              <label className="block text-sm font-medium mb-2">Certifications</label>
              <textarea
                value={resumeData.certifications}
                onChange={(e) => setResumeData({ ...resumeData, certifications: e.target.value })}
                className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px]"
                placeholder="List your certifications..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Achievements</label>
              <textarea
                value={resumeData.achievements}
                onChange={(e) => setResumeData({ ...resumeData, achievements: e.target.value })}
                className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px]"
                placeholder="List your achievements..."
              />
            </div>
          </div>

          {/* Declaration */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Declaration</h2>
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="declaration"
                checked={resumeData.declaration}
                onChange={(e) => setResumeData({ ...resumeData, declaration: e.target.checked })}
                className="mt-1 w-4 h-4 accent-primary"
                required
              />
              <label htmlFor="declaration" className="text-sm">
                I hereby declare that the information provided above is true to the best of my knowledge.{" "}
                <span className="text-destructive">*</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Create Resume
          </button>
        </form>
      )}
    </div>
  );
};

export default Portfolio;
