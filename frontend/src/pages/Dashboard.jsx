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
  ArrowRight,
  PiggyBank,
  Receipt,
  CreditCard,
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

const fmt = (val) => `Rp ${(val ?? 0).toLocaleString("id-ID")}`;

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

  const calcTrend = (curr, prev) => {
    if (!prev || prev === 0) return curr > 0 ? "+100%" : "0%";
    const percent = Math.round(((curr - prev) / prev) * 100);
    return percent > 0 ? `+${percent}%` : `${percent}%`;
  };

  const incomeTrend = calcTrend(data?.thisMonth?.income, data?.lastMonth?.income);
  const expenseTrend = calcTrend(data?.thisMonth?.expense, data?.lastMonth?.expense);
  const incomeIsUp = data?.thisMonth?.income >= (data?.lastMonth?.income || 0);
  const expenseIsUp = data?.thisMonth?.expense >= (data?.lastMonth?.expense || 0);
  const netPositive = (data?.thisMonth?.netCashFlow ?? 0) >= 0;

  const COLORS = ["#628263", "#84a585", "#a5c8a7", "#c7ebc9", "#4d684e"];

  const now = new Date();
  const dateStr = now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <Layout>
      {/* ── Header ── */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400 dark:text-gray-500">{dateStr}</p>
          <h1 className="mt-1 text-2xl font-extrabold text-gray-900 dark:text-gray-100 sm:text-3xl">
            {user?.name ? `Halo, ${user.name} 👋` : "Ringkasan Keuangan"}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Berikut ringkasan keuanganmu hari ini.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start">
          <button
            onClick={() => {
              const periodMap = { this_month: "Bulan Ini", last_month: "Bulan Lalu", this_year: "Tahun Ini" };
              generateMonthlyReport(data, periodMap[timeFilter]);
            }}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 shadow-sm transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <FileDown className="h-4 w-4" />
            Export PDF
          </button>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
          >
            <option value="this_month">Bulan Ini</option>
            <option value="last_month">Bulan Lalu</option>
            <option value="this_year">Tahun Ini</option>
          </select>
        </div>
      </div>

      {/* ── Row 1: Stat Cards ── */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total Balance — hero card */}
        <div className="relative col-span-1 overflow-hidden rounded-2xl bg-gradient-to-br from-primary-700 to-primary-500 p-6 text-white shadow-lg sm:col-span-2 xl:col-span-1">
          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white opacity-5" />
          <div className="absolute -bottom-6 -left-4 h-20 w-20 rounded-full bg-white opacity-5" />
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium opacity-80">Total Saldo</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold leading-tight sm:text-3xl">
            {fmt(data?.totalBalance)}
          </p>
          <div className="mt-4 flex items-center gap-1.5">
            <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${netPositive ? "bg-green-400/20 text-green-200" : "bg-red-400/20 text-red-200"}`}>
              {netPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {data?.thisMonth?.netCashFlow > 0 ? "+" : ""}{fmt(data?.thisMonth?.netCashFlow)}
            </span>
            <span className="text-xs opacity-60">bulan ini</span>
          </div>
        </div>

        {/* Pemasukan */}
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pemasukan</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">
            {fmt(data?.thisMonth?.income)}
          </p>
          <div className="mt-3 flex items-center gap-1.5">
            <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${incomeIsUp ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10" : "bg-red-50 text-red-500 dark:bg-red-500/10"}`}>
              {incomeTrend}
            </span>
            <span className="text-xs text-gray-400">vs bulan lalu</span>
          </div>
        </div>

        {/* Pengeluaran */}
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pengeluaran</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500 dark:bg-red-500/10">
              <TrendingDown className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">
            {fmt(data?.thisMonth?.expense)}
          </p>
          <div className="mt-3 flex items-center gap-1.5">
            <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${expenseIsUp ? "bg-red-50 text-red-500 dark:bg-red-500/10" : "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10"}`}>
              {expenseTrend}
            </span>
            <span className="text-xs text-gray-400">vs bulan lalu</span>
          </div>
        </div>

        {/* Net Cash Flow */}
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Net Cash Flow</p>
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${netPositive ? "bg-primary-50 text-primary-500 dark:bg-primary-500/10" : "bg-red-50 text-red-500 dark:bg-red-500/10"}`}>
              <CreditCard className="h-4 w-4" />
            </div>
          </div>
          <p className={`text-2xl font-extrabold ${netPositive ? "text-primary-500" : "text-red-500"}`}>
            {data?.thisMonth?.netCashFlow > 0 ? "+" : ""}{fmt(data?.thisMonth?.netCashFlow)}
          </p>
          <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">Pemasukan − Pengeluaran</p>
        </div>
      </div>

      {/* ── Row 2: Charts ── */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Bar Chart */}
        <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2 dark:bg-gray-800">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-800 dark:text-gray-200">Tren Arus Kas</h3>
              <p className="text-xs text-gray-400 mt-0.5">Perbandingan pemasukan & pengeluaran tahun ini</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-primary-500" />
                Pemasukan
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-red-400" />
                Pengeluaran
              </span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} tickFormatter={(val) => `${val / 1000000}M`} />
                <Tooltip
                  cursor={{ fill: "#f9fafb", radius: 6 }}
                  contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: 12 }}
                  formatter={(value) => fmt(value)}
                />
                <Bar dataKey="income" name="Pemasukan" fill="#628263" radius={[5, 5, 0, 0]} maxBarSize={28} />
                <Bar dataKey="expense" name="Pengeluaran" fill="#f87171" radius={[5, 5, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="mb-4">
            <h3 className="font-bold text-gray-800 dark:text-gray-200">Pengeluaran / Kategori</h3>
            <p className="text-xs text-gray-400 mt-0.5">Top kategori bulan ini</p>
          </div>
          {data?.expenseByCategory?.length > 0 ? (
            <>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.expenseByCategory}
                      innerRadius={52}
                      outerRadius={72}
                      paddingAngle={4}
                      dataKey="total"
                    >
                      {data.expenseByCategory.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: 12 }}
                      formatter={(value) => fmt(value)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="mt-3 flex flex-col gap-2.5">
                {data.expenseByCategory.slice(0, 4).map((cat, idx) => (
                  <li key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                      <span className="truncate text-sm text-gray-600 dark:text-gray-400">{cat.category}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="text-xs text-gray-400">{cat.percentage}%</span>
                      <span className="rounded-lg bg-gray-50 px-2 py-0.5 text-xs font-bold text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                        {fmt(cat.total)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <EmptyState icon={DollarSign} title="Belum ada pengeluaran" description="Belum ada pengeluaran bulan ini." />
          )}
        </div>
      </div>

      {/* ── Row 3: Transactions + Right Column ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Transactions */}
        <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2 dark:bg-gray-800">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-800 dark:text-gray-200">Transaksi Terakhir</h3>
              <p className="text-xs text-gray-400 mt-0.5">5 transaksi terkini</p>
            </div>
            <Link to="/transactions" className="flex items-center gap-1 rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-bold text-primary-600 transition hover:bg-primary-100 dark:bg-primary-500/10 dark:text-primary-400">
              Semua <ArrowRight className="h-3.5 w-3.5" />
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
            <ul className="flex flex-col divide-y divide-gray-50 dark:divide-gray-700/50">
              {data?.recentTransactions?.map((tx) => (
                <li key={tx.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3.5">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tx.type === "income" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10" : "bg-red-50 text-red-500 dark:bg-red-500/10"}`}>
                      {tx.type === "income" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-gray-900 dark:text-gray-100">
                        {tx.description || tx.category?.name}
                      </p>
                      <div className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-400">
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 font-medium text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                          {tx.category?.name}
                        </span>
                        <span>·</span>
                        <span>{tx.account?.name}</span>
                        <span>·</span>
                        <span>
                          {new Date(tx.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className={`shrink-0 ml-3 text-sm font-extrabold tabular-nums ${tx.type === "income" ? "text-emerald-600" : "text-red-500"}`}>
                    {tx.type === "income" ? "+" : "−"}Rp {tx.amount.toLocaleString("id-ID")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          {/* Budget Progress */}
          <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-800 dark:text-gray-200">Budget</h3>
                <p className="text-xs text-gray-400 mt-0.5">Progres pengeluaran bulan ini</p>
              </div>
              <Link to="/budgets" className="text-xs font-semibold text-primary-500 hover:underline">
                Detail
              </Link>
            </div>
            {data?.budgets?.length > 0 ? (
              <div className="flex flex-col gap-5">
                {data.budgets.slice(0, 3).map((b) => {
                  const percent = Math.min((b.spentAmount / b.amount) * 100, 100).toFixed(0);
                  const isWarning = percent >= 80;
                  return (
                    <div key={b.id}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{b.category?.name}</span>
                        {isWarning && (
                          <span className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-500 dark:bg-red-500/10">
                            <AlertTriangle className="h-3 w-3" /> Hampir habis
                          </span>
                        )}
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${isWarning ? "bg-red-500" : "bg-primary-500"}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="mt-1.5 flex justify-between text-xs text-gray-400">
                        <span>Rp {b.spentAmount?.toLocaleString("id-ID")}</span>
                        <span className="font-semibold">{percent}% dari Rp {b.amount?.toLocaleString("id-ID")}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState icon={Wallet} title="Belum ada anggaran" description="Belum ada anggaran bulan ini." actionLabel="Buat Anggaran" actionLink="/budgets" />
            )}
          </div>

          {/* Savings Progress */}
          <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-800 dark:text-gray-200">Target Tabungan</h3>
                <p className="text-xs text-gray-400 mt-0.5">Progres menuju targetmu</p>
              </div>
              <Link to="/saving-goals" className="text-xs font-semibold text-primary-500 hover:underline">
                Detail
              </Link>
            </div>
            {data?.savings?.length > 0 ? (
              <div className="flex flex-col gap-5">
                {data.savings.slice(0, 2).map((s) => {
                  const percent = Math.min((s.savedAmount / s.targetAmount) * 100, 100).toFixed(0);
                  return (
                    <div key={s.id}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{s.name}</span>
                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                          {percent}%
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                        <div
                          className="h-full rounded-full bg-blue-500 transition-all duration-700"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="mt-1.5 flex justify-between text-xs text-gray-400">
                        <span>Rp {s.savedAmount?.toLocaleString("id-ID")}</span>
                        <span>/ Rp {s.targetAmount?.toLocaleString("id-ID")}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState icon={DollarSign} title="Belum ada target" description="Mulai menabung dengan membuat target pertamamu." actionLabel="Tambah Tabungan" actionLink="/saving-goals" />
            )}
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
            <h3 className="mb-4 font-bold text-gray-800 dark:text-gray-200">Aksi Cepat</h3>
            <div className="flex flex-col gap-2.5">
              <Link
                to="/transactions"
                className="flex items-center justify-between rounded-xl bg-primary-500 px-4 py-3 font-bold text-white transition hover:bg-primary-600"
              >
                <div className="flex items-center gap-2.5">
                  <Receipt className="h-4 w-4" />
                  Catat Transaksi
                </div>
                <ArrowRight className="h-4 w-4 opacity-70" />
              </Link>
              <Link
                to="/saving-goals"
                className="flex items-center justify-between rounded-xl border-2 border-primary-200 bg-primary-50 px-4 py-3 font-bold text-primary-600 transition hover:border-primary-400 hover:bg-primary-100 dark:border-primary-700 dark:bg-primary-500/10 dark:text-primary-400"
              >
                <div className="flex items-center gap-2.5">
                  <PiggyBank className="h-4 w-4" />
                  Tambah Tabungan
                </div>
                <ArrowRight className="h-4 w-4 opacity-70" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
