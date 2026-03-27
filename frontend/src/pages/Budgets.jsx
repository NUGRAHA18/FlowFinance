import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);

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
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/budgets", {
        ...formData,
        amount: Number(formData.amount),
      });
      setFormData({ categoryId: "", amount: "", month: "" });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || "Gagal membuat anggaran");
    }
  };

  return (
    <Layout>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Manajemen Anggaran</h2>
      </div>

      {/* Form Tambah Anggaran */}
      <div className="mb-10 rounded-3xl bg-white p-8 shadow-sm">
        <h3 className="mb-6 text-xl font-bold text-gray-800">
          Buat Anggaran Baru
        </h3>
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap items-end gap-6"
        >
          <div className="flex-1 min-w-[200px]">
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
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Bulan (YYYY-MM)
            </label>
            <input
              type="month"
              required
              value={formData.month}
              onChange={(e) =>
                setFormData({ ...formData, month: e.target.value })
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#628263] focus:bg-white focus:ring-2 focus:ring-[#628263]/20"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Batas Maksimal (Rp)
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
          <button
            type="submit"
            className="rounded-xl bg-[#628263] px-8 py-3 font-bold text-white transition hover:bg-[#4d684e] shadow-md"
          >
            Simpan
          </button>
        </form>
      </div>

      {/* Daftar Anggaran */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {budgets.map((b) => (
          <div
            key={b.id}
            className="rounded-3xl bg-white p-6 shadow-sm border-t-4 border-[#628263]"
          >
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-xl font-bold text-gray-800">
                {b.category?.name}
              </h4>
              <span className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
                {b.month}
              </span>
            </div>
            <p className="text-sm text-gray-500">Batas Anggaran</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">
              Rp {b.amount.toLocaleString("id-ID")}
            </p>
          </div>
        ))}
      </div>
    </Layout>
  );
}
