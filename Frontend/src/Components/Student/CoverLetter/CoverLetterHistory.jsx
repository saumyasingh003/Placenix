// View Layer - Presentational Component for Cover Letter History
import { FaTrash, FaEye } from "react-icons/fa";

const CoverLetterHistory = ({ history, onView, onDelete, isLoading }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="col-span-1 w-full">
      <div className="bg-white border p-5 rounded-lg shadow-sm h-full flex flex-col">

        {/* Title */}
        <h2 className="text-xl font-semibold mb-4">Past Cover Letters</h2>

        {/* Loading */}
        {isLoading ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : history.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No cover letters generated yet.
          </p>
        ) : (
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1 md:pr-2 custom-scroll">

            {history.map((item) => (
              <div
                key={item._id}
                className="p-4 border rounded-md bg-gray-50 hover:bg-gray-100 transition cursor-pointer animate-fadeIn"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="font-medium text-lg break-words">
                      {item.jobTitle}
                    </h3>

                    <p className="text-xs text-gray-500">{item.companyName}</p>

                    <p className="text-xs text-gray-500 mb-2">
                      {formatDate(item.createdAt)}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 mt-3 sm:mt-0 sm:ml-3">
                    {item.content && (
                      <button
                        onClick={() => onView(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition"
                        title="View cover letter"
                      >
                        <FaEye />
                      </button>
                    )}

                    <button
                      onClick={() => onDelete(item._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition"
                      title="Delete cover letter"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                {/* Job Description Preview */}
                <p className="text-sm text-gray-700 mt-2 line-clamp-3">
                  {item.jobDescription || "No job description available"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoverLetterHistory;
