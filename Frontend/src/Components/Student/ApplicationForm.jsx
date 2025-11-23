import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FaArrowLeft } from "react-icons/fa";

const ApplicationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    resume: "",
    cgpa: "",
    skills: "",
    branch: "",
    year: ""
  });

  useEffect(() => {
    const companies = JSON.parse(localStorage.getItem("companies") || "[]");
    const foundCompany = companies.find((c) => c.id === parseInt(id));
    setCompany(foundCompany);

    // Auto-fill from current user profile
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userProfile = users.find((u) => u.email === currentUser.email);

    if (userProfile) {
      setFormData({
        name: userProfile.name || "",
        email: userProfile.email || "",
        phone: userProfile.phone || "",
        resume: userProfile.resume || "",
        cgpa: userProfile.cgpa || "",
        skills: userProfile.skills || "",
        branch: userProfile.branch || "",
        year: userProfile.year || ""
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    toast.success("Details saved!");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get existing applications
    const applications = JSON.parse(localStorage.getItem("applications") || "[]");

    // Create new application
    const newApplication = {
      id: Date.now(),
      companyId: parseInt(id),
      companyName: company.companyName,
      ...formData,
      appliedAt: new Date().toISOString(),
      status: "Pending"
    };

    applications.push(newApplication);
    localStorage.setItem("applications", JSON.stringify(applications));

    // Update company's student count
    const companies = JSON.parse(localStorage.getItem("companies") || "[]");
    const updatedCompanies = companies.map((c) => {
      if (c.id === parseInt(id)) {
        return {
          ...c,
          studentsRegistered: (c.studentsRegistered || 0) + 1
        };
      }
      return c;
    });
    localStorage.setItem("companies", JSON.stringify(updatedCompanies));

    toast.success("Application submitted successfully!");
    navigate("/home/history");
  };

  if (!company) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-muted-foreground">Company not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
      >
        <FaArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="bg-card border border-border rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Apply to {company.companyName}</h1>
        <p className="text-muted-foreground mb-6">Please review and submit your application</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email ID *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Resume Link *</label>
              <input
                type="url"
                name="resume"
                value={formData.resume}
                onChange={handleChange}
                required
                placeholder="https://drive.google.com/..."
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">CGPA</label>
              <input
                type="text"
                name="cgpa"
                value={formData.cgpa}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Branch</label>
              <input
                type="text"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-foreground">Skills</label>
              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                rows="3"
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 py-3 px-6 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold transition-all"
            >
              Save
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-6 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-semibold transition-all"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
