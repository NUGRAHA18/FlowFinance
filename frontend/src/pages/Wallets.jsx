import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";

export default function Wallets() {
  const [wallets, setWallets] = useState([]);
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
      console.error("Gagal memuat dompet");
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/wallets", {
        ...formData,
        balance: Number(formData.balance),
      });
      setFormData({ name: "", type: "bank", balance: 0 });
      fetchWallets();
    } catch (err) {
      alert("Gagal menambah dompet");
    }
  };

  return (
    <Layout>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Dompet Saya</h2>
      </div>

      {/* Form Tambah Dompet */}
      <div className="mb-10 rounded-3xl bg-white p-8 shadow-sm">
        <h3 className="mb-6 text-xl font-bold text-gray-800">
          Tambah Dompet Baru
        </h3>
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap items-end gap-6"
        >
          <div className="flex-1 min-w-[200px]">
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Nama Dompet
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#628263] focus:bg-white focus:ring-2 focus:ring-[#628263]/20"
              placeholder="Misal: BCA Utama"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Tipe
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#628263] focus:bg-white focus:ring-2 focus:ring-[#628263]/20"
            >
              <option value="bank">Bank</option>
              <option value="ewallet">E-Wallet</option>
              <option value="cash">Tunai</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Saldo Awal
            </label>
            <input
              type="number"
              required
              value={formData.balance}
              onChange={(e) =>
                setFormData({ ...formData, balance: e.target.value })
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#628263] focus:bg-white focus:ring-2 focus:ring-[#628263]/20"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-[#628263] px-8 py-3 font-bold text-white transition hover:bg-[#4d684e] shadow-md"
          >
            Simpan
          </button>
        </form>
      </div>

      {/* Daftar Dompet */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {wallets.map((wallet) => (
          <div
            key={wallet.id}
            className="flex flex-col justify-between rounded-3xl bg-white p-6 shadow-sm border-t-4 border-[#628263]"
          >
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="rounded-full bg-[#f0f4f1] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#628263]">
                  {wallet.type}
                </span>
                <span className="text-gray-400">💳</span>
              </div>
              <h4 className="mt-4 text-xl font-bold text-gray-800">
                {wallet.name}
              </h4>
            </div>
            <p className="mt-6 text-2xl font-bold text-gray-900">
              Rp {wallet.balance.toLocaleString("id-ID")}
            </p>
          </div>
        ))}
      </div>
    </Layout>
  );
}
