import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { BarChart3, Target, Handshake, CalendarClock, PiggyBank, Wallet, ArrowRight, CheckCircle2 } from "lucide-react";
import ssDashboard from "../assets/ss-dashboard.png";

function useScrollReveal() {
  const refs = useRef([]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);
  const addRef = (el) => {
    if (el && !refs.current.includes(el)) refs.current.push(el);
  };
  return addRef;
}

const FEATURE_COLORS = [
  { bg: "bg-blue-50", text: "text-blue-500", border: "hover:border-blue-200" },
  { bg: "bg-emerald-50", text: "text-emerald-500", border: "hover:border-emerald-200" },
  { bg: "bg-violet-50", text: "text-violet-500", border: "hover:border-violet-200" },
  { bg: "bg-amber-50", text: "text-amber-500", border: "hover:border-amber-200" },
  { bg: "bg-rose-50", text: "text-rose-500", border: "hover:border-rose-200" },
  { bg: "bg-cyan-50", text: "text-cyan-500", border: "hover:border-cyan-200" },
];

export default function LandingPage() {
  const reveal = useScrollReveal();

  const features = [
    { title: "Analitik Real-time", desc: "Lihat arus kas bulananmu dalam grafik yang mudah dipahami.", icon: BarChart3 },
    { title: "Pelacak Anggaran", desc: "Setel batas pengeluaran per kategori agar tidak pernah over-budget.", icon: Target },
    { title: "Manajemen Hutang", desc: "Catat siapa yang berhutang padamu, atau hutang yang harus kamu bayar.", icon: Handshake },
    { title: "Pengingat Langganan", desc: "Pantau semua tagihan rutinmu agar terhindar dari denda keterlambatan.", icon: CalendarClock },
    { title: "Target Tabungan", desc: "Visualisasikan progres tabunganmu untuk membeli barang impian.", icon: PiggyBank },
    { title: "Multi-Dompet", desc: "Pisahkan saldo uang tunai, rekening bank, dan e-wallet dalam satu tempat.", icon: Wallet },
  ];

  const faqs = [
    { q: "Apakah FlowFinance gratis?", a: "Ya, fitur dasar pencatatan dan analitik 100% gratis digunakan." },
    { q: "Apakah data keuangan saya aman?", a: "Kami menggunakan enkripsi standar industri. Data kamu hanya bisa diakses olehmu melalui akun yang diamankan dengan Token JWT." },
    { q: "Bisa melacak tagihan bulanan?", a: "Tentu. Ada fitur 'Langganan' yang akan mengingatkanmu kapan tagihan Netflix, internet, atau listrik harus dibayar." },
  ];

  const steps = [
    { step: "01", title: "Buat Akun", desc: "Daftar gratis dalam hitungan detik. Tidak butuh kartu kredit.", check: "Gratis selamanya" },
    { step: "02", title: "Siapkan Dompet", desc: "Masukkan saldo awal bank atau e-wallet kamu.", check: "Multi-dompet" },
    { step: "03", title: "Mulai Mencatat", desc: "Catat tiap transaksi dan biarkan sistem yang merapikannya.", check: "Laporan otomatis" },
  ];

  return (
    <div className="min-h-screen bg-surface font-sans text-gray-800">
      {/* Navbar */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6">
        <div className="text-2xl font-bold text-primary-500">FlowFinance</div>
        <div className="flex items-center gap-4 sm:gap-6">
          <Link to="/login" className="text-sm font-medium text-gray-600 transition hover:text-primary-500 sm:text-base">
            Masuk
          </Link>
          <Link to="/register" className="rounded-xl bg-primary-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-primary-600 sm:px-6 sm:text-base">
            Daftar Gratis
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto mt-12 flex max-w-7xl flex-col items-center px-6 text-center lg:mt-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-600 mb-6">
          <span className="h-2 w-2 rounded-full bg-primary-500 animate-pulse" />
          100% Gratis · Tanpa Kartu Kredit
        </div>
        <h1 className="max-w-4xl text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
          Satu Tempat untuk <br />
          <span className="text-primary-500">Kendalikan Keuanganmu</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base text-gray-600 sm:text-lg">
          Tinggalkan spreadsheet yang rumit. Lacak pengeluaran, atur anggaran,
          dan capai target tabunganmu dengan dasbor cerdas yang dirancang untuk
          kedamaian pikiran.
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            to="/register"
            className="flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 text-base font-bold text-white transition hover:bg-primary-600 shadow-lg shadow-primary-500/30 sm:px-8 sm:py-4 sm:text-lg"
          >
            Coba Sekarang <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        <div className="mt-16 w-full max-w-5xl overflow-hidden rounded-3xl border-8 border-white bg-white shadow-2xl">
          <div className="aspect-video w-full bg-gray-100">
            <img src={ssDashboard} alt="Preview Dashboard FlowFinance" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto mt-24 max-w-7xl px-6 sm:mt-32">
        <div className="text-center" ref={reveal}>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-500 mb-3">Fitur Unggulan</p>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Kenapa Memilih FlowFinance?</h2>
          <p className="mt-4 text-gray-500">Alat profesional dengan antarmuka yang sangat ramah pemula.</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, idx) => {
            const Icon = f.icon;
            const color = FEATURE_COLORS[idx];
            return (
              <div
                key={idx}
                ref={reveal}
                style={{ transitionDelay: `${(idx % 3) * 80}ms` }}
                className={`reveal group rounded-3xl bg-white p-8 shadow-sm border border-transparent transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${color.border}`}
              >
                <div className={`mb-5 flex h-13 w-13 items-center justify-center rounded-2xl ${color.bg} ${color.text} p-3`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-800">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto mt-24 max-w-7xl px-6 sm:mt-32">
        <div
          ref={reveal}
          className="reveal rounded-3xl bg-white p-8 shadow-sm sm:p-12 lg:p-20 border border-gray-100"
        >
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-500 mb-3">Mulai dalam 3 Langkah</p>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Cara Kerja FlowFinance</h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-10 sm:mt-16 md:grid-cols-3">
            {steps.map((item, idx) => (
              <div
                key={idx}
                ref={reveal}
                style={{ transitionDelay: `${idx * 100}ms` }}
                className="reveal relative flex flex-col items-center text-center group"
              >
                {idx < steps.length - 1 && (
                  <div className="absolute top-8 left-[calc(50%+2.5rem)] right-0 h-px bg-gradient-to-r from-primary-200 to-transparent hidden md:block" />
                )}
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary-500 text-xl font-black text-white shadow-lg shadow-primary-500/30 group-hover:scale-110 transition-transform duration-300">
                  {item.step}
                </div>
                <h3 className="mt-6 text-xl font-bold text-gray-800">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-primary-500">
                  <CheckCircle2 className="h-4 w-4" />
                  {item.check}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto mt-24 max-w-3xl px-6 sm:mt-32">
        <div className="text-center" ref={reveal}>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-500 mb-3">FAQ</p>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Pertanyaan Umum</h2>
        </div>
        <div className="mt-10 flex flex-col gap-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              ref={reveal}
              style={{ transitionDelay: `${idx * 80}ms` }}
              className="reveal rounded-2xl bg-white p-6 shadow-sm border border-transparent hover:border-primary-100 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary-500">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="font-bold text-gray-800">{faq.q}</h4>
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto mt-24 max-w-7xl px-6 pb-20 sm:mt-32">
        <div
          ref={reveal}
          className="reveal relative overflow-hidden flex flex-col items-center justify-center rounded-3xl bg-primary-500 p-8 text-center shadow-xl sm:p-12 lg:p-24"
        >
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_white_0%,_transparent_60%)]" />
          <h2 className="relative text-2xl font-bold text-white sm:text-3xl lg:text-5xl">Siap Merapikan Keuanganmu?</h2>
          <p className="relative mt-4 max-w-2xl text-sm text-primary-100 sm:text-lg">
            Bergabunglah dan mulai bangun kebiasaan finansial yang lebih sehat hari ini.
          </p>
          <Link
            to="/register"
            className="relative mt-8 rounded-xl bg-white px-8 py-3 text-base font-bold text-primary-500 transition hover:bg-gray-50 shadow-lg sm:px-10 sm:py-4 sm:text-lg"
          >
            Buat Akun Sekarang
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 border-t border-primary-100 bg-white py-12 text-gray-600">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <h2 className="text-2xl font-bold text-primary-500">FlowFinance</h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed">
              Sistem pencatatan personal untuk melacak arus kas, anggaran, dan target finansialmu dengan mudah, aman, dan presisi.
            </p>
          </div>
          <div>
            <h3 className="mb-4 font-bold text-gray-900">Navigasi</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link to="/login" className="transition hover:text-primary-500">Masuk</Link></li>
              <li><Link to="/register" className="transition hover:text-primary-500">Daftar</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-bold text-gray-900">Informasi</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li><span className="text-gray-400">Privacy Policy</span></li>
              <li><span className="text-gray-400">Terms of Service</span></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-gray-100 px-6 pt-8 text-sm md:flex-row">
          <p>&copy; {new Date().getFullYear()} FlowFinance. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
