import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { toast } from "../components/Toast";
import LoadingButton from "../components/LoadingButton";
import { LogIn } from "lucide-react";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", formData);
      await login(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.details?.join(", ") || err.response?.data?.error || "Login gagal. Cek email dan password.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-primary-400";

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-4 font-sans dark:bg-gray-900">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-sm dark:bg-gray-800">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-primary-500">Selamat Datang</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Masuk untuk mengelola keuanganmu</p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              className={inputClass}
              placeholder="nama@email.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
              Password <span className="text-red-400">*</span>
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              className={inputClass}
              placeholder="Masukkan password"
            />
          </div>
          <LoadingButton type="submit" loading={loading} className="mt-2 w-full py-4">
            <LogIn className="h-4 w-4" /> Masuk Sekarang
          </LoadingButton>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Belum punya akun?{" "}
          <Link to="/register" className="font-bold text-primary-500 hover:underline">
            Daftar gratis
          </Link>
        </p>
      </div>
    </div>
  );
}
