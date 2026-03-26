import prisma from "../config/prisma.js";

export const getDashboardData = async (userId) => {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // 1. Hitung Total Saldo dari semua dompet (Account)
  const accounts = await prisma.account.findMany({
    where: { userId },
    select: { balance: true },
  });
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  // 2. Hitung Total Pemasukan & Pengeluaran Bulan Ini
  const transactionsThisMonth = await prisma.transaction.findMany({
    where: {
      userId,
      date: { gte: firstDayOfMonth },
    },
    select: { amount: true, type: true },
  });

  let totalIncome = 0;
  let totalExpense = 0;

  transactionsThisMonth.forEach((tx) => {
    if (tx.type === "income") totalIncome += tx.amount;
    if (tx.type === "expense") totalExpense += tx.amount;
  });

  // 3. Ambil 5 Transaksi Terakhir
  const recentTransactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 5,
    include: {
      category: { select: { name: true } },
      account: { select: { name: true } },
    },
  });

  return {
    totalBalance,
    totalIncome,
    totalExpense,
    recentTransactions,
  };
};
