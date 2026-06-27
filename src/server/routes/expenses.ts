import { Router } from "express";
import { Expense as ExpenseRaw } from "../../models/Expense";

const router = Router();
const Expense = ExpenseRaw as any;

// GET all expenses
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find({});
    res.json(expenses);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST sync expenses
router.post("/sync", async (req, res) => {
  try {
    const data = req.body;
    await Expense.deleteMany({});
    if (Array.isArray(data) && data.length > 0) {
      await Expense.insertMany(data);
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
