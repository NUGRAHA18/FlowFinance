#!/usr/bin/env node
/**
 * Migrasi data Neon → Supabase.
 *
 * Menyalin isi tabel apa adanya lewat driver `pg` — tidak butuh pg_dump/psql
 * terpasang di mesin. Skema TIDAK dibuat di sini; jalankan `npm run db:deploy`
 * ke Supabase lebih dulu.
 *
 * Pemakaian:
 *   SOURCE_DATABASE_URL=<neon>  TARGET_DATABASE_URL=<supabase direct :5432> \
 *     node scripts/migrate-data.js [--dry-run] [--truncate] [--no-ssl-verify]
 *
 * Flag:
 *   --dry-run        Hanya baca & hitung baris di kedua sisi. Tidak menulis apa pun.
 *   --truncate       Kosongkan tabel tujuan lebih dulu (urutan terbalik).
 *                    TANPA flag ini script bersifat idempoten: baris dengan id
 *                    yang sudah ada di tujuan dilewati (ON CONFLICT DO NOTHING).
 *   --no-ssl-verify  Matikan verifikasi sertifikat TLS. Pakai hanya kalau
 *                    koneksi gagal dengan error sertifikat.
 */

import "dotenv/config";
import pg from "pg";

// Urutan penting: parent sebelum child, mengikuti foreign key di schema.prisma.
// Rollback/truncate memakai urutan terbalik.
const TABLES = [
  "User",
  "Account",
  "Category",
  "Transaction",
  "Budget",
  "SavingGoal",
  "Debt",
  "DebtPayment",
  "Subscription",
  "RecurringTransaction",
];

// Baris per statement INSERT. Postgres membatasi 65535 parameter per query,
// jadi 500 baris × ~12 kolom masih jauh di bawah batas.
const BATCH_SIZE = 500;

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has("--dry-run");
const TRUNCATE = args.has("--truncate");
const NO_SSL_VERIFY = args.has("--no-ssl-verify");

for (const arg of args) {
  if (!["--dry-run", "--truncate", "--no-ssl-verify"].includes(arg)) {
    console.error(`Flag tidak dikenal: ${arg}`);
    process.exit(1);
  }
}

const SOURCE_URL = process.env.SOURCE_DATABASE_URL;
const TARGET_URL = process.env.TARGET_DATABASE_URL;

if (!SOURCE_URL || !TARGET_URL) {
  console.error(
    "SOURCE_DATABASE_URL dan TARGET_DATABASE_URL wajib di-set.\n\n" +
      "  SOURCE_DATABASE_URL = connection string Neon (database lama)\n" +
      "  TARGET_DATABASE_URL = Supabase DIRECT connection, port 5432 — bukan pooler 6543.\n" +
      "                        Pooler tidak cocok untuk transaksi besar seperti ini."
  );
  process.exit(1);
}

if (/:6543\//.test(TARGET_URL)) {
  console.error(
    "TARGET_DATABASE_URL menunjuk ke port 6543 (transaction pooler).\n" +
      "Gunakan DIRECT connection (port 5432) — pooler memutus transaksi panjang."
  );
  process.exit(1);
}

const ident = (name) => `"${name.replace(/"/g, '""')}"`;

const connect = async (label, connectionString) => {
  const client = new pg.Client({
    connectionString,
    ...(NO_SSL_VERIFY ? { ssl: { rejectUnauthorized: false } } : {}),
    // Migrasi bisa lama; jangan diputus di tengah jalan.
    statement_timeout: 0,
    query_timeout: 0,
  });
  try {
    await client.connect();
  } catch (err) {
    console.error(`\n✗ Gagal konek ke ${label}: ${err.message}`);
    if (/certificate|SSL|self.signed/i.test(err.message)) {
      console.error("  Coba ulangi dengan flag --no-ssl-verify.");
    }
    process.exit(1);
  }
  return client;
};

const countRows = async (client, table) => {
  const res = await client.query(`SELECT COUNT(*)::int AS n FROM ${ident(table)}`);
  return res.rows[0].n;
};

// information_schema membandingkan nama apa adanya. `to_regclass('public.User')`
// tidak bisa dipakai: identifier tanpa kutip dilipat jadi huruf kecil, sedangkan
// Prisma membuat tabel PascalCase ("User", "SavingGoal", ...).
const tableExists = async (client, table) => {
  const res = await client.query(
    `SELECT EXISTS (
       SELECT 1 FROM information_schema.tables
       WHERE table_schema = 'public' AND table_name = $1
     ) AS present`,
    [table]
  );
  return res.rows[0].present;
};

const main = async () => {
  console.log(`\nFlowFinance — migrasi data Neon → Supabase`);
  console.log(`Mode: ${DRY_RUN ? "DRY RUN (tidak menulis)" : TRUNCATE ? "TRUNCATE + INSERT" : "INSERT (idempoten)"}\n`);

  const source = await connect("SOURCE (Neon)", SOURCE_URL);
  const target = await connect("TARGET (Supabase)", TARGET_URL);

  try {
    // ── Preflight ────────────────────────────────────────────────────────────
    const missingSource = [];
    const missingTarget = [];
    for (const table of TABLES) {
      if (!(await tableExists(source, table))) missingSource.push(table);
      if (!(await tableExists(target, table))) missingTarget.push(table);
    }

    if (missingTarget.length) {
      console.error(
        `✗ Tabel belum ada di Supabase: ${missingTarget.join(", ")}\n` +
          `  Jalankan \`npm run db:deploy\` ke Supabase lebih dulu.`
      );
      process.exit(1);
    }
    if (missingSource.length) {
      console.error(`✗ Tabel tidak ditemukan di Neon: ${missingSource.join(", ")}`);
      process.exit(1);
    }

    // ── Ringkasan sebelum ────────────────────────────────────────────────────
    const before = {};
    console.log("Tabel                      Neon    Supabase");
    console.log("─────────────────────────────────────────────");
    for (const table of TABLES) {
      const src = await countRows(source, table);
      const tgt = await countRows(target, table);
      before[table] = { src, tgt };
      console.log(`${table.padEnd(24)} ${String(src).padStart(6)}  ${String(tgt).padStart(10)}`);
    }

    const totalSource = Object.values(before).reduce((a, b) => a + b.src, 0);
    const totalTarget = Object.values(before).reduce((a, b) => a + b.tgt, 0);
    console.log("─────────────────────────────────────────────");
    console.log(`${"TOTAL".padEnd(24)} ${String(totalSource).padStart(6)}  ${String(totalTarget).padStart(10)}\n`);

    if (DRY_RUN) {
      console.log("Dry run selesai — tidak ada data yang ditulis.");
      return;
    }

    if (totalSource === 0) {
      console.log("Tidak ada data di Neon. Selesai.");
      return;
    }

    if (totalTarget > 0 && !TRUNCATE) {
      console.log(
        "! Supabase sudah berisi data. Baris dengan id yang sama akan DILEWATI,\n" +
          "  bukan ditimpa. Pakai --truncate kalau ingin mengganti total.\n"
      );
    }

    // Menonaktifkan trigger FK sebagai jaring pengaman — urutan TABLES sudah
    // benar, jadi ini opsional. Supabase mengizinkan ini untuk role `postgres`.
    //
    // Dijalankan SEBELUM BEGIN: kalau SET gagal di dalam transaksi, transaksinya
    // ikut abort dan semua query berikutnya gagal.
    let replicaMode = false;
    try {
      await target.query("SET session_replication_role = replica");
      replicaMode = true;
    } catch {
      console.log("(session_replication_role tidak tersedia — mengandalkan urutan tabel)\n");
    }

    // ── Copy dalam satu transaksi ────────────────────────────────────────────
    await target.query("BEGIN");

    const inserted = Object.fromEntries(TABLES.map((t) => [t, 0]));

    if (TRUNCATE) {
      for (const table of [...TABLES].reverse()) {
        await target.query(`DELETE FROM ${ident(table)}`);
      }
      console.log("Tabel tujuan dikosongkan.\n");
    }

    for (const table of TABLES) {
      const { rows } = await source.query(`SELECT * FROM ${ident(table)}`);
      if (rows.length === 0) {
        console.log(`${table.padEnd(24)} kosong, dilewati`);
        continue;
      }

      const columns = Object.keys(rows[0]);
      const colList = columns.map(ident).join(", ");

      for (let offset = 0; offset < rows.length; offset += BATCH_SIZE) {
        const batch = rows.slice(offset, offset + BATCH_SIZE);
        const values = [];
        const placeholders = batch.map((row) => {
          const slots = columns.map((col) => {
            values.push(row[col]);
            return `$${values.length}`;
          });
          return `(${slots.join(", ")})`;
        });

        const res = await target.query(
          `INSERT INTO ${ident(table)} (${colList}) VALUES ${placeholders.join(", ")} ` +
            `ON CONFLICT ("id") DO NOTHING`,
          values
        );
        inserted[table] += res.rowCount;
      }

      const skipped = rows.length - inserted[table];
      console.log(
        `${table.padEnd(24)} ${String(inserted[table]).padStart(6)} disalin` +
          (skipped > 0 ? `, ${skipped} dilewati (id sudah ada)` : "")
      );
    }

    await target.query("COMMIT");

    if (replicaMode) {
      await target.query("SET session_replication_role = DEFAULT");
    }

    console.log("\n✓ Transaksi di-commit.\n");

    // ── Verifikasi ───────────────────────────────────────────────────────────
    console.log("Verifikasi:");
    console.log("Tabel                      Neon    Supabase   status");
    console.log("──────────────────────────────────────────────────────");
    let mismatch = 0;
    for (const table of TABLES) {
      const src = before[table].src;
      const tgt = await countRows(target, table);
      const ok = tgt >= src;
      if (!ok) mismatch++;
      console.log(
        `${table.padEnd(24)} ${String(src).padStart(6)}  ${String(tgt).padStart(10)}   ${ok ? "ok" : "KURANG"}`
      );
    }
    console.log("──────────────────────────────────────────────────────");

    if (mismatch > 0) {
      console.error(`\n✗ ${mismatch} tabel punya baris lebih sedikit dari sumber.`);
      process.exit(1);
    }
    console.log("\n✓ Semua tabel cocok. Migrasi selesai.");
    console.log("  Langkah berikut: arahkan DATABASE_URL backend ke Supabase, lalu tes login.");
  } catch (err) {
    try {
      await target.query("ROLLBACK");
      console.error("\n✗ Error — transaksi di-rollback, Supabase tidak berubah.");
    } catch {
      console.error("\n✗ Error, dan rollback juga gagal.");
    }
    console.error(`  ${err.message}`);
    process.exitCode = 1;
  } finally {
    await source.end().catch(() => {});
    await target.end().catch(() => {});
  }
};

main();
