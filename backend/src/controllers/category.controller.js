import * as CategoryService from "../service/category.service.js";

export const createCategory = async (req, res) => {
  try {
    const { name, type } = req.body;
    const userId = req.userId; // Dari JWT

    const category = await CategoryService.createCategory({
      name,
      type,
      userId,
    });
    res.status(201).json({ message: "Category created", category });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await CategoryService.getUserCategories(req.userId);
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await CategoryService.deleteCategory({
      categoryId: req.params.id,
      userId: req.userId,
    });
    res.status(200).json({ message: "Category deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
