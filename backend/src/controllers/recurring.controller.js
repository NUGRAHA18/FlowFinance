import * as recurringService from "../service/recurring.service.js";

export const createRecurring = async (req, res) => {
  try {
    const { accountId, categoryId, amount, type, description, frequency, nextRun } = req.body;
    const recurring = await recurringService.createRecurring({
      userId: req.userId,
      accountId,
      categoryId,
      amount,
      type,
      description,
      frequency,
      nextRun,
    });
    res.status(201).json(recurring);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecurrings = async (req, res) => {
  try {
    const recurrings = await recurringService.getUserRecurrings(req.userId);
    res.json(recurrings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRecurring = async (req, res) => {
  try {
    const recurring = await recurringService.updateRecurring({
      recurringId: req.params.id,
      userId: req.userId,
      isActive: req.body.isActive,
    });
    res.json(recurring);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteRecurring = async (req, res) => {
  try {
    const result = await recurringService.deleteRecurring({
      recurringId: req.params.id,
      userId: req.userId,
    });
    res.json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const processRecurrings = async (req, res) => {
  try {
    const count = await recurringService.processRecurrings();
    res.json({ message: `Processed ${count} recurring transactions`, count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
