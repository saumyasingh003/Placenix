import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  FaFileAlt,
  FaTrash,
  FaEye,
  FaMagic,
  FaEdit,
  FaDownload
} from "react-icons/fa";
import jsPDF from "jspdf";

const CoverLetter = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const token = currentUser.token || "";

  const [formData, setFormData] = useState({
    companyName: "",
    jobTitle: "",
    jobDescription: "",
    applicantName: currentUser.name || ""
  });

  const [history, setHistory] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState(null);

  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [editId, setEditId] = useState(null);

  // -------------------------------------------------------
  // 🔥 Fetch History
  // -------------------------------------------------------
  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/coverletter/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(res.data.data || []);
    } catch {
      toast.error("Failed to fetch cover letters");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // -------------------------------------------------------
  // 🔥 Handle Input
  // -------------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // -------------------------------------------------------
  // 🔥 Generate Cover Letter
  // -------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.companyName || !formData.jobTitle || !formData.jobDescription)
      return toast.error("All fields are required!");

    try {
      await axios.post(
        "http://localhost:5000/coverletter/generate",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Cover letter generated!");

      setFormData({
        companyName: "",
        jobTitle: "",
        jobDescription: "",
        applicantName: currentUser.name || ""
      });

      fetchHistory();
    } catch {
      toast.error("Failed to generate cover letter");
    }
  };

  // -------------------------------------------------------
  // 🔥 View Letter
  // -------------------------------------------------------
  const handleView = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/coverletter/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedLetter(res.data.data);
    } catch {
      toast.error("Failed to load letter");
    }
  };

  // -------------------------------------------------------
  // ✏️ Manual Edit
  // -------------------------------------------------------
  const openEditor = (item) => {
    setEditId(item._id);
    setEditContent(item.content);
    setEditMode(true);
  };

  const saveManualEdit = async () => {
    try {
      await axios.put(
        `http://localhost:5000/coverletter/manual-update/${editId}`,
        { content: editContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Updated successfully!");
      setEditMode(false);
      fetchHistory();
    } catch {
      toast.error("Failed to update");
    }
  };

  // -------------------------------------------------------
  // ❌ Delete Letter
  // -------------------------------------------------------
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/coverletter/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Deleted!");
      fetchHistory();
    } catch {
      toast.error("Unable to delete");
    }
  };

  // -------------------------------------------------------
  // 📄 Download PDF
  // -------------------------------------------------------
  const downloadPDF = (item) => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    doc.setFont("Helvetica", "normal");
    const lines = doc.splitTextToSize(item.content, 500);
    doc.text(lines, 40, 60);

    doc.save(`${item.jobTitle}-CoverLetter.pdf`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="flex items-center gap-4 mb-6 mt-2">
        <FaMagic className="text-5xl text-emerald-600" />
        <div>
          <h1 className="text-3xl font-bold">AI Cover Letter Generator</h1>
          <p className="text-gray-600">Generate, edit & download cover letters.</p>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">

        {/* FORM */}
        <div className="col-span-2">
          <form onSubmit={handleSubmit} className="bg-white  mt-8 p-6 rounded-lg border shadow space-y-6">

            <InputField
              label="Company Name"
              name="companyName"
              value={formData.companyName}
              placeholder="Enter company name"
              onChange={handleChange}
            />

            <InputField
              label="Job Title"
              name="jobTitle"
              value={formData.jobTitle}
              placeholder="Enter job title"
              onChange={handleChange}
            />

            <div>
              <label className="block text-sm font-medium mb-2">Job Description</label>
              <textarea
                name="jobDescription"
                rows="7"
                value={formData.jobDescription}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md"
                placeholder="Paste job description"
              />
            </div>

            <button className="bg-black text-white py-3 w-full rounded-md flex items-center justify-center gap-2 hover:bg-gray-900">
              <FaMagic /> Generate Cover Letter
            </button>
          </form>
        </div>

        {/* HISTORY */}
        <div className="bg-white border p-6 rounded-lg shadow">

          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaFileAlt className="text-xl" /> Past Cover Letters
          </h2>

          {history.length === 0 ? (
            <p className="text-gray-500 text-sm">No cover letters yet.</p>
          ) : (
            <div className="space-y-5 max-h-[500px] overflow-y-auto">

              {history.map((item) => (
                <div
                  key={item._id}
                  className="p-5 border rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition-all mt-3 w-full"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-lg">{item.jobTitle}</h3>

                    <div className="flex gap-3 text-xl">
                      <FaEye
                        onClick={() => handleView(item._id)}
                        className="text-blue-600 cursor-pointer hover:scale-110"
                      />
                      <FaEdit
                        onClick={() => openEditor(item)}
                        className="text-green-600 cursor-pointer hover:scale-110"
                      />
                      <FaDownload
                        onClick={() => downloadPDF(item)}
                        className="text-purple-600 cursor-pointer hover:scale-110"
                      />
                      <FaTrash
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 cursor-pointer hover:scale-110"
                      />
                    </div>
                  </div>

                  {/* Readable Date */}
                  <p className="text-xs text-gray-500 mb-3">
                    {new Date(item.createdAt).toLocaleString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric"
                    })}
                  </p>
                </div>
              ))}

            </div>
          )}

        </div>
      </div>

      {/* VIEW MODAL */}
      {selectedLetter && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white p-6 max-w-2xl w-full rounded-lg shadow-xl max-h-[80vh] overflow-y-auto">

            <h2 className="text-2xl font-bold mb-2">{selectedLetter.jobTitle}</h2>
            <p className="text-gray-600">{selectedLetter.companyName}</p>

            <pre className="whitespace-pre-wrap mt-4">
              {selectedLetter.content}
            </pre>

            <button
              className="mt-4 bg-black text-white px-4 py-2 rounded"
              onClick={() => setSelectedLetter(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editMode && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white p-6 max-w-2xl w-full rounded-lg shadow-xl">

            <h2 className="text-xl font-semibold mb-3">Edit Cover Letter</h2>

            <textarea
              className="w-full h-96 border p-3 rounded-md"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />

            <div className="flex justify-end gap-3 mt-4">
              <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setEditMode(false)}>
                Cancel
              </button>

              <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={saveManualEdit}>
                Save Changes
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

// ------------------------------------------------------------
// REUSABLE INPUT COMPONENT
// ------------------------------------------------------------
const InputField = ({ label, name, value, placeholder, onChange }) => (
  <div>
    <label className="block text-sm font-medium mb-2">{label}</label>
    <input
      type="text"
      className="w-full px-3 py-2 border rounded-md"
      value={value}
      placeholder={placeholder}
      name={name}
      onChange={onChange}
    />
  </div>
);

export default CoverLetter;
