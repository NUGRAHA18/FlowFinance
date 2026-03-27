import * as SavingGoalService from "../service/savingGoal.service.js";

export const createGoal = async (req, res) => {
  try {
    const { name, targetAmount, deadline } = req.body;
    const goal = await SavingGoalService.createSavingGoal({
      userId: req.userId,
      name,
      targetAmount,
      deadline,
    });
    res.status(201).json({ message: "Saving goal created", goal });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getGoals = async (req, res) => {
  try {
    const goals = await SavingGoalService.getSavingGoals(req.userId);
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addAmount = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, accountId } = req.body;

    const goal = await SavingGoalService.addSavingAmount({
      goalId: id,
      userId: req.userId,
      amount,
      accountId,
    });
    res.status(200).json({ message: "Berhasil menabung", goal });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const withdrawAmount = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, accountId } = req.body;

    const goal = await SavingGoalService.withdrawSavingAmount({
      goalId: id,
      userId: req.userId,
      amount,
      accountId,
    });
    res.status(200).json({ message: "Berhasil menarik tabungan", goal });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
