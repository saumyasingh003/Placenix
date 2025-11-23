import { useState, useEffect } from "react";
import axios from "axios";

const RegisteredStudents = () => {
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const token = currentUser?.token;

        const res = await axios.get("http://localhost:5000/profile/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setStudents(res.data.data);
        }
      } catch (error) {
        console.log("Error loading profiles:", error);
      }
    };

    fetchProfiles();
  }, []);

  // Pagination Logic
  const lastIndex = currentPage * rowsPerPage;
  const firstIndex = lastIndex - rowsPerPage;
  const currentStudents = students.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(students.length / rowsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Proper Resume URL
  const formatResumeURL = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `http://localhost:5000${path}`;
  };

  return (
    <div className="space-y-6">
      
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Registered Students</h1>
        <p className="text-gray-600 mt-2">Complete student profile & academic information</p>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-300 rounded-xl shadow">
        <div className="overflow-x-auto rounded-xl">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 border-b">
              <tr>
                <Th>#</Th>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Contact</Th>
                <Th>Branch</Th>
                <Th>CGPA</Th>
                <Th>Backlogs</Th>
                <Th>LinkedIn</Th>
                <Th>GitHub</Th>
                <Th>LeetCode</Th>
                <Th>Resume</Th>
                <Th>Job Preference</Th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {currentStudents.length > 0 ? (
                currentStudents.map((s, index) => (
                  <tr key={s._id} className="hover:bg-gray-100 transition">
                    
                    {/* INDEX */}
                    <Td>{firstIndex + index + 1}</Td>

                    <Td className="capitalize">{s.name}</Td>
                    <Td>{s.email}</Td>
                    <Td>{s.contact || "N/A"}</Td>
                    <Td>{s.branch || "N/A"}</Td>
                    <Td>{s.cgpa || "N/A"}</Td>
                    <Td>{s.backlogs || 0}</Td>

                    <Td>
                      {s.linkedinLink ? (
                        <a href={s.linkedinLink} target="_blank" className="text-blue-600 underline">
                          Open
                        </a>
                      ) : "N/A"}
                    </Td>

                    <Td>
                      {s.githubLink ? (
                        <a href={s.githubLink} target="_blank" className="text-blue-600 underline">
                          GitHub
                        </a>
                      ) : "N/A"}
                    </Td>

                    <Td>
                      {s.leetcodeLink ? (
                        <a href={s.leetcodeLink} target="_blank" className="text-blue-600 underline">
                          LeetCode
                        </a>
                      ) : "N/A"}
                    </Td>

                    {/* RESUME */}
                    <Td>
                      {s.resume ? (
                        <a
                          href={formatResumeURL(s.resume)}
                          target="_blank"
                          className="text-blue-600 underline"
                        >
                          View
                        </a>
                      ) : "N/A"}
                    </Td>

                    {/* JOB PREFERENCE */}
                    <Td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          s.jobPreference === "tech"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {s.jobPreference === "tech" ? "Tech" : "Non-Tech"}
                      </span>
                    </Td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12" className="px-6 py-12 text-center text-gray-600">
                    No students registered yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-3 mt-4">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-gray-300 disabled:opacity-50"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => goToPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? "bg-gray-800 text-white"
                : "bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RegisteredStudents;

/* ---------------- Helper Components ---------------- */

const Th = ({ children }) => (
  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
    {children}
  </th>
);

const Td = ({ children }) => (
  <td className="px-6 py-4 text-sm text-gray-800">{children}</td>
);
