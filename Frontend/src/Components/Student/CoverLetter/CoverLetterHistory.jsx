// View Layer - Presentational Component for Cover Letter History
import { FaTrash, FaEye } from "react-icons/fa";

const CoverLetterHistory = ({ 
  history, 
  onView, 
  onDelete, 
  isLoading 
}) => {
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
    <div className="col-span-1">
      <div className="bg-white border p-5 rounded-lg shadow-sm h-full">
        <h2 className="text-xl font-semibold mb-4">Past Cover Letters</h2>

        {isLoading ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : history.length === 0 ? (
          <p className="text-gray-500 text-sm">No cover letters generated yet.</p>
        ) : (
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {history.map((item) => (
              <div
                key={item._id}
                className="p-4 border rounded-md bg-gray-50 hover:bg-gray-100 transition"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{item.jobTitle}</h3>
                    <p className="text-xs text-gray-500 mb-1">
                      {item.companyName}
                    </p>
                    <p className="text-xs text-gray-500 mb-2">
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-2">
                    {item.content && (
                      <button
                        onClick={() => onView(item)}
                        className="p-1 text-blue-600 hover:text-blue-800 transition"
                        title="View cover letter"
                      >
                        <FaEye />
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(item._id)}
                      className="p-1 text-red-600 hover:text-red-800 transition"
                      title="Delete cover letter"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-700 line-clamp-3">
                  {item.jobDescription}
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


