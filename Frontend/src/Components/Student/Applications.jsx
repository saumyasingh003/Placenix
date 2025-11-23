import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendar, FaBuilding } from "react-icons/fa";
import axios from "axios";

const Application = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [applying, setApplying] = useState(false);

  // Format Date
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Open or Closed based on registration
  const getRegistrationStatus = (endDate) => {
    if (!endDate) return "Closed";
    return new Date(endDate) >= new Date() ? "Apply" : "Closed";
  };

  // Button style + label based on application status
  const getButtonDesign = (status) => {
    switch (status) {
      case "Apply":
        return { text: "View Details", class: "bg-[#00916E] text-white hover:bg-[#007A59]" };

      case "Applied":
        return { text: "Applied", class: "bg-blue-100 text-blue-700 border border-blue-400" };

      case "Shortlisted":
        return { text: "Shortlisted", class: "bg-yellow-100 text-yellow-700 border border-yellow-400" };

      case "Interview":
        return { text: "Interview Scheduled", class: "bg-purple-100 text-purple-700 border border-purple-400" };

      case "Hired":
        return { text: "Hired", class: "bg-green-100 text-green-700 border border-green-500" };

      case "Rejected":
        return { text: "Rejected", class: "bg-red-100 text-red-700 border border-red-400" };

      case "Closed":
        return { text: "Registration Closed", class: "bg-gray-200 text-gray-600 cursor-not-allowed" };

      default:
        return { text: "View Details", class: "bg-[#00916E] text-white hover:bg-[#007A59]" };
    }
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) return;

        const headers = { Authorization: `Bearer ${currentUser.token}` };

        const companyReq = axios.get("http://localhost:5000/company/all", { headers });

        let appliedApplications = [];
        try {
          const appRes = await axios.get("http://localhost:5000/application/mine", { headers });
          appliedApplications = appRes.data?.data || [];
        } catch {}

        const applicationStatusByCompany = {};
        appliedApplications.forEach((app) => {
          const compId = app.company?._id || app.company;
          if (compId) applicationStatusByCompany[compId] = app.status;
        });

        const companiesRes = await companyReq;
        let list = companiesRes.data?.data || [];

        // Assign dynamic status
        list = list.map((c) => ({
          ...c,
          status: applicationStatusByCompany[c._id] || getRegistrationStatus(c.endRegistrationDate),
        }));

        // Priority sorting:
        // 1. Active Applications (not Apply, not Closed)
        // 2. Apply
        // 3. Closed
        const priority = {
          Applied: 0,
          Shortlisted: 0,
          Interview: 0,
          Hired: 0,
          Rejected: 0,
          Apply: 1,
          Closed: 2,
        };

        list.sort((a, b) => {
          const pA = priority[a.status] ?? 3;
          const pB = priority[b.status] ?? 3;

          if (pA !== pB) return pA - pB;

          return new Date(a.startRegistrationDate) - new Date(b.startRegistrationDate);
        });

        setCompanies(list);
      } catch {}
    };

    fetchCompanies();
  }, []);

  // Apply to a company
  const handleConfirmApply = async () => {
    if (!selectedCompany) return;

    setApplying(true);
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const token = currentUser.token;

      const res = await axios.post(
        "http://localhost:5000/application/apply",
        { companyId: selectedCompany._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setCompanies((prev) =>
          prev.map((c) =>
            c._id === selectedCompany._id ? { ...c, status: "Applied" } : c
          )
        );
      }
    } catch {}

    setApplying(false);
    setShowPopup(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">

      {/* HEADER */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-gray-800">Placement Updates</h1>
        <p className="text-gray-600">Latest opportunities</p>
      </div>

      {/* COMPANY GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {companies.length > 0 ? (
          companies.map((company) => (
            <div
              key={company._id}
              className="rounded-xl border bg-white shadow-sm hover:shadow-md transition p-5"
            >
              <h3 className="text-xl font-semibold text-gray-800">
                {company.companyName}
              </h3>

              {/* STATUS BADGE */}
              <span
                className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold
                  ${
                    company.status === "Apply"
                      ? "bg-green-100 text-green-700"
                      : company.status === "Applied"
                      ? "bg-blue-100 text-blue-700"
                      : company.status === "Shortlisted"
                      ? "bg-yellow-100 text-yellow-700"
                      : company.status === "Interview"
                      ? "bg-purple-100 text-purple-700"
                      : company.status === "Hired"
                      ? "bg-green-200 text-green-800"
                      : company.status === "Rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-300 text-gray-700"
                  }`}
              >
                {company.status}
              </span>

              {/* DETAILS */}
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FaBuilding className="text-gray-600" />
                  <span className="font-medium capitalize">{company.type}</span>
                </div>

                <div className="flex items-center gap-2">
                  <FaCalendar className="text-gray-600" />
                  <span>
                    {formatDate(company.startRegistrationDate)} —{" "}
                    {formatDate(company.endRegistrationDate)}
                  </span>
                </div>
              </div>

              {/* BUTTON */}
              <div className="mt-4">
                <button
                  onClick={() => navigate(`/home/company/${company._id}`)}
                  className={`w-full py-2 rounded-lg font-semibold transition ${getButtonDesign(company.status).class}`}
                >
                  {getButtonDesign(company.status).text}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-12 text-gray-600">
            No companies available.
          </div>
        )}
      </div>
    </div>
  );
};

export default Application;
