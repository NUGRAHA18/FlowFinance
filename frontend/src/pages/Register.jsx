import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { toast } from "../components/Toast";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/register", formData);
      toast.success("Registrasi berhasil! Silakan login.");
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.details?.join(", ") || err.response?.data?.error || "Terjadi kesalahan saat mendaftar";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#eaeee9] p-4 font-sans text-gray-800">
      <div className="w-full max-w-md rounded-[2.5rem] bg-white p-10 shadow-sm">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-[#628263]">Buat Akun</h2>
          <p className="mt-2 text-gray-500">
            Mulai perjalanan finansialmu hari ini
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#628263] focus:bg-white focus:ring-2 focus:ring-[#628263]/20"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#628263] focus:bg-white focus:ring-2 focus:ring-[#628263]/20"
              placeholder="nama@email.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#628263] focus:bg-white focus:ring-2 focus:ring-[#628263]/20"
              placeholder="Minimal 6 karakter"
            />
          </div>
          <button
            type="submit"
            className="mt-2 w-full rounded-xl bg-[#628263] py-4 font-bold text-white transition hover:bg-[#4d684e] shadow-lg shadow-[#628263]/30"
          >
            Daftar Sekarang
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Sudah punya akun?{" "}
          <Link
            to="/login"
            className="font-bold text-[#628263] hover:underline"
          >
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
