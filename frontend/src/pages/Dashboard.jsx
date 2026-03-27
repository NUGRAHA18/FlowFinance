import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get("/analytics/dashboard");
        setData(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div className="p-10 text-center">Memuat data...</div>;

  return (
    <Layout>
      {/* Header Atas (Bisa untuk Search Bar / Profil) */}
      <div className="mb-8 flex items-center justify-between">
        <div className="relative w-72">
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-full border-none bg-white py-2 pl-10 pr-4 shadow-sm outline-none focus:ring-2 focus:ring-[#628263]"
          />
          <span className="absolute left-4 top-2.5 text-gray-400">🔍</span>
        </div>
        <div className="flex items-center gap-4 text-xl text-gray-600">
          <span className="cursor-pointer hover:text-gray-800">❓</span>
          <span className="cursor-pointer hover:text-gray-800">⚙️</span>
          <span className="cursor-pointer hover:text-gray-800">🔔</span>
          <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-300">
            <img
              src="https://ui-avatars.com/api/?name=User&background=628263&color=fff"
              alt="Profile"
            />
          </div>
        </div>
      </div>

      {/* Grid Layout Utama */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Kolom Kiri: Kartu Saldo & Transaksi */}
        <div className="flex flex-col gap-6">
          {/* Kartu Kredit Mockup (Total Balance) */}
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-gray-500">
              Total Saldo (Semua Dompet)
            </h3>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#A04530] to-[#1E1E1E] p-6 text-white shadow-lg">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-500 opacity-20 blur-2xl"></div>
              <p className="mb-8 font-medium">FlowFinance Card</p>
              <h2 className="mb-2 text-3xl font-bold tracking-widest">
                Rp {data?.totalBalance?.toLocaleString("id-ID")}
              </h2>
              <p className="text-sm opacity-80">Saldo Tersedia</p>
            </div>
          </div>

          {/* Daftar Transaksi */}
          <div className="flex-1 rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">
                Transaksi Terakhir
              </h3>
              <span className="text-sm cursor-pointer text-gray-400 hover:text-gray-800">
                Terbaru ▼
              </span>
            </div>

            {data?.recentTransactions?.length === 0 ? (
              <p className="text-sm text-gray-500">Belum ada transaksi.</p>
            ) : (
              <ul className="flex flex-col gap-5">
                {data?.recentTransactions?.map((tx) => (
                  <li key={tx.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0f4f1] text-[#628263]">
                        {tx.type === "income" ? "↓" : "↑"}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">
                          {tx.description || tx.category?.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(tx.date).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                    </div>
                    <p
                      className={`font-bold ${tx.type === "income" ? "text-[#628263]" : "text-gray-800"}`}
                    >
                      {tx.type === "income" ? "+" : "-"} $
                      {Math.round(tx.amount / 15000)}{" "}
                      {/* Simulasi Dollar seperti di foto, hapus Math.round jika mau tetap Rupiah */}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Kolom Tengah & Kanan: Analitik & Aksi Cepat */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Baris Atas: Income & Expense */}
          <div className="grid grid-cols-2 gap-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-gray-500">
                Pemasukan Bulan Ini
              </p>
              <h2 className="mt-2 text-3xl font-bold text-[#628263]">
                Rp {data?.totalIncome?.toLocaleString("id-ID")}
              </h2>
              {/* Simulasi Grafik Bar Sederhana */}
              <div className="mt-6 flex h-24 items-end gap-2">
                {[40, 70, 45, 90, 65, 30].map((h, i) => (
                  <div
                    key={i}
                    className="w-full rounded-t-md bg-[#d2ded3]"
                    style={{ height: `${h}%` }}
                  ></div>
                ))}
                <div className="w-full rounded-t-md bg-[#628263] h-[80%]"></div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-gray-500">
                Pengeluaran Bulan Ini
              </p>
              <h2 className="mt-2 text-3xl font-bold text-gray-800">
                Rp {data?.totalExpense?.toLocaleString("id-ID")}
              </h2>
              {/* Simulasi Grafik Bar Sederhana */}
              <div className="mt-6 flex h-24 items-end gap-2">
                {[80, 50, 65, 40, 85, 55].map((h, i) => (
                  <div
                    key={i}
                    className="w-full rounded-t-md bg-gray-200"
                    style={{ height: `${h}%` }}
                  ></div>
                ))}
                <div className="w-full rounded-t-md bg-red-400 h-[60%]"></div>
              </div>
            </div>
          </div>

          {/* Baris Bawah: Tombol Aksi Cepat (Seperti di kanan foto) */}
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-gray-800">Aksi Cepat</h3>
            <div className="flex flex-col gap-4">
              <Link
                to="/wallets"
                className="w-full rounded-xl bg-[#628263] py-4 text-center font-bold text-white transition hover:bg-[#4d684e]"
              >
                Tambah Dompet
              </Link>
              <Link
                to="/transactions"
                className="w-full rounded-xl bg-[#628263] py-4 text-center font-bold text-white transition hover:bg-[#4d684e]"
              >
                Catat Transaksi
              </Link>
              <Link
                to="/budgets"
                className="w-full rounded-xl bg-[#628263] py-4 text-center font-bold text-white transition hover:bg-[#4d684e]"
              >
                Atur Anggaran
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
