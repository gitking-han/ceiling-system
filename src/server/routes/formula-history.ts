import { Router } from "express";
import { FormulaHistory as FormulaHistoryRaw } from "../../models/FormulaHistory";

const router = Router();
const FormulaHistory = FormulaHistoryRaw as any;

// GET all formula histories
router.get("/", async (req, res) => {
  try {
    const history = await FormulaHistory.find({});
    res.json(history);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST sync formula histories
router.post("/sync", async (req, res) => {
  try {
    const data = req.body;
    await FormulaHistory.deleteMany({});
    if (Array.isArray(data) && data.length > 0) {
      await FormulaHistory.insertMany(data);
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
