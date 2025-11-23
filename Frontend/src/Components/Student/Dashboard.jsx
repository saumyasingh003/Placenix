import { useState, useEffect } from "react";
import axios from "axios";
import { FaGraduationCap } from "react-icons/fa";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

/* ----------------------------------------------------------
   REUSABLE COMPACT INFO ROW
---------------------------------------------------------- */
const InfoRow = ({ label, value, badgeColor }) => (
  <div className="flex justify-between items-center text-sm">
    <p className="text-gray-500">{label}</p>

    {badgeColor ? (
      <span
        className={`px-2 py-0.5 rounded-md text-xs font-medium capitalize bg-${badgeColor}-100 text-${badgeColor}-700`}
      >
        {value}
      </span>
    ) : (
      <span className="text-gray-800 font-medium">{value}</span>
    )}
  </div>
);

/* ----------------------------------------------------------
   MAIN DASHBOARD
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
      "Ability to explain answers logically",
      "Confidence during HR & technical rounds",
      "Active listening and idea understanding",
      "Professional email and resume communication",
    ],
    "DSA / Problem Solving": [
      "Strong understanding of arrays, strings, linked lists",
      "Trees, graphs, recursion, and backtracking proficiency",
      "Efficient problem-solving approach",
      "Time and space complexity analysis",
      "Ability to solve medium-level coding problems",
    ],
    "Development Skills": [
      "Good project architecture and clean code",
      "Full-stack development exposure",
      "API design, authentication & authorization",
      "Debugging and version control skills (Git)",
      "Understanding of deployment & cloud basics",
    ],
    Projects: [
      "At least 2–3 well-structured, real-world projects",
      "Clean and active GitHub with meaningful contributions",
      "Live deployment or working demo",
      "Clear README with features, tech stack, and setup steps",
      "Projects that show problem-solving and ownership",
    ],
    "Aptitude & Core CS": [
      "Strong quantitative aptitude and logical thinking",
      "Basic OS, DBMS, and Computer Networks knowledge",
      "Understanding of SQL queries and joins",
      "Knowledge of OOP concepts and their practical use",
      "Useful for placement tests and technical interviews",
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
    <div className="w-full px-6 py-6">
      {/* -------------------------------------------------- */}
      {/* HEADER */}
      {/* -------------------------------------------------- */}
      <div className="flex flex-col items-center mb-6">
        <div className="flex items-center gap-4 justify-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[#00916E]">
            <FaGraduationCap className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900">
            Placement Preparation Insights
          </h1>
        </div>

        <p className="text-gray-500 text-base mt-2 text-center">
          Understand the key components to crack placements
        </p>
      </div>

      {/* -------------------------------------------------- */}
      {/* TWO MAIN BOXES */}
      {/* -------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* -------------------------------------------------- */}
        {/* LEFT BOX (BIGGER PIE + BIGGER BADGES + LESS SPACE) */}
        {/* -------------------------------------------------- */}
        <div className="bg-white shadow-md rounded-xl p-5 border border-gray-100">
          <h6 className="text-md font-bold text-gray-800 mb-3">
            Placement Components
          </h6>

          <div className="flex gap-4 items-start">
            {/* Bigger Pie Chart */}
            <div className="w-56 mt-6">
              <Pie
                data={placementComponentsData}
                options={{
                  plugins: { legend: { display: false } },
                  onHover: handleHover,
                }}
              />
            </div>

            {/* Bigger Badges */}
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {selectedComponent}
              </h2>

              <div className="flex flex-col gap-2">
                {placementDetails[selectedComponent].map((item, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 text-sm rounded-lg text-gray-800 border border-gray-300"
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
        {/* RIGHT BOX — MINIMAL + ARROW FLOW */}
        {/* -------------------------------------------------- */}

        <div className="bg-white shadow-sm rounded-xl p-5 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Latest Company Visit
          </h3>

          {loadingCompany && (
            <p className="text-gray-600 text-sm">
              Fetching upcoming company...
            </p>
          )}

          {!loadingCompany && error && (
            <p className="text-red-500 font-medium text-sm">{error}</p>
          )}

          {!loadingCompany && companyData && (
            <div className="space-y-4">
              {/* BASIC INFO */}
              <div className="space-y-2">
                <InfoRow label="Company" value={companyData.companyName} />
                <InfoRow
                  label="Visit"
                  value={companyData.visitDate}
                  badgeColor="green"
                />
                <InfoRow
                  label="Applied"
                  value={companyData.totalStudentsApplied}
                />
                <InfoRow
                  label="Type"
                  value={companyData.jobType}
                  badgeColor="blue"
                />
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

              {/* Hiring Process Flow */}
              <div className="mt-3">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Hiring Process
                </h4>

                <div className="flex items-center flex-wrap gap-2 text-xs">
                  {Object.entries(companyData.hiringProcess || {}).map(
                    ([round, status], index, arr) => (
                      <div key={index} className="flex items-center">
                        <span
                          className={`px-2 py-1 rounded-md border text-xs font-medium 
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
                          <span className="mx-1 text-gray-400">→</span>
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
