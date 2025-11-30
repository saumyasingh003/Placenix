import { useState, useEffect } from "react";
import axios from "axios";
import { FaGraduationCap } from "react-icons/fa";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

/* ----------------------------------------------------------
   REUSABLE INFO ROW (RESPONSIVE)
---------------------------------------------------------- */
const InfoRow = ({ label, value, badgeColor }) => (
  <div className="flex justify-between items-center text-sm sm:text-base">
    <p className="text-gray-500">{label}</p>

    {badgeColor ? (
      <span
        className={`px-2 py-0.5 rounded-md text-xs sm:text-sm font-medium capitalize bg-${badgeColor}-100 text-${badgeColor}-700`}
      >
        {value}
      </span>
    ) : (
      <span className="text-gray-800 font-medium">{value}</span>
    )}
  </div>
);

/* ----------------------------------------------------------
   MAIN DASHBOARD — FULLY RESPONSIVE
---------------------------------------------------------- */
const Dashboard = () => {
  const [companyData, setCompanyData] = useState(null);
  const [loadingCompany, setLoadingCompany] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEarliestCompany = async () => {
      try {
        const res = await axios.get("http://localhost:5000/company/earliest", {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("currentUser")).token
            }`,
          },
        });

        setCompanyData(res.data.data);
      } catch (err) {
        setError("No upcoming company visits found.");
      } finally {
        setLoadingCompany(false);
      }
    };

    fetchEarliestCompany();
  }, []);

  /* -------------------- Left Box Data -------------------- */
  const placementDetails = {
    "Communication Skills": [
      "Clear and structured speaking",
      "Explain answers logically",
      "Confidence during HR & technical rounds",
      "Active listening",
      "Professional email + resume communication",
    ],
    "DSA / Problem Solving": [
      "Strong arrays, strings, linked lists",
      "Trees, graphs, recursion",
      "Efficient problem-solving",
      "Time & space complexity",
      "Medium-level coding problems",
    ],
    "Development Skills": [
      "Project architecture + clean code",
      "Full-stack exposure",
      "API design & auth",
      "Debugging + Git",
      "Deployment basics",
    ],
    Projects: [
      "2–3 real-world projects",
      "Clean GitHub contributions",
      "Live deployment",
      "Clear README",
      "Ownership + problem solving",
    ],
    "Aptitude & Core CS": [
      "Quant + logical aptitude",
      "OS, DBMS, CN basics",
      "SQL queries",
      "OOP concepts",
      "Used in tests & interviews",
    ],
  };

  const colors = ["#6EE7B7", "#FCD34D", "#93C5FD", "#FCA5A5", "#C4B5FD"];
  const labels = Object.keys(placementDetails);

  const placementComponentsData = {
    labels,
    datasets: [
      {
        data: [25, 25, 20, 20, 10],
        backgroundColor: colors,
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const [selectedComponent, setSelectedComponent] = useState(
    "Communication Skills"
  );

  const handleHover = (_, elements) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      setSelectedComponent(labels[index]);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 py-6">

      {/* -------------------------------------------------- */}
      {/* HEADER */}
      {/* -------------------------------------------------- */}
      <div className="flex flex-col items-center text-center mb-6">

        <div className="flex items-center gap-3 sm:gap-4 justify-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-[#00916E]">
            <FaGraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Placement Preparation Insights
          </h1>
        </div>

        <p className="text-gray-500 text-sm sm:text-base mt-2">
          Understand the key components to crack placements
        </p>
      </div>

      {/* -------------------------------------------------- */}
      {/* TWO MAIN BOXES — FULLY RESPONSIVE GRID */}
      {/* -------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* -------------------------------------------------- */}
        {/* LEFT BOX – RESPONSIVE PIE + BADGES */}
        {/* -------------------------------------------------- */}
        <div className="bg-white shadow-md rounded-xl p-4 sm:p-5 border border-gray-100">

          <h6 className="text-md sm:text-lg font-bold  mb-3">
            Placement Components
          </h6>

          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">

            {/* Responsive Pie Chart */}
            <div className="w-40 sm:w-52 md:w-56 mt-16">
              <Pie
                data={placementComponentsData}
                options={{
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  onHover: handleHover,
                }}
              />
            </div>

            {/* Responsive Detail Badges */}
            <div className="flex flex-col w-full">
              <h2 className="text-lg font-semibold text-gray-800 mb-2 text-center md:text-left">
                {selectedComponent}
              </h2>

              <div className="flex flex-col gap-2">
                {placementDetails[selectedComponent].map((item, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 text-xs sm:text-sm rounded-lg border border-gray-300"
                    style={{
                      backgroundColor:
                        colors[labels.indexOf(selectedComponent)] + "33",
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------- */}
        {/* RIGHT BOX – COMPANY VISIT */}
        {/* -------------------------------------------------- */}
        <div className="bg-white shadow-md rounded-xl p-4 sm:p-5 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Latest Company Visit
          </h3>

          {loadingCompany && (
            <p className="text-gray-600 text-sm">Fetching upcoming company...</p>
          )}

          {!loadingCompany && error && (
            <p className="text-red-500 font-medium text-sm">{error}</p>
          )}

          {!loadingCompany && companyData && (
            <div className="space-y-4">

              {/* BASIC INFO */}
              <div className="space-y-2">
                <InfoRow label="Company" value={companyData.companyName} />
                <InfoRow label="Visit" value={companyData.visitDate} badgeColor="green" />
                <InfoRow
                  label="Applied"
                  value={companyData.totalStudentsApplied}
                />
                <InfoRow label="Type" value={companyData.jobType} badgeColor="blue" />
                <InfoRow
                  label="Status"
                  value={companyData.studentStatus}
                  badgeColor="purple"
                />
                <InfoRow
                  label="Stage"
                  value={companyData.applicationStage}
                  badgeColor="orange"
                />
              </div>

              {/* Hiring Process Flow — Responsive */}
              <div className="mt-3">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Hiring Process
                </h4>

                <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
                  {Object.entries(companyData.hiringProcess || {}).map(
                    ([round, status], index, arr) => (
                      <div key={index} className="flex items-center">
                        <span
                          className={`px-2 py-1 rounded-md border text-xs sm:text-sm font-medium
                          ${
                            status
                              ? "bg-green-100 text-green-700 border-green-300"
                              : "bg-gray-100 text-gray-500 border-gray-300"
                          }`}
                        >
                          {round
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (c) => c.toUpperCase())}
                        </span>

                        {index !== arr.length - 1 && (
                          <span className="mx-1 text-gray-400 hidden sm:inline">→</span>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
