import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaBuilding,
  FaHistory,
  FaUsers,
  FaInfoCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { cn } from "../../utils";

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { icon: FaHome, label: "Dashboard", path: "/admin" },
    { icon: FaBuilding, label: "Register Company", path: "/admin/register-company" },
    { icon: FaHistory, label: "Company Details", path: "/admin/history" },
    { icon: FaUsers, label: "Registered Students", path: "/admin/students" },
  ];

  const bottomNavItems = [{ icon: FaInfoCircle, label: "About", path: "/admin/about" }];

  return (
    <>
      {/* MOBILE TOGGLE BUTTON */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-20 left-4 z-50 md:hidden h-10 w-10 flex items-center justify-center 
                   rounded-lg bg-white shadow border"
      >
        {mobileOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* SIDEBAR */}
      <aside
        className={cn(
          "fixed md:sticky top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r shadow-sm transition-all duration-300 z-40",
          // Desktop collapse
          isCollapsed ? "md:w-16" : "md:w-64",
          // Mobile drawer
          mobileOpen ? "w-64 left-0" : "w-64 -left-64 md:left-0"
        )}
      >
        <div className="flex flex-col h-full p-3">

          {/* DESKTOP COLLAPSE BUTTON */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex ml-auto mb-4 h-10 w-10 items-center justify-center 
                       rounded-lg hover:bg-gray-100 transition"
          >
            {isCollapsed ? <FaBars /> : <FaTimes />}
          </button>

          <nav className="flex-1 flex flex-col space-y-1">

            {/* TOP NAVIGATION */}
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition",
                    isActive ? "bg-[#00916E] text-white font-semibold" : "hover:bg-gray-100",

                    // Center icons in collapsed mode
                    isCollapsed && "justify-center",

                    // Center items in mobile drawer if collapsed
                    mobileOpen && isCollapsed && "justify-start"
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            ))}

            {/* BOTTOM NAVIGATION */}
            <div className="mt-auto">
              {bottomNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg transition",
                      isActive ? "bg-[#00916E] text-white font-semibold" : "hover:bg-gray-100",

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

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}
    </>
  );
};

export default AdminSidebar;
