import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("this_month"); // Filter Waktu (Poin 4)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Jika backend sudah support query timeFilter, bisa ditambahkan: ?filter=${timeFilter}
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
  }, [timeFilter]);

  if (loading)
    return (
      <div className="flex h-full items-center justify-center text-xl text-gray-500">
        Memuat dasbor...
      </div>
    );

  // Fungsi hitung persentase (Poin 6.1)
  const calcTrend = (curr, prev) => {
    if (!prev || prev === 0) return curr > 0 ? "+100%" : "0%";
    const percent = Math.round(((curr - prev) / prev) * 100);
    return percent > 0 ? `+${percent}%` : `${percent}%`;
  };

  const incomeTrend = calcTrend(
    data?.thisMonth?.income,
    data?.lastMonth?.income,
  );
  const expenseTrend = calcTrend(
    data?.thisMonth?.expense,
    data?.lastMonth?.expense,
  );
  const incomeIsUp = data?.thisMonth?.income >= (data?.lastMonth?.income || 0);
  const expenseIsUp =
    data?.thisMonth?.expense >= (data?.lastMonth?.expense || 0);

  // Warna untuk Pie Chart
  const COLORS = ["#628263", "#84a585", "#a5c8a7", "#c7ebc9", "#e0f5e1"];

  return (
    <Layout>
      {/* Header & Filter Waktu (Poin 4) */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Ringkasan Keuangan
          </h2>
          <p className="text-gray-500">Pantau arus kas dan targetmu di sini.</p>
        </div>
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2 font-medium text-gray-700 shadow-sm outline-none transition focus:border-[#628263]"
        >
          <option value="this_month">Bulan Ini</option>
          <option value="last_month">Bulan Lalu</option>
          <option value="this_year">Tahun Ini</option>
        </select>
      </div>

      {/* Baris 1: Kartu Utama (Balance, Income, Expense, Net) */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Balance (Poin 5) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#A04530] to-[#1E1E1E] p-6 text-white shadow-lg">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-500 opacity-20 blur-2xl"></div>
          <p className="mb-2 text-sm opacity-80">Total Saldo</p>
          <h2 className="text-3xl font-bold">
            Rp {data?.totalBalance?.toLocaleString("id-ID")}
          </h2>
          <p className="mt-4 text-xs font-medium text-green-300">
            {data?.thisMonth?.netCashFlow > 0 ? "+" : ""} Rp{" "}
            {data?.thisMonth?.netCashFlow?.toLocaleString("id-ID")} bulan ini
          </p>
        </div>

        {/* Income */}
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-gray-500">Pemasukan</p>
          <h2 className="mt-2 text-2xl font-bold text-[#628263]">
            Rp {data?.thisMonth?.income?.toLocaleString("id-ID")}
          </h2>
          <p
            className={`mt-4 text-sm font-bold ${incomeIsUp ? "text-green-500" : "text-red-500"}`}
          >
            {incomeTrend}{" "}
            <span className="text-xs font-normal text-gray-400">
              vs bulan lalu
            </span>
          </p>
        </div>

        {/* Expense */}
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-gray-500">Pengeluaran</p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            Rp {data?.thisMonth?.expense?.toLocaleString("id-ID")}
          </h2>
          <p
            className={`mt-4 text-sm font-bold ${expenseIsUp ? "text-red-500" : "text-green-500"}`}
          >
            {expenseTrend}{" "}
            <span className="text-xs font-normal text-gray-400">
              vs bulan lalu
            </span>
          </p>
        </div>

        {/* Net Cash Flow (Poin 6.2) */}
        <div className="rounded-3xl bg-white p-6 shadow-sm border-l-4 border-[#628263]">
          <p className="text-sm font-semibold text-gray-500">Net Cash Flow</p>
          <h2
            className={`mt-2 text-2xl font-bold ${data?.thisMonth?.netCashFlow >= 0 ? "text-[#628263]" : "text-red-500"}`}
          >
            {data?.thisMonth?.netCashFlow > 0 ? "+" : ""} Rp{" "}
            {data?.thisMonth?.netCashFlow?.toLocaleString("id-ID")}
          </h2>
          <p className="mt-4 text-xs text-gray-400">Income dikurangi Expense</p>
        </div>
      </div>

      {/* Baris 2: Charts & Progress */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Income vs Expense Bar Chart (Poin 9) */}
        <div className="rounded-3xl bg-white p-6 shadow-sm lg:col-span-2">
          <h3 className="mb-6 text-lg font-bold text-gray-800">
            Tren Arus Kas (Tahun Ini)
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data?.chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                  tickFormatter={(val) => `Rp${val / 1000000}M`}
                />
                <Tooltip
                  cursor={{ fill: "#f9fafb" }}
                  formatter={(value) => `Rp ${value.toLocaleString("id-ID")}`}
                />
                <Bar
                  dataKey="income"
                  name="Pemasukan"
                  fill="#628263"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="expense"
                  name="Pengeluaran"
                  fill="#f87171"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense by Category Pie Chart (Poin 9) */}
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h3 className="mb-2 text-lg font-bold text-gray-800">
            Pengeluaran by Kategori
          </h3>
          {data?.expenseByCategory?.length > 0 ? (
            <>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.expenseByCategory}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="total"
                    >
                      {data.expenseByCategory.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) =>
                        `Rp ${value.toLocaleString("id-ID")}`
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="mt-4 flex flex-col gap-2">
                {data.expenseByCategory.slice(0, 4).map((cat, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                      ></span>
                      <span className="text-gray-600">{cat.category}</span>
                    </div>
                    <span className="font-bold text-gray-800">
                      {cat.percentage}%
                    </span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="mt-10 text-center text-sm text-gray-500">
              Belum ada pengeluaran bulan ini.
            </p>
          )}
        </div>
      </div>

      {/* Baris 3: Transaksi & Progress Bars */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Transactions (Poin 7) */}
        <div className="rounded-3xl bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800">
              Transaksi Terakhir
            </h3>
            <Link
              to="/transactions"
              className="text-sm font-bold text-[#628263] hover:underline"
            >
              Lihat Semua
            </Link>
          </div>

          {data?.recentTransactions?.length === 0 ? (
            <p className="text-sm text-gray-500">Belum ada transaksi.</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {data?.recentTransactions?.map((tx) => (
                <li
                  key={tx.id}
                  className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${tx.type === "income" ? "bg-[#f0f4f1] text-[#628263]" : "bg-red-50 text-red-500"}`}
                    >
                      {tx.type === "income" ? "💰" : "🍜"}{" "}
                      {/* Idealnya icon dinamis dari kategori */}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">
                        {tx.category?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {tx.description || tx.category?.name} <br />
                        <span className="text-xs">
                          {tx.account?.name} •{" "}
                          {new Date(tx.date).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      </p>
                    </div>
                  </div>
                  <p
                    className={`text-lg font-bold ${tx.type === "income" ? "text-[#628263]" : "text-red-500"}`}
                  >
                    {tx.type === "income" ? "+" : "-"} Rp{" "}
                    {tx.amount.toLocaleString("id-ID")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Kolom Kanan: Budget, Savings, Aksi Cepat */}
        <div className="flex flex-col gap-6">
          {/* Budget Progress (Poin 10) */}
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-gray-800">
              Budget Progress
            </h3>
            {data?.budgets?.length > 0 ? (
              data.budgets.slice(0, 3).map((b) => {
                const percent = Math.min(
                  (b.spentAmount / b.amount) * 100,
                  100,
                ).toFixed(0);
                const isWarning = percent >= 80;
                return (
                  <div key={b.id} className="mb-4 last:mb-0">
                    <div className="flex justify-between text-sm font-medium text-gray-800">
                      <span>{b.category?.name}</span>
                      <span>
                        Rp {b.spentAmount?.toLocaleString("id-ID")} / Rp{" "}
                        {b.amount?.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`h-full transition-all duration-500 ${isWarning ? "bg-red-500" : "bg-[#628263]"}`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                    <div className="mt-1 flex justify-between text-xs">
                      <span className="font-bold text-gray-600">
                        {percent}%
                      </span>
                      {isWarning && (
                        <span className="font-semibold text-red-500">
                          ⚠ Hampir habis
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500">
                Belum ada anggaran bulan ini.
              </p>
            )}
          </div>

          {/* Savings Progress (Poin 11) */}
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-gray-800">
              Savings Progress
            </h3>
            {data?.savings?.length > 0 ? (
              data.savings.slice(0, 2).map((s) => {
                const percent = Math.min(
                  (s.savedAmount / s.targetAmount) * 100,
                  100,
                ).toFixed(0);
                return (
                  <div key={s.id} className="mb-4 last:mb-0">
                    <div className="flex justify-between text-sm font-medium text-gray-800">
                      <span>{s.name}</span>
                      <span>
                        Rp {s.savedAmount?.toLocaleString("id-ID")} / Rp{" "}
                        {s.targetAmount?.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                    <span className="mt-1 block text-xs font-bold text-gray-600">
                      {percent}%
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500">
                Belum ada target tabungan.
              </p>
            )}
          </div>

          {/* Aksi Cepat (Poin 8) */}
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-gray-800">Aksi Cepat</h3>
            <div className="flex flex-col gap-3">
              <Link
                to="/transactions"
                className="w-full rounded-xl bg-[#628263] py-3 text-center font-bold text-white transition hover:bg-[#4d684e]"
              >
                Catat Transaksi
              </Link>
              <Link
                to="/saving-goals"
                className="w-full rounded-xl border-2 border-[#628263] py-3 text-center font-bold text-[#628263] transition hover:bg-[#f0f4f1]"
              >
                Tambah Tabungan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
