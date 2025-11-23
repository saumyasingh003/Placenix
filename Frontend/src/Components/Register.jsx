import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { toast } from "sonner";
import { cn } from "../utils";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: ""
  });

  const validateForm = () => {
    const newErrors = { name: "", email: "", password: "" };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
      isValid = false;
    } else if (!formData.email.endsWith("@amity.edu")) {
      newErrors.email = "Use your official Amity email (@amity.edu)";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be 6+ characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all fields correctly");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/auth/register", formData);

      toast.success(res.data.message || "Registration successful!");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#00916E] p-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row max-w-4xl w-full animate-scale-in">

        {/* LEFT ILLUSTRATION */}
        <div className="lg:w-1/2 w-full flex items-center justify-center p-6 ">
          <img
            src="/students.avif"
            alt="Students"
            className="w-80 h-auto rounded-xl shadow-lg border-4 border-[#FFCF00]"
          />
        </div>

        {/* RIGHT FORM */}
        <div className="lg:w-1/2 w-full p-8">
          <div className="text-center mb-6">
            <div
              className="mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-3 shadow-md"
              style={{
                background: "linear-gradient(135deg, #00916E, #FFCF00, #EE6123)",
              }}
            >
              <FaGraduationCap className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-3xl font-bold text-gray-800">Create Your Account</h2>
            <p className="text-gray-500 text-sm mt-1">Sign up to get started</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">

            {/* NAME */}
            <div>
              <label className="text-sm font-semibold text-gray-700">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={cn(
                  "w-full h-11 px-4 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-[#00916E]",
                  errors.name ? "border-red-500" : "border-gray-300"
                )}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-semibold text-gray-700">Email ID</label>
              <input
                type="email"
                placeholder="your.email@amity.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={cn(
                  "w-full h-11 px-4 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-[#00916E]",
                  errors.email ? "border-red-500" : "border-gray-300"
                )}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <label className="text-sm font-semibold text-gray-700">Password</label>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={cn(
                  "w-full h-11 px-4 pr-10 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-[#00916E]",
                  errors.password ? "border-red-500" : "border-gray-300"
                )}
              />

              <span
                className="absolute right-3 top-9 transform -translate-y-1/2 cursor-pointer mt-3 mr-2 text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>

              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            {/* REGISTER BUTTON */}
            <button
              type="submit"
              className="w-full h-11 bg-[#EE6123] text-white rounded-xl shadow-md hover:bg-[#d5531d] hover:shadow-lg transition-transform active:scale-95"
            >
              Register
            </button>

            {/* LOGIN LINK */}
            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-[#EE6123] font-semibold hover:underline">
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
