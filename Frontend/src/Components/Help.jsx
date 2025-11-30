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
    <div className="max-w-5xl mx-auto space-y-10 p-4 md:p-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-[#00916E]">
          Help & Support
        </h1>
        <p className="text-gray-600 mt-1 text-sm md:text-base">
          We're here to assist you anytime.
        </p>
      </div>

      {/* CONTACT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

        {/* EMAIL */}
        <InfoCard
          bg="#EE6123"
          icon={<FaEnvelope className="text-white text-2xl" />}
          title="Email Us"
          text="placement@amity.edu"
        />

        {/* PHONE */}
        <InfoCard
          bg="#FFCF00"
          icon={<FaPhone className="text-black text-2xl" />}
          title="Call Us"
          text="+91 120 4392000"
          darkText
        />

        {/* OFFICE HOURS */}
        <InfoCard
          bg="#FA003F"
          icon={<FaQuestionCircle className="text-white text-2xl" />}
          title="Office Hours"
          text="Mon–Fri: 9 AM – 5 PM"
        />

      </div>

      {/* CONTACT FORM */}
      <div className="bg-white border rounded-xl shadow p-6">

        <h2 className="text-2xl font-semibold text-[#00916E] mb-4">
          Send us a Message
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* NAME */}
            <Field
              label="Your Name *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            {/* EMAIL */}
            <Field
              label="Your Email *"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* SUBJECT */}
          <Field
            label="Subject *"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />

          {/* MESSAGE */}
          <div>
            <label className="text-sm font-medium text-gray-700">Message *</label>
            <textarea
              name="message"
              rows="5"
              required
              value={formData.message}
              onChange={handleChange}
              className="w-full mt-1 rounded-md border px-3 py-2 focus:ring-2 
              focus:ring-[#00916E] outline-none transition bg-gray-50"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-[#00916E] hover:bg-[#007b5d] 
              text-white px-6 py-2 rounded-lg shadow-md transition font-medium"
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

        <div className="space-y-6">

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

/* INFO CARD COMPONENT */
const InfoCard = ({ bg, icon, title, text, darkText }) => (
  <div
    className="rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-all duration-300"
    style={{ backgroundColor: bg }}
  >
    <div className="w-14 h-14 bg-white/25 rounded-full flex items-center justify-center mx-auto mb-3">
      {icon}
    </div>
    <h3 className={`text-xl font-semibold ${darkText ? "text-black" : "text-white"}`}>
      {title}
    </h3>
    <p
      className={`mt-1 ${darkText ? "text-black/80" : "text-white/90"} break-words`}
    >
      {text}
    </p>
  </div>
);

/* REUSABLE FIELD COMPONENT */
const Field = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      {...props}
      className="w-full mt-1 rounded-md border px-3 py-2 focus:ring-2 
      focus:ring-[#00916E] outline-none transition bg-gray-50"
    />
  </div>
);

/* FAQ ITEM */
const FAQItem = ({ q, a }) => (
  <div className="border-l-4 pl-4" style={{ borderColor: "#FFCF00" }}>
    <h3 className="font-semibold text-[#00916E]">{q}</h3>
    <p className="text-gray-600 mt-1">{a}</p>
  </div>
);

export default Help;
