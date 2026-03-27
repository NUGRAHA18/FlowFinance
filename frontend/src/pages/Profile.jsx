import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import { toast } from "../components/Toast";

export default function Profile() {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile");
      setProfile({ name: res.data.name, email: res.data.email });
    } catch (err) {
      toast.error("Gagal memuat profil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/profile", profile);
      setProfile({ name: res.data.profile.name, email: res.data.profile.email });
      toast.success("Profil berhasil diperbarui");
    } catch (err) {
      const msg = err.response?.data?.details?.join(", ") || err.response?.data?.error;
      toast.error(msg || "Gagal memperbarui profil");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("Konfirmasi password tidak cocok");
    }

    try {
      await api.put("/profile/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password berhasil diubah");
    } catch (err) {
      const msg = err.response?.data?.details?.join(", ") || err.response?.data?.error;
      toast.error(msg || "Gagal mengubah password");
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#628263] focus:bg-white focus:ring-2 focus:ring-[#628263]/20";

  if (loading)
    return (
      <Layout>
        <div className="flex h-64 items-center justify-center text-gray-500">
          Memuat profil...
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Pengaturan Profil</h2>
        <p className="mt-1 text-gray-500">Kelola informasi akun dan keamanan</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Update Profile */}
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h3 className="mb-6 text-xl font-bold text-gray-800">Informasi Pribadi</h3>
          <form onSubmit={handleUpdateProfile} className="flex flex-col gap-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className={inputClass}
                placeholder="Nama lengkap"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                type="email"
                required
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className={inputClass}
                placeholder="email@contoh.com"
              />
            </div>
            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-[#628263] py-4 font-bold text-white transition hover:bg-[#4d684e] shadow-md"
            >
              Simpan Perubahan
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h3 className="mb-6 text-xl font-bold text-gray-800">Ubah Password</h3>
          <form onSubmit={handleChangePassword} className="flex flex-col gap-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Password Lama
              </label>
              <input
                type="password"
                required
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
                className={inputClass}
                placeholder="Masukkan password lama"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Password Baru
              </label>
              <input
                type="password"
                required
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
                className={inputClass}
                placeholder="Minimal 6 karakter"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Konfirmasi Password Baru
              </label>
              <input
                type="password"
                required
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
                className={inputClass}
                placeholder="Ulangi password baru"
              />
            </div>
            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-gray-800 py-4 font-bold text-white transition hover:bg-gray-900 shadow-md"
            >
              Ubah Password
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
