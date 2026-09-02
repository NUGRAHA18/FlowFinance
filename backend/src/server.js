import app from "./app.js";
import prisma, { pool } from "./config/prisma.js";

const PORT = process.env.PORT || 5000;

// Render mengharuskan bind ke 0.0.0.0, bukan localhost.
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`[Server] Running on port ${PORT} (${process.env.NODE_ENV || "development"})`);
});

// Render mengirim SIGTERM saat deploy ulang — tutup koneksi DB dengan rapi
// supaya slot connection pooler Supabase tidak tertinggal menggantung.
const shutdown = async (signal) => {
  console.log(`[Server] ${signal} diterima, mematikan server...`);
  server.close(async () => {
    try {
      await prisma.$disconnect();
      await pool.end();
    } catch (err) {
      console.error("[Server] Gagal menutup koneksi DB:", err.message);
    }
    process.exit(0);
  });

  // Jangan menggantung selamanya kalau ada request yang tidak selesai.
  setTimeout(() => process.exit(1), 10_000).unref();
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
