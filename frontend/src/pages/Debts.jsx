import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import { toast } from "../components/Toast";
import LoadingButton from "../components/LoadingButton";
import EmptyState from "../components/EmptyState";
import { SkeletonCard } from "../components/Skeleton";
import { Handshake, CheckCircle, Clock, Trash2 } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-gray-100 outline-none transition focus:border-primary-500 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-primary-500/20";

export default function Debts() {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    personName: "",
    amount: "",
    dueDate: "",
  });

  const fetchDebts = async () => {
    try {
      const res = await api.get("/debts");
      setDebts(res.data);
    } catch (err) {
      toast.error("Gagal memuat daftar hutang");
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchDebts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/debts", {
        ...formData,
        amount: Number(formData.amount),
      });
      setFormData({ personName: "", amount: "", dueDate: "" });
      fetchDebts();
      toast.success("Hutang berhasil dicatat");
    } catch (err) {
      const msg = err.response?.data?.details?.join(", ") || err.response?.data?.error;
      toast.error(msg || "Gagal mencatat hutang");
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = async (debt) => {
    const confirmed = window.confirm(
      `Tandai hutang ke "${debt.personName}" sebagai lunas?`
    );
    if (!confirmed) return;

    try {
      await api.put(`/debts/${debt.id}/status`, { status: "paid" });
      fetchDebts();
      toast.success(`Hutang ke ${debt.personName} ditandai lunas`);
    } catch (err) {
      toast.error("Gagal mengubah status hutang");
    }
  };

  return (
    <Layout>
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Handshake className="h-8 w-8 text-primary-500" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Pelacak Hutang</h2>
        </div>
      </div>

      {/* Form Tambah Hutang */}
      <div className="mb-10 rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-sm">
        <h3 className="mb-6 text-xl font-bold text-gray-800 dark:text-gray-200">
          Catat Hutang Baru
        </h3>
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap items-end gap-6"
        >
          <div className="flex-1 min-w-[200px]">
            <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
              Nama Pihak/Orang
            </label>
            <input
              type="text"
              required
              value={formData.personName}
              onChange={(e) =>
                setFormData({ ...formData, personName: e.target.value })
              }
              className={inputClass}
              placeholder="Misal: Andi"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
              Nominal (Rp)
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
              Jatuh Tempo
            </label>
            <input
              type="date"
              required
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
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

      {/* Daftar Hutang */}
      {initialLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : debts.length === 0 ? (
        <EmptyState
          title="Belum ada hutang"
          description="Catat hutang pertama kamu di form di atas."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {debts.map((debt) => {
            const isPaid = debt.status === "paid";

            return (
              <div
                key={debt.id}
                className={`flex flex-col justify-between rounded-3xl p-6 shadow-sm transition ${isPaid ? "bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20" : "bg-white dark:bg-gray-800 border-t-4 border-primary-500"}`}
              >
                <div>
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h4
                        className={`text-xl font-bold ${isPaid ? "text-gray-500 dark:text-gray-400 line-through" : "text-gray-800 dark:text-gray-200"}`}
                      >
                        {debt.personName}
                      </h4>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Jatuh Tempo:{" "}
                        {new Date(debt.dueDate).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                    <span
                      className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${isPaid ? "bg-primary-100 dark:bg-primary-500/20 text-primary-500" : "bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400"}`}
                    >
                      {isPaid ? (
                        <CheckCircle className="h-3.5 w-3.5" />
                      ) : (
                        <Clock className="h-3.5 w-3.5" />
                      )}
                      {isPaid ? "Lunas" : "Belum Lunas"}
                    </span>
                  </div>
                  <p
                    className={`mt-4 text-3xl font-bold ${isPaid ? "text-gray-400 dark:text-gray-500" : "text-gray-900 dark:text-gray-100"}`}
                  >
                    Rp {debt.amount.toLocaleString("id-ID")}
                  </p>
                </div>

                {!isPaid && (
                  <button
                    onClick={() => markAsPaid(debt)}
                    className="mt-6 w-full rounded-xl bg-gray-800 dark:bg-gray-700 py-3 text-sm font-bold text-white hover:bg-gray-900 dark:hover:bg-gray-600 transition"
                  >
                    Tandai Lunas
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
