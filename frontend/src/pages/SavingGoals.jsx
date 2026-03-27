import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import { toast } from "../components/Toast";

export default function SavingGoals() {
  const [goals, setGoals] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    deadline: "",
  });
  const [addAmount, setAddAmount] = useState({});

  const fetchGoals = async () => {
    try {
      const res = await api.get("/saving-goals");
      setGoals(res.data);
    } catch (err) {
      toast.error("Gagal memuat target tabungan");
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/saving-goals", {
        ...formData,
        targetAmount: Number(formData.targetAmount),
      });
      setFormData({ name: "", targetAmount: "", deadline: "" });
      fetchGoals();
      toast.success("Target tabungan berhasil dibuat");
    } catch (err) {
      const msg = err.response?.data?.details?.join(", ") || err.response?.data?.error;
      toast.error(msg || "Gagal membuat target tabungan");
    }
  };

  const handleAddSaving = async (id, e) => {
    e.preventDefault();
    const amountToSave = Number(addAmount[id]);
    if (!amountToSave || amountToSave <= 0)
      return toast.error("Masukkan nominal yang valid");

    try {
      await api.put(`/saving-goals/${id}/add`, { amount: amountToSave });
      setAddAmount({ ...addAmount, [id]: "" });
      fetchGoals();
      toast.success(`Berhasil menabung Rp ${amountToSave.toLocaleString("id-ID")}`);
    } catch (err) {
      toast.error("Gagal menambah tabungan");
    }
  };

  return (
    <Layout>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Target Tabungan</h2>
      </div>

      {/* Form Tambah Target */}
      <div className="mb-10 rounded-3xl bg-white p-8 shadow-sm">
        <h3 className="mb-6 text-xl font-bold text-gray-800">
          Buat Target Baru
        </h3>
        <form
          onSubmit={handleCreate}
          className="flex flex-wrap items-end gap-6"
        >
          <div className="flex-1 min-w-[200px]">
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Nama Target
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#628263] focus:bg-white focus:ring-2 focus:ring-[#628263]/20"
              placeholder="Misal: Beli Laptop"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Target Nominal (Rp)
            </label>
            <input
              type="number"
              required
              value={formData.targetAmount}
              onChange={(e) =>
                setFormData({ ...formData, targetAmount: e.target.value })
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#628263] focus:bg-white focus:ring-2 focus:ring-[#628263]/20"
              placeholder="0"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Batas Waktu
            </label>
            <input
              type="date"
              required
              value={formData.deadline}
              onChange={(e) =>
                setFormData({ ...formData, deadline: e.target.value })
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

      {/* Daftar Target Tabungan */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {goals.map((goal) => {
          const progress = Math.min(
            (goal.savedAmount / goal.targetAmount) * 100,
            100,
          ).toFixed(1);

          return (
            <div
              key={goal.id}
              className="flex flex-col justify-between rounded-3xl bg-white p-8 shadow-sm"
            >
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-xl font-bold text-gray-800">
                    {goal.name}
                  </h4>
                  <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    Tenggat:{" "}
                    {new Date(goal.deadline).toLocaleDateString("id-ID")}
                  </span>
                </div>

                <div className="my-6">
                  <div className="mb-2 flex justify-between text-sm font-bold text-gray-800">
                    <span>Rp {goal.savedAmount.toLocaleString("id-ID")}</span>
                    <span className="text-gray-400">
                      Rp {goal.targetAmount.toLocaleString("id-ID")}
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="h-4 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full bg-[#628263] transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="mt-2 text-right text-sm font-bold text-[#628263]">
                    {progress}% Terkumpul
                  </p>
                </div>
              </div>

              {/* Form Tambah Saldo */}
              <form
                onSubmit={(e) => handleAddSaving(goal.id, e)}
                className="mt-2 flex gap-3"
              >
                <input
                  type="number"
                  placeholder="Tambah saldo..."
                  value={addAmount[goal.id] || ""}
                  onChange={(e) =>
                    setAddAmount({ ...addAmount, [goal.id]: e.target.value })
                  }
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm outline-none transition focus:border-[#628263] focus:bg-white"
                />
                <button
                  type="submit"
                  className="whitespace-nowrap rounded-xl bg-gray-800 px-6 py-2 text-sm font-bold text-white hover:bg-gray-900"
                >
                  Tabung
                </button>
              </form>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}
