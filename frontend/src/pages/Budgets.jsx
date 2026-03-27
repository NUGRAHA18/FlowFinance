import { useEffect, useState } from "react";
import { Target, Trash2, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import api from "../api/axios";
import Layout from "../components/Layout";
import { toast } from "../components/Toast";
import LoadingButton from "../components/LoadingButton";
import EmptyState from "../components/EmptyState";
import { SkeletonCard } from "../components/Skeleton";

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [expandedBudget, setExpandedBudget] = useState(null);

  const [formData, setFormData] = useState({
    categoryId: "",
    amount: "",
    month: "",
  });

  const fetchData = async () => {
    try {
      const [budgetRes, catRes] = await Promise.all([
        api.get("/budgets"),
        api.get("/categories"),
      ]);
      setBudgets(budgetRes.data);
      setCategories(catRes.data.filter((c) => c.type === "expense"));
    } catch (err) {
      console.error("Gagal memuat data anggaran");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/budgets", {
        ...formData,
        amount: Number(formData.amount),
      });
      setFormData({ categoryId: "", amount: "", month: "" });
      fetchData();
      toast.success("Anggaran berhasil dibuat");
    } catch (err) {
      toast.error(err.response?.data?.error || "Gagal membuat anggaran");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (budget) => {
    const confirmed = window.confirm(
      `Hapus anggaran "${budget.category?.name}" untuk bulan ${budget.month}?`
    );
    if (!confirmed) return;
    try {
      await api.delete(`/budgets/${budget.id}`);
      fetchData();
      toast.success("Anggaran berhasil dihapus");
    } catch (err) {
      toast.error("Gagal menghapus anggaran");
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return "bg-red-500";
    if (percentage >= 80) return "bg-amber-500";
    return "bg-primary-500";
  };

  const getStatusBadge = (percentage) => {
    if (percentage >= 100)
      return { text: "Melebihi!", bg: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" };
    if (percentage >= 80)
      return { text: "Hampir Habis", bg: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" };
    return { text: "Aman", bg: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" };
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-gray-100 outline-none transition focus:border-primary-500 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-primary-500/20";

  return (
    <Layout>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Manajemen Anggaran</h2>
      </div>

      {/* Form Tambah Anggaran */}
      <div className="mb-10 rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-sm">
        <h3 className="mb-6 text-xl font-bold text-gray-800 dark:text-gray-200">
          Buat Anggaran Baru
        </h3>
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap items-end gap-6"
        >
          <div className="flex-1 min-w-[200px]">
            <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
              Kategori
            </label>
            <select
              required
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              className={inputClass}
            >
              <option value="">Pilih Kategori...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
              Bulan (YYYY-MM)
            </label>
            <input
              type="month"
              required
              value={formData.month}
              onChange={(e) =>
                setFormData({ ...formData, month: e.target.value })
              }
              className={inputClass}
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
              Batas Maksimal (Rp)
            </label>
            <input
              type="number"
              required
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className={inputClass}
              placeholder="0"
            />
          </div>
          <LoadingButton
            type="submit"
            loading={loading}
            className="rounded-xl bg-primary-500 px-8 py-3 font-bold text-white transition hover:bg-primary-600 shadow-md"
          >
            Simpan
          </LoadingButton>
        </form>
      </div>

      {/* Daftar Anggaran */}
      {pageLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : budgets.length === 0 ? (
        <EmptyState
          icon={Target}
          title="Belum Ada Anggaran"
          description="Buat anggaran pertama Anda untuk mulai mengontrol pengeluaran."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {budgets.map((b) => {
            const spent = b.spentAmount || 0;
            const percentage = b.amount > 0 ? Math.round((spent / b.amount) * 100) : 0;
            const remaining = b.amount - spent;
            const status = getStatusBadge(percentage);

            return (
              <div
                key={b.id}
                className="rounded-3xl bg-white dark:bg-gray-800 p-6 shadow-sm border-t-4 border-primary-500"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    {b.category?.name}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-gray-100 dark:bg-gray-700 px-3 py-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                      {b.month}
                    </span>
                    <span className={`rounded-lg px-3 py-1 text-xs font-bold ${status.bg}`}>
                      {status.text}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="my-4">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Terpakai: Rp {spent.toLocaleString("id-ID")}
                    </span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">{percentage}%</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                    <div
                      className={`h-full transition-all duration-500 ${getProgressColor(percentage)}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Batas Anggaran</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      Rp {b.amount.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Sisa</p>
                    <p className={`text-lg font-bold ${remaining < 0 ? "text-red-500" : "text-primary-500"}`}>
                      {remaining < 0 ? "-" : ""} Rp {Math.abs(remaining).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>

                {/* Toggle Detail Transaksi */}
                <button
                  onClick={() => setExpandedBudget(expandedBudget === b.id ? null : b.id)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-50 dark:bg-gray-700 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                >
                  {expandedBudget === b.id ? (
                    <><ChevronUp className="h-4 w-4" /> Sembunyikan Detail</>
                  ) : (
                    <><ChevronDown className="h-4 w-4" /> Lihat {b.transactions?.length || 0} Transaksi</>
                  )}
                </button>

                {/* Detail Transaksi */}
                {expandedBudget === b.id && (
                  <div className="mt-3 rounded-xl bg-gray-50 dark:bg-gray-700 p-4 animate-fade-in">
                    {(!b.transactions || b.transactions.length === 0) ? (
                      <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-2">
                        Belum ada transaksi untuk anggaran ini.
                      </p>
                    ) : (
                      <ul className="flex flex-col gap-2">
                        {b.transactions.map((tx) => (
                          <li
                            key={tx.id}
                            className="flex items-center justify-between rounded-lg bg-white dark:bg-gray-800 px-3 py-2.5"
                          >
                            <div>
                              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                {tx.description || "Tanpa keterangan"}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {tx.account?.name} &bull; {new Date(tx.date).toLocaleDateString("id-ID")}
                              </p>
                            </div>
                            <span className="text-sm font-bold text-red-500">
                              -Rp {tx.amount.toLocaleString("id-ID")}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                <button
                  onClick={() => handleDelete(b)}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-red-100 dark:border-red-900/30 bg-transparent py-2 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                >
                  <Trash2 className="h-4 w-4" />
                  Hapus Anggaran
                </button>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
