import { useState } from "react";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";

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

  // -------------------------------------------------------
  // ✅ Placement Q&A BANK (Multiple Answers + Random)
  // -------------------------------------------------------
  const qaPairs = [
    {
    question: ["hi", "hello", "hey", "how are you", "good morning", "good evening", "good afternoon", "whats up", "what's up"],
    answers: [
      "Hello! How can I assist you today?",
      "Hi there! Ready to talk about placements?",
      "Hey! What can I help you with?",
      "I'm doing great! How can I support your placement prep?",
      "Hello! Ask me anything about placements or career guidance.",
      "Hi! How's your day going?",
    ],
  },

  // ------------------------------------------------
  // Other Placement Q&A
  // ------------------------------------------------
  {
    question: ["how to prepare for placements", "placement preparation", "placement guide"],
    answers: [
      "Start with DSA, then OOPs, DBMS, OS & CN. Practice daily and revise concepts regularly.",
      "Focus on DSA first, then prepare your resume, projects, and practice mock interviews.",
      "Solve LeetCode daily, revise CS fundamentals, and build 2–3 strong projects.",
    ],
  },
  {
    question: ["resume tips", "resume help", "how to prepare resume"],
    answers: [
      "Keep your resume one page and add strong projects and internships.",
      "Avoid paragraphs—use bullet points and focus on achievements.",
      "Highlight skills, projects, accomplishments, and quantify your results.",
    ],
  },
  {
    question: ["best programming language", "which language", "language for placements"],
    answers: [
      "C++ and Java are best for DSA. Python is also a good beginner-friendly choice.",
      "Companies prefer strong logic, not language. Use whichever you’re comfortable with.",
      "For development roles: JavaScript + React or Python + Django are great choices.",
    ],
  },
  {
    question: ["projects for resume", "project ideas", "placement projects"],
    answers: [
      "Build an e-commerce app, chat app, or portfolio website.",
      "Try ML projects like spam detection, diabetes prediction, or recommendation system.",
      "A real-time chat app, attendance system, or admin panel dashboard works well.",
    ],
  },
  {
    question: ["how to crack interview", "interview tips", "crack placements"],
    answers: [
      "Explain your thought process clearly and stay confident.",
      "Practice mock interviews and revise past questions before the interview.",
      "Focus on clarity, communication, and correctness rather than speed.",
    ],
  },
  {
    question: ["hr questions", "hr interview", "hr round"],
    answers: [
      "Be honest, confident, and genuine. HR checks personality, not IQ.",
      "Prepare answers for strengths, weaknesses, goals, and achievements.",
      "Keep answers crisp, positive, and related to the job and company.",
    ],
  },

    {
      question: ["how to prepare for placements", "placement preparation", "placement guide"],
      answers: [
        "Start with DSA, then OOPs, DBMS, OS & CN. Practice daily and revise concepts regularly.",
        "Focus on DSA first, then prepare your resume, projects, and practice mock interviews.",
        "Solve LeetCode daily, revise CS fundamentals, and build 2–3 strong projects.",
      ],
    },
    {
      question: ["resume tips", "resume help", "how to prepare resume"],
      answers: [
        "Keep your resume one page and add strong projects and internships.",
        "Avoid paragraphs—use bullet points and focus on achievements.",
        "Highlight skills, projects, accomplishments, and quantify your results.",
      ],
    },
    {
      question: ["best programming language", "which language", "language for placements"],
      answers: [
        "C++ and Java are best for DSA. Python is also a good beginner-friendly choice.",
        "Companies prefer strong logic, not language. Use whichever you’re comfortable with.",
        "For development roles: JavaScript + React or Python + Django are great choices.",
      ],
    },
    {
      question: ["projects for resume", "project ideas", "placement projects"],
      answers: [
        "Build an e-commerce app, chat app, or portfolio website.",
        "Try ML projects like spam detection, diabetes prediction, or recommendation system.",
        "A real-time chat app, attendance system, or admin panel dashboard works well.",
      ],
    },
    {
      question: ["how to crack interview", "interview tips", "crack placements"],
      answers: [
        "Explain your thought process clearly and stay confident.",
        "Practice mock interviews and revise past questions before the interview.",
        "Focus on clarity, communication, and correctness rather than speed.",
      ],
    },
    {
      question: ["hr questions", "hr interview", "hr round"],
      answers: [
        "Be honest, confident, and genuine. HR checks personality, not IQ.",
        "Prepare answers for strengths, weaknesses, goals, and achievements.",
        "Keep answers crisp, positive, and related to the job and company.",
      ],
    },
  ];

  // -------------------------------------------------------
  // ✅ Function to match user input to a Q → Return Random Answer
  // -------------------------------------------------------
  const findAnswer = (userInput) => {
    userInput = userInput.toLowerCase();

    for (const pair of qaPairs) {
      for (const keyword of pair.question) {
        if (userInput.includes(keyword)) {
          const randomIndex = Math.floor(Math.random() * pair.answers.length);
          return pair.answers[randomIndex]; // return random answer
        }
      }
    }
    return null; // no match
  };

  // -------------------------------------------------------
  // SEND MESSAGE
  // -------------------------------------------------------
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newUserMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages([...messages, newUserMessage]);

    const answer = findAnswer(inputMessage);

    setInputMessage("");

    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: answer
          ? answer
          : "Sorry, I couldn't understand that. Try asking about: resume, DSA, interviews, HR, projects.",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botResponse]);
    }, 700);
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
                  <p className="text-sm">{message.text}</p>
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
          </div>

          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 h-10 rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
              />
              <button
                type="submit"
                className="w-10 h-10 bg-teal-600 hover:bg-teal-700 text-white rounded-lg flex items-center justify-center"
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
