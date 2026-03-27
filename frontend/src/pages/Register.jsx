import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { toast } from "../components/Toast";
import LoadingButton from "../components/LoadingButton";
import { UserPlus } from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Inline validation
    const errors = { ...fieldErrors };
    if (name === "name") {
      errors.name = value.trim().length < 2 ? "Nama minimal 2 karakter" : "";
    }
    if (name === "email") {
      errors.email = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "Format email tidak valid" : "";
    }
    if (name === "password") {
      errors.password = value.length < 6 ? "Password minimal 6 karakter" : "";
    }
    setFieldErrors(errors);
  };

  const passwordStrength = () => {
    const p = formData.password;
    if (!p) return { level: 0, text: "", color: "" };
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;

    if (score <= 2) return { level: score, text: "Lemah", color: "bg-red-400" };
    if (score <= 3) return { level: score, text: "Cukup", color: "bg-amber-400" };
    return { level: score, text: "Kuat", color: "bg-green-500" };
  };

  const strength = passwordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/register", formData);
      toast.success("Registrasi berhasil! Silakan login.");
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.details?.join(", ") || err.response?.data?.error || "Terjadi kesalahan saat mendaftar";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-primary-400";
  const errorInputClass = "border-red-300 focus:border-red-500 focus:ring-red-500/20";

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-4 font-sans dark:bg-gray-900">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-sm dark:bg-gray-800">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-primary-500">Buat Akun</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Mulai perjalanan finansialmu hari ini</p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
              Nama Lengkap <span className="text-red-400">*</span>
            </label>
            <input
              id="name" type="text" name="name" value={formData.name}
              onChange={handleChange} required autoComplete="name"
              className={`${inputClass} ${fieldErrors.name ? errorInputClass : ""}`}
              placeholder="John Doe"
            />
            {fieldErrors.name && <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>}
          </div>
          <div>
            <label htmlFor="reg-email" className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              id="reg-email" type="email" name="email" value={formData.email}
              onChange={handleChange} required autoComplete="email"
              className={`${inputClass} ${fieldErrors.email ? errorInputClass : ""}`}
              placeholder="nama@email.com"
            />
            {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>}
          </div>
          <div>
            <label htmlFor="reg-password" className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
              Password <span className="text-red-400">*</span>
            </label>
            <input
              id="reg-password" type="password" name="password" value={formData.password}
              onChange={handleChange} required autoComplete="new-password"
              className={`${inputClass} ${fieldErrors.password ? errorInputClass : ""}`}
              placeholder="Minimal 6 karakter"
            />
            {formData.password && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= strength.level ? strength.color : "bg-gray-200 dark:bg-gray-600"}`} />
                  ))}
                </div>
                <p className={`mt-1 text-xs font-medium ${strength.level <= 2 ? "text-red-500" : strength.level <= 3 ? "text-amber-500" : "text-green-500"}`}>
                  Password: {strength.text}
                </p>
              </div>
            )}
            {fieldErrors.password && <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>}
          </div>
          <LoadingButton type="submit" loading={loading} className="mt-2 w-full py-4">
            <UserPlus className="h-4 w-4" /> Daftar Sekarang
          </LoadingButton>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Sudah punya akun?{" "}
          <Link to="/login" className="font-bold text-primary-500 hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
