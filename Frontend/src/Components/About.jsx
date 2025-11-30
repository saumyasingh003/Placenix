import {
  FaGraduationCap,
  FaBriefcase,
  FaUsers,
  FaTrophy,
} from "react-icons/fa";

const About = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-10 p-4 md:p-6">

      {/* HEADER */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-[#00916E]">
          About Us
        </h1>
        <p className="text-gray-600 mt-2 text-sm md:text-base">
          Learn about Amity University and our Placement Cell
        </p>
      </div>

      {/* MAIN CONTENT CARD */}
      <div className="rounded-xl border bg-white shadow p-6 md:p-8 space-y-10">

        {/* SECTION REUSABLE */}
        <AboutSection
          icon={<FaGraduationCap className="w-7 h-7 text-black" />}
          bg="#FFCF00"
          title="Amity University"
          text="Amity University is one of India's leading education groups with a strong
          commitment to excellence in education, innovation, and research.
          With top-tier faculty and global-standard infrastructure,
          we prepare students for future-ready careers."
        />

        <AboutSection
          icon={<FaBriefcase className="w-7 h-7 text-white" />}
          bg="#00916E"
          title="Placement Cell"
          text="Our Placement Cell works throughout the year to connect students with 
          industry leaders. We facilitate internships, training programs, 
          workshops, and recruitment opportunities across top organizations."
        />

        <AboutSection
          icon={<FaUsers className="w-7 h-7 text-white" />}
          bg="#FA003F"
          title="Our Mission"
          text="Our mission is to equip students with the necessary skills,
          professional exposure, and confidence to succeed in competitive 
          industries. We strive to create impactful industry-academic 
          collaborations for maximum placement success."
        />

        <AboutSection
          icon={<FaTrophy className="w-7 h-7 text-black" />}
          bg="#FFCF00"
          title="Our Achievements"
          text="With collaborations with 500+ recruiters including Fortune 500 companies,
          our students have been placed in top roles in IT, Finance, Consulting,
          Design, and various other sectors — securing competitive packages 
          across industries."
        />
      </div>

      {/* CONTACT CARD */}
      <div className="rounded-xl border bg-white shadow p-6 md:p-8 animate-fadeIn">
        <h2 className="text-2xl font-semibold text-[#00916E] mb-4">
          Contact Information
        </h2>

        <div className="space-y-2 text-gray-700 text-sm md:text-base">
          <p>
            <strong className="text-black">Email:</strong> placement@amity.edu
          </p>
          <p>
            <strong className="text-black">Phone:</strong> +91 120 4392000
          </p>
          <p>
            <strong className="text-black">Address:</strong>{" "}
            Amity University, Patna, Bihar
          </p>
        </div>
      </div>
    </div>
  );
};

/* REUSABLE SECTION COMPONENT */
const AboutSection = ({ icon, bg, title, text }) => (
  <div className="flex flex-col md:flex-row items-start gap-5 animate-fadeInHover">

    {/* ICON BOX */}
    <div
      className="w-16 h-16 rounded-xl flex items-center justify-center shadow-md flex-shrink-0"
      style={{ backgroundColor: bg }}
    >
      {icon}
    </div>

    {/* TEXT */}
    <div>
      <h2 className="text-xl md:text-2xl font-semibold text-[#00916E]">
        {title}
      </h2>
      <p className="text-gray-700 mt-1 leading-relaxed text-sm md:text-base">
        {text}
      </p>
    </div>
  </div>
);

export default About;
