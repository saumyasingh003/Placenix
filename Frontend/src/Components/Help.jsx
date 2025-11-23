import { useState } from "react";
import { toast } from "sonner";
import {
  FaEnvelope,
  FaPhone,
  FaQuestionCircle,
  FaPaperPlane,
} from "react-icons/fa";

const Help = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const helpRequests = JSON.parse(localStorage.getItem("helpRequests") || "[]");

    helpRequests.push({
      ...formData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: "pending",
    });

    localStorage.setItem("helpRequests", JSON.stringify(helpRequests));

    toast.success("Your query has been submitted!");

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4">

      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold text-[#00916E]">Help & Support</h1>
        <p className="text-gray-600 mt-1">We're here to assist you anytime.</p>
      </div>

      {/* CONTACT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* EMAIL */}
        <div
          className="rounded-xl p-6 text-center shadow-lg border hover:shadow-2xl transition-all"
          style={{ backgroundColor: "#EE6123" }}
        >
          <div className="w-14 h-14 bg-white/25 rounded-full flex items-center justify-center mx-auto mb-3">
            <FaEnvelope className="text-white text-2xl" />
          </div>
          <h3 className="text-xl font-semibold text-white">Email Us</h3>
          <p className="text-white/90 mt-1">placement@amity.edu</p>
        </div>

        {/* PHONE */}
        <div
          className="rounded-xl p-6 text-center shadow-lg border hover:shadow-2xl transition-all"
          style={{ backgroundColor: "#FFCF00" }}
        >
          <div className="w-14 h-14 bg-black/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <FaPhone className="text-black text-2xl" />
          </div>
          <h3 className="text-xl font-semibold text-black">Call Us</h3>
          <p className="text-black/80 mt-1">+91 120 4392000</p>
        </div>

        {/* OFFICE HOURS */}
        <div
          className="rounded-xl p-6 text-center shadow-lg border hover:shadow-2xl transition-all"
          style={{ backgroundColor: "#FA003F" }}
        >
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <FaQuestionCircle className="text-white text-2xl" />
          </div>
          <h3 className="text-xl font-semibold text-white">Office Hours</h3>
          <p className="text-white/90 mt-1">Mon–Fri: 9 AM – 5 PM</p>
        </div>

      </div>

      {/* CONTACT FORM */}
      <div className="bg-white border rounded-xl shadow p-6">

        <h2 className="text-2xl font-semibold text-[#00916E] mb-4">
          Send us a Message
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* NAME */}
            <div>
              <label className="text-sm font-medium text-gray-700">Your Name *</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full mt-1 rounded-md border px-3 py-2 focus:ring-2 focus:ring-[#00916E]"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium text-gray-700">Your Email *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full mt-1 rounded-md border px-3 py-2 focus:ring-2 focus:ring-[#00916E]"
              />
            </div>
          </div>

          {/* SUBJECT */}
          <div>
            <label className="text-sm font-medium text-gray-700">Subject *</label>
            <input
              name="subject"
              required
              value={formData.subject}
              onChange={handleChange}
              className="w-full mt-1 rounded-md border px-3 py-2 focus:ring-2 focus:ring-[#00916E]"
            />
          </div>

          {/* MESSAGE */}
          <div>
            <label className="text-sm font-medium text-gray-700">Message *</label>
            <textarea
              name="message"
              rows="5"
              required
              value={formData.message}
              onChange={handleChange}
              className="w-full mt-1 rounded-md border px-3 py-2 focus:ring-2 focus:ring-[#00916E]"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-[#00916E] hover:bg-[#007b5d] text-white px-6 py-2 rounded-lg shadow-md transition-all"
            >
              <FaPaperPlane /> Submit Query
            </button>
          </div>
        </form>
      </div>

      {/* FAQ SECTION */}
      <div className="bg-white border rounded-xl shadow p-6">

        <h2 className="text-2xl font-semibold text-[#00916E] mb-4">
          Frequently Asked Questions
        </h2>

        <div className="space-y-5">

          <FAQItem
            q="How do I register for a placement drive?"
            a="Check the Updates section regularly for new placement opportunities and follow the instructions provided."
          />

          <FAQItem
            q="How can I update my profile?"
            a="Go to the Profile section from the sidebar and edit your academic & personal details."
          />

          <FAQItem
            q="Where can I check my application history?"
            a="Visit the History section to view all your submitted applications."
          />

        </div>
      </div>
    </div>
  );
};

/* FAQ ITEM COMPONENT */
const FAQItem = ({ q, a }) => (
  <div className="border-l-4 pl-4" style={{ borderColor: "#FFCF00" }}>
    <h3 className="font-semibold text-[#00916E]">{q}</h3>
    <p className="text-gray-600 mt-1">{a}</p>
  </div>
);

export default Help;
