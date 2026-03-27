import request from "supertest";
import app from "../src/app.js";
import { createAuthenticatedUser, createWallet, createCategory } from "./helpers.js";

describe("Transaction API", () => {
  let token, wallet, category;

  beforeAll(async () => {
    const auth = await createAuthenticatedUser("tx");
    token = auth.token;
    wallet = await createWallet(token);
    category = await createCategory(token, { name: "Makan", type: "expense" });
  });

  const auth = () => ({ Authorization: `Bearer ${token}` });

  describe("POST /api/transactions", () => {
    it("should create an expense transaction", async () => {
      const res = await request(app)
        .post("/api/transactions")
        .set(auth())
        .send({
          accountId: wallet.id,
          categoryId: category.id,
          amount: 50000,
          type: "expense",
          description: "Beli nasi goreng",
        });
      expect(res.status).toBe(201);
      expect(res.body.transaction).toHaveProperty("id");
    });

    it("should deduct wallet balance on expense", async () => {
      const res = await request(app).get("/api/wallets").set(auth());
      const updatedWallet = res.body.find((w) => w.id === wallet.id);
      expect(updatedWallet.balance).toBe(950000); // 1000000 - 50000
    });

    it("should reject amount <= 0", async () => {
      const res = await request(app)
        .post("/api/transactions")
        .set(auth())
        .send({
          accountId: wallet.id,
          categoryId: category.id,
          amount: -100,
          type: "expense",
          description: "Invalid",
        });
      expect(res.status).toBe(400);
    });

    it("should reject missing description", async () => {
      const res = await request(app)
        .post("/api/transactions")
        .set(auth())
        .send({
          accountId: wallet.id,
          categoryId: category.id,
          amount: 1000,
          type: "expense",
        });
      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/transactions", () => {
    it("should return paginated transactions", async () => {
      const res = await request(app)
        .get("/api/transactions?page=1&limit=10")
        .set(auth());
      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.pagination).toHaveProperty("total");
      expect(res.body.pagination).toHaveProperty("totalPages");
    });

    it("should filter by type", async () => {
      const res = await request(app)
        .get("/api/transactions?type=expense")
        .set(auth());
      expect(res.status).toBe(200);
      res.body.data.forEach((tx) => expect(tx.type).toBe("expense"));
    });
  });

  describe("PUT /api/transactions/:id", () => {
    let txId;
    beforeAll(async () => {
      const res = await request(app)
        .get("/api/transactions?limit=1")
        .set(auth());
      txId = res.body.data[0].id;
    });

    it("should update a transaction", async () => {
      const res = await request(app)
        .put(`/api/transactions/${txId}`)
        .set(auth())
        .send({
          accountId: wallet.id,
          categoryId: category.id,
          amount: 75000,
          type: "expense",
          description: "Updated description",
        });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Transaction updated");
    });
  });

  describe("DELETE /api/transactions/:id", () => {
    let txId;
    beforeAll(async () => {
      // Create a new one to delete
      const createRes = await request(app)
        .post("/api/transactions")
        .set(auth())
        .send({
          accountId: wallet.id,
          categoryId: category.id,
          amount: 10000,
          type: "expense",
          description: "To be deleted",
        });
      txId = createRes.body.transaction.id;
    });

    it("should delete and restore balance", async () => {
      const beforeRes = await request(app).get("/api/wallets").set(auth());
      const balanceBefore = beforeRes.body.find((w) => w.id === wallet.id).balance;

      const res = await request(app)
        .delete(`/api/transactions/${txId}`)
        .set(auth());
      expect(res.status).toBe(200);

      const afterRes = await request(app).get("/api/wallets").set(auth());
      const balanceAfter = afterRes.body.find((w) => w.id === wallet.id).balance;
      expect(balanceAfter).toBe(balanceBefore + 10000);
    });
  });

  describe("Transfer", () => {
    let wallet2;
    beforeAll(async () => {
      wallet2 = await createWallet(token, { name: "Wallet 2", balance: 500000 });
    });

    it("should transfer between wallets", async () => {
      const res = await request(app)
        .post("/api/transactions")
        .set(auth())
        .send({
          accountId: wallet.id,
          toAccountId: wallet2.id,
          amount: 100000,
          type: "transfer",
          description: "Transfer test",
        });
      expect(res.status).toBe(201);
    });

    it("should reject transfer to same wallet", async () => {
      const res = await request(app)
        .post("/api/transactions")
        .set(auth())
        .send({
          accountId: wallet.id,
          toAccountId: wallet.id,
          amount: 50000,
          type: "transfer",
        });
      expect(res.status).toBe(400);
    });
  });
});
