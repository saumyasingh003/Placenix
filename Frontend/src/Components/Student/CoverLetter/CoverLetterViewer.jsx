// View Layer - Presentational Component for Viewing Cover Letter Content
import { FaTimes } from "react-icons/fa";

const CoverLetterViewer = ({ coverLetter, onClose }) => {
  if (!coverLetter) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-2xl font-bold">{coverLetter.jobTitle}</h2>
            <p className="text-sm text-gray-500">{coverLetter.companyName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="bg-white p-8 rounded-lg shadow-sm max-w-3xl mx-auto">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed font-sans">
              {coverLetter.content || "No content available"}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterViewer;

