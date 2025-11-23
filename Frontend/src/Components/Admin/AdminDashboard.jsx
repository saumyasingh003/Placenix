import { useEffect, useState } from "react";
import { FaBuilding } from "react-icons/fa";
import axios from "axios";

// Chart.js
import { Pie, Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement
);

const AdminDashboard = () => {
  const [jobStats, setJobStats] = useState({ tech: 0, nonTech: 0 });

  const [earliestCompany, setEarliestCompany] = useState({
    name: "-",
    date: "-",
    totalApplied: "-",
    jobType: "-"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch job preference stats (Tech / Non-Tech)
        const res = await axios.get("http://localhost:5000/profile/jobpreferencestats");

        if (res.data.success) {
          setJobStats({
            tech: res.data.tech.count,
            nonTech: res.data.nonTech.count,
          });
        }

        // Fetch earliest company visit
        const companyRes = await axios.get(
          "http://localhost:5000/company/earliest-admin",
          {
            headers: {
              Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("currentUser")).token
              }`,
            },
          }
        );

        if (companyRes.data.success) {
          setEarliestCompany({
            name: companyRes.data.data.companyName,
            date: companyRes.data.data.visitDate,
            totalApplied: companyRes.data.data.totalStudentsApplied,
            jobType: companyRes.data.data.jobType
          });
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      }
    };

    fetchData();
  }, []);

  // ---------- PIE CHART ----------
  const pieData = {
    labels: ["Tech", "Non-Tech"],
    datasets: [
      {
        data: [jobStats.tech, jobStats.nonTech],
        backgroundColor: ["#00916E", "#F4D03F"],
      },
    ],
  };

  const pieOptions = { plugins: { legend: { display: false } } };

  // ---------- LINE CHART ----------
  const lineData = {
    labels: ["2021", "2022", "2023", "2024", "2025"],
    datasets: [
      {
        label: "Placement %",
        data: [60, 55, 70, 88, null],
        borderColor: "#00916E",
        backgroundColor: "#00916E",
        tension: 0.4,
        pointRadius: 4,
      },
    ],
  };

  const lineOptions = { plugins: { legend: { display: false } } };

  // ---------- BAR CHART ----------
  const barData = {
    labels: ["2020", "2021", "2022", "2023", "2024"],
    datasets: [
      {
        label: "Average Package (LPA)",
        data: [16, 18, 15, 12, 20],
        backgroundColor: "#00916E",
        borderRadius: 6,
      },
    ],
  };

  const barOptions = { plugins: { legend: { display: false } } };

  // ---------- STAT CARD ----------
  const StatCard = ({ icon: Icon, title, value }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-4">
        
        {/* Icon Circle */}
        <div className="p-3 rounded-full bg-gradient-to-r from-green-500 to-green-600 shadow-md">
          <Icon className="w-6 h-6 text-white" />
        </div>

        {/* Text Section */}
        <div className="flex flex-col">
          <p className="text-gray-500 text-sm">{title}</p>

          <p className="text-gray-800 text-base whitespace-pre-line mt-1 leading-relaxed">
            {value}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* ---------- ROW 1: 3 CHARTS ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">

        {/* PIE */}
        <div className="w-full h-56 bg-white rounded-lg shadow flex flex-col items-center justify-center p-2">
          <div className="w-40 h-40">
            <Pie data={pieData} options={pieOptions} />
          </div>
          <p className="mt-2 text-xs text-gray-600">
            Tech: {jobStats.tech} | Non-Tech: {jobStats.nonTech}
          </p>
        </div>

        {/* BAR */}
        <div className="w-full h-56 bg-white rounded-lg shadow flex flex-col items-center justify-center p-2">
          <div className="w-80 h-80">
            <Bar data={barData} options={barOptions} />
          </div>
          <p className="mt-2 text-xs text-gray-600">Average Package Trend</p>
        </div>

        {/* LINE */}
        <div className="w-full h-56 bg-white rounded-lg shadow flex flex-col items-center justify-center p-2">
          <div className="w-80 h-80">
            <Line data={lineData} options={lineOptions} />
          </div>
          <p className="mt-2 text-xs text-gray-600">Placement Trend</p>
        </div>

      </div>

      {/* ---------- ROW 2: COMPANY DETAILS ---------- */}
   <StatCard
  icon={FaBuilding}
  title={`Earliest Company: ${earliestCompany.name}`}
  value={
    <div className="flex items-center justify-between w-full text-gray-800 gap-10">
      <span>Visiting On: {earliestCompany.date}</span>
      <span>Students Applied: {earliestCompany.totalApplied}</span>
      <span>Job Type: {earliestCompany.jobType}</span>
    </div>
  }
/>




    </div>
  );
};

export default AdminDashboard;
