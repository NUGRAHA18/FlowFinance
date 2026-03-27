const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Fungsi bantuan untuk format YYYY-MM
const getMonthStr = (date) => date.toISOString().slice(0, 7);

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id; // Asumsi ID user didapat dari middleware JWT

    // 1. Tentukan batas waktu (Tanggal)
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59,
      999,
    );

    // Start of current year for charts
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // 2. Tarik Semua Data Esensial Paralel (Agar Cepat)
    const [
      accounts,
      savings,
      budgets,
      recentTransactions,
      thisMonthTransactions,
      lastMonthTransactions,
      yearTransactions,
    ] = await Promise.all([
      prisma.account.findMany({ where: { userId } }),
      prisma.savingGoal.findMany({ where: { userId } }),
      prisma.budget.findMany({
        where: { userId, month: getMonthStr(now) },
        include: { category: true },
      }),
      prisma.transaction.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        take: 5,
        include: { category: true, account: true },
      }),
      prisma.transaction.findMany({
        where: { userId, date: { gte: startOfThisMonth } },
        include: { category: true },
      }),
      prisma.transaction.findMany({
        where: { userId, date: { gte: startOfLastMonth, lte: endOfLastMonth } },
      }),
      prisma.transaction.findMany({
        where: { userId, date: { gte: startOfYear } },
        include: { category: true },
      }),
    ]);

    // 3. Kalkulasi Total Saldo (Total Balance)
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

    // 4. Kalkulasi Pemasukan & Pengeluaran (Bulan Ini vs Bulan Lalu)
    const calculateFlow = (transactions) => {
      let income = 0,
        expense = 0;
      transactions.forEach((tx) => {
        if (tx.type === "income") income += tx.amount;
        if (tx.type === "expense") expense += tx.amount;
      });
      return { income, expense, netCashFlow: income - expense };
    };

    const thisMonth = calculateFlow(thisMonthTransactions);
    const lastMonth = calculateFlow(lastMonthTransactions);

    // 5. Kalkulasi Progress Anggaran (Budget Progress)
    const budgetsWithProgress = budgets.map((budget) => {
      // Hitung total pengeluaran untuk kategori ini di bulan ini
      const spentAmount = thisMonthTransactions
        .filter(
          (tx) => tx.categoryId === budget.categoryId && tx.type === "expense",
        )
        .reduce((sum, tx) => sum + tx.amount, 0);

      return { ...budget, spentAmount };
    });

    // 6. Expense By Category (Pie Chart Data)
    const expenseByCategoryMap = {};
    thisMonthTransactions
      .filter((tx) => tx.type === "expense")
      .forEach((tx) => {
        const catName = tx.category.name;
        expenseByCategoryMap[catName] =
          (expenseByCategoryMap[catName] || 0) + tx.amount;
      });

    const expenseByCategory = Object.keys(expenseByCategoryMap)
      .map((catName) => {
        const total = expenseByCategoryMap[catName];
        const percentage =
          thisMonth.expense > 0
            ? Math.round((total / thisMonth.expense) * 100)
            : 0;
        return { category: catName, total, percentage };
      })
      .sort((a, b) => b.total - a.total); // Urutkan dari yang terbesar

    // 7. Chart Income vs Expense (Bar Chart Data - Per Bulan)
    const monthlyDataMap = {};
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Inisialisasi bulan sampai bulan saat ini
    for (let i = 0; i <= now.getMonth(); i++) {
      monthlyDataMap[i] = { month: monthNames[i], income: 0, expense: 0 };
    }

    yearTransactions.forEach((tx) => {
      const m = tx.date.getMonth();
      if (monthlyDataMap[m]) {
        if (tx.type === "income") monthlyDataMap[m].income += tx.amount;
        if (tx.type === "expense") monthlyDataMap[m].expense += tx.amount;
      }
    });

    const chartData = Object.values(monthlyDataMap);

    // 8. Kembalikan Response Final
    res.json({
      totalBalance,
      thisMonth,
      lastMonth,
      recentTransactions,
      budgets: budgetsWithProgress,
      savings,
      expenseByCategory,
      chartData,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ error: "Gagal memuat data dashboard" });
  }
};
