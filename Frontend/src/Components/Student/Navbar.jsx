import { useState, useEffect } from "react";
import { FaGraduationCap, FaSignOutAlt, FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Navbar = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // NOTIFICATION LOADER
  useEffect(() => {
    const loadNotifications = () => {
      const companies = JSON.parse(localStorage.getItem("companies") || "[]");
      const viewedNotifications = JSON.parse(localStorage.getItem("viewedNotifications") || "[]");

      const notifs = companies.map((company, index) => ({
        id: `company-${index}`,
        title: `New Placement Drive: ${company.companyName}`,
        message: `${company.companyName} is hiring! Application deadline: ${company.endRegistrationDate}`,
        date: company.startRegistrationDate,
        type: "placement",
        isRead: viewedNotifications.includes(`company-${index}`)
      }));

      const today = new Date();
      const deadlineNotifs = companies
        .filter(company => {
          const endDate = new Date(company.endRegistrationDate);
          const daysUntilDeadline = Math.ceil(
            (endDate - today) / (1000 * 60 * 60 * 24)
          );
          return daysUntilDeadline <= 3 && daysUntilDeadline >= 0;
        })
        .map((company, index) => ({
          id: `deadline-${index}`,
          title: `Application Deadline Approaching`,
          message: `${company.companyName} applications close on ${company.endRegistrationDate}`,
          date: company.endRegistrationDate,
          type: "deadline",
          isRead: viewedNotifications.includes(`deadline-${index}`)
        }));

      const all = [...notifs, ...deadlineNotifs].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setNotifications(all);
      setUnreadCount(all.filter(n => !n.isRead).length);
    };

    loadNotifications();
    const itv = setInterval(loadNotifications, 30000);
    return () => clearInterval(itv);
  }, []);

  // LOGOUT
  const handleSignOut = () => {
    localStorage.removeItem("currentUser");
    toast.success("Signed out successfully");
    navigate("/login");
  };

  // MARK AS READ
  const markAsRead = (id) => {
    const viewed = JSON.parse(localStorage.getItem("viewedNotifications") || "[]");

    if (!viewed.includes(id)) {
      viewed.push(id);
      localStorage.setItem("viewedNotifications", JSON.stringify(viewed));

      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
      );

      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  // MARK ALL
  const markAllAsRead = () => {
    const allIds = notifications.map(n => n.id);
    localStorage.setItem("viewedNotifications", JSON.stringify(allIds));

    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  return (
    <header
      className="sticky top-0 z-50 w-full border-b shadow-md"
      style={{
        backgroundColor: "#FFFFFF", // <<< WHITE BACKGROUND
      }}
    >
      <div className="flex h-20 items-center justify-between px-4 md:px-6">

        {/* LOGO + NAME */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-white rounded-xl shadow flex items-center justify-center">
            <FaGraduationCap className="w-6 h-6 text-[#FA003F]" />
          </div>
          <h1
            className="text-2xl font-bold tracking-wide"
            style={{ color: "#FA003F" }}
          >
            PlaceNix
          </h1>
        </div>

        {/* GREETING */}
        <div className="flex-1 flex justify-center">
          <p className="text-lg italic  text-gray-600">
            Hello,{" "}
            <span className="font-semibold text-gray-800">
              {currentUser.name || "Student"}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-4">

          {/* NOTIFICATIONS */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative h-11 w-11 flex items-center justify-center rounded-lg hover:bg-gray-50 transition border shadow-sm"
            >
              <FaBell className="w-5 h-5 text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white text-xs font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* DROPDOWN */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border rounded-xl shadow-xl z-50 max-h-[500px] overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-semibold text-lg">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-[#FA003F] hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="overflow-y-auto flex-1">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        <FaBell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No notifications yet</p>
                      </div>
                    ) : (
                      <div className="divide-y">
                        {notifications.map(n => (
                          <div
                            key={n.id}
                            onClick={() => markAsRead(n.id)}
                            className={`p-4 cursor-pointer transition hover:bg-gray-100 ${
                              !n.isRead ? "bg-[#FFF1EE]" : "bg-white"
                            }`}
                          >
                            <h4 className="font-medium text-sm">{n.title}</h4>
                            <p className="text-xs text-gray-600 mt-1">{n.message}</p>
                            <p className="text-xs text-gray-500 mt-2">{n.date}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* SIGN OUT BUTTON */}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 h-11 px-4 rounded-lg border shadow-sm hover:bg-gray-50 transition font-semibold"
            style={{ color: "#FA003F", borderColor: "#FA003F" }}
          >
            <FaSignOutAlt className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
