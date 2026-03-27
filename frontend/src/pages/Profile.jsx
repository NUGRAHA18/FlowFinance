import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import { toast } from "../components/Toast";
import LoadingButton from "../components/LoadingButton";
import EmptyState from "../components/EmptyState";
import { SkeletonCard } from "../components/Skeleton";
import { User, Lock, Save } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const inputClass =
  "w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-gray-100 outline-none transition focus:border-primary-500 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-primary-500/20";

export default function Profile() {
  const { setUser } = useAuth();
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [initialLoading, setInitialLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
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
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const res = await api.put("/profile", profile);
      const updatedProfile = { name: res.data.profile.name, email: res.data.profile.email };
      setProfile(updatedProfile);
      setUser((prev) => ({ ...prev, ...updatedProfile }));
      toast.success("Profil berhasil diperbarui");
    } catch (err) {
      const msg = err.response?.data?.details?.join(", ") || err.response?.data?.error;
      toast.error(msg || "Gagal memperbarui profil");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("Konfirmasi password tidak cocok");
    }

    setPasswordLoading(true);
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
    } finally {
      setPasswordLoading(false);
    }
  };

  if (initialLoading)
    return (
      <Layout>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Pengaturan Profil</h2>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Kelola informasi akun dan keamanan</p>
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <User className="h-8 w-8 text-primary-500" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Pengaturan Profil</h2>
        </div>
        <p className="mt-1 text-gray-500 dark:text-gray-400">Kelola informasi akun dan keamanan</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Update Profile */}
        <div className="rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-2">
            <User className="h-5 w-5 text-primary-500" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Informasi Pribadi</h3>
          </div>
          <form onSubmit={handleUpdateProfile} className="flex flex-col gap-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
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
              <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
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
            <LoadingButton
              type="submit"
              loading={profileLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 py-4 font-bold text-white transition hover:bg-primary-600 shadow-md"
            >
              <Save className="h-4 w-4" />
              Simpan Perubahan
            </LoadingButton>
          </form>
        </div>

        {/* Change Password */}
        <div className="rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary-500" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Ubah Password</h3>
          </div>
          <form onSubmit={handleChangePassword} className="flex flex-col gap-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
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
              <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
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
              <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
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
            <LoadingButton
              type="submit"
              loading={passwordLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-800 dark:bg-gray-700 py-4 font-bold text-white transition hover:bg-gray-900 dark:hover:bg-gray-600 shadow-md"
            >
              <Lock className="h-4 w-4" />
              Ubah Password
            </LoadingButton>
          </form>
        </div>
      </div>
    </Layout>
  );
}
