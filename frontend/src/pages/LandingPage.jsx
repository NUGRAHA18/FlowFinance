import { Link } from "react-router-dom";
import ssDashboard from "../assets/ss-dashboard.png";
export default function LandingPage() {
  const faqs = [
    {
      q: "Apakah FlowFinance gratis?",
      a: "Ya, fitur dasar pencatatan dan analitik 100% gratis digunakan.",
    },
    {
      q: "Apakah data keuangan saya aman?",
      a: "Kami menggunakan enkripsi standar industri. Data kamu hanya bisa diakses olehmu melalui akun yang diamankan dengan Token JWT.",
    },
    {
      q: "Bisa melacak tagihan bulanan?",
      a: "Tentu. Ada fitur 'Langganan' yang akan mengingatkanmu kapan tagihan Netflix, internet, atau listrik harus dibayar.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#eaeee9] font-sans text-gray-800">
      {/* 0. Navbar */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6">
        <div className="text-2xl font-bold text-[#628263]">FlowFinance</div>
        <div className="flex items-center gap-6">
          <Link
            to="/login"
            className="font-medium text-gray-600 transition hover:text-[#628263]"
          >
            Masuk
          </Link>
          <Link
            to="/register"
            className="rounded-xl bg-[#628263] px-6 py-2 font-bold text-white transition hover:bg-[#4d684e]"
          >
            Daftar Gratis
          </Link>
        </div>
      </nav>

      {/* 1 & 4. Hero Section & Screenshot Placeholder */}
      <section className="mx-auto mt-12 flex max-w-7xl flex-col items-center px-6 text-center lg:mt-20">
        <h1 className="max-w-4xl text-5xl font-extrabold leading-tight text-gray-900 lg:text-6xl">
          Satu Tempat untuk <br />
          <span className="text-[#628263]">Kendalikan Keuanganmu</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-gray-600">
          Tinggalkan spreadsheet yang rumit. Lacak pengeluaran, atur anggaran,
          dan capai target tabunganmu dengan dasbor cerdas yang dirancang untuk
          kedamaian pikiran.
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            to="/register"
            className="rounded-xl bg-[#628263] px-8 py-4 text-lg font-bold text-white transition hover:bg-[#4d684e] shadow-lg shadow-[#628263]/30"
          >
            Coba Sekarang
          </Link>
        </div>

        {/* Tempat Screenshot Aplikasi */}
        <div className="mt-16 w-full max-w-5xl overflow-hidden rounded-[2rem] border-8 border-white bg-white shadow-2xl">
          {/* Sisipkan gambar screenshot dasbor kamu di sini */}
          <div className="aspect-video w-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400 font-medium">
              <img src={ssDashboard} alt="preview" />
            </span>
            {/* Contoh tag img jika gambar sudah ada: */}
            {/* <img src="/assets/dashboard-ss.png" alt="Dashboard Preview" className="h-full w-full object-cover" /> */}
          </div>
        </div>
      </section>

      {/* 2. Manfaat / Fitur Utama */}
      <section className="mx-auto mt-32 max-w-7xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Kenapa Memilih FlowFinance?
          </h2>
          <p className="mt-4 text-gray-600">
            Alat profesional dengan antarmuka yang sangat ramah pemula.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              title: "Analitik Real-time",
              desc: "Lihat arus kas bulananmu dalam grafik yang mudah dipahami.",
              icon: "📊",
            },
            {
              title: "Pelacak Anggaran",
              desc: "Setel batas pengeluaran per kategori agar tidak pernah over-budget.",
              icon: "🎯",
            },
            {
              title: "Manajemen Hutang",
              desc: "Catat siapa yang berhutang padamu, atau hutang yang harus kamu bayar.",
              icon: "🤝",
            },
            {
              title: "Pengingat Langganan",
              desc: "Pantau semua tagihan rutinmu agar terhindar dari denda keterlambatan.",
              icon: "📅",
            },
            {
              title: "Target Tabungan",
              desc: "Visualisasikan progres tabunganmu untuk membeli barang impian.",
              icon: "🐷",
            },
            {
              title: "Multi-Dompet",
              desc: "Pisahkan saldo uang tunai, rekening bank, dan e-wallet dalam satu tempat.",
              icon: "💳",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="rounded-3xl bg-white p-8 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-4 text-4xl">{feature.icon}</div>
              <h3 className="mb-2 text-xl font-bold text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. How It Works */}
      <section className="mx-auto mt-32 max-w-7xl px-6">
        <div className="rounded-[3rem] bg-white p-12 shadow-sm lg:p-20">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Cara Kerja FlowFinance
          </h2>
          <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3 relative">
            {/* Garis penghubung (Hanya tampil di desktop) */}
            <div className="absolute top-8 left-[15%] right-[15%] h-1 bg-[#eaeee9] hidden md:block"></div>

            {[
              {
                step: "1",
                title: "Buat Akun",
                desc: "Daftar gratis dalam hitungan detik. Tidak butuh kartu kredit.",
              },
              {
                step: "2",
                title: "Siapkan Dompet",
                desc: "Masukkan saldo awal bank atau e-wallet kamu.",
              },
              {
                step: "3",
                title: "Mulai Mencatat",
                desc: "Catat tiap transaksi dan biarkan sistem yang merapikannya.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="relative flex flex-col items-center text-center z-10"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#628263] text-2xl font-bold text-white shadow-lg shadow-[#628263]/30">
                  {item.step}
                </div>
                <h3 className="mt-6 text-xl font-bold text-gray-800">
                  {item.title}
                </h3>
                <p className="mt-2 text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="mx-auto mt-32 max-w-3xl px-6">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Pertanyaan Umum
        </h2>
        <div className="mt-10 flex flex-col gap-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-2xl bg-white p-6 shadow-sm">
              <h4 className="font-bold text-gray-800">{faq.q}</h4>
              <p className="mt-2 text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Call to Action (Meyakinkan User) */}
      <section className="mx-auto mt-32 max-w-7xl px-6 pb-20">
        <div className="flex flex-col items-center justify-center rounded-[3rem] bg-[#628263] p-12 text-center shadow-xl lg:p-24">
          <h2 className="text-3xl font-bold text-white lg:text-5xl">
            Siap Merapikan Keuanganmu?
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-[#d2ded3]">
            Bergabunglah dan mulai bangun kebiasaan finansial yang lebih sehat
            hari ini.
          </p>
          <Link
            to="/register"
            className="mt-8 rounded-xl bg-white px-10 py-4 text-lg font-bold text-[#628263] transition hover:bg-gray-100 shadow-lg"
          >
            Buat Akun Sekarang
          </Link>
        </div>
      </section>

      {/* 7. Footer Singkat */}
      <footer className="mt-20 border-t border-[#d2ded3] bg-white py-12 text-gray-600">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 md:grid-cols-4">
          {/* Info Brand */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-[#628263]">FlowFinance</h2>
            <p className="mt-4 max-w-sm text-sm">
              Sistem pencatatan personal untuk melacak arus kas, anggaran, dan
              target finansialmu dengan mudah, aman, dan presisi.
            </p>
          </div>

          {/* Menu Navigasi Footer */}
          <div>
            <h3 className="mb-4 font-bold text-gray-900">Perusahaan</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <Link to="/about" className="transition hover:text-[#628263]">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition hover:text-[#628263]">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-gray-900">Legal</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <Link
                  to="/privacy-policy"
                  className="transition hover:text-[#628263]"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-service"
                  className="transition hover:text-[#628263]"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer & Social Media */}
        <div className="mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-gray-100 px-6 pt-8 text-sm md:flex-row">
          <p>© {new Date().getFullYear()} FlowFinance. All rights reserved.</p>

          {/* Social Media Icons (Menggunakan teks/emoji sebagai placeholder rapi) */}
          <div className="flex gap-6 text-lg">
            <a
              href="#"
              className="transition hover:text-[#628263]"
              aria-label="Instagram"
            >
              IG
            </a>
            <a
              href="#"
              className="transition hover:text-[#628263]"
              aria-label="Twitter"
            >
              X
            </a>
            <a
              href="#"
              className="transition hover:text-[#628263]"
              aria-label="LinkedIn"
            >
              IN
            </a>
            <a
              href="#"
              className="transition hover:text-[#628263]"
              aria-label="Facebook"
            >
              FB
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
