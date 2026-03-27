import { jest } from "@jest/globals";
import request from "supertest";
import app from "../src/app.js";

describe("Auth API", () => {
  const testUser = {
    name: "Test User",
    email: `test${Date.now()}@example.com`,
    password: "password123",
  };

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("/api/auth/register").send(testUser);
      expect(res.status).toBe(201);
      expect(res.body.message).toBe("User registered");
      expect(res.body.user).toHaveProperty("id");
      expect(res.body.user.email).toBe(testUser.email);
    });

    it("should reject duplicate email", async () => {
      const res = await request(app).post("/api/auth/register").send(testUser);
      expect(res.status).toBe(400);
    });

    it("should reject invalid email format", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ name: "Test", email: "invalid", password: "123456" });
      expect(res.status).toBe(400);
      expect(res.body.details).toBeDefined();
    });

    it("should reject short password", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ name: "Test", email: "new@test.com", password: "123" });
      expect(res.status).toBe(400);
    });

    it("should reject missing name", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ email: "x@test.com", password: "123456" });
      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login with correct credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: testUser.email, password: testUser.password });
      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.user).toHaveProperty("id");
    });

    it("should reject wrong password", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: testUser.email, password: "wrongpassword" });
      expect(res.status).toBe(400);
    });

    it("should reject non-existent email", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "noone@example.com", password: "123456" });
      expect(res.status).toBe(400);
    });
  });
});
