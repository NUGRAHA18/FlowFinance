import request from "supertest";
import app from "../src/app.js";

// Buat user baru + login, return { token, userId }
export async function createAuthenticatedUser(suffix = "") {
  const email = `testuser${Date.now()}${suffix}@test.com`;
  const password = "testpass123";

  await request(app)
    .post("/api/auth/register")
    .send({ name: "Test User", email, password });

  const loginRes = await request(app)
    .post("/api/auth/login")
    .send({ email, password });

  return {
    token: loginRes.body.token,
    userId: loginRes.body.user.id,
    email,
  };
}

// Helper: buat wallet
export async function createWallet(token, data = {}) {
  const res = await request(app)
    .post("/api/wallets")
    .set("Authorization", `Bearer ${token}`)
    .send({ name: data.name || "Test Wallet", type: data.type || "bank", balance: data.balance || 1000000 });
  return res.body.wallet;
}

// Helper: buat kategori
export async function createCategory(token, data = {}) {
  const res = await request(app)
    .post("/api/categories")
    .set("Authorization", `Bearer ${token}`)
    .send({ name: data.name || "Test Category", type: data.type || "expense" });
  return res.body.category;
}
