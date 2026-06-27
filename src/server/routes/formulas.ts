import { Router } from "express";
import { Formula as FormulaRaw } from "../../models/Formula";

const router = Router();
const Formula = FormulaRaw as any;

// GET all formulas
router.get("/", async (req, res) => {
  try {
    const formulas = await Formula.find({});
    res.json(formulas);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST sync formulas
router.post("/sync", async (req, res) => {
  try {
    const data = req.body;
    await Formula.deleteMany({});
    if (Array.isArray(data) && data.length > 0) {
      await Formula.insertMany(data);
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
