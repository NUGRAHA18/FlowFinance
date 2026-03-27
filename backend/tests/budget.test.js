import request from "supertest";
import app from "../src/app.js";
import { createAuthenticatedUser, createWallet, createCategory } from "./helpers.js";

describe("Budget API", () => {
  let token, wallet, category;
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  beforeAll(async () => {
    const auth = await createAuthenticatedUser("budget");
    token = auth.token;
    wallet = await createWallet(token);
    category = await createCategory(token, { name: "Transport", type: "expense" });
  });

  const auth = () => ({ Authorization: `Bearer ${token}` });

  describe("POST /api/budgets", () => {
    it("should create a budget", async () => {
      const res = await request(app)
        .post("/api/budgets")
        .set(auth())
        .send({ categoryId: category.id, amount: 500000, month: currentMonth });
      expect(res.status).toBe(201);
      expect(res.body.budget).toHaveProperty("id");
    });

    it("should reject duplicate budget for same category+month", async () => {
      const res = await request(app)
        .post("/api/budgets")
        .set(auth())
        .send({ categoryId: category.id, amount: 300000, month: currentMonth });
      expect(res.status).toBe(400);
    });

    it("should reject invalid month format", async () => {
      const res = await request(app)
        .post("/api/budgets")
        .set(auth())
        .send({ categoryId: category.id, amount: 100000, month: "2026-13" });
      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/budgets (with spending tracking)", () => {
    beforeAll(async () => {
      // Buat transaksi expense dengan kategori Transport
      await request(app)
        .post("/api/transactions")
        .set(auth())
        .send({
          accountId: wallet.id,
          categoryId: category.id,
          amount: 150000,
          type: "expense",
          description: "Grab ke kantor",
        });
      await request(app)
        .post("/api/transactions")
        .set(auth())
        .send({
          accountId: wallet.id,
          categoryId: category.id,
          amount: 50000,
          type: "expense",
          description: "Bensin",
        });
    });

    it("should return budgets with spentAmount calculated from transactions", async () => {
      const res = await request(app).get("/api/budgets").set(auth());
      expect(res.status).toBe(200);

      const budget = res.body.find((b) => b.categoryId === category.id);
      expect(budget).toBeDefined();
      expect(budget.spentAmount).toBe(200000); // 150000 + 50000
      expect(budget.amount).toBe(500000);
    });

    it("should include related transactions list", async () => {
      const res = await request(app).get("/api/budgets").set(auth());
      const budget = res.body.find((b) => b.categoryId === category.id);
      expect(budget.transactions).toBeInstanceOf(Array);
      expect(budget.transactions.length).toBe(2);
      expect(budget.transactions[0]).toHaveProperty("description");
      expect(budget.transactions[0]).toHaveProperty("amount");
    });
  });

  describe("DELETE /api/budgets/:id", () => {
    it("should delete a budget", async () => {
      const getRes = await request(app).get("/api/budgets").set(auth());
      const budgetId = getRes.body[0].id;

      const res = await request(app)
        .delete(`/api/budgets/${budgetId}`)
        .set(auth());
      expect(res.status).toBe(200);
    });
  });
});
