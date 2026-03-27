import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
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
      console.error("Gagal memuat daftar langganan");
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    } catch (err) {
      alert("Gagal mencatat langganan");
    }
  };

  const deleteSubscription = async (id) => {
    if (!window.confirm("Berhenti berlangganan layanan ini?")) return;
    try {
      await api.delete(`/subscriptions/${id}`);
      fetchSubscriptions();
    } catch (err) {
      alert("Gagal menghapus langganan");
    }
  };

  return (
    <Layout>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Pelacak Langganan</h2>
      </div>

      {/* Form Tambah Langganan */}
      <div className="mb-10 rounded-3xl bg-white p-8 shadow-sm">
        <h3 className="mb-6 text-xl font-bold text-gray-800">
          Tambah Tagihan Rutin
        </h3>
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap items-end gap-6"
        >
          <div className="flex-1 min-w-[200px]">
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Nama Layanan
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#628263] focus:bg-white focus:ring-2 focus:ring-[#628263]/20"
              placeholder="Misal: Netflix"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Biaya (Rp)
            </label>
            <input
              type="number"
              required
              value={formData.cost}
              onChange={(e) =>
                setFormData({ ...formData, cost: e.target.value })
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#628263] focus:bg-white focus:ring-2 focus:ring-[#628263]/20"
              placeholder="0"
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Siklus
            </label>
            <select
              value={formData.billingCycle}
              onChange={(e) =>
                setFormData({ ...formData, billingCycle: e.target.value })
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#628263] focus:bg-white focus:ring-2 focus:ring-[#628263]/20"
            >
              <option value="monthly">Bulanan</option>
              <option value="yearly">Tahunan</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Tagihan Berikutnya
            </label>
            <input
              type="date"
              required
              value={formData.nextPayment}
              onChange={(e) =>
                setFormData({ ...formData, nextPayment: e.target.value })
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

      {/* Daftar Langganan */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subscriptions.map((sub) => (
          <div
            key={sub.id}
            className="flex flex-col justify-between rounded-3xl bg-white p-6 shadow-sm border-t-4 border-gray-800"
          >
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-xl font-bold text-gray-800">{sub.name}</h4>
                <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium uppercase tracking-wider text-gray-600">
                  {sub.billingCycle}
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                Rp {sub.cost.toLocaleString("id-ID")}
              </p>
              <p className="mt-4 text-sm font-medium text-red-500 bg-red-50 inline-block px-3 py-1 rounded-lg">
                Jatuh Tempo:{" "}
                {new Date(sub.nextPayment).toLocaleDateString("id-ID")}
              </p>
            </div>

            <button
              onClick={() => deleteSubscription(sub.id)}
              className="mt-6 w-full rounded-xl border-2 border-red-100 bg-transparent py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition"
            >
              Hapus Langganan
            </button>
          </div>
        ))}
      </div>
    </Layout>
  );
}
