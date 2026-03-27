import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { SkeletonDashboard } from "../components/Skeleton";
import EmptyState from "../components/EmptyState";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  Wallet,
  DollarSign,
  AlertTriangle,
  FileDown,
} from "lucide-react";
import { generateMonthlyReport } from "../utils/generateReport";
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
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("this_month");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get(`/analytics/dashboard?filter=${timeFilter}`);
        setData(res.data);
      } catch (err) {
        // 401 handling is done by global axios interceptor
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    setLoading(true);
    fetchDashboardData();
  }, [timeFilter]);

  if (loading)
    return (
      <Layout>
        <SkeletonDashboard />
      </Layout>
    );

  // Fungsi hitung persentase
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
      {/* Header & Filter Waktu */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {user?.name ? `Halo, ${user.name}!` : "Ringkasan Keuangan"}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Pantau arus kas dan targetmu di sini.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const periodMap = { this_month: "Bulan Ini", last_month: "Bulan Lalu", this_year: "Tahun Ini" };
              generateMonthlyReport(data, periodMap[timeFilter]);
            }}
            className="flex items-center gap-2 rounded-xl bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm transition hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <FileDown className="h-4 w-4" /> PDF
          </button>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 font-medium text-gray-700 shadow-sm outline-none transition focus:border-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
          >
            <option value="this_month">Bulan Ini</option>
            <option value="last_month">Bulan Lalu</option>
            <option value="this_year">Tahun Ini</option>
          </select>
        </div>
      </div>

      {/* Baris 1: Kartu Utama (Balance, Income, Expense, Net) */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Balance */}
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
        <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
            Pemasukan
          </p>
          <h2 className="mt-2 text-2xl font-bold text-primary-500">
            Rp {data?.thisMonth?.income?.toLocaleString("id-ID")}
          </h2>
          <p
            className={`mt-4 text-sm font-bold ${incomeIsUp ? "text-green-500" : "text-red-500"}`}
          >
            {incomeTrend}{" "}
            <span className="text-xs font-normal text-gray-400 dark:text-gray-500">
              vs bulan lalu
            </span>
          </p>
        </div>

        {/* Expense */}
        <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
            Pengeluaran
          </p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Rp {data?.thisMonth?.expense?.toLocaleString("id-ID")}
          </h2>
          <p
            className={`mt-4 text-sm font-bold ${expenseIsUp ? "text-red-500" : "text-green-500"}`}
          >
            {expenseTrend}{" "}
            <span className="text-xs font-normal text-gray-400 dark:text-gray-500">
              vs bulan lalu
            </span>
          </p>
        </div>

        {/* Net Cash Flow */}
        <div className="rounded-3xl bg-white p-6 shadow-sm border-l-4 border-primary-500 dark:bg-gray-800">
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
            Net Cash Flow
          </p>
          <h2
            className={`mt-2 text-2xl font-bold ${data?.thisMonth?.netCashFlow >= 0 ? "text-primary-500" : "text-red-500"}`}
          >
            {data?.thisMonth?.netCashFlow > 0 ? "+" : ""} Rp{" "}
            {data?.thisMonth?.netCashFlow?.toLocaleString("id-ID")}
          </h2>
          <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
            Income dikurangi Expense
          </p>
        </div>
      </div>

      {/* Baris 2: Charts & Progress */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Income vs Expense Bar Chart */}
        <div className="rounded-3xl bg-white p-6 shadow-sm lg:col-span-2 dark:bg-gray-800">
          <h3 className="mb-6 text-lg font-bold text-gray-800 dark:text-gray-200">
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

        {/* Expense by Category Pie Chart */}
        <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <h3 className="mb-2 text-lg font-bold text-gray-800 dark:text-gray-200">
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
                      <span className="text-gray-600 dark:text-gray-400">
                        {cat.category}
                      </span>
                    </div>
                    <span className="font-bold text-gray-800 dark:text-gray-200">
                      {cat.percentage}%
                    </span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <EmptyState
              icon={DollarSign}
              title="Belum ada pengeluaran"
              description="Belum ada pengeluaran bulan ini."
            />
          )}
        </div>
      </div>

      {/* Baris 3: Transaksi & Progress Bars */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Transactions */}
        <div className="rounded-3xl bg-white p-6 shadow-sm lg:col-span-2 dark:bg-gray-800">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
              Transaksi Terakhir
            </h3>
            <Link
              to="/transactions"
              className="text-sm font-bold text-primary-500 hover:underline"
            >
              Lihat Semua
            </Link>
          </div>

          {data?.recentTransactions?.length === 0 ? (
            <EmptyState
              icon={ArrowUpDown}
              title="Belum ada transaksi"
              description="Mulai catat transaksi pertamamu."
              actionLabel="Catat Transaksi"
              actionLink="/transactions"
            />
          ) : (
            <ul className="flex flex-col gap-4">
              {data?.recentTransactions?.map((tx) => (
                <li
                  key={tx.id}
                  className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0 dark:border-gray-700"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tx.type === "income" ? "bg-primary-50 text-primary-500 dark:bg-primary-500/10" : "bg-red-50 text-red-500 dark:bg-red-500/10"}`}
                    >
                      {tx.type === "income" ? (
                        <TrendingUp className="h-5 w-5" />
                      ) : (
                        <TrendingDown className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-gray-100">
                        {tx.category?.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
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
                    className={`text-lg font-bold ${tx.type === "income" ? "text-primary-500" : "text-red-500"}`}
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
          {/* Budget Progress */}
          <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-bold text-gray-800 dark:text-gray-200">
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
                    <div className="flex justify-between text-sm font-medium text-gray-800 dark:text-gray-200">
                      <span>{b.category?.name}</span>
                      <span>
                        Rp {b.spentAmount?.toLocaleString("id-ID")} / Rp{" "}
                        {b.amount?.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                      <div
                        className={`h-full transition-all duration-500 ${isWarning ? "bg-red-500" : "bg-primary-500"}`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                    <div className="mt-1 flex justify-between text-xs">
                      <span className="font-bold text-gray-600 dark:text-gray-400">
                        {percent}%
                      </span>
                      {isWarning && (
                        <span className="flex items-center gap-1 font-semibold text-red-500">
                          <AlertTriangle className="h-3 w-3" /> Hampir habis
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <EmptyState
                icon={Wallet}
                title="Belum ada anggaran"
                description="Belum ada anggaran bulan ini."
                actionLabel="Buat Anggaran"
                actionLink="/budgets"
              />
            )}
          </div>

          {/* Savings Progress */}
          <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-bold text-gray-800 dark:text-gray-200">
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
                    <div className="flex justify-between text-sm font-medium text-gray-800 dark:text-gray-200">
                      <span>{s.name}</span>
                      <span>
                        Rp {s.savedAmount?.toLocaleString("id-ID")} / Rp{" "}
                        {s.targetAmount?.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                      <div
                        className="h-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                    <span className="mt-1 block text-xs font-bold text-gray-600 dark:text-gray-400">
                      {percent}%
                    </span>
                  </div>
                );
              })
            ) : (
              <EmptyState
                icon={DollarSign}
                title="Belum ada target tabungan"
                description="Mulai menabung dengan membuat target pertamamu."
                actionLabel="Tambah Tabungan"
                actionLink="/saving-goals"
              />
            )}
          </div>

          {/* Aksi Cepat */}
          <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-bold text-gray-800 dark:text-gray-200">
              Aksi Cepat
            </h3>
            <div className="flex flex-col gap-3">
              <Link
                to="/transactions"
                className="w-full rounded-xl bg-primary-500 py-3 text-center font-bold text-white transition hover:bg-primary-600"
              >
                Catat Transaksi
              </Link>
              <Link
                to="/saving-goals"
                className="w-full rounded-xl border-2 border-primary-500 py-3 text-center font-bold text-primary-500 transition hover:bg-primary-50"
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
