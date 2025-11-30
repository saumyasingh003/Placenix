import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaBuilding,
  FaArrowLeft,
  FaEnvelope,
  FaPhone,
  FaFileAlt,
  FaCalendar,
  FaBriefcase,
  FaMoneyBillWave,
} from "react-icons/fa";
import axios from "axios";
import { toast } from "sonner";
import * as XLSX from "xlsx";

const CompanyApplicants = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const formatDate = (date) => {
    if (!date) return "Not specified";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const computeStatus = (endDate) => {
    if (!endDate) return "Closed";
    const today = new Date();
    return new Date(endDate) < today ? "Closed" : "Apply";
  };

  useEffect(() => {
    const fetchCompanyAndApplicants = async () => {
      try {
        setLoading(true);
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) {
          toast.error("Please login to continue");
          navigate("/login");
          return;
        }

        const token = currentUser.token;

        const res1 = await axios.get(
          `http://localhost:5000/company/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res1.data.success) {
          const c = res1.data.data || {};
          c.status = computeStatus(c.endRegistrationDate);
          setCompany(c);
        }

        const res2 = await axios.get(
          `http://localhost:5000/application/company/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res2.data.success) setApplicants(res2.data.data || []);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load details");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyAndApplicants();
  }, [id, navigate]);

  if (loading)
    return <p className="p-6 text-center text-gray-600">Loading...</p>;

  if (!company)
    return <p className="p-6 text-center text-gray-600">Company not found</p>;

  const updateStatus = async (applicationId, newStatus) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const token = currentUser?.token;

      const res = await axios.put(
        `http://localhost:5000/application/status/${applicationId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("Status updated");

        setApplicants((prev) =>
          prev.map((a) =>
            a._id === applicationId ? { ...a, status: newStatus } : a
          )
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  const statusColors = {
    Applied: "bg-blue-100 text-blue-700",
    Shortlisted: "bg-yellow-100 text-yellow-700",
    Interview: "bg-gray-200 text-gray-700",
    Hired: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
  };

  const escapeCsv = (v) => {
    if (!v) return "";
    const s = String(v);
    if (s.includes(",") || s.includes('"') || s.includes("\n"))
      return `"${s.replace(/"/g, '""')}"`;
    return s;
  };

  const downloadCSV = () => {
    const headers = ["Name", "Email", "Phone", "CGPA", "Branch", "Status", "AppliedAt"];
    const rows = applicants.map((a) => {
      const s = a.student || {};
      return [
        escapeCsv(s.name),
        escapeCsv(s.email),
        escapeCsv(s.contact),
        escapeCsv(s.cgpa),
        escapeCsv(s.branch),
        escapeCsv(a.status),
        escapeCsv(formatDate(a.appliedAt)),
      ].join(",");
    });

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "applicants.csv";
    a.click();
  };

  const downloadExcel = () => {
    const data = applicants.map((a) => ({
      Name: a.student?.name,
      Email: a.student?.email,
      Phone: a.student?.contact,
      CGPA: a.student?.cgpa,
      Branch: a.student?.branch,
      Status: a.status,
      AppliedAt: formatDate(a.appliedAt),
    }));

    const sheet = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, "Applicants");

    XLSX.writeFile(wb, "applicants.xlsx");
  };

  const filteredApplicants = applicants.filter((a) => {
    const s = a.student || {};
    const q = searchQuery.toLowerCase();

    const matchesSearch =
      s.name?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.branch?.toLowerCase().includes(q) ||
      s.contact?.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === "All" ? true : a.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
      >
        <FaArrowLeft /> Back
      </button>

      {/* COMPANY CARD */}
      <div className="bg-white border rounded-xl shadow p-6 space-y-6">

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <FaBuilding className="text-gray-700 w-8 h-8" />
          </div>

          <div>
            <h1 className="text-3xl font-bold">{company.companyName}</h1>
            <p className="text-gray-600">Total Applicants: {applicants.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 bg-gray-50 p-5 rounded-xl">
          <Detail label="Job Category" value={company.jobCategory} icon={<FaBriefcase />} />
          <Detail label="Type" value={company.type} icon={<FaBriefcase />} />
          <Detail label="Package (LPA)" value={company.packageOffered || "N/A"} icon={<FaMoneyBillWave />} />
          <Detail label="Internship Stipend" value={company.internshipStipend || "N/A"} icon={<FaMoneyBillWave />} />
          <Detail label="Registration Start" value={formatDate(company.startRegistrationDate)} icon={<FaCalendar />} />
          <Detail label="Registration End" value={formatDate(company.endRegistrationDate)} icon={<FaCalendar />} />
          <Detail label="Visit Date" value={formatDate(company.visitDate)} icon={<FaCalendar />} />
          <Detail label="Status" value={company.status} icon={<FaBriefcase />} />
        </div>

        <Section title="Description">{company.description}</Section>

        <Section title="Skills Required">
          {Array.isArray(company.skillsRequired) ? company.skillsRequired.join(", ") : "Not specified"}
        </Section>

        <Section title="Hiring Process">
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            {company.hiringProcess?.apptitude && <li>Aptitude Test</li>}
            {company.hiringProcess?.coding && <li>Coding Round</li>}
            {company.hiringProcess?.groupDiscussion && <li>Group Discussion</li>}
            {company.hiringProcess?.personalInterview && <li>Personal Interview</li>}
            {!Object.values(company.hiringProcess || {}).some(Boolean) && (
              <p className="text-gray-500">Not specified</p>
            )}
          </ul>
        </Section>
      </div>

      {/* APPLICANTS TABLE / MOBILE CARDS */}
      <div className="bg-white border rounded-xl shadow overflow-hidden">

        {/* Search + Filters */}
        <div className="p-6 border-b flex flex-col md:flex-row gap-4 justify-between">

          <input
            type="text"
            placeholder="Search by name, email, branch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 w-full border rounded-lg"
          />

          <div className="flex flex-wrap gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="All">All Status</option>
              <option value="Applied">Applied</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview">Interview</option>
              <option value="Hired">Hired</option>
              <option value="Rejected">Rejected</option>
            </select>

            <button onClick={downloadCSV} className="px-3 py-2 bg-blue-600 text-white rounded-lg">
              CSV
            </button>

            <button onClick={downloadExcel} className="px-3 py-2 bg-green-600 text-white rounded-lg">
              Excel
            </button>
          </div>
        </div>

        {filteredApplicants.length > 0 ? (
          <>
            {/* DESKTOP TABLE */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr>
                    <Th>Name</Th>
                    <Th>Email</Th>
                    <Th>Phone</Th>
                    <Th>CGPA</Th>
                    <Th>Branch</Th>
                    <Th>Resume</Th>
                    <Th>Status</Th>
                    <Th>Applied</Th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {filteredApplicants.map((a) => {
                    const s = a.student || {};
                    return (
                      <tr key={a._id} className="hover:bg-gray-50">

                        <Td>{s.name || "N/A"}</Td>

                        <Td>
                          <div className="flex items-center gap-2">
                            <FaEnvelope className="w-3 h-3" /> {s.email}
                          </div>
                        </Td>

                        <Td>
                          <div className="flex items-center gap-2">
                            <FaPhone className="w-3 h-3" /> {s.contact}
                          </div>
                        </Td>

                        <Td>{s.cgpa}</Td>
                        <Td>{s.branch}</Td>

                        <Td>
                          {s.resume ? (
                            <a href={s.resume} target="_blank" className="underline text-blue-600">
                              View
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </Td>

                        <Td>
                          <select
                            value={a.status}
                            onChange={(e) => updateStatus(a._id, e.target.value)}
                            className={`px-2 py-1 rounded-lg text-sm font-medium cursor-pointer ${statusColors[a.status]}`}
                          >
                            <option value="Applied">Applied</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Interview">Interview</option>
                            <option value="Hired">Hired</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </Td>

                        <Td>{formatDate(a.appliedAt)}</Td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARDS */}
            <div className="md:hidden p-4 space-y-4">
              {filteredApplicants.map((a) => {
                const s = a.student || {};
                return (
                  <div key={a._id} className="border rounded-xl p-4 bg-gray-50 shadow-sm space-y-3">

                    <h2 className="text-lg font-semibold">{s.name}</h2>

                    <p className="text-sm text-gray-700 flex gap-2">
                      <FaEnvelope /> {s.email}
                    </p>

                    <p className="text-sm text-gray-700 flex gap-2">
                      <FaPhone /> {s.contact}
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <p className="text-sm"><b>CGPA:</b> {s.cgpa}</p>
                      <p className="text-sm"><b>Branch:</b> {s.branch}</p>

                      <p className="text-sm col-span-2">
                        <b>Resume: </b>
                        {s.resume ? (
                          <a href={s.resume} target="_blank" className="text-blue-600 underline">View</a>
                        ) : "N/A"}
                      </p>

                      <p className="text-sm col-span-2">
                        <b>Applied:</b> {formatDate(a.appliedAt)}
                      </p>
                    </div>

                    <select
                      value={a.status}
                      onChange={(e) => updateStatus(a._id, e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg text-sm font-medium ${statusColors[a.status]}`}
                    >
                      <option value="Applied">Applied</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Interview">Interview</option>
                      <option value="Hired">Hired</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="p-10 text-center text-gray-500">No applications found</div>
        )}
      </div>
    </div>
  );
};

export default CompanyApplicants;

/* ---------------- Helper Components ---------------- */

const Detail = ({ label, value, icon }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium text-gray-900 flex items-center gap-2">
      {icon} {value}
    </p>
  </div>
);

const Section = ({ title, children }) => (
  <div className="space-y-2">
    <h3 className="text-lg font-semibold">{title}</h3>
    <div className="text-gray-700">{children}</div>
  </div>
);

const Th = ({ children }) => (
  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{children}</th>
);

const Td = ({ children }) => (
  <td className="px-6 py-4 text-sm text-gray-800">{children}</td>
);
