// Helper: buat validation error
const fail = (res, errors) => {
  return res.status(400).json({ error: "Validation failed", details: errors });
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidUUID = (id) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
const isValidMonth = (m) => /^\d{4}-(0[1-9]|1[0-2])$/.test(m);
const isValidDate = (d) => !isNaN(new Date(d).getTime());

// ==================== AUTH ====================

export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || typeof name !== "string" || name.trim().length < 2)
    errors.push("Nama minimal 2 karakter");
  if (!email || !isValidEmail(email)) errors.push("Format email tidak valid");
  if (!password || password.length < 6)
    errors.push("Password minimal 6 karakter");

  return errors.length ? fail(res, errors) : next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !isValidEmail(email)) errors.push("Format email tidak valid");
  if (!password || password.length === 0) errors.push("Password wajib diisi");

  return errors.length ? fail(res, errors) : next();
};

// ==================== ACCOUNT/WALLET ====================

export const validateCreateWallet = (req, res, next) => {
  const { name, type, balance } = req.body;
  const errors = [];
  const validTypes = ["cash", "bank", "ewallet", "investment"];

  if (!name || typeof name !== "string" || name.trim().length === 0)
    errors.push("Nama dompet wajib diisi");
  if (!type || !validTypes.includes(type))
    errors.push(`Tipe harus salah satu dari: ${validTypes.join(", ")}`);
  if (balance !== undefined && (typeof balance !== "number" || balance < 0))
    errors.push("Saldo tidak boleh negatif");

  return errors.length ? fail(res, errors) : next();
};

export const validateUpdateWallet = (req, res, next) => {
  const { name, balance } = req.body;
  const errors = [];

  if (name !== undefined && (typeof name !== "string" || name.trim().length === 0))
    errors.push("Nama dompet tidak boleh kosong");
  if (balance !== undefined && (typeof balance !== "number" || balance < 0))
    errors.push("Saldo tidak boleh negatif");

  return errors.length ? fail(res, errors) : next();
};

// ==================== CATEGORY ====================

export const validateCreateCategory = (req, res, next) => {
  const { name, type } = req.body;
  const errors = [];
  const validTypes = ["income", "expense"];

  if (!name || typeof name !== "string" || name.trim().length === 0)
    errors.push("Nama kategori wajib diisi");
  if (!type || !validTypes.includes(type))
    errors.push("Tipe harus 'income' atau 'expense'");

  return errors.length ? fail(res, errors) : next();
};

// ==================== TRANSACTION ====================

export const validateCreateTransaction = (req, res, next) => {
  const { accountId, categoryId, amount, type, description, toAccountId } = req.body;
  const errors = [];
  const validTypes = ["income", "expense", "transfer"];

  if (!accountId || !isValidUUID(accountId))
    errors.push("Account ID tidak valid");
  if (!amount || typeof amount !== "number" || amount <= 0)
    errors.push("Nominal harus lebih dari 0");
  if (!type || !validTypes.includes(type))
    errors.push("Tipe harus 'income', 'expense', atau 'transfer'");

  if (type === "transfer") {
    if (!toAccountId || !isValidUUID(toAccountId))
      errors.push("Akun tujuan transfer tidak valid");
    if (accountId && toAccountId && accountId === toAccountId)
      errors.push("Akun asal dan tujuan tidak boleh sama");
  } else {
    if (!categoryId || !isValidUUID(categoryId))
      errors.push("Category ID tidak valid");
    if (!description || typeof description !== "string" || description.trim().length === 0)
      errors.push("Keterangan wajib diisi");
  }

  return errors.length ? fail(res, errors) : next();
};

export const validateUpdateTransaction = (req, res, next) => {
  const { accountId, categoryId, amount, type, description } = req.body;
  const errors = [];
  const validTypes = ["income", "expense"];

  if (!accountId || !isValidUUID(accountId))
    errors.push("Account ID tidak valid");
  if (!categoryId || !isValidUUID(categoryId))
    errors.push("Category ID tidak valid");
  if (!amount || typeof amount !== "number" || amount <= 0)
    errors.push("Nominal harus lebih dari 0");
  if (!type || !validTypes.includes(type))
    errors.push("Tipe harus 'income' atau 'expense'");
  if (!description || typeof description !== "string" || description.trim().length === 0)
    errors.push("Keterangan wajib diisi");

  return errors.length ? fail(res, errors) : next();
};

// ==================== BUDGET ====================

export const validateCreateBudget = (req, res, next) => {
  const { categoryId, amount, month } = req.body;
  const errors = [];

  if (!categoryId || !isValidUUID(categoryId))
    errors.push("Category ID tidak valid");
  if (!amount || typeof amount !== "number" || amount <= 0)
    errors.push("Jumlah budget harus lebih dari 0");
  if (!month || !isValidMonth(month))
    errors.push("Format bulan harus YYYY-MM (contoh: 2026-03)");

  return errors.length ? fail(res, errors) : next();
};

// ==================== SAVING GOAL ====================

export const validateCreateSavingGoal = (req, res, next) => {
  const { name, targetAmount, deadline } = req.body;
  const errors = [];

  if (!name || typeof name !== "string" || name.trim().length === 0)
    errors.push("Nama tujuan tabungan wajib diisi");
  if (!targetAmount || typeof targetAmount !== "number" || targetAmount <= 0)
    errors.push("Target tabungan harus lebih dari 0");
  if (!deadline || !isValidDate(deadline))
    errors.push("Tanggal deadline tidak valid");

  return errors.length ? fail(res, errors) : next();
};

export const validateAddSavingAmount = (req, res, next) => {
  const { amount } = req.body;
  const errors = [];

  if (!amount || typeof amount !== "number" || amount <= 0)
    errors.push("Jumlah tabungan harus lebih dari 0");

  return errors.length ? fail(res, errors) : next();
};

// ==================== DEBT ====================

export const validateCreateDebt = (req, res, next) => {
  const { personName, amount, dueDate } = req.body;
  const errors = [];

  if (!personName || typeof personName !== "string" || personName.trim().length === 0)
    errors.push("Nama orang wajib diisi");
  if (!amount || typeof amount !== "number" || amount <= 0)
    errors.push("Jumlah hutang harus lebih dari 0");
  if (!dueDate || !isValidDate(dueDate))
    errors.push("Tanggal jatuh tempo tidak valid");

  return errors.length ? fail(res, errors) : next();
};

export const validateUpdateDebtStatus = (req, res, next) => {
  const { status } = req.body;
  const errors = [];
  const validStatuses = ["pending", "paid"];

  if (!status || !validStatuses.includes(status))
    errors.push("Status harus 'pending' atau 'paid'");

  return errors.length ? fail(res, errors) : next();
};

// ==================== SUBSCRIPTION ====================

export const validateCreateSubscription = (req, res, next) => {
  const { name, cost, billingCycle, nextPayment } = req.body;
  const errors = [];
  const validCycles = ["monthly", "yearly"];

  if (!name || typeof name !== "string" || name.trim().length === 0)
    errors.push("Nama langganan wajib diisi");
  if (!cost || typeof cost !== "number" || cost <= 0)
    errors.push("Biaya langganan harus lebih dari 0");
  if (!billingCycle || !validCycles.includes(billingCycle))
    errors.push("Siklus tagihan harus 'monthly' atau 'yearly'");
  if (!nextPayment || !isValidDate(nextPayment))
    errors.push("Tanggal pembayaran berikutnya tidak valid");

  return errors.length ? fail(res, errors) : next();
};

// ==================== PROFILE ====================

export const validateUpdateProfile = (req, res, next) => {
  const { name, email } = req.body;
  const errors = [];

  if (!name || typeof name !== "string" || name.trim().length < 2)
    errors.push("Nama minimal 2 karakter");
  if (!email || !isValidEmail(email)) errors.push("Format email tidak valid");

  return errors.length ? fail(res, errors) : next();
};

export const validateChangePassword = (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const errors = [];

  if (!currentPassword || currentPassword.length === 0)
    errors.push("Password lama wajib diisi");
  if (!newPassword || newPassword.length < 6)
    errors.push("Password baru minimal 6 karakter");

  return errors.length ? fail(res, errors) : next();
};
