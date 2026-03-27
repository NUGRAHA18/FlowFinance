import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import { toast } from "../components/Toast";
import LoadingButton from "../components/LoadingButton";
import EmptyState from "../components/EmptyState";
import { SkeletonCard } from "../components/Skeleton";
import { Tag, ArrowDownLeft, ArrowUpRight, Trash2, Plus } from "lucide-react";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", type: "expense" });

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      toast.error("Gagal memuat kategori");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/categories", formData);
      setFormData({ name: "", type: "expense" });
      fetchCategories();
      toast.success("Kategori berhasil ditambahkan");
    } catch (err) {
      const msg =
        err.response?.data?.details?.join(", ") || err.response?.data?.error;
      toast.error(msg || "Gagal menambah kategori");
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (cat) => {
    const confirmed = window.confirm(
      `Hapus kategori "${cat.name}"?\nTransaksi dan budget terkait mungkin terpengaruh.`,
    );
    if (!confirmed) return;
    try {
      await api.delete(`/categories/${cat.id}`);
      fetchCategories();
      toast.success("Kategori berhasil dihapus");
    } catch (err) {
      toast.error("Gagal menghapus kategori");
    }
  };

  const incomes = categories.filter((c) => c.type === "income");
  const expenses = categories.filter((c) => c.type === "expense");

  const inputClass =
    "w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 outline-none transition text-gray-900 dark:text-gray-100 focus:border-primary-500 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-primary-500/20";

  return (
    <Layout>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Kategori Keuangan
        </h2>
      </div>

      {/* Form Tambah Kategori */}
      <div className="mb-10 rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-sm">
        <h3 className="mb-6 text-xl font-bold text-gray-800 dark:text-gray-200">
          Tambah Kategori Baru
        </h3>
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap items-end gap-6"
        >
          <div className="flex-1 min-w-[200px]">
            <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
              Nama Kategori
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={inputClass}
              placeholder="Misal: Makan"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
              Tipe
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className={inputClass}
            >
              <option value="expense">Pengeluaran (Expense)</option>
              <option value="income">Pemasukan (Income)</option>
            </select>
          </div>
          <LoadingButton
            type="submit"
            loading={loading}
            className="rounded-xl bg-primary-500 px-8 py-3 font-bold text-white transition hover:bg-primary-600 shadow-md flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Simpan
          </LoadingButton>
        </form>
      </div>

      {/* Daftar Kategori */}
      {pageLoading ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Kolom Pemasukan */}
          <div className="rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                <ArrowDownLeft className="h-5 w-5" />
              </span>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                Pemasukan
              </h3>
            </div>
            {incomes.length === 0 ? (
              <EmptyState
                icon={ArrowDownLeft}
                title="Belum ada kategori pemasukan"
                description="Tambahkan kategori pemasukan untuk mengelompokkan sumber pendapatan Anda."
              />
            ) : (
              <ul className="flex flex-col gap-3">
                {incomes.map((cat) => (
                  <li
                    key={cat.id}
                    className="flex items-center justify-between rounded-xl bg-gray-50 dark:bg-gray-700 p-4 transition hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <div className="flex items-center gap-3">
                      <ArrowDownLeft className="h-4 w-4 text-green-500" />
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {cat.name}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteCategory(cat)}
                      className="text-sm font-bold text-red-500 hover:text-red-700 dark:hover:text-red-400 flex items-center gap-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Hapus
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Kolom Pengeluaran */}
          <div className="rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                <ArrowUpRight className="h-5 w-5" />
              </span>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                Pengeluaran
              </h3>
            </div>
            {expenses.length === 0 ? (
              <EmptyState
                icon={ArrowUpRight}
                title="Belum ada kategori pengeluaran"
                description="Tambahkan kategori pengeluaran untuk melacak pengeluaran Anda."
              />
            ) : (
              <ul className="flex flex-col gap-3">
                {expenses.map((cat) => (
                  <li
                    key={cat.id}
                    className="flex items-center justify-between rounded-xl bg-gray-50 dark:bg-gray-700 p-4 transition hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <div className="flex items-center gap-3">
                      <ArrowUpRight className="h-4 w-4 text-red-500" />
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {cat.name}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteCategory(cat)}
                      className="text-sm font-bold text-red-500 hover:text-red-700 dark:hover:text-red-400 flex items-center gap-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Hapus
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
