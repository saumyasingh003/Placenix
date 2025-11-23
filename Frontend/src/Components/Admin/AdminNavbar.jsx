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

  /* ============================================================
     🔔 LOAD NOTIFICATIONS
  ============================================================ */
  useEffect(() => {
    const loadNotifications = () => {
      const companies = JSON.parse(localStorage.getItem("companies") || "[]");
      const viewedNotifications = JSON.parse(localStorage.getItem("viewedNotifications") || "[]");

      const notifs = companies.map((company, index) => ({
        id: `company-${index}`,
        title: `New Placement Drive: ${company.companyName}`,
        message: `${company.companyName} is hiring! Deadline: ${company.endRegistrationDate}`,
        date: company.startRegistrationDate,
        type: "placement",
        isRead: viewedNotifications.includes(`company-${index}`),
      }));

      const today = new Date();
      const deadlineNotifs = companies
        .filter(company => {
          const end = new Date(company.endRegistrationDate);
          const daysLeft = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
          return daysLeft <= 3 && daysLeft >= 0;
        })
        .map((company, index) => ({
          id: `deadline-${index}`,
          title: `Deadline Approaching`,
          message: `${company.companyName} closes on ${company.endRegistrationDate}`,
          date: company.endRegistrationDate,
          type: "deadline",
          isRead: viewedNotifications.includes(`deadline-${index}`),
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

  /* ============================================================
     🚪 SIGN OUT
  ============================================================ */
  const handleSignOut = () => {
    localStorage.removeItem("currentUser");
    toast.success("Signed out successfully");
    navigate("/login");
  };

  /* ============================================================
     📌 MARK AS READ
  ============================================================ */
  const markAsRead = (id) => {
    const viewed = JSON.parse(localStorage.getItem("viewedNotifications") || "[]");

    if (!viewed.includes(id)) {
      viewed.push(id);
      localStorage.setItem("viewedNotifications", JSON.stringify(viewed));
    }

    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );

    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    const allIds = notifications.map(n => n.id);
    localStorage.setItem("viewedNotifications", JSON.stringify(allIds));

    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">

        {/* LOGO + TITLE */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#FA003F] flex items-center justify-center shadow">
            <FaGraduationCap className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-[#FA003F]">PlaceNix</h1>
        </div>

        {/* CENTER TEXT */}
        <div className="flex-1 flex justify-center">
          <p className="text-lg italic  text-gray-600">
            Hello, {" "}
            <span className="font-medium text-gray-900">
              {currentUser.name || "Student"}
            </span>
          </p>
        </div>

        {/* RIGHT SIDE ICONS */}
        <div className="flex items-center gap-4">

          {/* 🔔 NOTIFICATION BUTTON */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative h-10 w-10 rounded-lg border bg-white hover:bg-gray-50 shadow flex items-center justify-center"
            >
              <FaBell className="w-5 h-5 text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FA003F] text-white text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* NOTIFICATION DROPDOWN */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />

                <div className="absolute right-0 mt-3 w-80 bg-white border rounded-xl shadow-lg z-50 max-h-[500px] overflow-hidden flex flex-col">
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
                        <FaBell className="w-10 h-10 mx-auto opacity-50 mb-2" />
                        No notifications yet
                      </div>
                    ) : (
                      <div className="divide-y">
                        {notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markAsRead(n.id)}
                            className={`p-4 cursor-pointer transition ${
                              n.isRead ? "bg-white" : "bg-[#FFF4E1]"
                            } hover:bg-gray-100`}
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

          {/* 🚪 SIGN OUT */}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 h-10 px-4 rounded-lg border shadow-sm hover:bg-gray-50 transition font-semibold text-[#FA003F] border-[#FA003F]"
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
