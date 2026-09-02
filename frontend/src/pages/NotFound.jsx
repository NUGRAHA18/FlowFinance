import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 text-center">
      <p className="text-7xl font-bold text-primary-500">404</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">Halaman Tidak Ditemukan</h1>
      <p className="mt-2 text-gray-500">
        Halaman yang kamu cari tidak ada atau sudah dipindahkan.
      </p>
      <Link
        to="/"
        className="mt-8 rounded-xl bg-primary-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-600"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
