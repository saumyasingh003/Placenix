import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaGraduationCap,
  FaChevronDown,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { toast } from "sonner";
import axios from "axios";
import { cn } from "../utils";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "student",
  });

  const [errors, setErrors] = useState({ email: "", password: "" });
  const [selectOpen, setSelectOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const ADMIN_EMAIL = "admin@amity.edu";

  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    if (!formData.email.trim()) {
      newErrors.email = "Email or College ID is required";
      isValid = false;
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleEmailChange = (value) => {
    setFormData({
      ...formData,
      email: value,
      role:
        value.trim().toLowerCase() === ADMIN_EMAIL
          ? "admin"
          : formData.role,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/auth/login`, {
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      const user = response.data.user;
      localStorage.setItem("currentUser", JSON.stringify(user));

      toast.success("Login successful!");
      user.role === "admin" ? navigate("/admin") : navigate("/home");

    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#00916E] p-4 sm:p-6 md:p-10">

      {/* CARD */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row max-w-4xl w-full">

        {/* LEFT IMAGE SECTION */}
        <div className="lg:w-1/2 w-full flex items-center justify-center p-4 sm:p-6 md:p-8 bg-white">
          <img
            src="/students.avif"
            alt="Students"
            className="w-52 sm:w-64 md:w-72 lg:w-80 h-auto rounded-xl shadow-lg border-4 border-[#FFCF00] object-cover"
          />
        </div>

        {/* RIGHT FORM AREA */}
        <div className="lg:w-1/2 w-full p-5 sm:p-8 md:p-10">

          {/* LOGO */}
          <div className="text-center mb-6 sm:mb-8">
            <div
              className="mx-auto w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-3 shadow-md"
              style={{
                background:
                  "linear-gradient(135deg, #00916E, #FFCF00, #EE6123)",
              }}
            >
              <FaGraduationCap className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
              Welcome Back
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">
              Login to access your dashboard
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">

            {/* EMAIL */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Email / College ID
              </label>

              <input
                type="email"
                placeholder="your.email@college.edu"
                value={formData.email}
                onChange={(e) => handleEmailChange(e.target.value)}
                className={cn(
                  "w-full h-10 sm:h-11 px-3 sm:px-4 text-sm rounded-xl border bg-gray-50 focus:ring-2 focus:ring-[#00916E] outline-none transition",
                  errors.email ? "border-red-500" : "border-gray-300"
                )}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <label className="text-sm font-semibold text-gray-700">
                Password
              </label>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className={cn(
                  "w-full h-10 sm:h-11 px-3 sm:px-4 pr-10 text-sm rounded-xl border bg-gray-50 focus:ring-2 focus:ring-[#00916E] outline-none transition",
                  errors.password ? "border-red-500" : "border-gray-300"
                )}
              />

              {/* Eye Icon */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-gray-600 hover:text-gray-800"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>

              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* ROLE DROPDOWN */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Role
              </label>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSelectOpen(!selectOpen)}
                  className="w-full h-10 sm:h-11 px-4 text-sm rounded-xl border bg-gray-50 flex items-center justify-between shadow-sm"
                >
                  {formData.role}
                  <FaChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {selectOpen && (
                  <div className="absolute w-full bg-white mt-1 border rounded-lg shadow-md z-50">
                    <Option
                      label="Student"
                      onClick={() => {
                        setFormData({ ...formData, role: "student" });
                        setSelectOpen(false);
                      }}
                    />
                    <Option
                      label="Admin"
                      onClick={() => {
                        setFormData({ ...formData, role: "admin" });
                        setSelectOpen(false);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full h-10 sm:h-11 bg-[#EE6123] text-white text-sm sm:text-base rounded-xl shadow-md hover:bg-[#d5531d] active:scale-95 transition"
            >
              Login
            </button>

            {/* REGISTER LINK */}
            <p className="text-center text-xs sm:text-sm text-gray-500">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-[#EE6123] font-semibold hover:underline"
              >
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

/* DROPDOWN OPTION */
const Option = ({ label, onClick }) => (
  <div
    className="px-4 py-2 cursor-pointer hover:bg-[#FFCF00]/30 text-sm transition"
    onClick={onClick}
  >
    {label}
  </div>
);

export default Login;
