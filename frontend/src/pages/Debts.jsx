import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import { toast } from "../components/Toast";
import LoadingButton from "../components/LoadingButton";
import EmptyState from "../components/EmptyState";
import { SkeletonCard } from "../components/Skeleton";
import {
  Handshake,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  CreditCard,
} from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-gray-100 outline-none transition focus:border-primary-500 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-primary-500/20";

const smallInputClass =
  "w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none transition focus:border-primary-500 focus:bg-white dark:focus:bg-gray-600";

export default function Debts() {
  const [debts, setDebts] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [expandedDebt, setExpandedDebt] = useState(null);
  const [payForm, setPayForm] = useState({});
  const [formData, setFormData] = useState({
    personName: "",
    amount: "",
    dueDate: "",
  });

  const fetchData = async () => {
    try {
      const [debtRes, walletRes] = await Promise.all([
        api.get("/debts"),
        api.get("/wallets"),
      ]);
      setDebts(debtRes.data);
      setWallets(walletRes.data);
    } catch (err) {
      toast.error("Gagal memuat data");
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
      fetchData();
      toast.success("Hutang berhasil dicatat");
    } catch (err) {
      const msg =
        err.response?.data?.details?.join(", ") || err.response?.data?.error;
      toast.error(msg || "Gagal mencatat hutang");
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (debtId, e) => {
    e.preventDefault();
    const form = payForm[debtId] || {};
    const amount = Number(form.amount);
    if (!amount || amount <= 0)
      return toast.error("Masukkan nominal pembayaran");
    if (!form.accountId) return toast.error("Pilih dompet pembayaran");

    try {
      await api.put(`/debts/${debtId}/pay`, {
        amount,
        accountId: form.accountId,
        note: form.note || "",
      });
      setPayForm((prev) => ({
        ...prev,
        [debtId]: { amount: "", accountId: "", note: "" },
      }));
      fetchData();
      toast.success(`Pembayaran Rp ${amount.toLocaleString("id-ID")} berhasil`);
    } catch (err) {
      toast.error(err.response?.data?.error || "Gagal melakukan pembayaran");
    }
  };

  const getPayFormValue = (debtId, field) => payForm[debtId]?.[field] || "";
  const updatePayForm = (debtId, field, value) => {
    setPayForm((prev) => ({
      ...prev,
      [debtId]: { ...prev[debtId], [field]: value },
    }));
  };

  return (
    <Layout>
      <div className="mb-8 flex items-center gap-3">
        <Handshake className="h-8 w-8 text-primary-500" />
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Pelacak Hutang
        </h2>
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
        <SkeletonCard count={3} />
      ) : debts.length === 0 ? (
        <EmptyState
          title="Belum ada hutang"
          description="Catat hutang pertama kamu di form di atas."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {debts.map((debt) => {
            const isPaid = debt.status === "paid";
            const isPartial = debt.status === "partial";
            const remaining = debt.amount - (debt.paidAmount || 0);
            const paidPercent =
              debt.amount > 0
                ? Math.round(((debt.paidAmount || 0) / debt.amount) * 100)
                : 0;
            const isExpanded = expandedDebt === debt.id;

            return (
              <div
                key={debt.id}
                className={`flex flex-col rounded-3xl p-6 shadow-sm transition ${
                  isPaid
                    ? "bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20"
                    : "bg-white dark:bg-gray-800 border-t-4 border-primary-500"
                }`}
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
                      className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                        isPaid
                          ? "bg-primary-100 dark:bg-primary-500/20 text-primary-500"
                          : isPartial
                            ? "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                            : "bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400"
                      }`}
                    >
                      {isPaid ? (
                        <CheckCircle className="h-3.5 w-3.5" />
                      ) : (
                        <Clock className="h-3.5 w-3.5" />
                      )}
                      {isPaid
                        ? "Lunas"
                        : isPartial
                          ? "Sebagian"
                          : "Belum Lunas"}
                    </span>
                  </div>

                  <p
                    className={`text-3xl font-bold ${isPaid ? "text-gray-400 dark:text-gray-500" : "text-gray-900 dark:text-gray-100"}`}
                  >
                    Rp {debt.amount.toLocaleString("id-ID")}
                  </p>

                  {/* Progress bar pembayaran */}
                  {(debt.paidAmount || 0) > 0 && (
                    <div className="mt-3">
                      <div className="mb-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>
                          Terbayar: Rp{" "}
                          {(debt.paidAmount || 0).toLocaleString("id-ID")}
                        </span>
                        <span>{paidPercent}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                        <div
                          className={`h-full transition-all duration-500 ${isPaid ? "bg-primary-500" : "bg-blue-500"}`}
                          style={{ width: `${paidPercent}%` }}
                        />
                      </div>
                      {!isPaid && (
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Sisa: Rp {remaining.toLocaleString("id-ID")}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Form Bayar (hanya untuk non-paid) */}
                {!isPaid && (
                  <div className="mt-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 p-4">
                    <p className="mb-3 text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      <CreditCard className="h-4 w-4" /> Bayar Hutang
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <input
                        type="number"
                        placeholder="Nominal"
                        value={getPayFormValue(debt.id, "amount")}
                        onChange={(e) =>
                          updatePayForm(debt.id, "amount", e.target.value)
                        }
                        className={smallInputClass}
                      />
                      <select
                        value={getPayFormValue(debt.id, "accountId")}
                        onChange={(e) =>
                          updatePayForm(debt.id, "accountId", e.target.value)
                        }
                        className={smallInputClass}
                      >
                        <option value="">Dompet...</option>
                        {wallets.map((w) => (
                          <option key={w.id} value={w.id}>
                            {w.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <input
                      type="text"
                      placeholder="Catatan (opsional)"
                      value={getPayFormValue(debt.id, "note")}
                      onChange={(e) =>
                        updatePayForm(debt.id, "note", e.target.value)
                      }
                      className={`${smallInputClass} mb-2`}
                    />
                    <button
                      onClick={(e) => handlePay(debt.id, e)}
                      className="w-full rounded-xl bg-primary-500 py-2.5 text-sm font-bold text-white hover:bg-primary-600 transition"
                    >
                      Bayar Sekarang
                    </button>
                  </div>
                )}

                {/* Riwayat Pembayaran */}
                {debt.payments && debt.payments.length > 0 && (
                  <>
                    <button
                      onClick={() =>
                        setExpandedDebt(isExpanded ? null : debt.id)
                      }
                      className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl bg-gray-50 dark:bg-gray-700 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                      {debt.payments.length} Pembayaran
                    </button>
                    {isExpanded && (
                      <div className="mt-2 flex flex-col gap-1.5 animate-fade-in">
                        {debt.payments.map((p) => (
                          <div
                            key={p.id}
                            className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-gray-700 px-3 py-2"
                          >
                            <div>
                              <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                {new Date(p.paidAt).toLocaleDateString("id-ID")}
                              </p>
                              {p.note && (
                                <p className="text-xs text-gray-400">
                                  {p.note}
                                </p>
                              )}
                            </div>
                            <span className="text-sm font-bold text-primary-500">
                              Rp {p.amount.toLocaleString("id-ID")}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
