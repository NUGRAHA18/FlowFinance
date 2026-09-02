import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.routes.js";
import walletRoutes from "./routes/wallet.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import budgetRoutes from "./routes/budget.routes.js";
import savingGoalRoutes from "./routes/savingGoal.routes.js";
import debtRoutes from "./routes/debt.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import exportRoutes from "./routes/export.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import recurringRoutes from "./routes/recurring.routes.js";

dotenv.config();

const app = express();
const isProduction = process.env.NODE_ENV === "production";

// Security
app.use(helmet());

// CORS
// FRONTEND_URL boleh berisi beberapa origin, dipisah koma.
const staticOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((o) => o.trim().replace(/\/$/, ""))
  .filter(Boolean);

const devOrigins = ["http://localhost:5173", "http://localhost:4173", "http://localhost:3000"];

// Preview deployment Vercel punya URL yang berubah tiap commit.
const previewOriginPattern = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i;

const isOriginAllowed = (origin) => {
  const normalized = origin.replace(/\/$/, "");
  if (staticOrigins.includes(normalized)) return true;
  if (!isProduction && devOrigins.includes(normalized)) return true;
  if (previewOriginPattern.test(normalized)) return true;
  return false;
};

app.use(
  cors({
    origin: (origin, callback) => {
      // Request tanpa Origin (curl, health check, server-to-server) selalu lolos.
      if (!origin) return callback(null, true);
      if (isOriginAllowed(origin)) return callback(null, true);
      callback(new Error(`Origin ${origin} tidak diizinkan oleh CORS`));
    },
    credentials: true,
  })
);

// Render menempatkan app di belakang proxy — perlu agar rate limiter melihat IP asli.
app.set("trust proxy", 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: isProduction ? 500 : 1000, // limit per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Terlalu banyak request, coba lagi nanti." },
});
app.use("/api/", limiter);

// Auth rate limiting (lebih ketat)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 50 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Terlalu banyak percobaan login, coba lagi dalam 15 menit." },
});

app.use(express.json({ limit: "10mb" }));

// Health check — dipakai Render sebagai health check path. Sengaja tidak
// menyentuh database supaya probe tetap murah dan tidak memakan koneksi pooler.
app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.get("/", (req, res) => {
  res.json({
    service: "flowfinance-api",
    message: "FlowFinance API running",
    env: process.env.NODE_ENV || "development",
  });
});

// Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/wallets", walletRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/saving-goals", savingGoalRoutes);
app.use("/api/debts", debtRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/recurring", recurringRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} tidak ditemukan` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  const status = /CORS/.test(err.message) ? 403 : 500;
  res.status(status).json({
    error: isProduction && status === 500 ? "Internal server error" : err.message,
  });
});

export default app;
