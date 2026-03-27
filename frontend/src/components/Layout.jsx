import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import {
  LayoutDashboard, Wallet, Tag, ArrowLeftRight, Target,
  PiggyBank, Handshake, CalendarClock, RefreshCw, Settings, LogOut,
  Bell, Menu, X, Sun, Moon,
} from "lucide-react";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, darkMode, toggleDarkMode } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const notifRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch {
      // silently fail
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const dangerCount = notifications.filter((n) => n.severity === "danger").length;
  const totalCount = notifications.length;

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Dompet", path: "/wallets", icon: Wallet },
    { name: "Kategori", path: "/categories", icon: Tag },
    { name: "Transaksi", path: "/transactions", icon: ArrowLeftRight },
    { name: "Anggaran", path: "/budgets", icon: Target },
    { name: "Tabungan", path: "/saving-goals", icon: PiggyBank },
    { name: "Hutang", path: "/debts", icon: Handshake },
    { name: "Langganan", path: "/subscriptions", icon: CalendarClock },
    { name: "Berulang", path: "/recurring", icon: RefreshCw },
    { name: "Profil", path: "/profile", icon: Settings },
  ];

  const getSeverityStyle = (severity) => {
    if (severity === "danger") return "border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20";
    return "border-l-4 border-amber-400 bg-amber-50 dark:bg-amber-900/20";
  };

  return (
    <div className="flex h-screen overflow-hidden bg-surface font-sans text-gray-800 dark:bg-gray-900 dark:text-gray-100">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col justify-between bg-white p-6 shadow-lg transition-transform duration-300 dark:bg-gray-800 lg:static lg:translate-x-0 lg:rounded-r-4xl lg:shadow-sm ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="navigation"
        aria-label="Menu utama"
      >
        <div>
          <div className="mb-10 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">FlowFinance</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 lg:hidden dark:hover:bg-gray-700"
              aria-label="Tutup menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-primary-50 text-primary-500 dark:bg-primary-900/30 dark:text-primary-300"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col gap-2">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700"
            aria-label={darkMode ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            {darkMode ? "Mode Terang" : "Mode Gelap"}
          </button>

          {/* User Info */}
          {user && (
            <div className="rounded-xl bg-gray-50 px-3 py-2.5 dark:bg-gray-700">
              <p className="text-sm font-bold text-gray-800 dark:text-white">{user.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="h-5 w-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl p-4 lg:p-8">
          {/* Top Bar */}
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl bg-white p-2.5 shadow-sm lg:hidden dark:bg-gray-800"
              aria-label="Buka menu navigasi"
            >
              <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>

            <div className="flex items-center gap-3 ml-auto">
              {/* Notification Bell */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setShowNotif(!showNotif)}
                  className="relative rounded-xl bg-white p-2.5 shadow-sm transition hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
                  aria-label={`Notifikasi, ${totalCount} peringatan`}
                  aria-expanded={showNotif}
                >
                  <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  {totalCount > 0 && (
                    <span className={`absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white ${dangerCount > 0 ? "bg-red-500" : "bg-amber-500"}`}>
                      {totalCount}
                    </span>
                  )}
                </button>

                {showNotif && (
                  <div
                    className="absolute right-0 top-12 z-50 w-80 rounded-2xl bg-white shadow-xl border border-gray-100 animate-fade-in dark:bg-gray-800 dark:border-gray-700 sm:w-96"
                    role="dialog"
                    aria-label="Panel notifikasi"
                  >
                    <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-700">
                      <h4 className="font-bold text-gray-800 dark:text-white">Notifikasi</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{totalCount} peringatan aktif</p>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-5 py-8 text-center text-sm text-gray-400">
                          Tidak ada notifikasi saat ini.
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1 p-2">
                          {notifications.map((notif, idx) => (
                            <div key={idx} className={`rounded-xl px-4 py-3 ${getSeverityStyle(notif.severity)}`} role="alert">
                              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{notif.title}</p>
                              <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{notif.message}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
