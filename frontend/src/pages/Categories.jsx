import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: "", type: "expense" });

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Gagal memuat kategori");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/categories", formData);
      setFormData({ name: "", type: "expense" });
      fetchCategories();
    } catch (err) {
      alert("Gagal menambah kategori");
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Hapus kategori ini?")) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert("Gagal menghapus kategori");
    }
  };

  const incomes = categories.filter((c) => c.type === "income");
  const expenses = categories.filter((c) => c.type === "expense");

  return (
    <Layout>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Kategori Keuangan</h2>
      </div>

      {/* Form Tambah Kategori */}
      <div className="mb-10 rounded-3xl bg-white p-8 shadow-sm">
        <h3 className="mb-6 text-xl font-bold text-gray-800">
          Tambah Kategori Baru
        </h3>
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap items-end gap-6"
        >
          <div className="flex-1 min-w-[200px]">
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Nama Kategori
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#628263] focus:bg-white focus:ring-2 focus:ring-[#628263]/20"
              placeholder="Misal: Makan Siang"
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
              <option value="expense">Pengeluaran (Expense)</option>
              <option value="income">Pemasukan (Income)</option>
            </select>
          </div>
          <button
            type="submit"
            className="rounded-xl bg-[#628263] px-8 py-3 font-bold text-white transition hover:bg-[#4d684e] shadow-md"
          >
            Simpan
          </button>
        </form>
      </div>

      {/* Daftar Kategori */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Kolom Pemasukan */}
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
              ↓
            </span>
            <h3 className="text-xl font-bold text-gray-800">Pemasukan</h3>
          </div>
          <ul className="flex flex-col gap-3">
            {incomes.map((cat) => (
              <li
                key={cat.id}
                className="flex items-center justify-between rounded-xl bg-gray-50 p-4 transition hover:bg-gray-100"
              >
                <span className="font-medium text-gray-800">{cat.name}</span>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="text-sm font-bold text-red-500 hover:text-red-700"
                >
                  Hapus
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Kolom Pengeluaran */}
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
              ↑
            </span>
            <h3 className="text-xl font-bold text-gray-800">Pengeluaran</h3>
          </div>
          <ul className="flex flex-col gap-3">
            {expenses.map((cat) => (
              <li
                key={cat.id}
                className="flex items-center justify-between rounded-xl bg-gray-50 p-4 transition hover:bg-gray-100"
              >
                <span className="font-medium text-gray-800">{cat.name}</span>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="text-sm font-bold text-red-500 hover:text-red-700"
                >
                  Hapus
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
}
