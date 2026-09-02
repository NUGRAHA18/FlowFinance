import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL belum di-set. Isi dengan Supabase connection pooler URL (port 6543)."
  );
}

// Supabase pooler menutup koneksi idle, jadi pool dibuat kecil dan
// koneksi idle dilepas sendiri sebelum server memutusnya.
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: Number(process.env.DB_POOL_MAX || 10),
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});

pool.on("error", (err) => {
  console.error("[DB] Idle client error:", err.message);
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export { pool };
export default prisma;
