import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import { toast } from "../components/Toast";
import LoadingButton from "../components/LoadingButton";
import EmptyState from "../components/EmptyState";
import { SkeletonCard } from "../components/Skeleton";
import { CalendarClock, Trash2, Repeat } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-gray-100 outline-none transition focus:border-primary-500 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-primary-500/20";

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    cost: "",
    billingCycle: "monthly",
    nextPayment: "",
  });

  const fetchSubscriptions = async () => {
    try {
      const res = await api.get("/subscriptions");
      setSubscriptions(res.data);
    } catch (err) {
      toast.error("Gagal memuat daftar langganan");
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/subscriptions", {
        ...formData,
        cost: Number(formData.cost),
      });
      setFormData({
        name: "",
        cost: "",
        billingCycle: "monthly",
        nextPayment: "",
      });
      fetchSubscriptions();
      toast.success("Langganan berhasil ditambahkan");
    } catch (err) {
      const msg = err.response?.data?.details?.join(", ") || err.response?.data?.error;
      toast.error(msg || "Gagal mencatat langganan");
    } finally {
      setLoading(false);
    }
  };

  const deleteSubscription = async (sub) => {
    const confirmed = window.confirm(
      `Hapus langganan "${sub.name}"?`
    );
    if (!confirmed) return;
    try {
      await api.delete(`/subscriptions/${sub.id}`);
      fetchSubscriptions();
      toast.success("Langganan berhasil dihapus");
    } catch (err) {
      toast.error("Gagal menghapus langganan");
    }
  };

  return (
    <Layout>
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarClock className="h-8 w-8 text-primary-500" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Pelacak Langganan</h2>
        </div>
      </div>

      {/* Form Tambah Langganan */}
      <div className="mb-10 rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-sm">
        <h3 className="mb-6 text-xl font-bold text-gray-800 dark:text-gray-200">
          Tambah Tagihan Rutin
        </h3>
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap items-end gap-6"
        >
          <div className="flex-1 min-w-[200px]">
            <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
              Nama Layanan
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={inputClass}
              placeholder="Misal: Netflix"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
              Biaya (Rp)
            </label>
            <input
              type="number"
              required
              value={formData.cost}
              onChange={(e) =>
                setFormData({ ...formData, cost: e.target.value })
              }
              className={inputClass}
              placeholder="0"
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
              Siklus
            </label>
            <select
              value={formData.billingCycle}
              onChange={(e) =>
                setFormData({ ...formData, billingCycle: e.target.value })
              }
              className={inputClass}
            >
              <option value="monthly">Bulanan</option>
              <option value="yearly">Tahunan</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
              Tagihan Berikutnya
            </label>
            <input
              type="date"
              required
              value={formData.nextPayment}
              onChange={(e) =>
                setFormData({ ...formData, nextPayment: e.target.value })
              }
              className={inputClass}
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

      {/* Daftar Langganan */}
      {initialLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : subscriptions.length === 0 ? (
        <EmptyState
          title="Belum ada langganan"
          description="Tambahkan tagihan rutin pertama kamu di form di atas."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {subscriptions.map((sub) => (
            <div
              key={sub.id}
              className="flex flex-col justify-between rounded-3xl bg-white dark:bg-gray-800 p-6 shadow-sm border-t-4 border-primary-500"
            >
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200">{sub.name}</h4>
                  <span className="flex items-center gap-1 rounded-lg bg-gray-100 dark:bg-gray-700 px-3 py-1 text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400">
                    <Repeat className="h-3.5 w-3.5" />
                    {sub.billingCycle === "monthly" ? "Bulanan" : "Tahunan"}
                  </span>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Rp {sub.cost.toLocaleString("id-ID")}
                </p>
                <p className="mt-4 text-sm font-medium text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10 inline-block px-3 py-1 rounded-lg">
                  Jatuh Tempo:{" "}
                  {new Date(sub.nextPayment).toLocaleDateString("id-ID")}
                </p>
              </div>

              <button
                onClick={() => deleteSubscription(sub)}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-red-100 dark:border-red-500/20 bg-transparent py-2.5 text-sm font-bold text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
              >
                <Trash2 className="h-4 w-4" />
                Hapus Langganan
              </button>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
