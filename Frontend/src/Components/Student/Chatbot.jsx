import { useState } from "react";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your PlaceNix assistant. Ask me anything about placements!",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Added loading state

  // -------------------------------------------------------
  // SEND MESSAGE TO BACKEND
  // -------------------------------------------------------
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // 1. Add User Message
    const newUserMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // 2. Call the FastAPI Backend
      const response = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: newUserMessage.text }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();

      // 3. Add Bot Response
      const botResponse = {
        id: messages.length + 2,
        text: data.reply, // Uses the actual AI reply from backend
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botResponse]);

    } catch (error) {
      // Error Handling
      const errorResponse = {
        id: messages.length + 2,
        text: "Sorry, I'm having trouble connecting to the server right now.",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorResponse]);
      console.error("Chat Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-teal-600 text-white rounded-full shadow-xl hover:bg-teal-700 flex items-center justify-center transition-all duration-300 z-50"
        >
          <FaRobot className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-teal-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <FaRobot className="w-5 h-5 text-white" />
              </span>
              <div>
                <h3 className="font-semibold text-white">PlaceNix Assistant</h3>
                <p className="text-xs text-white/80">Online</p>
              </div>
            </div>

            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-full">
              <FaTimes className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] rounded-xl p-3 shadow-sm ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-teal-500 to-sky-500 text-white"
                      : "bg-white border border-gray-200"
                  }`}
                >
                 <div className={`text-sm ${message.sender === 'user' ? 'text-white' : 'markdown-body'}`}>
                    <ReactMarkdown
                       components={{
                        // Custom styling for specific markdown elements
                        ul: ({node, ...props}) => <ul className="list-disc ml-4 space-y-1" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal ml-4 space-y-1" {...props} />,
                        li: ({node, ...props}) => <li className="mb-1" {...props} />,
                        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                        a: ({node, ...props}) => <a className="text-blue-500 underline" target="_blank" {...props} />
                      }}
                    >
                      {message.text}
                    </ReactMarkdown>
                  </div>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === "user" ? "text-white/80" : "text-gray-500"
                    }`}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 h-10 rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading}
                className={`w-10 h-10 bg-teal-600 text-white rounded-lg flex items-center justify-center ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-teal-700'}`}
              >
                <FaPaperPlane className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;