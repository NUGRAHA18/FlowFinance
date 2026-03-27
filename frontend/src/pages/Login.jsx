import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { toast } from "../components/Toast";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.details?.join(", ") || err.response?.data?.error || "Login gagal. Cek email dan password.";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#eaeee9] p-4 font-sans text-gray-800">
      <div className="w-full max-w-md rounded-[2.5rem] bg-white p-10 shadow-sm">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-[#628263]">
            Selamat Datang
          </h2>
          <p className="mt-2 text-gray-500">Masuk untuk mengelola keuanganmu</p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="mt-2 w-full rounded-xl bg-[#628263] py-4 font-bold text-white transition hover:bg-[#4d684e] shadow-lg shadow-[#628263]/30"
          >
            Masuk Sekarang
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="font-bold text-[#628263] hover:underline"
          >
            Daftar gratis
          </Link>
        </p>
      </div>
    </div>
  );
}
