import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import { toast } from "../components/Toast";
import LoadingButton from "../components/LoadingButton";
import EmptyState from "../components/EmptyState";
import { SkeletonCard } from "../components/Skeleton";
import {
  Wallet,
  CreditCard,
  Smartphone,
  Banknote,
  TrendingUp,
  Trash2,
  Plus,
} from "lucide-react";

const walletTypeIcons = {
  bank: CreditCard,
  ewallet: Smartphone,
  cash: Banknote,
  investment: TrendingUp,
};

export default function Wallets() {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    type: "bank",
    balance: 0,
  });

  const fetchWallets = async () => {
    try {
      const res = await api.get("/wallets");
      setWallets(res.data);
    } catch (err) {
      toast.error("Gagal memuat dompet");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/wallets", {
        ...formData,
        balance: Number(formData.balance),
      });
      setFormData({ name: "", type: "bank", balance: 0 });
      fetchWallets();
      toast.success("Dompet berhasil ditambahkan");
    } catch (err) {
      const msg =
        err.response?.data?.details?.join(", ") || err.response?.data?.error;
      toast.error(msg || "Gagal menambah dompet");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (wallet) => {
    const confirmed = window.confirm(
      `Hapus dompet "${wallet.name}"?\nSemua transaksi terkait juga akan terhapus.`
    );
    if (!confirmed) return;

    try {
      await api.delete(`/wallets/${wallet.id}`);
      fetchWallets();
      toast.success("Dompet berhasil dihapus");
    } catch (err) {
      toast.error("Gagal menghapus dompet");
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 outline-none transition text-gray-900 dark:text-gray-100 focus:border-primary-500 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-primary-500/20";

  return (
    <Layout>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Dompet Saya
        </h2>
      </div>

      {/* Form Tambah Dompet */}
      <div className="mb-10 rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-sm">
        <h3 className="mb-6 text-xl font-bold text-gray-800 dark:text-gray-200">
          Tambah Dompet Baru
        </h3>
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap items-end gap-6"
        >
          <div className="flex-1 min-w-[200px]">
            <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
              Nama Dompet
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={inputClass}
              placeholder="Misal: BCA Utama"
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
              <option value="bank">Bank</option>
              <option value="ewallet">E-Wallet</option>
              <option value="cash">Tunai</option>
              <option value="investment">Investasi</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
              Saldo Awal
            </label>
            <input
              type="number"
              required
              value={formData.balance}
              onChange={(e) =>
                setFormData({ ...formData, balance: e.target.value })
              }
              className={inputClass}
            />
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

      {/* Daftar Dompet */}
      {pageLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : wallets.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="Belum ada dompet"
          description="Tambahkan dompet pertama Anda untuk mulai mencatat keuangan."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {wallets.map((wallet) => {
            const TypeIcon = walletTypeIcons[wallet.type] || Wallet;
            return (
              <div
                key={wallet.id}
                className="flex flex-col justify-between rounded-3xl bg-white dark:bg-gray-800 p-6 shadow-sm border-t-4 border-primary-500"
              >
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-2 rounded-full bg-primary-50 dark:bg-primary-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-500">
                      <TypeIcon className="h-3.5 w-3.5" />
                      {wallet.type}
                    </span>
                  </div>
                  <h4 className="mt-4 text-xl font-bold text-gray-800 dark:text-gray-200">
                    {wallet.name}
                  </h4>
                </div>
                <p className="mt-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Rp {wallet.balance.toLocaleString("id-ID")}
                </p>
                <button
                  onClick={() => handleDelete(wallet)}
                  className="mt-4 w-full rounded-xl border-2 border-red-100 dark:border-red-900/30 bg-transparent py-2 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition flex items-center justify-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Hapus Dompet
                </button>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
