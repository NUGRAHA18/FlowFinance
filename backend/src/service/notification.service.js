import prisma from "../config/prisma.js";

const getMonthStr = (date) => date.toISOString().slice(0, 7);

export const getNotifications = async (userId) => {
  const now = new Date();
  const notifications = [];

  // 1. Budget mendekati/melebihi batas
  const budgets = await prisma.budget.findMany({
    where: { userId, month: getMonthStr(now) },
    include: { category: { select: { name: true } } },
  });

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  for (const budget of budgets) {
    const spent = await prisma.transaction.aggregate({
      where: {
        userId,
        categoryId: budget.categoryId,
        type: "expense",
        date: { gte: startOfMonth, lte: endOfMonth },
      },
      _sum: { amount: true },
    });

    const spentAmount = spent._sum.amount || 0;
    const percentage = budget.amount > 0 ? (spentAmount / budget.amount) * 100 : 0;

    if (percentage >= 100) {
      notifications.push({
        type: "budget_exceeded",
        severity: "danger",
        title: `Anggaran ${budget.category?.name} Melebihi Batas!`,
        message: `Terpakai Rp ${spentAmount.toLocaleString("id-ID")} dari Rp ${budget.amount.toLocaleString("id-ID")} (${Math.round(percentage)}%)`,
      });
    } else if (percentage >= 80) {
      notifications.push({
        type: "budget_warning",
        severity: "warning",
        title: `Anggaran ${budget.category?.name} Hampir Habis`,
        message: `Terpakai Rp ${spentAmount.toLocaleString("id-ID")} dari Rp ${budget.amount.toLocaleString("id-ID")} (${Math.round(percentage)}%)`,
      });
    }
  }

  // 2. Hutang mendekati jatuh tempo (7 hari ke depan) atau sudah lewat
  const debts = await prisma.debt.findMany({
    where: { userId, status: "pending" },
  });

  const sevenDaysLater = new Date(now);
  sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

  for (const debt of debts) {
    const dueDate = new Date(debt.dueDate);
    if (dueDate < now) {
      notifications.push({
        type: "debt_overdue",
        severity: "danger",
        title: `Hutang ke ${debt.personName} Sudah Lewat Jatuh Tempo!`,
        message: `Rp ${debt.amount.toLocaleString("id-ID")} — jatuh tempo ${dueDate.toLocaleDateString("id-ID")}`,
      });
    } else if (dueDate <= sevenDaysLater) {
      const daysLeft = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
      notifications.push({
        type: "debt_upcoming",
        severity: "warning",
        title: `Hutang ke ${debt.personName} Segera Jatuh Tempo`,
        message: `Rp ${debt.amount.toLocaleString("id-ID")} — ${daysLeft} hari lagi (${dueDate.toLocaleDateString("id-ID")})`,
      });
    }
  }

  // 3. Subscription mendekati jatuh tempo (7 hari ke depan) atau sudah lewat
  const subscriptions = await prisma.subscription.findMany({
    where: { userId },
  });

  for (const sub of subscriptions) {
    const nextPayment = new Date(sub.nextPayment);
    if (nextPayment < now) {
      notifications.push({
        type: "subscription_overdue",
        severity: "danger",
        title: `Tagihan ${sub.name} Sudah Lewat!`,
        message: `Rp ${sub.cost.toLocaleString("id-ID")} — jatuh tempo ${nextPayment.toLocaleDateString("id-ID")}`,
      });
    } else if (nextPayment <= sevenDaysLater) {
      const daysLeft = Math.ceil((nextPayment - now) / (1000 * 60 * 60 * 24));
      notifications.push({
        type: "subscription_upcoming",
        severity: "warning",
        title: `Tagihan ${sub.name} Segera Jatuh Tempo`,
        message: `Rp ${sub.cost.toLocaleString("id-ID")} — ${daysLeft} hari lagi`,
      });
    }
  }

  // Sort: danger first, then warning
  notifications.sort((a, b) => {
    if (a.severity === "danger" && b.severity !== "danger") return -1;
    if (a.severity !== "danger" && b.severity === "danger") return 1;
    return 0;
  });

  return notifications;
};
