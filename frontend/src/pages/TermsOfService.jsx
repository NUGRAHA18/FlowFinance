import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
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

        <h1 className="mb-2 text-3xl font-bold text-gray-900">Syarat &amp; Ketentuan</h1>
        <p className="mb-10 text-sm text-gray-400">Terakhir diperbarui: Maret 2026</p>

        <div className="flex flex-col gap-8 text-gray-600 leading-relaxed">

          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900">1. Penerimaan Syarat</h2>
            <p>
              Dengan mendaftar dan menggunakan FlowFinance, Anda menyatakan telah membaca, memahami, dan
              menyetujui Syarat &amp; Ketentuan ini. Jika Anda tidak menyetujui, mohon untuk tidak menggunakan
              layanan kami.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900">2. Deskripsi Layanan</h2>
            <p>
              FlowFinance adalah aplikasi manajemen keuangan pribadi yang memungkinkan pengguna untuk mencatat
              transaksi, mengelola anggaran, memantau tujuan tabungan, melacak utang, dan mengelola langganan
              berulang. Layanan ini disediakan secara gratis tanpa perlu kartu kredit.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900">3. Akun Pengguna</h2>
            <ul className="ml-4 flex flex-col gap-2 list-disc">
              <li>Anda bertanggung jawab penuh atas keamanan akun dan kata sandi Anda.</li>
              <li>Setiap aktivitas yang terjadi di bawah akun Anda menjadi tanggung jawab Anda.</li>
              <li>Anda wajib memberikan informasi yang akurat dan terkini saat mendaftar.</li>
              <li>Satu orang hanya diperbolehkan memiliki satu akun aktif.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900">4. Penggunaan yang Diizinkan</h2>
            <p className="mb-2">Anda setuju untuk menggunakan FlowFinance hanya untuk keperluan yang sah, yaitu:</p>
            <ul className="ml-4 flex flex-col gap-2 list-disc">
              <li>Pengelolaan keuangan pribadi Anda sendiri.</li>
              <li>Mencatat dan memantau data keuangan secara mandiri.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900">5. Penggunaan yang Dilarang</h2>
            <p className="mb-2">Anda dilarang untuk:</p>
            <ul className="ml-4 flex flex-col gap-2 list-disc">
              <li>Menggunakan layanan untuk aktivitas ilegal atau penipuan.</li>
              <li>Mencoba mengakses akun pengguna lain tanpa izin.</li>
              <li>Melakukan reverse engineering, scraping, atau eksploitasi terhadap sistem kami.</li>
              <li>Mengunggah konten berbahaya, malware, atau kode yang merusak.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900">6. Kepemilikan Data</h2>
            <p>
              Semua data keuangan yang Anda masukkan ke dalam FlowFinance adalah milik Anda sepenuhnya.
              Kami tidak mengklaim kepemilikan atas data tersebut. Anda dapat mengekspor atau menghapus
              data Anda kapan saja.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900">7. Penafian Layanan</h2>
            <p>
              FlowFinance adalah alat bantu pencatatan keuangan pribadi dan <strong>bukan merupakan
              layanan konsultasi keuangan, investasi, atau perbankan</strong>. Segala keputusan
              keuangan yang Anda ambil berdasarkan data di aplikasi ini sepenuhnya merupakan tanggung
              jawab Anda.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900">8. Batasan Tanggung Jawab</h2>
            <p>
              FlowFinance tidak bertanggung jawab atas kerugian langsung maupun tidak langsung yang
              timbul dari penggunaan atau ketidakmampuan menggunakan layanan, termasuk kehilangan data
              akibat kejadian di luar kendali kami (force majeure).
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900">9. Penghentian Layanan</h2>
            <p>
              Kami berhak menangguhkan atau menghapus akun yang melanggar Syarat &amp; Ketentuan ini
              tanpa pemberitahuan sebelumnya. Anda juga dapat menghapus akun Anda kapan saja.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900">10. Perubahan Syarat</h2>
            <p>
              Kami dapat mengubah Syarat &amp; Ketentuan ini sewaktu-waktu. Perubahan akan diumumkan
              melalui aplikasi. Penggunaan layanan setelah perubahan berlaku dianggap sebagai
              persetujuan Anda terhadap syarat yang baru.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900">11. Hukum yang Berlaku</h2>
            <p>
              Syarat &amp; Ketentuan ini diatur oleh hukum yang berlaku di Republik Indonesia.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900">12. Hubungi Kami</h2>
            <p className="mb-4">
              Untuk pertanyaan seputar Syarat &amp; Ketentuan ini, silakan hubungi developer FlowFinance:
            </p>
            <ul className="ml-4 flex flex-col gap-2 list-disc">
              <li><strong>Nama:</strong> Agung Nugraha</li>
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
                  @NRGH18
                </a>
              </li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
}
