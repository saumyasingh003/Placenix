import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  FaHome, 
  FaBuilding, 
  FaHistory, 
  FaUsers, 
  FaInfoCircle, 
  FaBars, 
  FaTimes 
} from "react-icons/fa";
import { cn } from "../../utils";


const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { icon: FaHome, label: "Dashboard", path: "/admin" },
    { icon: FaBuilding, label: "Register Company", path: "/admin/register-company" },
    { icon: FaHistory, label: "Company Details", path: "/admin/history" },
    { icon: FaUsers, label: "Registered Students", path: "/admin/students" }
  ];

  const bottomNavItems = [
    { icon: FaInfoCircle, label: "About", path: "/admin/about" }
  ];

  return (
    <>
      {/* MOBILE TOGGLE BUTTON */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="fixed top-20 left-4 z-40 md:hidden h-10 w-10 flex items-center justify-center 
                   rounded-lg bg-white shadow border"
      >
        {isCollapsed ? <FaBars /> : <FaTimes />}
      </button>

      {/* SIDEBAR */}
      <aside
        className={cn(
          "fixed md:sticky top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r shadow-sm transition-all duration-300",
          isCollapsed ? "w-0 md:w-16" : "w-64"
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
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition",

                    !isActive && "hover:bg-gray-100 hover:text-black",
                    isActive && "bg-[#00916E] text-white font-semibold",

                    isCollapsed && "justify-center"
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
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg transition",

                      !isActive && "hover:bg-gray-100 hover:text-black",
                      isActive && "bg-[#00916E] text-white font-semibold",

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

export default AdminSidebar;
