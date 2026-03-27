import * as TransactionService from "../service/transaction.service.js";

export const createTransaction = async (req, res) => {
  try {
    const { accountId, categoryId, amount, type, description, toAccountId } = req.body;
    const userId = req.userId;

    const transaction = await TransactionService.createTransaction({
      userId,
      accountId,
      categoryId,
      amount,
      type,
      description,
      toAccountId,
    });

    res.status(201).json({ message: "Transaction successful", transaction });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const result = await TransactionService.getUserTransactions(
      req.userId,
      req.query,
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const { accountId, categoryId, amount, type, description } = req.body;
    const userId = req.userId;
    const transactionId = req.params.id;

    const transaction = await TransactionService.updateTransaction({
      transactionId,
      userId,
      accountId,
      categoryId,
      amount,
      type,
      description,
    });

    res.status(200).json({ message: "Transaction updated", transaction });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const userId = req.userId;
    const transactionId = req.params.id;

    await TransactionService.deleteTransaction({ transactionId, userId });

    res.status(200).json({ message: "Transaction deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
