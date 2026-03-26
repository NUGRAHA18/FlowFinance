import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// 1. Buat koneksi pool menggunakan library 'pg'
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// 2. Gunakan adapter agar Prisma bisa bicara dengan pool tersebut
const adapter = new PrismaPg(pool);

// 3. Masukkan adapter ke dalam PrismaClient
const prisma = new PrismaClient({ adapter });

export default prisma;
