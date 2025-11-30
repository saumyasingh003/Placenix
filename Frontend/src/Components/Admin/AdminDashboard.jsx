import { useEffect, useState } from "react";
import { FaBuilding } from "react-icons/fa";
import axios from "axios";

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
        const res = await axios.get(
          "http://localhost:5000/profile/jobpreferencestats"
        );

        if (res.data.success) {
          setJobStats({
            tech: res.data.tech.count,
            nonTech: res.data.nonTech.count,
          });
        }

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
            jobType: companyRes.data.data.jobType,
          });
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      }
    };

    fetchData();
  }, []);

  // PIE CHART
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

  // LINE CHART
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

  // BAR CHART
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

  // STAT CARD
  const StatCard = ({ icon: Icon, title, value }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">

      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-3">
        
        <div className="p-3 rounded-full bg-gradient-to-r from-green-500 to-green-600 shadow-md self-start sm:self-auto">
          <Icon className="w-6 h-6 text-white" />
        </div>

        <div className="flex-1">
          <p className="text-gray-500 text-sm">{title}</p>
          <div className="mt-1 text-gray-800 text-sm sm:text-base">{value}</div>
        </div>

      </div>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* PIE */}
        <div className="w-full bg-white rounded-lg shadow p-3 flex flex-col items-center">
          <div className="w-32 h-32 sm:w-40 sm:h-40">
            <Pie data={pieData} options={pieOptions} />
          </div>
          <p className="mt-3 text-xs sm:text-sm text-gray-600">
            Tech: {jobStats.tech} | Non-Tech: {jobStats.nonTech}
          </p>
        </div>

        {/* BAR */}
        <div className="w-full bg-white rounded-lg shadow p-3 flex flex-col items-center">
          <div className="w-full max-w-xs sm:max-w-sm h-40 sm:h-48">
            <Bar data={barData} options={barOptions} />
          </div>
          <p className="mt-3 text-xs sm:text-sm text-gray-600">
            Average Package Trend
          </p>
        </div>

        {/* LINE */}
        <div className="w-full bg-white rounded-lg shadow p-3 flex flex-col items-center">
          <div className="w-full max-w-xs sm:max-w-sm h-40 sm:h-48">
            <Line data={lineData} options={lineOptions} />
          </div>
          <p className="mt-3 text-xs sm:text-sm text-gray-600">
            Placement Trend
          </p>
        </div>

      </div>

      {/* COMPANY DETAILS CARD */}
      <StatCard
        icon={FaBuilding}
        title={`Earliest Company: ${earliestCompany.name}`}
        value={
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-2">
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
