import * as DebtService from "../service/debt.service.js";

export const createDebt = async (req, res) => {
  try {
    const { personName, amount, dueDate, status } = req.body;
    const debt = await DebtService.createDebt({
      userId: req.userId,
      personName,
      amount,
      dueDate,
      status,
    });
    res.status(201).json({ message: "Debt recorded", debt });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getDebts = async (req, res) => {
  try {
    const debts = await DebtService.getUserDebts(req.userId);
    res.status(200).json(debts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "pending" atau "paid"

    const debt = await DebtService.updateDebtStatus({
      debtId: id,
      userId: req.userId,
      status,
    });
    res.status(200).json({ message: "Debt status updated", debt });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
