import "dotenv/config";
import { defineConfig } from "@prisma/config";

export default defineConfig({
  datasource: {
    // Migrasi & introspeksi harus lewat direct connection Supabase (port 5432),
    // bukan pooler (6543) — pgbouncer tidak mendukung prepared statement DDL.
    url: process.env.DIRECT_URL || process.env.DATABASE_URL,
  },
});
