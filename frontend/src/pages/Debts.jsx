import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";

export default function Debts() {
  const [debts, setDebts] = useState([]);
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
      console.error("Gagal memuat daftar hutang");
    }
  };

  useEffect(() => {
    fetchDebts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/debts", {
        ...formData,
        amount: Number(formData.amount),
      });
      setFormData({ personName: "", amount: "", dueDate: "" });
      fetchDebts();
    } catch (err) {
      alert("Gagal mencatat hutang");
    }
  };

  const markAsPaid = async (id) => {
    try {
      await api.put(`/debts/${id}/status`, { status: "paid" });
      fetchDebts();
    } catch (err) {
      alert("Gagal mengubah status hutang");
    }
  };

  return (
    <Layout>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Pelacak Hutang</h2>
      </div>

      {/* Form Tambah Hutang */}
      <div className="mb-10 rounded-3xl bg-white p-8 shadow-sm">
        <h3 className="mb-6 text-xl font-bold text-gray-800">
          Catat Hutang Baru
        </h3>
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap items-end gap-6"
        >
          <div className="flex-1 min-w-[200px]">
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Nama Pihak/Orang
            </label>
            <input
              type="text"
              required
              value={formData.personName}
              onChange={(e) =>
                setFormData({ ...formData, personName: e.target.value })
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#628263] focus:bg-white focus:ring-2 focus:ring-[#628263]/20"
              placeholder="Misal: Andi"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
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
          <div className="flex-1 min-w-[200px]">
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Jatuh Tempo
            </label>
            <input
              type="date"
              required
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
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

      {/* Daftar Hutang */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {debts.map((debt) => {
          const isPaid = debt.status === "paid";

          return (
            <div
              key={debt.id}
              className={`flex flex-col justify-between rounded-3xl p-6 shadow-sm transition ${isPaid ? "bg-[#f0f4f1] border border-[#d2ded3]" : "bg-white border-t-4 border-[#628263]"}`}
            >
              <div>
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h4
                      className={`text-xl font-bold ${isPaid ? "text-gray-500 line-through" : "text-gray-800"}`}
                    >
                      {debt.personName}
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">
                      Jatuh Tempo:{" "}
                      {new Date(debt.dueDate).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${isPaid ? "bg-[#d2ded3] text-[#628263]" : "bg-orange-100 text-orange-600"}`}
                  >
                    {isPaid ? "Lunas" : "Belum Lunas"}
                  </span>
                </div>
                <p
                  className={`mt-4 text-3xl font-bold ${isPaid ? "text-gray-400" : "text-gray-900"}`}
                >
                  Rp {debt.amount.toLocaleString("id-ID")}
                </p>
              </div>

              {!isPaid && (
                <button
                  onClick={() => markAsPaid(debt.id)}
                  className="mt-6 w-full rounded-xl bg-gray-800 py-3 text-sm font-bold text-white hover:bg-gray-900 transition"
                >
                  Tandai Lunas
                </button>
              )}
            </div>
          );
        })}
      </div>
    </Layout>
  );
}
