import prisma from "../config/prisma.js";

export const createDebt = async ({
  userId,
  personName,
  amount,
  dueDate,
  status,
}) => {
  return await prisma.debt.create({
    data: {
      userId,
      personName,
      amount,
      dueDate: new Date(dueDate),
      status: status || "pending",
    },
  });
};

export const getUserDebts = async (userId) => {
  return await prisma.debt.findMany({
    where: { userId },
    include: {
      payments: {
        orderBy: { paidAt: "desc" },
      },
    },
    orderBy: { dueDate: "asc" },
  });
};

// Bayar hutang (partial / full) — otomatis buat transaksi expense
export const payDebt = async ({ debtId, userId, amount, accountId, note }) => {
  return await prisma.$transaction(async (tx) => {
    const debt = await tx.debt.findFirst({
      where: { id: debtId, userId },
    });
    if (!debt) throw new Error("Hutang tidak ditemukan");
    if (debt.status === "paid") throw new Error("Hutang sudah lunas");

    const remaining = debt.amount - debt.paidAmount;
    if (amount > remaining) throw new Error(`Maksimal pembayaran Rp ${remaining.toLocaleString("id-ID")}`);

    // Cek saldo dompet
    const account = await tx.account.findFirst({
      where: { id: accountId, userId },
    });
    if (!account) throw new Error("Dompet tidak ditemukan");
    if (account.balance < amount) throw new Error("Saldo dompet tidak mencukupi");

    // 1. Kurangi saldo dompet
    await tx.account.update({
      where: { id: accountId },
      data: { balance: { decrement: amount } },
    });

    // 2. Catat pembayaran
    await tx.debtPayment.create({
      data: { debtId, amount, note },
    });

    // 3. Update paidAmount + status
    const newPaidAmount = debt.paidAmount + amount;
    const newStatus = newPaidAmount >= debt.amount ? "paid" : "partial";

    const updated = await tx.debt.update({
      where: { id: debtId },
      data: { paidAmount: newPaidAmount, status: newStatus },
    });

    // 4. Buat transaksi expense otomatis
    await tx.transaction.create({
      data: {
        userId,
        accountId,
        amount,
        type: "expense",
        description: `Bayar hutang: ${debt.personName}${note ? ` - ${note}` : ""}`,
      },
    });

    return updated;
  });
};

export const updateDebtStatus = async ({ debtId, userId, status }) => {
  const debt = await prisma.debt.findFirst({
    where: { id: debtId, userId },
  });

  if (!debt) throw new Error("Debt not found");

  return await prisma.debt.update({
    where: { id: debtId },
    data: { status },
  });
};
