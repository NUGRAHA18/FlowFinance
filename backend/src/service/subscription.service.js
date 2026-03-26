import prisma from "../config/prisma.js";

export const createSubscription = async ({
  userId,
  name,
  cost,
  billingCycle,
  nextPayment,
}) => {
  return await prisma.subscription.create({
    data: {
      userId,
      name,
      cost,
      billingCycle, // monthly atau yearly
      nextPayment: new Date(nextPayment),
    },
  });
};

export const getUserSubscriptions = async (userId) => {
  return await prisma.subscription.findMany({
    where: { userId },
    orderBy: { nextPayment: "asc" }, // Mengurutkan dari tagihan terdekat
  });
};

export const deleteSubscription = async ({ subscriptionId, userId }) => {
  const subscription = await prisma.subscription.findFirst({
    where: { id: subscriptionId, userId },
  });

  if (!subscription) throw new Error("Subscription not found");

  return await prisma.subscription.delete({
    where: { id: subscriptionId },
  });
};
