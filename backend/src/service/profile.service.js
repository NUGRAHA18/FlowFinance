import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  if (!user) throw new Error("User not found");
  return user;
};

export const updateProfile = async ({ userId, name, email }) => {
  // Cek apakah email sudah dipakai user lain
  if (email) {
    const existing = await prisma.user.findFirst({
      where: { email, NOT: { id: userId } },
    });
    if (existing) throw new Error("Email sudah digunakan oleh akun lain");
  }

  return await prisma.user.update({
    where: { id: userId },
    data: { name, email },
    select: { id: true, name: true, email: true, createdAt: true },
  });
};

export const changePassword = async ({ userId, currentPassword, newPassword }) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error("User not found");

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) throw new Error("Password lama tidak sesuai");

  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { message: "Password berhasil diubah" };
};
