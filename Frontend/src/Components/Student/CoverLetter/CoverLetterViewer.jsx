// View Layer - Presentational Component for Viewing Cover Letter Content
import { FaTimes } from "react-icons/fa";

const CoverLetterViewer = ({ coverLetter, onClose }) => {
  if (!coverLetter) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999] p-4 animate-fadeIn">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl md:text-2xl font-bold break-words">
              {coverLetter.jobTitle}
            </h2>
            <p className="text-sm text-gray-500 break-words">
              {coverLetter.companyName}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 md:p-3 hover:bg-gray-100 rounded-full transition"
          >
            <FaTimes className="text-lg md:text-xl" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <div className="bg-white p-5 md:p-8 rounded-lg shadow-sm max-w-3xl mx-auto">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed text-sm md:text-base font-sans">
              {coverLetter.content || "No content available"}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-black text-white rounded-md hover:bg-gray-900 transition text-sm md:text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterViewer;
