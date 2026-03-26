import * as BudgetService from "../service/budget.service.js";

export const createBudget = async (req, res) => {
  try {
    const { categoryId, amount, month } = req.body;
    const userId = req.userId; // Dari Token JWT

    const budget = await BudgetService.createBudget({
      userId,
      categoryId,
      amount,
      month,
    });
    res.status(201).json({ message: "Budget created", budget });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getBudgets = async (req, res) => {
  try {
    const budgets = await BudgetService.getUserBudgets(req.userId);
    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
