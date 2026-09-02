import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-primary-500"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda
        </Link>

        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Kebijakan Privasi
        </h1>
        <p className="mb-10 text-sm text-gray-400">
          Terakhir diperbarui: Maret 2026
        </p>

        <div className="flex flex-col gap-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900">
              1. Pendahuluan
            </h2>
            <p>
              FlowFinance ("kami", "layanan kami") berkomitmen untuk melindungi
              privasi pengguna. Kebijakan Privasi ini menjelaskan bagaimana kami
              mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda
              ketika menggunakan aplikasi FlowFinance.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900">
              2. Informasi yang Kami Kumpulkan
            </h2>
            <p className="mb-2">
              Kami mengumpulkan informasi berikut saat Anda menggunakan
              FlowFinance:
            </p>
            <ul className="ml-4 flex flex-col gap-2 list-disc">
              <li>
                <strong>Informasi Akun:</strong> Nama dan alamat email yang Anda
                daftarkan.
              </li>
              <li>
                <strong>Data Keuangan:</strong> Data transaksi, anggaran,
                dompet, tujuan tabungan, utang, dan langganan yang Anda masukkan
                secara manual ke dalam aplikasi.
              </li>
              <li>
                <strong>Data Penggunaan:</strong> Informasi tentang cara Anda
                berinteraksi dengan aplikasi untuk keperluan peningkatan
                layanan.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900">
              3. Cara Kami Menggunakan Informasi Anda
            </h2>
            <p className="mb-2">Informasi yang dikumpulkan digunakan untuk:</p>
            <ul className="ml-4 flex flex-col gap-2 list-disc">
              <li>
                Menyediakan dan mengelola akun serta layanan FlowFinance untuk
                Anda.
              </li>
              <li>
                Menampilkan laporan, analitik, dan ringkasan keuangan pribadi
                Anda.
              </li>
              <li>
                Meningkatkan fungsionalitas dan pengalaman pengguna aplikasi.
              </li>
              <li>
                Mengirimkan notifikasi penting terkait akun Anda jika
                diperlukan.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900">
              4. Keamanan Data
            </h2>
            <p>
              Kami menerapkan langkah-langkah keamanan teknis yang wajar untuk
              melindungi data Anda, termasuk enkripsi koneksi SSL/TLS dan
              penyimpanan kata sandi secara terenkripsi. Meski demikian, tidak
              ada sistem yang sepenuhnya bebas risiko. Kami menyarankan Anda
              untuk menggunakan kata sandi yang kuat dan tidak membagikannya
              kepada siapa pun.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900">
              5. Berbagi Data dengan Pihak Ketiga
            </h2>
            <p>
              Kami <strong>tidak menjual</strong> data pribadi Anda kepada pihak
              ketiga. Data Anda hanya dapat dibagikan dalam kondisi berikut:
            </p>
            <ul className="mt-2 ml-4 flex flex-col gap-2 list-disc">
              <li>
                Jika diwajibkan oleh hukum atau peraturan yang berlaku di
                Indonesia.
              </li>
              <li>
                Kepada penyedia layanan infrastruktur (seperti layanan database
                cloud) yang terikat perjanjian kerahasiaan.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900">
              6. Hak Anda
            </h2>
            <p className="mb-2">Anda memiliki hak untuk:</p>
            <ul className="ml-4 flex flex-col gap-2 list-disc">
              <li>
                Mengakses dan mengunduh data keuangan Anda kapan saja melalui
                fitur ekspor laporan.
              </li>
              <li>
                Memperbarui informasi profil Anda melalui halaman pengaturan
                akun.
              </li>
              <li>
                Menghapus akun dan seluruh data Anda dengan menghubungi kami.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900">
              7. Perubahan Kebijakan
            </h2>
            <p>
              Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu.
              Perubahan signifikan akan diberitahukan melalui aplikasi.
              Penggunaan berkelanjutan atas layanan kami setelah perubahan
              dianggap sebagai persetujuan Anda.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900">
              8. Hubungi Kami
            </h2>
            <p className="mb-4">
              Jika Anda memiliki pertanyaan atau kekhawatiran mengenai kebijakan
              privasi ini, silakan hubungi developer FlowFinance:
            </p>
            <ul className="ml-4 flex flex-col gap-2 list-disc">
              <li>
                <strong>Nama:</strong> Agung Nugraha
              </li>
              <li>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:agungnugraha180405@gmail.com"
                  className="text-primary-500 hover:underline"
                >
                  agungnugraha180405@gmail.com
                </a>
              </li>
              <li>
                <strong>GitHub:</strong>{" "}
                <a
                  href="https://github.com/NUGRAHA18"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-500 hover:underline"
                >
                  github.com/NUGRAHA18
                </a>
              </li>
              <li>
                <strong>Instagram:</strong>{" "}
                <a
                  href="https://instagram.com/NRGH18"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-500 hover:underline"
                >
                  @Nrgh18
                </a>
              </li>
              <li>
                <strong>WhatsApp:</strong>{" "}
                <a
                  href="https://instagram.com/NRGH18"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-500 hover:underline"
                >
                  +6285523516312
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
