import prisma from "../config/prisma.js";

export const exportTransactionsCSV = async (userId) => {
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    include: {
      account: { select: { name: true } },
      category: { select: { name: true } },
    },
  });

  // Header CSV
  const headers = ["Tanggal", "Tipe", "Kategori", "Dompet", "Nominal", "Keterangan"];

  const rows = transactions.map((tx) => {
    const date = new Date(tx.date).toLocaleDateString("id-ID");
    const type = tx.type === "income" ? "Pemasukan" : tx.type === "expense" ? "Pengeluaran" : "Transfer";
    const category = tx.category?.name || "-";
    const account = tx.account?.name || "-";
    const amount = tx.amount;
    // Escape description untuk CSV (handle koma dan kutip)
    const desc = tx.description ? `"${tx.description.replace(/"/g, '""')}"` : "-";

    return [date, type, category, account, amount, desc].join(",");
  });

  return [headers.join(","), ...rows].join("\n");
};
