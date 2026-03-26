import * as TransactionService from "../service/transaction.service.js";

export const createTransaction = async (req, res) => {
  try {
    const { accountId, categoryId, amount, type, description } = req.body;
    const userId = req.userId; // Dari token JWT

    const transaction = await TransactionService.createTransaction({
      userId,
      accountId,
      categoryId,
      amount,
      type,
      description,
    });

    res.status(201).json({ message: "Transaction successful", transaction });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const transactions = await TransactionService.getUserTransactions(
      req.userId,
    );
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
