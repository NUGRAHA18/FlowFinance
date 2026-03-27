import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    type: "expense",
    accountId: "",
    categoryId: "",
    amount: "",
    description: "",
  });

  const fetchData = async () => {
    try {
      const [txRes, walletRes, catRes] = await Promise.all([
        api.get("/transactions"),
        api.get("/wallets"),
        api.get("/categories"),
      ]);
      setTransactions(txRes.data);
      setWallets(walletRes.data);
      setCategories(catRes.data);
      if (walletRes.data.length > 0)
        setFormData((prev) => ({ ...prev, accountId: walletRes.data[0].id }));
    } catch (err) {
      console.error("Gagal memuat data", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredCategories = categories.filter((c) => c.type === formData.type);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.categoryId) return alert("Pilih kategori terlebih dahulu!");
    try {
      await api.post("/transactions", {
        ...formData,
        amount: Number(formData.amount),
      });
      setFormData({ ...formData, amount: "", description: "", categoryId: "" });
      fetchData();
    } catch (err) {
      alert("Gagal mencatat transaksi");
    }
  };

  return (
    <Layout>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Transaksi Saya</h2>
      </div>

      {/* Form Tambah Transaksi */}
      <div className="mb-10 rounded-3xl bg-white p-8 shadow-sm">
        <h3 className="mb-6 text-xl font-bold text-gray-800">
          Catat Transaksi Baru
        </h3>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-600">
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
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#628263] focus:bg-white focus:ring-2 focus:ring-[#628263]/20"
            >
              <option value="expense">Pengeluaran</option>
              <option value="income">Pemasukan</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Dompet
            </label>
            <select
              required
              value={formData.accountId}
              onChange={(e) =>
                setFormData({ ...formData, accountId: e.target.value })
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#628263] focus:bg-white focus:ring-2 focus:ring-[#628263]/20"
            >
              <option value="">Pilih Dompet...</option>
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Kategori
            </label>
            <select
              required
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#628263] focus:bg-white focus:ring-2 focus:ring-[#628263]/20"
            >
              <option value="">Pilih Kategori...</option>
              {filteredCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Nominal (Rp)
            </label>
            <input
              type="number"
              required
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#628263] focus:bg-white focus:ring-2 focus:ring-[#628263]/20"
              placeholder="0"
            />
          </div>
          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Keterangan
            </label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#628263] focus:bg-white focus:ring-2 focus:ring-[#628263]/20"
              placeholder="Misal: Beli makan siang"
            />
          </div>
          <div className="flex items-end lg:col-span-3">
            <button
              type="submit"
              className="w-full rounded-xl bg-[#628263] py-4 font-bold text-white transition hover:bg-[#4d684e] shadow-md"
            >
              Simpan Transaksi
            </button>
          </div>
        </form>
      </div>

      {/* Daftar Transaksi */}
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h3 className="mb-6 text-xl font-bold text-gray-800">
          Riwayat Transaksi
        </h3>
        {transactions.length === 0 ? (
          <p className="text-gray-500">Belum ada transaksi.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {transactions.map((tx) => (
              <li
                key={tx.id}
                className="flex flex-col gap-2 rounded-2xl bg-gray-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-0"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${tx.type === "income" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                  >
                    {tx.type === "income" ? "↓" : "↑"}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{tx.description}</p>
                    <p className="text-sm text-gray-500">
                      {tx.account?.name} • {tx.category?.name} •{" "}
                      {new Date(tx.date).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>
                <p
                  className={`text-xl font-bold ${tx.type === "income" ? "text-[#628263]" : "text-gray-900"}`}
                >
                  {tx.type === "income" ? "+" : "-"} Rp{" "}
                  {tx.amount.toLocaleString("id-ID")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
