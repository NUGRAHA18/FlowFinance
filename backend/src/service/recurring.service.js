import prisma from "../config/prisma.js";
import { createTransaction } from "./transaction.service.js";

export const createRecurring = async ({
  userId,
  accountId,
  categoryId,
  amount,
  type,
  description,
  frequency,
  nextRun,
}) => {
  const recurring = await prisma.recurringTransaction.create({
    data: {
      userId,
      accountId,
      categoryId,
      amount,
      type,
      description,
      frequency,
      nextRun: new Date(nextRun),
    },
  });
  return recurring;
};

export const getUserRecurrings = async (userId) => {
  const recurrings = await prisma.recurringTransaction.findMany({
    where: { userId },
    include: {
      account: { select: { name: true } },
      category: { select: { name: true } },
    },
    orderBy: { nextRun: "asc" },
  });
  return recurrings;
};

export const updateRecurring = async ({ recurringId, userId, isActive }) => {
  const recurring = await prisma.recurringTransaction.findUnique({
    where: { id: recurringId },
  });

  if (!recurring || recurring.userId !== userId) {
    throw new Error("Recurring transaction not found");
  }

  const updated = await prisma.recurringTransaction.update({
    where: { id: recurringId },
    data: { isActive },
  });
  return updated;
};

export const deleteRecurring = async ({ recurringId, userId }) => {
  const recurring = await prisma.recurringTransaction.findUnique({
    where: { id: recurringId },
  });

  if (!recurring || recurring.userId !== userId) {
    throw new Error("Recurring transaction not found");
  }

  await prisma.recurringTransaction.delete({
    where: { id: recurringId },
  });
  return { message: "Recurring transaction deleted" };
};

const calculateNextRun = (currentNextRun, frequency) => {
  const date = new Date(currentNextRun);

  switch (frequency) {
    case "daily":
      date.setDate(date.getDate() + 1);
      break;
    case "weekly":
      date.setDate(date.getDate() + 7);
      break;
    case "monthly":
      date.setMonth(date.getMonth() + 1);
      break;
    case "yearly":
      date.setFullYear(date.getFullYear() + 1);
      break;
    default:
      throw new Error(`Unknown frequency: ${frequency}`);
  }

  return date;
};

export const processRecurrings = async () => {
  const now = new Date();

  const dueRecurrings = await prisma.recurringTransaction.findMany({
    where: {
      isActive: true,
      nextRun: { lte: now },
    },
  });

  let processedCount = 0;

  for (const recurring of dueRecurrings) {
    await createTransaction({
      userId: recurring.userId,
      accountId: recurring.accountId,
      categoryId: recurring.categoryId,
      amount: recurring.amount,
      type: recurring.type,
      description: recurring.description,
    });

    const newNextRun = calculateNextRun(recurring.nextRun, recurring.frequency);

    await prisma.recurringTransaction.update({
      where: { id: recurring.id },
      data: { nextRun: newNextRun },
    });

    processedCount++;
  }

  return processedCount;
};
