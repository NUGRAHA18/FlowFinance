import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import { toast } from "../components/Toast";
import LoadingButton from "../components/LoadingButton";
import EmptyState from "../components/EmptyState";
import { SkeletonCard } from "../components/Skeleton";
import { RefreshCw, Plus, Pause, Play, Trash2 } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-gray-100 outline-none transition focus:border-primary-500 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-primary-500/20";

export default function RecurringTransactions() {
  const [recurringList, setRecurringList] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [formData, setFormData] = useState({
    type: "expense",
    accountId: "",
    categoryId: "",
    amount: "",
    description: "",
    frequency: "monthly",
    nextRun: "",
  });

  const fetchRecurring = async () => {
    try {
      const res = await api.get("/recurring");
      setRecurringList(res.data);
    } catch (err) {
      toast.error("Gagal memuat transaksi berulang");
    }
  };

  const fetchWallets = async () => {
    try {
      const res = await api.get("/wallets");
      setWallets(res.data);
    } catch (err) {
      toast.error("Gagal memuat daftar akun");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      toast.error("Gagal memuat kategori");
    }
  };

  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchRecurring(), fetchWallets(), fetchCategories()]);
      setPageLoading(false);
    };
    init();
  }, []);

  const filteredCategories = categories.filter(
    (cat) => cat.type === formData.type,
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/recurring", {
        ...formData,
        accountId: Number(formData.accountId),
        categoryId: Number(formData.categoryId),
        amount: Number(formData.amount),
      });
      setFormData({
        type: "expense",
        accountId: "",
        categoryId: "",
        amount: "",
        description: "",
        frequency: "monthly",
        nextRun: "",
      });
      fetchRecurring();
      toast.success("Transaksi berulang berhasil ditambahkan");
    } catch (err) {
      const msg =
        err.response?.data?.details?.join(", ") || err.response?.data?.error;
      toast.error(msg || "Gagal menambah transaksi berulang");
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async () => {
    try {
      const res = await api.post("/recurring/process");
      const count = res.data?.count ?? 0;
      toast.success(`${count} transaksi berulang berhasil diproses`);
      fetchRecurring();
    } catch (err) {
      toast.error("Gagal memproses transaksi berulang");
    }
  };

  const toggleActive = async (item) => {
    try {
      await api.put(`/recurring/${item.id}`, { isActive: !item.isActive });
      fetchRecurring();
      toast.success(
        item.isActive
          ? "Transaksi berulang dijeda"
          : "Transaksi berulang diaktifkan",
      );
    } catch (err) {
      toast.error("Gagal mengubah status");
    }
  };

  const deleteRecurring = async (item) => {
    const confirmed = window.confirm(
      `Hapus transaksi berulang "${item.description || item.category?.name}"?`,
    );
    if (!confirmed) return;
    try {
      await api.delete(`/recurring/${item.id}`);
      fetchRecurring();
      toast.success("Transaksi berulang berhasil dihapus");
    } catch (err) {
      toast.error("Gagal menghapus transaksi berulang");
    }
  };

  const frequencyLabel = (freq) => {
    const map = {
      daily: "Harian",
      weekly: "Mingguan",
      monthly: "Bulanan",
      yearly: "Tahunan",
    };
    return map[freq] || freq;
  };

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <RefreshCw className="h-8 w-8 text-primary-500" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Transaksi Berulang
          </h2>
        </div>
        <LoadingButton
          onClick={handleProcess}
          className="rounded-xl bg-primary-500 px-6 py-3 font-bold text-white transition hover:bg-primary-600 shadow-md"
        >
          <RefreshCw className="h-4 w-4" />
          Proses Sekarang
        </LoadingButton>
      </div>

      {/* Form Tambah Transaksi Berulang */}
      <div className="mb-10 rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-sm">
        <h3 className="mb-6 text-xl font-bold text-gray-800 dark:text-gray-200">
          Tambah Transaksi Berulang
        </h3>
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap items-end gap-6"
        >
          <div className="flex-1 min-w-[150px]">
            <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
              Tipe
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value,
                  categoryId: "",
                })
              }
              className={inputClass}
            >
              <option value="income">Pemasukan</option>
              <option value="expense">Pengeluaran</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
              Akun
            </label>
            <select
              required
              value={formData.accountId}
              onChange={(e) =>
                setFormData({ ...formData, accountId: e.target.value })
              }
              className={inputClass}
            >
              <option value="">Pilih Akun</option>
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
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
              <option value="">Pilih Kategori</option>
              {filteredCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
              Jumlah (Rp)
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
          <div className="flex-1 min-w-[200px]">
            <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
              Deskripsi
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className={inputClass}
              placeholder="Misal: Gaji bulanan"
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
              Frekuensi
            </label>
            <select
              value={formData.frequency}
              onChange={(e) =>
                setFormData({ ...formData, frequency: e.target.value })
              }
              className={inputClass}
            >
              <option value="daily">Harian</option>
              <option value="weekly">Mingguan</option>
              <option value="monthly">Bulanan</option>
              <option value="yearly">Tahunan</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
              Tanggal Berikutnya
            </label>
            <input
              type="date"
              required
              value={formData.nextRun}
              onChange={(e) =>
                setFormData({ ...formData, nextRun: e.target.value })
              }
              className={inputClass}
            />
          </div>
          <LoadingButton
            type="submit"
            loading={loading}
            className="rounded-xl bg-primary-500 px-8 py-3 font-bold text-white transition hover:bg-primary-600 shadow-md"
          >
            <Plus className="h-4 w-4" />
            Simpan
          </LoadingButton>
        </form>
      </div>

      {/* Daftar Transaksi Berulang */}
      {pageLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : recurringList.length === 0 ? (
        <EmptyState
          icon={RefreshCw}
          title="Belum ada transaksi berulang"
          description="Tambahkan transaksi berulang pertama kamu di form di atas."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recurringList.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-3xl bg-white dark:bg-gray-800 p-6 shadow-sm"
            >
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    {item.category?.name}
                  </h4>
                  <span
                    className={`rounded-lg px-3 py-1 text-xs font-bold ${
                      item.isActive
                        ? "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400"
                        : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                    }`}
                  >
                    {item.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.account?.name}
                </p>
                {item.description && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {item.description}
                  </p>
                )}
                <p
                  className={`mt-3 text-2xl font-bold ${
                    item.type === "income" ? "text-primary-500" : "text-red-500"
                  }`}
                >
                  {item.type === "income" ? "+" : "-"} Rp{" "}
                  {item.amount?.toLocaleString("id-ID")}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1 rounded-lg bg-gray-100 dark:bg-gray-700 px-3 py-1 text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400">
                    <RefreshCw className="h-3.5 w-3.5" />
                    {frequencyLabel(item.frequency)}
                  </span>
                  <span className="rounded-lg bg-blue-50 dark:bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                    Berikutnya:{" "}
                    {new Date(item.nextRun).toLocaleDateString("id-ID")}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => toggleActive(item)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 py-2.5 text-sm font-bold transition ${
                    item.isActive
                      ? "border-amber-100 dark:border-amber-500/20 text-amber-500 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10"
                      : "border-green-100 dark:border-green-500/20 text-green-500 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/10"
                  }`}
                >
                  {item.isActive ? (
                    <>
                      <Pause className="h-4 w-4" />
                      Jeda
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Aktifkan
                    </>
                  )}
                </button>
                <button
                  onClick={() => deleteRecurring(item)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-red-100 dark:border-red-500/20 bg-transparent py-2.5 text-sm font-bold text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                >
                  <Trash2 className="h-4 w-4" />
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
