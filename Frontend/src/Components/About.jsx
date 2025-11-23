import { FaGraduationCap, FaBriefcase, FaUsers, FaTrophy } from "react-icons/fa";

const About = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-10 p-4">

      {/* HEADER */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#00916E]">About Us</h1>
        <p className="text-gray-600 mt-2">
          Learn about Amity University and our Placement Cell
        </p>
      </div>

      {/* MAIN CONTENT CARD */}
      <div className="rounded-xl border bg-white shadow p-8 space-y-8">

        {/* SECTION 1 */}
        <div className="flex items-start gap-5">
          <div className="w-26 h-14 rounded-lg flex items-center justify-center shadow-md"
            style={{ backgroundColor: "#FFCF00" }}>
            <FaGraduationCap className="w-7 h-7 text-black" />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-[#00916E]">
              Amity University
            </h2>
            <p className="text-gray-700 mt-1 leading-relaxed">
              Amity University is one of India's leading education groups with a strong
              commitment to excellence in education, innovation, and research.
              With top-tier faculty and global-standard infrastructure,
              we prepare students for future-ready careers.
            </p>
          </div>
        </div>

        {/* SECTION 2 */}
        <div className="flex items-start gap-5">
          <div className="w-26 h-14 rounded-lg flex items-center justify-center shadow-md"
            style={{ backgroundColor: "#00916E" }}>
            <FaBriefcase className="w-7 h-7 text-white" />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-[#00916E]">
              Placement Cell
            </h2>
            <p className="text-gray-700 mt-1 leading-relaxed">
              Our Placement Cell works throughout the year to connect students with 
              industry leaders. We facilitate internships, training programs, 
              workshops, and recruitment opportunities across top organizations.
            </p>
          </div>
        </div>

        {/* SECTION 3 */}
        <div className="flex items-start gap-5">
          <div className="w-26 h-14 rounded-lg flex items-center justify-center shadow-md"
            style={{ backgroundColor: "#FA003F" }}>
            <FaUsers className="w-7 h-7 text-white" />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-[#00916E]">
              Our Mission
            </h2>
            <p className="text-gray-700 mt-1 leading-relaxed">
              Our mission is to equip students with the necessary skills,
              professional exposure, and confidence to succeed in 
              competitive industries. We strive to create impactful 
              industry-academic collaborations for maximum placement success.
            </p>
          </div>
        </div>

        {/* SECTION 4 */}
        <div className="flex items-start gap-5">
          <div className="w-26 h-14 rounded-lg flex items-center justify-center shadow-md"
            style={{ backgroundColor: "#FFCF00" }}>
            <FaTrophy className="w-7 h-7 text-black" />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-[#00916E]">
              Our Achievements
            </h2>
            <p className="text-gray-700 mt-1 leading-relaxed">
              With collaborations with 500+ recruiters including Fortune 500 companies,
              our students have been placed in top roles in IT, Finance, Consulting,
              Design, and various other sectors — securing competitive packages 
              across industries.
            </p>
          </div>
        </div>
      </div>

      {/* CONTACT CARD */}
      <div className="rounded-xl border bg-white shadow p-6">
        <h2 className="text-2xl font-semibold text-[#00916E] mb-4">
          Contact Information
        </h2>

        <div className="space-y-2 text-gray-700">
          <p>
            <strong className="text-black">Email:</strong> placement@amity.edu
          </p>
          <p>
            <strong className="text-black">Phone:</strong> +91 120 4392000
          </p>
          <p>
            <strong className="text-black">Address:</strong> Amity University, Patna, Bihar
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
