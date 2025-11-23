import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaCalendar, FaBriefcase, FaChevronRight } from "react-icons/fa";

const AdminHistory = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Convert ISO → Human-readable
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Determine dynamic status
  const getStatus = (endDate) => {
    if (!endDate) return "Apply";
    const today = new Date();
    const end = new Date(endDate);
    return end < today ? "Closed" : "Apply";
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) return;

        const token = currentUser.token;

        const res = await axios.get("http://localhost:5000/company/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        let fetched = res.data.data || [];

        fetched = fetched.map((c) => ({
          ...c,
          status: getStatus(c.endRegistrationDate),
        }));

        // Sort → upcoming first
        fetched.sort((a, b) => {
          if (a.status === "Apply" && b.status === "Closed") return -1;
          if (a.status === "Closed" && b.status === "Apply") return 1;
          return (
            new Date(a.startRegistrationDate) -
            new Date(b.startRegistrationDate)
          );
        });

        setCompanies(fetched);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (loading) {
    return <div className="w-full p-6 text-center text-gray-500">Loading...</div>;
  }

  if (!companies.length) {
    return <div className="w-full p-6 text-center text-gray-500">No companies found.</div>;
  }

  // Pagination Logic
  const totalPages = Math.ceil(companies.length / itemsPerPage);
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentCompanies = companies.slice(firstIndex, lastIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="w-full p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Registered Companies</h1>
      <p className="text-gray-600">Upcoming companies appear on top</p>

      <div className="overflow-x-auto w-full border rounded-xl shadow-sm">
        <table className="w-full bg-white text-gray-800 border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Company</th>
              <th className="px-6 py-3 text-left font-semibold">Category</th>
              <th className="px-6 py-3 text-left font-semibold">Type</th>
              <th className="px-6 py-3 text-left font-semibold">Registration Dates</th>
              <th className="px-6 py-3 text-left font-semibold">Status</th>
              <th className="px-6 py-3 text-center font-semibold">Action</th>
            </tr>
          </thead>

          <tbody>
            {currentCompanies.map((company) => (
              <tr key={company._id} className="border-b hover:bg-gray-50 transition">
                
                {/* Company */}
                <td className="px-6 py-4">{company.companyName}</td>

                {/* Category */}
                <td className="px-6 py-4 text-gray-600">{company.jobCategory || "N/A"}</td>

                {/* Type */}
                <td className="px-6 py-4 flex items-center gap-2 text-gray-700 capitalize">
                  <FaBriefcase className="w-4 h-4" />
                  {company.type}
                </td>

                {/* Dates */}
                <td className="px-6 py-4 text-gray-700">
                  <div className="flex items-center gap-2">
                    <FaCalendar className="w-4 h-4" />
                    {formatDate(company.startRegistrationDate)} →{" "}
                    {formatDate(company.endRegistrationDate)}
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      company.status === "Apply"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {company.status}
                  </span>
                </td>

                {/* Action */}
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/admin/company/${company._id}`);
                    }}
                    className="p-2 hover:bg-gray-200 rounded-full transition"
                  >
                    <FaChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION CONTROLS */}
      <div className="flex justify-center items-center gap-2 mt-4">
        {/* Prev */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Prev
        </button>

        {/* Page Numbers */}
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => goToPage(index + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === index + 1
                ? "bg-gray-800 text-white"
                : "bg-gray-200"
            }`}
          >
            {index + 1}
          </button>
        ))}

        {/* Next */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminHistory;
