import { useState, useEffect } from "react";
import { FaHistory } from "react-icons/fa";

const Update = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const storedApplications = JSON.parse(localStorage.getItem("applications") || "[]");
    setApplications(storedApplications);
  }, []);

  // Status Styling with your theme colors
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-[#FFCF00] text-black"; // Yellow
      case "Shortlisted":
        return "bg-[#00916E] text-white"; // Green
      case "Completed":
        return "bg-[#00916E] text-white"; // Green
      case "Rejected":
        return "bg-[#FA003F] text-white"; // Red
      default:
        return "bg-gray-600 text-white";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4">

      {/* HEADER */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-md"
             style={{ backgroundColor: "#00916E" }}>
          <FaHistory className="w-7 h-7 text-white" />
        </div>

        <div>
          <h1 className="text-4xl font-bold text-[#00916E]">Updates</h1>
          <p className="text-gray-600">Your placement activity updates</p>
        </div>
      </div>

      {/* CARD */}
      <div className="rounded-xl border bg-white shadow">

        {/* CARD HEADER */}
        <div className="p-6 border-b">
          <h3 className="text-2xl font-semibold text-[#00916E]">Recent Activity</h3>
          <p className="text-gray-600 text-sm">Track your applications and participation</p>
        </div>

        <div className="p-6">

          {/* IF DATA EXISTS */}
          {applications.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-separate border-spacing-y-2">

                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="py-2 px-4">Company</th>
                    <th className="py-2 px-4">Applied Date</th>
                    <th className="py-2 px-4">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {applications.map((application) => (
                    <tr
                      key={application.id}
                      className="bg-gray-50 hover:bg-gray-100 transition rounded-xl shadow-sm"
                    >
                      <td className="px-4 py-3 font-semibold text-gray-800">
                        {application.companyName}
                      </td>

                      <td className="px-4 py-3 text-gray-700">
                        {new Date(application.appliedAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${getStatusColor(
                            application.status
                          )}`}
                        >
                          {application.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          ) : (
            // EMPTY STATE
            <div className="text-center py-12 text-gray-500">
              <p>No applications yet</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Update;
