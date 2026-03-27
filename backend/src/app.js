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
const corsOptions = {
  origin: isProduction
    ? process.env.FRONTEND_URL || "https://flowfinance.app"
    : ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: isProduction ? 100 : 1000, // limit per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Terlalu banyak request, coba lagi nanti." },
});
app.use("/api/", limiter);

// Auth rate limiting (lebih ketat)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 20 : 100,
  message: { error: "Terlalu banyak percobaan login, coba lagi dalam 15 menit." },
});

app.use(express.json({ limit: "10mb" }));

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

// Health check
app.get("/", (req, res) => {
  res.json({ message: "FlowFinance API running", env: process.env.NODE_ENV || "development" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: isProduction ? "Internal server error" : err.message });
});

export default app;
