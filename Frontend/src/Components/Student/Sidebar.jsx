import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaBell,
  FaHistory,
  FaBars,
  FaTimes,
  FaBriefcase,
  FaChevronDown,
  FaChevronRight,
  FaInfoCircle,
  FaQuestionCircle
} from "react-icons/fa";
import { cn } from "../../utils";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(true);
  const location = useLocation();

  const navItems = [
    { icon: FaHome, label: "Home", path: "/home" },
    { icon: FaUser, label: "Profile", path: "/home/profile" }
  ];

  const bottomNavItems = [
    { icon: FaBell, label: "Applications", path: "/home/applications" },
    { icon: FaHistory, label: "Updates", path: "/home/update" },
    { icon: FaQuestionCircle, label: "Help", path: "/home/help" },
    { icon: FaInfoCircle, label: "About", path: "/home/about" }
  ];

  const portfolioItems = [
    { label: "Cover Letter", path: "/home/portfolio/cover-letter" },
    { label: "Create Resume", path: "/home/portfolio/resume" }
  ];

  return (
    <>
      {/* MOBILE TOGGLE BUTTON */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="fixed top-20 left-4 z-40 md:hidden h-10 w-10 flex items-center justify-center rounded-lg bg-white text-black shadow"
      >
        {isCollapsed ? <FaBars /> : <FaTimes />}
      </button>

      {/* SIDEBAR */}
      <aside
        className={cn(
          "fixed md:sticky top-16 left-0 h-[calc(100vh-4rem)] text-white border-r transition-all duration-300 ease-in-out z-30",
          isCollapsed ? "w-0 md:w-16" : "w-64"
        )}
        style={{ backgroundColor: "#00916E" }}
      >
        <div className="flex flex-col h-full p-3">

          {/* DESKTOP COLLAPSE BUTTON */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex ml-auto mb-4 h-10 w-10 items-center justify-center rounded-lg hover:bg-[#FEEFE5] hover:text-black transition"
          >
            {isCollapsed ? <FaBars /> : <FaTimes />}
          </button>

          <nav className="flex-1 flex flex-col space-y-1">

            {/* TOP NAV ITEMS */}
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/home"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition",

                    // ⭐ apply hover ONLY when not active
                    !isActive && "hover:bg-[#FEEFE5] hover:text-black",

                    // ⭐ active tab stays yellow even on hover
                    isActive && "bg-[#FFCF00] text-black font-semibold",

                    isCollapsed && "justify-center"
                  )
                }
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            ))}

            {/* PORTFOLIO SECTION */}
            <div>
              <button
                onClick={() => setIsPortfolioOpen(!isPortfolioOpen)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition",

                  !location.pathname.startsWith("/home/portfolio") &&
                    "hover:bg-[#FEEFE5] hover:text-black",

                  location.pathname.startsWith("/home/portfolio") &&
                    "bg-[#FFCF00] text-black font-semibold",

                  isCollapsed && "justify-center"
                )}
              >
                <FaBriefcase className="w-5 h-5" />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left">My Portfolio</span>
                    {isPortfolioOpen ? <FaChevronDown /> : <FaChevronRight />}
                  </>
                )}
              </button>

              {isPortfolioOpen && !isCollapsed && (
                <div className="ml-8 mt-1 space-y-1">
                  {portfolioItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        cn(
                          "block px-3 py-1.5 rounded-lg text-sm transition",

                          !isActive && "hover:bg-[#FEEFE5] hover:text-black",
                          isActive && "bg-[#FFCF00] text-black font-semibold"
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            {/* BOTTOM NAV ITEMS */}
            <div className="mt-auto">
              {bottomNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg transition",

                      !isActive && "hover:bg-[#FEEFE5] hover:text-black",
                      isActive && "bg-[#FFCF00] text-black font-semibold",

                      isCollapsed && "justify-center"
                    )
                  }
                >
                  <item.icon className="w-5 h-5" />
                  {!isCollapsed && <span>{item.label}</span>}
                </NavLink>
              ))}
            </div>

          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
