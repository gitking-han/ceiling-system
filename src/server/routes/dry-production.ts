import { Router } from "express";
import { DryProduction as DryProductionRaw } from "../../models/DryProduction";

const router = Router();
const DryProduction = DryProductionRaw as any;

// GET all dry production records
router.get("/", async (req, res) => {
  try {
    const records = await DryProduction.find({});
    res.json(records);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST sync dry production records
router.post("/sync", async (req, res) => {
  try {
    const data = req.body;
    await DryProduction.deleteMany({});
    if (Array.isArray(data) && data.length > 0) {
      await DryProduction.insertMany(data);
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
