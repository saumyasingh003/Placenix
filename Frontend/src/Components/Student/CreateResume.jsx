import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaMagic,
  FaPhoneAlt,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import { toast } from "sonner";
import "react-datepicker/dist/react-datepicker.css";
import { useReactToPrint } from "react-to-print";

/* -------------------------------------------------------------------------- */
/*                            CreateResume.jsx                                 */
/* -------------------------------------------------------------------------- */

const CreateResume = () => {
  const resumeRef = useRef();
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    branch: "",
    cgpa: "",
    collegeName: "",
    contact: "",
    email: "",
    githubLink: "",
    linkedinLink: "",
    leetcodeLink: "",

    keySkills: [],
    keySkillsText: "",

    experience: [
      {
        companyName: "",
        role: "",
        startDate: null,
        endDate: null,
        description: "",
      },
    ],

    projects: [{ title: "", techStack: "", link: "", description: "" }],
    achievements: [{ title: "", institution: "", description: "" }],
    positionOfResponsibility: [
      { title: "", organization: "", duration: "", description: "" },
    ],
  });

  const handlePrint = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: `${formData.firstName || "My"}_Resume`,
    onBeforeGetContent: async () => {
      await handleSaveResume(); // Save to DB before printing
    },
    onAfterPrint: () => toast.success("Resume downloaded!"),
  });

  /* --------------------------- Fetch Profile --------------------------- */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) return;

        const token = currentUser.token;

        const res = await axios.get("http://localhost:5000/profile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          const p = res.data.data;

          setFormData((prev) => ({
            ...prev,
            firstName: p.name?.split(" ")[0] || "",
            lastName: p.name?.split(" ")[1] || "",
            email: p.email || "",
            contact: p.contact || "",
            branch: p.branch || "",
            cgpa: p.cgpa || "",
            collegeName: p.collegeName || "",
            githubLink: p.githubLink || "",
            linkedinLink: p.linkedinLink || "",
            leetcodeLink: p.leetcodeLink || "",
            keySkills: Array.isArray(p.keySkills) ? p.keySkills : [],
            keySkillsText: Array.isArray(p.keySkills)
              ? p.keySkills.join(", ")
              : "",
          }));
        }
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /* --------------------------- Fetch Profile & Resume --------------------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) {
          toast.error("Please login to continue");
          return;
        }

        const token = currentUser.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const res = await axios.get("http://localhost:5000/resume/get", config);

        if (res.data.success) {
          const { profile, resume } = res.data.data;

          const parseDate = (dateStr) => (dateStr ? new Date(dateStr) : null);

          setFormData((prev) => ({
            ...prev,
            // --- Profile Data ---
            firstName: profile?.name?.split(" ")[0] || "",
            lastName: profile?.name?.split(" ")[1] || "",
            email: profile?.email || "",
            contact: profile?.contact || "",
            branch: profile?.branch || "",
            cgpa: profile?.cgpa || "",
            collegeName: profile?.collegeName || "",
            githubLink: profile?.githubLink || "",
            linkedinLink: profile?.linkedinLink || "",
            leetcodeLink: profile?.leetcodeLink || "",

            // --- Resume Data (if exists) ---
            keySkills: resume?.keySkills || profile?.keySkills || [],
            keySkillsText: (resume?.keySkills || profile?.keySkills || []).join(
              ", "
            ),

            summary: resume?.summary || "",
            portfolioLink: resume?.portfolioLink || "",

            experience:
              resume?.experience?.length > 0
                ? resume.experience.map((e) => ({
                    ...e,
                    startDate: parseDate(e.startDate),
                    endDate: parseDate(e.endDate),
                  }))
                : [
                    {
                      companyName: "",
                      role: "",
                      startDate: null,
                      endDate: null,
                      description: "",
                    },
                  ],

            projects:
              resume?.projects?.length > 0
                ? resume.projects
                : [{ title: "", techStack: "", link: "", description: "" }],

            achievements:
              resume?.achievements?.length > 0
                ? resume.achievements
                : [{ title: "", institution: "", description: "" }],

            positionOfResponsibility:
              resume?.positionOfResponsibility?.length > 0
                ? resume.positionOfResponsibility
                : [
                    {
                      title: "",
                      organization: "",
                      duration: "",
                      description: "",
                    },
                  ],
          }));
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ------------------------------ Handlers ----------------------------- */

  const handleChange = (e, index, type) => {
    const { name, value } = e.target;

    if (typeof index === "number" && type) {
      setFormData((prev) => {
        const updated = { ...prev };
        updated[type] = [...updated[type]];
        updated[type][index] = { ...updated[type][index], [name]: value };
        return updated;
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addField = (type, template) => {
    setFormData((prev) => ({
      ...prev,
      [type]: [...prev[type], template],
    }));
  };

  const removeField = (type, index) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  /* ---------------------- Key Skills helpers ----------------------- */

  const keySkillsTextToArray = (text) =>
    text
      ? text
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length > 0)
      : [];

  const convertKeySkillsForSave = () => {
    const arr = keySkillsTextToArray(formData.keySkillsText || "");
    setFormData((prev) => ({ ...prev, keySkills: arr }));
    return arr;
  };

  /* -------------------------------------------------------------------------- */
  /*                                Preview                                     */
  /* -------------------------------------------------------------------------- */

  const Preview = () => {
    const fullName = `${formData.firstName} ${formData.lastName}`
      .trim()
      .toUpperCase();

    const hasSkills =
      (formData.keySkillsText && formData.keySkillsText.trim() !== "") ||
      (Array.isArray(formData.keySkills) && formData.keySkills.length > 0);

    const hasExperience = formData.experience.some(
      (e) =>
        (e.companyName && e.companyName.trim()) ||
        (e.role && e.role.trim()) ||
        e.startDate ||
        e.endDate ||
        (e.description && e.description.trim())
    );

    const hasProjects = formData.projects.some(
      (p) =>
        (p.title && p.title.trim()) ||
        (p.techStack && String(p.techStack).trim().length > 0) ||
        (p.link && p.link.trim()) ||
        (p.description && p.description.trim())
    );

    const hasAchievements = formData.achievements.some(
      (a) =>
        (a.title && a.title.trim()) ||
        (a.institution && a.institution.trim()) ||
        (a.description && a.description.trim())
    );

    const hasPOR = formData.positionOfResponsibility.some(
      (p) =>
        (p.title && p.title.trim()) ||
        (p.organization && p.organization.trim()) ||
        (p.duration && p.duration.trim()) ||
        (p.description && p.description.trim())
    );

    const displayKeySkills =
      formData.keySkills && formData.keySkills.length > 0
        ? formData.keySkills
        : keySkillsTextToArray(formData.keySkillsText || "");

    return (
      <div
        id="resume-preview"
        className="bg-white p-6 md:p-10 rounded-xl shadow-xl w-full md:w-[21cm] min-h-[29.7cm] mx-auto text-sm md:text-base"
      >
        <h1 className="text-2xl md:text-4xl font-bold text-center text-gray-900">
          {fullName || "YOUR NAME"}
        </h1>

        <p className="text-center text-gray-700 mt-3 flex flex-wrap justify-center items-center gap-4 md:gap-6 text-xs md:text-sm">
          {formData.email && (
            <span className="flex items-center gap-1">
              <FaEnvelope className="text-gray-600 text-xs" />
              {formData.email}
            </span>
          )}

          {formData.contact && (
            <span className="flex items-center gap-1">
              <FaPhoneAlt className="text-gray-600 text-xs" />
              {formData.contact}
            </span>
          )}

          {formData.linkedinLink && (
            <a
              href={formData.linkedinLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-black hover:underline"
            >
              <FaLinkedin className="text-black text-xs" />
              LinkedIn
            </a>
          )}

          {formData.githubLink && (
            <a
              href={formData.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-gray-900 hover:underline"
            >
              <FaGithub className="text-gray-900 text-xs" />
              GitHub
            </a>
          )}
        </p>

        {/* Education */}
        <Section title="Education" />
        <p className="font-semibold text-gray-900">
          {formData.collegeName || "College Name"}{" "}
          {formData.collegeName ? "(2022 – 2026)" : ""}
        </p>
        <p className="text-gray-700">
          {formData.branch ? `Branch: ${formData.branch}` : ""}
          {formData.cgpa ? ` · CGPA: ${formData.cgpa}` : ""}
        </p>

        {/* Skills */}
        {hasSkills && (
          <>
            <Section title="Key Skills" />
            <p className="text-gray-800">
              {displayKeySkills.length > 0
                ? displayKeySkills.join(", ")
                : formData.keySkillsText}
            </p>
          </>
        )}

        {/* Experience */}
        {hasExperience && (
          <>
            <Section title="Experience" />
            {formData.experience.map((e, i) =>
              e.companyName || e.role || e.description ? (
                <div key={i} className="mb-3">
                  <p className="font-semibold text-gray-900">
                    {e.companyName} — {e.role}{" "}
                    <span className="text-gray-600">
                      ({e.startDate ? formatDate(e.startDate) : "Start"} –{" "}
                      {e.endDate ? formatDate(e.endDate) : "End"})
                    </span>
                  </p>

                  {e.description &&
                    e.description.split("\n").map((line, idx) => (
                      <ul key={idx} className="ml-6 list-disc text-gray-700">
                        <li>{line}</li>
                      </ul>
                    ))}
                </div>
              ) : null
            )}
          </>
        )}

        {/* Projects */}
        {hasProjects && (
          <>
            <Section title="Projects" />
            {formData.projects.map((p, i) =>
              p.title || p.description ? (
                <div key={i} className="mb-3">
                  <div className="flex items-center flex-wrap gap-2 text-gray-900">
                    <span className="font-semibold">{p.title}</span>

                    {p.link && <span>|</span>}

                    {p.link && (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        Link
                      </a>
                    )}

                    {p.techStack && <span>|</span>}

                    {p.techStack && <span>{p.techStack}</span>}
                  </div>

                  {p.description &&
                    p.description.split("\n").map((line, idx) => (
                      <ul key={idx} className="ml-6 list-disc text-gray-700">
                        <li>{line}</li>
                      </ul>
                    ))}
                </div>
              ) : null
            )}
          </>
        )}

        {/* Achievements */}
        {hasAchievements && (
          <>
            <Section title="Achievements" />
            {formData.achievements.map((a, i) =>
              a.title || a.institution || a.description ? (
                <ul key={i} className="ml-6 list-disc text-gray-700 mb-1">
                  <li>
                    <span className="font-semibold">{a.title}</span>
                    {a.institution ? ` — ${a.institution}` : ""}{" "}
                    {a.description ? `: ${a.description}` : ""}
                  </li>
                </ul>
              ) : null
            )}
          </>
        )}

        {/* POR */}
        {hasPOR && (
          <>
            <Section title="Positions of Responsibility" />
            {formData.positionOfResponsibility.map((p, i) =>
              p.title || p.organization ? (
                <div key={i} className="mb-2">
                  <p className="font-semibold">
                    {p.title} — {p.organization}{" "}
                    {p.duration ? `(${p.duration})` : ""}
                  </p>

                  {p.description &&
                    p.description.split("\n").map((line, idx) => (
                      <ul key={idx} className="ml-6 list-disc text-gray-700">
                        <li>{line}</li>
                      </ul>
                    ))}
                </div>
              ) : null
            )}
          </>
        )}
      </div>
    );
  };

  const formatDate = (val) =>
    new Date(val).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-center px-4 py-4 text-gray-500 bg-white rounded-lg shadow">
          Loading profile...
        </p>
      </div>
    );

  const handleTogglePreview = () => {
    convertKeySkillsForSave();
    setShowPreview((prev) => !prev);
  };

  const handleSaveResume = async (e) => {
    if (e) e.preventDefault();

    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (!currentUser) {
        toast.error("Please login to save");
        return;
      }

      const formattedSkills = convertKeySkillsForSave();

      const payload = {
        ...formData,
        keySkills: formattedSkills,
      };

      const token = currentUser.token;

      const res = await axios.put(
        "http://localhost:5000/resume/update",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        toast.success("Resume saved to database! 💾");
      }
    } catch (error) {
      console.error("Save Error:", error);
      toast.error(error.response?.data?.message || "Failed to save resume");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-8 md:py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <div className="flex items-start gap-3">
            <FaMagic className="text-4xl md:text-5xl text-emerald-600 flex-shrink-0" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Resume Builder
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                Fill your details, preview, and download your resume as PDF.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {showPreview && (
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 md:px-5 py-2 rounded-lg bg-green-600 text-white text-sm md:text-base"
              >
                Download PDF
              </button>
            )}

            <button
              type="button"
              onClick={handleTogglePreview}
              className="px-4 md:px-5 py-2 rounded-lg bg-blue-600 text-white text-sm md:text-base"
            >
              {showPreview ? "Back to Form" : "Preview Resume"}
            </button>
          </div>
        </div>

        {/* Main Content */}
        {!showPreview ? (
          <ResumeForm
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            addField={addField}
            removeField={removeField}
            handleSaveResume={handleSaveResume}
          />
        ) : (
          <div className="overflow-x-auto">
            <div ref={resumeRef} className="inline-block">
              <Preview />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                            Resume Form                                      */
/* -------------------------------------------------------------------------- */

const ResumeForm = ({
  formData,
  setFormData,
  handleChange,
  addField,
  removeField,
  handleSaveResume,
}) => {
  return (
    <form
      className="bg-white p-6 md:p-8 rounded-xl shadow-xl space-y-10"
      onSubmit={(e) => e.preventDefault()}
    >
      <SectionHeader title="Basic Information" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Input
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={(e) => handleChange(e)}
        />
        <Input
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={(e) => handleChange(e)}
        />
        <Input
          label="Email"
          name="email"
          value={formData.email}
          onChange={(e) => handleChange(e)}
        />
        <Input
          label="Branch"
          name="branch"
          value={formData.branch}
          onChange={(e) => handleChange(e)}
        />
        <Input
          label="CGPA"
          name="cgpa"
          value={formData.cgpa}
          onChange={(e) => handleChange(e)}
        />
        <Input
          label="College Name"
          name="collegeName"
          value={formData.collegeName}
          onChange={(e) => handleChange(e)}
        />
        <Input
          label="Contact Number"
          name="contact"
          value={formData.contact}
          onChange={(e) => handleChange(e)}
        />
      </div>

      <SectionHeader title="Important Links" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Input
          label="GitHub Link"
          name="githubLink"
          value={formData.githubLink}
          onChange={(e) => handleChange(e)}
        />
        <Input
          label="LinkedIn Link"
          name="linkedinLink"
          value={formData.linkedinLink}
          onChange={(e) => handleChange(e)}
        />
        <Input
          label="LeetCode Link"
          name="leetcodeLink"
          value={formData.leetcodeLink}
          onChange={(e) => handleChange(e)}
        />
      </div>

      <SectionHeader title="Key Skills" />
      <input
        type="text"
        placeholder="React, Node.js, MongoDB"
        name="keySkillsText"
        value={formData.keySkillsText || ""}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, keySkillsText: e.target.value }))
        }
        className="w-full px-3 py-2 border rounded bg-gray-50"
      />

      <Repeater
        title="Experience"
        type="experience"
        list={formData.experience}
        handleChange={handleChange}
        removeField={removeField}
        addField={addField}
        isExperience={true}
        template={{
          companyName: "",
          role: "",
          startDate: null,
          endDate: null,
          description: "",
        }}
        setFormData={setFormData}
      />

      <Repeater
        title="Projects"
        type="projects"
        list={formData.projects}
        handleChange={handleChange}
        removeField={removeField}
        addField={addField}
        template={{ title: "", techStack: "", link: "", description: "" }}
        setFormData={setFormData}
      />

      <Repeater
        title="Achievements"
        type="achievements"
        list={formData.achievements}
        handleChange={handleChange}
        removeField={removeField}
        addField={addField}
        template={{ title: "", institution: "", description: "" }}
        setFormData={setFormData}
      />

      <Repeater
        title="Positions of Responsibility"
        type="positionOfResponsibility"
        list={formData.positionOfResponsibility}
        handleChange={handleChange}
        removeField={removeField}
        addField={addField}
        template={{
          title: "",
          organization: "",
          duration: "",
          description: "",
        }}
        setFormData={setFormData}
      />

      <button
        type="button"
        onClick={handleSaveResume}
        className="w-full py-3 bg-green-600 hover:bg-green-700 transition text-white text-base md:text-lg rounded-md mt-4"
      >
        Save Resume
      </button>
    </form>
  );
};

/* -------------------------------------------------------------------------- */
/*                            Repeater Component                              */
/* -------------------------------------------------------------------------- */

const Repeater = ({
  title,
  type,
  list,
  handleChange,
  removeField,
  addField,
  template,
  isExperience,
  setFormData,
}) => (
  <>
    <SectionHeader title={title} />

    {list.map((item, index) => (
      <DynamicCard
        key={index}
        title={`${title} ${index + 1}`}
        onRemove={() => index > 0 && removeField(type, index)}
        isExperience={isExperience}
        item={item}
        index={index}
        type={type}
        handleChange={handleChange}
        setFormData={setFormData}
      />
    ))}

    <button
      type="button"
      onClick={() => addField(type, template)}
      className="mt-2 flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm md:text-base"
    >
      <FaPlus /> Add More
    </button>
  </>
);

/* ---------------------------- AITextarea Component ----------------------------- */

const AITextarea = ({ value, onChange, meta, type }) => {
  const [loading, setLoading] = useState(false);

  const improveWithAI = async () => {
    try {
      setLoading(true);

      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const token = currentUser?.token;

      if (!token) {
        toast.error("Please login first");
        return;
      }

      const body = {
        experience: [],
        projects: [],
        achievements: [],
        positionOfResponsibility: [],
      };

      if (type === "experience")
        body.experience = [{ ...meta, description: value }];
      if (type === "projects")
        body.projects = [{ ...meta, description: value }];
      if (type === "achievements")
        body.achievements = [{ ...meta, description: value }];
      if (type === "positionOfResponsibility")
        body.positionOfResponsibility = [{ ...meta, description: value }];

      const res = await axios.post("http://localhost:5000/resume/ai", body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const improved = res.data?.improvedResults?.[0]?.improved;

      if (improved) {
        onChange({
          target: { name: "description", value: improved },
        });
        toast.success("AI improved the description ✨");
      } else {
        toast.error("AI returned no improvement");
      }
    } catch (err) {
      console.error("AI improve error", err);
      toast.error("AI failed to improve");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3">
      <textarea
        className="w-full px-3 py-2 border rounded bg-gray-50"
        value={value}
        name="description"
        onChange={onChange}
        rows={4}
      />

      <div className="flex flex-wrap items-center gap-3 mt-2">
        <button
          type="button"
          onClick={improveWithAI}
          className="inline-flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-800"
        >
          {loading ? "✨ Improving..." : "✨ Improve with AI"}
        </button>

        <button
          type="button"
          onClick={() =>
            onChange({ target: { name: "description", value: "" } })
          }
          className="text-sm text-red-500"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

/* ---------------------------- Dynamic Card ----------------------------- */

const DynamicCard = ({
  title,
  onRemove,
  isExperience,
  item,
  index,
  type,
  handleChange,
  setFormData,
}) => {
  const handleDateChange = (date, field) => {
    setFormData((prev) => {
      const updated = { ...prev };
      updated[type] = [...updated[type]];
      updated[type][index] = { ...updated[type][index], [field]: date };
      return updated;
    });
  };

  return (
    <div className="bg-gray-50 p-4 md:p-5 rounded-lg border shadow-sm mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base md:text-lg font-semibold">{title}</h3>
        <button
          type="button"
          onClick={onRemove}
          className="text-red-600 hover:text-red-700 disabled:opacity-40"
          disabled={!onRemove}
        >
          <FaTrash />
        </button>
      </div>

      {/* Experience Section */}
      {isExperience ? (
        <>
          <Input
            label="Company Name"
            name="companyName"
            value={item.companyName}
            onChange={(e) => handleChange(e, index, type)}
          />

          <Input
            label="Role"
            name="role"
            value={item.role}
            onChange={(e) => handleChange(e, index, type)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div>
              <label className="text-sm text-gray-700 block mb-1">
                Start Date
              </label>

              <DatePicker
                selected={item.startDate ? new Date(item.startDate) : null}
                onChange={(date) => handleDateChange(date, "startDate")}
                dateFormat="MMM yyyy"
                showMonthYearPicker
                className="w-full px-3 py-2 border rounded bg-gray-50"
                placeholderText="Select start date"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 block mb-1">
                End Date
              </label>

              <DatePicker
                selected={item.endDate ? new Date(item.endDate) : null}
                onChange={(date) => handleDateChange(date, "endDate")}
                dateFormat="MMM yyyy"
                showMonthYearPicker
                className="w-full px-3 py-2 border rounded bg-gray-50"
                placeholderText="Select end date"
              />
            </div>
          </div>

          <label className="text-sm text-gray-700 block mb-1 mt-3">
            Description (one point per line)
          </label>

          <AITextarea
            value={item.description}
            onChange={(e) => handleChange(e, index, type)}
            meta={item}
            type={type}
          />
        </>
      ) : (
        <>
          {Object.keys(item)
            .filter((k) => k !== "description")
            .map((k) => (
              <Input
                key={k}
                label={k.replace(/([A-Z])/g, " $1")}
                name={k}
                value={item[k]}
                onChange={(e) => handleChange(e, index, type)}
              />
            ))}

          <label className="text-sm text-gray-700 block mb-1 mt-3">
            Description
          </label>

          <AITextarea
            value={item.description}
            onChange={(e) => handleChange(e, index, type)}
            meta={item}
            type={type}
          />
        </>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                        Small Reusable Components                           */
/* -------------------------------------------------------------------------- */

const SectionHeader = ({ title }) => (
  <h2 className="text-lg md:text-xl font-semibold text-gray-900 border-l-4 border-blue-600 pl-3 md:pl-4 mb-4">
    {title}
  </h2>
);

const Section = ({ title }) => (
  <h2 className="text-lg md:text-xl font-semibold text-black mt-6 mb-2">
    {title}
  </h2>
);

const Input = ({ label, ...props }) => (
  <div className="w-full mt-2">
    <label className="text-sm text-gray-700 block mb-1">{label}</label>
    <input
      {...props}
      className="w-full px-3 py-2 border rounded bg-gray-50 text-sm md:text-base"
    />
  </div>
);

export default CreateResume;
