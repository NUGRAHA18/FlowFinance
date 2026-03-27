import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import api from "../api/axios";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      // silently fail
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // refresh tiap 1 menit
    return () => clearInterval(interval);
  }, []);

  // Close dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dangerCount = notifications.filter((n) => n.severity === "danger").length;
  const totalCount = notifications.length;

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: "\u229E" },
    { name: "Dompet", path: "/wallets", icon: "\uD83D\uDCB3" },
    { name: "Kategori", path: "/categories", icon: "\uD83D\uDCD1" },
    { name: "Transaksi", path: "/transactions", icon: "\uD83D\uDCB8" },
    { name: "Anggaran", path: "/budgets", icon: "\uD83C\uDFAF" },
    { name: "Tabungan", path: "/saving-goals", icon: "\uD83D\uDCB0" },
    { name: "Hutang", path: "/debts", icon: "\uD83E\uDD1D" },
    { name: "Langganan", path: "/subscriptions", icon: "\uD83D\uDCC5" },
    { name: "Profil", path: "/profile", icon: "\u2699\uFE0F" },
  ];

  const getSeverityStyle = (severity) => {
    if (severity === "danger") return "border-l-4 border-red-500 bg-red-50";
    return "border-l-4 border-amber-400 bg-amber-50";
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#eaeee9] font-sans text-gray-800">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col justify-between rounded-r-[2rem] bg-white p-6 shadow-sm">
        <div>
          <h1 className="mb-10 text-2xl font-bold text-gray-800">
            FlowFinance
          </h1>
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-xl p-3 font-medium transition ${
                    isActive
                      ? "bg-[#f0f4f1] text-[#628263] border-l-4 border-[#628263]"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-xl p-3 font-medium text-red-500 transition hover:bg-red-50"
        >
          <span>\uD83D\uDEAA</span> Logout
        </button>
      </aside>

      {/* Konten Utama */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-6xl">
          {/* Top Bar with Notification Bell */}
          <div className="mb-6 flex justify-end">
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotif(!showNotif)}
                className="relative rounded-xl bg-white p-3 shadow-sm transition hover:bg-gray-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {totalCount > 0 && (
                  <span className={`absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white ${dangerCount > 0 ? "bg-red-500" : "bg-amber-500"}`}>
                    {totalCount}
                  </span>
                )}
              </button>

              {/* Dropdown */}
              {showNotif && (
                <div className="absolute right-0 top-14 z-50 w-96 rounded-2xl bg-white shadow-xl border border-gray-100">
                  <div className="border-b border-gray-100 px-5 py-4">
                    <h4 className="font-bold text-gray-800">Notifikasi</h4>
                    <p className="text-xs text-gray-500">{totalCount} peringatan aktif</p>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-5 py-8 text-center text-sm text-gray-400">
                        Tidak ada notifikasi saat ini.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1 p-2">
                        {notifications.map((notif, idx) => (
                          <div
                            key={idx}
                            className={`rounded-xl px-4 py-3 ${getSeverityStyle(notif.severity)}`}
                          >
                            <p className="text-sm font-bold text-gray-800">{notif.title}</p>
                            <p className="mt-1 text-xs text-gray-600">{notif.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
