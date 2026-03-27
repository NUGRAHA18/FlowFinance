import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation(); // Untuk mendeteksi menu aktif

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: "⊞" },
    { name: "Dompet", path: "/wallets", icon: "💳" },
    { name: "Kategori", path: "/categories", icon: "📑" },
    { name: "Transaksi", path: "/transactions", icon: "💸" },
    { name: "Anggaran", path: "/budgets", icon: "🎯" },
    { name: "Tabungan", path: "/saving-goals", icon: "" }, // Bisa ganti emoji babi 🐷
    { name: "Hutang", path: "/debts", icon: "🤝" },
    { name: "Langganan", path: "/subscriptions", icon: "📅" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#eaeee9] font-sans text-gray-800">
      {/* Sidebar Samping */}
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

        {/* Tombol Logout di Bawah */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-xl p-3 font-medium text-red-500 transition hover:bg-red-50"
        >
          <span>🚪</span> Logout
        </button>
      </aside>

      {/* Konten Utama (Kanan) */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
