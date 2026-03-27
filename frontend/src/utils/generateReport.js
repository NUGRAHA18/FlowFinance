import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generateMonthlyReport(data, period = "Bulan Ini") {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFontSize(22);
  doc.setTextColor(98, 130, 99); // #628263
  doc.text("FlowFinance", 14, 20);

  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Laporan Keuangan - ${period}`, 14, 28);
  doc.text(`Dicetak: ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`, 14, 34);

  // Separator
  doc.setDrawColor(98, 130, 99);
  doc.setLineWidth(0.5);
  doc.line(14, 38, pageWidth - 14, 38);

  // Summary Cards
  let y = 46;
  doc.setFontSize(14);
  doc.setTextColor(30, 30, 30);
  doc.text("Ringkasan", 14, y);
  y += 8;

  doc.setFontSize(10);
  const summaryData = [
    ["Total Saldo", `Rp ${(data.totalBalance || 0).toLocaleString("id-ID")}`],
    ["Pemasukan", `Rp ${(data.thisMonth?.income || 0).toLocaleString("id-ID")}`],
    ["Pengeluaran", `Rp ${(data.thisMonth?.expense || 0).toLocaleString("id-ID")}`],
    ["Net Cash Flow", `Rp ${(data.thisMonth?.netCashFlow || 0).toLocaleString("id-ID")}`],
  ];

  autoTable(doc, {
    startY: y,
    head: [["Metrik", "Jumlah"]],
    body: summaryData,
    theme: "grid",
    headStyles: { fillColor: [98, 130, 99], fontSize: 10 },
    styles: { fontSize: 10, cellPadding: 4 },
    columnStyles: { 1: { halign: "right", fontStyle: "bold" } },
    margin: { left: 14, right: 14 },
  });

  y = doc.lastAutoTable.finalY + 12;

  // Expense by Category
  if (data.expenseByCategory && data.expenseByCategory.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(30, 30, 30);
    doc.text("Pengeluaran per Kategori", 14, y);
    y += 8;

    const categoryData = data.expenseByCategory.map((cat) => [
      cat.category,
      `Rp ${cat.total.toLocaleString("id-ID")}`,
      `${cat.percentage}%`,
    ]);

    autoTable(doc, {
      startY: y,
      head: [["Kategori", "Total", "%"]],
      body: categoryData,
      theme: "grid",
      headStyles: { fillColor: [98, 130, 99], fontSize: 10 },
      styles: { fontSize: 10, cellPadding: 4 },
      columnStyles: {
        1: { halign: "right" },
        2: { halign: "center" },
      },
      margin: { left: 14, right: 14 },
    });

    y = doc.lastAutoTable.finalY + 12;
  }

  // Budget Progress
  if (data.budgets && data.budgets.length > 0) {
    // Check if we need a new page
    if (y > 240) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(30, 30, 30);
    doc.text("Progress Anggaran", 14, y);
    y += 8;

    const budgetData = data.budgets.map((b) => {
      const spent = b.spentAmount || 0;
      const pct = b.amount > 0 ? Math.round((spent / b.amount) * 100) : 0;
      return [
        b.category?.name || "-",
        `Rp ${spent.toLocaleString("id-ID")}`,
        `Rp ${b.amount.toLocaleString("id-ID")}`,
        `${pct}%`,
        pct >= 100 ? "MELEBIHI" : pct >= 80 ? "HAMPIR HABIS" : "AMAN",
      ];
    });

    autoTable(doc, {
      startY: y,
      head: [["Kategori", "Terpakai", "Batas", "%", "Status"]],
      body: budgetData,
      theme: "grid",
      headStyles: { fillColor: [98, 130, 99], fontSize: 10 },
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        1: { halign: "right" },
        2: { halign: "right" },
        3: { halign: "center" },
        4: { halign: "center" },
      },
      margin: { left: 14, right: 14 },
    });

    y = doc.lastAutoTable.finalY + 12;
  }

  // Recent Transactions
  if (data.recentTransactions && data.recentTransactions.length > 0) {
    if (y > 220) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(30, 30, 30);
    doc.text("Transaksi Terakhir", 14, y);
    y += 8;

    const txData = data.recentTransactions.map((tx) => [
      new Date(tx.date).toLocaleDateString("id-ID"),
      tx.type === "income" ? "Pemasukan" : tx.type === "expense" ? "Pengeluaran" : "Transfer",
      tx.category?.name || "-",
      tx.description || "-",
      `${tx.type === "income" ? "+" : "-"} Rp ${tx.amount.toLocaleString("id-ID")}`,
    ]);

    autoTable(doc, {
      startY: y,
      head: [["Tanggal", "Tipe", "Kategori", "Keterangan", "Nominal"]],
      body: txData,
      theme: "grid",
      headStyles: { fillColor: [98, 130, 99], fontSize: 9 },
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: { 4: { halign: "right" } },
      margin: { left: 14, right: 14 },
    });
  }

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `FlowFinance - Halaman ${i} dari ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  // Download
  const filename = `laporan-flowfinance-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
