import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { FaSave, FaUser, FaUpload, FaTrash } from "react-icons/fa";

const Profile = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const token = currentUser.token || "";

  const [profileId, setProfileId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);

  const [formData, setFormData] = useState({
    name: currentUser.name || "",
    email: currentUser.email || "",
    branch: "",
    cgpa: "",
    collegeName: "",
    linkedinLink: "",
    githubLink: "",
    leetcodeLink: "",
    contact: "",
    backlogs: "0",
    jobPreference: "tech",  // ✅ NEW FIELD
    resume: "",
  });

  /* ============================================================
       LOAD PROFILE (GET /profile/me)
  ============================================================ */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/profile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setProfileId(res.data.data._id);

          setFormData((prev) => ({
            ...prev,
            ...res.data.data,
            name: currentUser.name,
            email: currentUser.email,
          }));
        }
      } catch {
        console.log("⚠ No profile found");
      }
    };

    loadProfile();
  }, []);

  /* ============================================================
       SAVE PROFILE
  ============================================================ */
  const handleSaveProfile = async () => {
    try {
      const url = profileId
        ? `http://localhost:5000/profile/update/${profileId}`
        : "http://localhost:5000/profile/add";

      const form = new FormData();
      Object.keys(formData).forEach((key) => form.append(key, formData[key]));

      if (resumeFile) form.append("resume", resumeFile);

      const response = await axios({
        method: profileId ? "PUT" : "POST",
        url,
        data: form,
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfileId(response.data.data._id);

      setFormData((prev) => ({
        ...prev,
        ...response.data.data,
      }));

      setIsEditing(false);
      toast.success("Profile saved successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save profile");
    }
  };

  /* ============================================================
       DELETE PROFILE
  ============================================================ */
  const handleDeleteProfile = async () => {
    try {
      await axios.delete(`http://localhost:5000/profile/delete/${profileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Profile deleted!");

      setProfileId(null);
      setFormData({
        name: currentUser.name,
        email: currentUser.email,
        branch: "",
        cgpa: "",
        collegeName: "",
        linkedinLink: "",
        githubLink: "",
        leetcodeLink: "",
        contact: "",
        backlogs: "0",
        jobPreference: "tech",
        resume: "",
      });
    } catch {
      toast.error("Failed to delete profile");
    }
  };

  /* ============================================================
        UI
  ============================================================ */
  return (
    <div className="w-full mx-auto space-y-6 p-4">

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-[#00916E] rounded-full flex items-center justify-center">
          <FaUser className="w-6 h-6 text-white" />
        </div>

        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-gray-500">Manage your account information</p>
        </div>
      </div>

      {/* PROFILE CARD */}
      <div className="rounded-xl border bg-white shadow-sm w-full">
        <div className="p-6 space-y-6">

          {/* GRID INPUTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Full Name" value={formData.name} disabled />
            <InputField label="Email" value={formData.email} disabled />

            {[
              ["Branch", "branch"],
              ["CGPA", "cgpa"],
              ["College Name", "collegeName"],
              ["Contact Number", "contact"],
              ["LinkedIn Link", "linkedinLink"],
              ["GitHub Link", "githubLink"],
              ["LeetCode Link", "leetcodeLink"],
              ["Backlogs", "backlogs"],
            ].map(([label, key]) => (
              <InputField
                key={key}
                label={label}
                value={formData[key]}
                disabled={!isEditing}
                placeholder={`Enter ${label}`}
                onChange={(e) =>
                  setFormData({ ...formData, [key]: e.target.value })
                }
              />
            ))}

            {/* ✅ JOB PREFERENCE (tech / non-tech) */}
            <div>
              <label className="text-sm font-medium">Job Preference</label>
              <select
                disabled={!isEditing}
                value={formData.jobPreference}
                onChange={(e) =>
                  setFormData({ ...formData, jobPreference: e.target.value })
                }
                className={`w-full mt-1 px-4 py-2 border rounded-md ${
                  !isEditing ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              >
                <option value="tech">Tech</option>
                <option value="non-tech">Non-Tech</option>
              </select>
            </div>

          </div>

          {/* RESUME UPLOAD */}
          <div>
            <label className="font-medium text-sm">Resume (PDF Only)</label>

            <div className="border border-dashed rounded-xl p-5 mt-2 flex flex-col items-center bg-gray-50">
              <FaUpload className="text-[#00916E] text-3xl mb-2" />

              <input
                type="file"
                accept="application/pdf"
                disabled={!isEditing}
                onChange={(e) => setResumeFile(e.target.files[0])}
                className="border p-2 rounded-md w-full"
              />

              {formData.resume && (
                <a
                  href={`http://localhost:5000${formData.resume}`}
                  target="_blank"
                  className="mt-3 text-blue-600 underline text-sm"
                >
                  View Uploaded Resume
                </a>
              )}
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3 pt-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveProfile}
                  className="bg-[#00916E] text-white px-5 py-2 rounded-md"
                >
                  <FaSave className="inline-block mr-2" /> Save Profile
                </button>

                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white px-5 py-2 rounded-md"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-amber-600 text-white px-5 py-2 rounded-md"
                >
                  Edit Profile
                </button>

                {profileId && (
                  <button
                    onClick={handleDeleteProfile}
                    className="bg-red-600 text-white px-5 py-2 rounded-md flex items-center gap-2"
                  >
                    <FaTrash /> Delete Profile
                  </button>
                )}
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

/* ============================================================
    REUSABLE INPUT
============================================================ */
const InputField = ({ label, value, disabled, placeholder, onChange }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <input
      value={value || ""}
      placeholder={placeholder}
      disabled={disabled}
      onChange={onChange}
      className={`w-full mt-1 px-4 py-2 border rounded-md ${
        disabled ? "bg-gray-100 cursor-not-allowed" : ""
      }`}
    />
  </div>
);

export default Profile;
