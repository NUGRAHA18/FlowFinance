import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import { toast } from "../components/Toast";
import LoadingButton from "../components/LoadingButton";
import EmptyState from "../components/EmptyState";
import { SkeletonList } from "../components/Skeleton";
import useDebounce from "../hooks/useDebounce";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Download,
  Search,
} from "lucide-react";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [wallets, setWallets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Filter state
  const [filters, setFilters] = useState({
    type: "",
    categoryId: "",
    accountId: "",
    startDate: "",
    endDate: "",
    search: "",
  });

  const debouncedFilters = useDebounce(filters, 400);

  const emptyForm = {
    type: "expense",
    accountId: "",
    categoryId: "",
    amount: "",
    description: "",
    toAccountId: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  const fetchTransactions = async (page = 1) => {
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (debouncedFilters.type) params.append("type", debouncedFilters.type);
      if (debouncedFilters.categoryId) params.append("categoryId", debouncedFilters.categoryId);
      if (debouncedFilters.accountId) params.append("accountId", debouncedFilters.accountId);
      if (debouncedFilters.startDate) params.append("startDate", debouncedFilters.startDate);
      if (debouncedFilters.endDate) params.append("endDate", debouncedFilters.endDate);
      if (debouncedFilters.search) params.append("search", debouncedFilters.search);

      const res = await api.get(`/transactions?${params}`);
      setTransactions(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error("Gagal memuat transaksi", err);
    } finally {
      setInitialLoading(false);
    }
  };

  const fetchMeta = async () => {
    try {
      const [walletRes, catRes] = await Promise.all([
        api.get("/wallets"),
        api.get("/categories"),
      ]);
      setWallets(walletRes.data);
      setCategories(catRes.data);
      if (!formData.accountId && walletRes.data.length > 0)
        setFormData((prev) => ({ ...prev, accountId: walletRes.data[0].id }));
    } catch (err) {
      console.error("Gagal memuat data", err);
    }
  };

  useEffect(() => {
    fetchMeta();
    fetchTransactions();
  }, []);

  useEffect(() => {
    fetchTransactions(1);
  }, [debouncedFilters]);

  const isTransfer = formData.type === "transfer";
  const filteredCategories = categories.filter((c) => c.type === formData.type);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isTransfer && !formData.categoryId) return toast.error("Pilih kategori terlebih dahulu!");
    if (isTransfer && !formData.toAccountId) return toast.error("Pilih dompet tujuan!");
    setLoading(true);
    try {
      const payload = {
        accountId: formData.accountId,
        amount: Number(formData.amount),
        type: formData.type,
      };

      if (isTransfer) {
        payload.toAccountId = formData.toAccountId;
        payload.description = formData.description || "Transfer antar dompet";
      } else {
        payload.categoryId = formData.categoryId;
        payload.description = formData.description;
      }

      if (editingId) {
        await api.put(`/transactions/${editingId}`, payload);
        setEditingId(null);
      } else {
        await api.post("/transactions", payload);
      }

      toast.success(editingId ? "Transaksi berhasil diubah" : "Transaksi berhasil dicatat");
      setFormData({ ...emptyForm, accountId: formData.accountId });
      fetchTransactions(pagination.page);
      fetchMeta(); // refresh saldo
    } catch (err) {
      const msg = err.response?.data?.details?.join(", ") || err.response?.data?.error;
      toast.error(msg || (editingId ? "Gagal mengubah transaksi" : "Gagal mencatat transaksi"));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (tx) => {
    setEditingId(tx.id);
    setFormData({
      type: tx.type === "transfer" ? "transfer" : tx.type,
      accountId: tx.accountId,
      categoryId: tx.categoryId || "",
      amount: tx.amount,
      description: tx.description || "",
      toAccountId: "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ ...emptyForm, accountId: wallets[0]?.id || "" });
  };

  const handleDelete = async (tx) => {
    const confirmed = window.confirm(
      `Hapus transaksi "${tx.description}"?\nSaldo dompet akan dikembalikan seperti semula.`
    );
    if (!confirmed) return;

    try {
      await api.delete(`/transactions/${tx.id}`);
      fetchTransactions(pagination.page);
      fetchMeta();
      toast.success("Transaksi berhasil dihapus");
    } catch (err) {
      toast.error("Gagal menghapus transaksi");
    }
  };

  const resetFilters = () => {
    setFilters({ type: "", categoryId: "", accountId: "", startDate: "", endDate: "", search: "" });
  };

  const handleExportCSV = async () => {
    try {
      const res = await api.get("/export/transactions", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "transaksi-flowfinance.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Data transaksi berhasil diexport");
    } catch (err) {
      toast.error("Gagal mengexport data");
    }
  };

  const getTypeIcon = (type) => {
    if (type === "income") return { icon: <ArrowDownLeft className="h-5 w-5" />, bg: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" };
    if (type === "transfer") return { icon: <ArrowLeftRight className="h-5 w-5" />, bg: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" };
    return { icon: <ArrowUpRight className="h-5 w-5" />, bg: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" };
  };

  const getTypeColor = (type) => {
    if (type === "income") return "text-primary-500 dark:text-primary-400";
    if (type === "transfer") return "text-blue-600 dark:text-blue-400";
    return "text-gray-900 dark:text-gray-100";
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-gray-100 outline-none transition focus:border-primary-500 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-primary-500/20";

  const filterInputClass =
    "rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-primary-500";

  return (
    <Layout>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Transaksi Saya</h2>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 rounded-xl bg-white dark:bg-gray-800 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm transition hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Form Tambah/Edit Transaksi */}
      <div className="mb-10 rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            {editingId ? "Edit Transaksi" : "Catat Transaksi Baru"}
          </h3>
          {editingId && (
            <button
              onClick={handleCancelEdit}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 transition hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Batal Edit
            </button>
          )}
        </div>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">Tipe</label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value, categoryId: "", toAccountId: "" })
              }
              className={inputClass}
            >
              <option value="expense">Pengeluaran</option>
              <option value="income">Pemasukan</option>
              <option value="transfer">Transfer</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
              {isTransfer ? "Dompet Asal" : "Dompet"}
            </label>
            <select
              required
              value={formData.accountId}
              onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
              className={inputClass}
            >
              <option value="">Pilih Dompet...</option>
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>

          {isTransfer ? (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">Dompet Tujuan</label>
              <select
                required
                value={formData.toAccountId}
                onChange={(e) => setFormData({ ...formData, toAccountId: e.target.value })}
                className={inputClass}
              >
                <option value="">Pilih Tujuan...</option>
                {wallets
                  .filter((w) => w.id !== formData.accountId)
                  .map((w) => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">Kategori</label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className={inputClass}
              >
                <option value="">Pilih Kategori...</option>
                {filteredCategories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">Nominal (Rp)</label>
            <input
              type="number"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className={inputClass}
              placeholder="0"
            />
          </div>
          <div className={isTransfer ? "" : "lg:col-span-2"}>
            <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">Keterangan</label>
            <input
              type="text"
              required={!isTransfer}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={inputClass}
              placeholder={isTransfer ? "Opsional" : "Misal: Beli makan siang"}
            />
          </div>
          <div className="flex items-end lg:col-span-3">
            <LoadingButton
              type="submit"
              loading={loading}
              className={`w-full rounded-xl py-4 font-bold text-white transition shadow-md ${
                editingId
                  ? "bg-amber-500 hover:bg-amber-600"
                  : isTransfer
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-primary-500 hover:bg-primary-600"
              }`}
            >
              {editingId ? "Simpan Perubahan" : isTransfer ? "Transfer Sekarang" : "Simpan Transaksi"}
            </LoadingButton>
          </div>
        </form>
      </div>

      {/* Filter */}
      <div className="mb-6 rounded-3xl bg-white dark:bg-gray-800 p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Filter</h3>
          <button
            onClick={resetFilters}
            className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            Reset Filter
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          <div className="relative col-span-2 md:col-span-3 lg:col-span-6 mb-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-primary-500 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              placeholder="Cari berdasarkan keterangan..."
            />
          </div>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className={filterInputClass}
          >
            <option value="">Semua Tipe</option>
            <option value="income">Pemasukan</option>
            <option value="expense">Pengeluaran</option>
            <option value="transfer">Transfer</option>
          </select>
          <select
            value={filters.accountId}
            onChange={(e) => setFilters({ ...filters, accountId: e.target.value })}
            className={filterInputClass}
          >
            <option value="">Semua Dompet</option>
            {wallets.map((w) => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
          <select
            value={filters.categoryId}
            onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
            className={filterInputClass}
          >
            <option value="">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            className={filterInputClass}
            placeholder="Dari tanggal"
          />
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            className={filterInputClass}
            placeholder="Sampai tanggal"
          />
        </div>
      </div>

      {/* Daftar Transaksi */}
      <div className="rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Riwayat Transaksi</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">{pagination.total} transaksi</span>
        </div>
        {initialLoading ? (
          <SkeletonList />
        ) : transactions.length === 0 ? (
          <EmptyState
            icon={ArrowLeftRight}
            title="Belum ada transaksi"
            description="Mulai catat pemasukan dan pengeluaranmu untuk memantau keuangan."
            actionLabel="Catat Transaksi Pertamamu"
            onAction={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          />
        ) : (
          <>
            <ul className="flex flex-col gap-4">
              {transactions.map((tx) => {
                const { icon, bg } = getTypeIcon(tx.type);
                return (
                  <li
                    key={tx.id}
                    className="flex flex-col gap-3 rounded-2xl bg-gray-50 dark:bg-gray-700 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${bg}`}>
                        {icon}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-gray-100">{tx.description}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {tx.account?.name}
                          {tx.category?.name && ` • ${tx.category.name}`}
                          {" • "}
                          {new Date(tx.date).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <p className={`text-xl font-bold ${getTypeColor(tx.type)}`}>
                        {tx.type === "income" ? "+" : tx.type === "transfer" ? "" : "-"} Rp{" "}
                        {tx.amount.toLocaleString("id-ID")}
                      </p>
                      <div className="flex gap-2">
                        {tx.type !== "transfer" && (
                          <button
                            onClick={() => handleEdit(tx)}
                            className="rounded-lg bg-amber-50 dark:bg-amber-900/30 px-3 py-2 text-sm font-medium text-amber-600 dark:text-amber-400 transition hover:bg-amber-100 dark:hover:bg-amber-900/50"
                          >
                            Edit
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(tx)}
                          className="rounded-lg bg-red-50 dark:bg-red-900/30 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 transition hover:bg-red-100 dark:hover:bg-red-900/50"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => fetchTransactions(pagination.page - 1)}
                  className="rounded-lg border border-gray-200 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 transition hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Sebelumnya
                </button>
                <span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                  {pagination.page} / {pagination.totalPages}
                </span>
                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => fetchTransactions(pagination.page + 1)}
                  className="rounded-lg border border-gray-200 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 transition hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Berikutnya
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
