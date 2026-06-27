import { Router } from "express";
import { FinalProduction as FinalProductionRaw } from "../../models/FinalProduction";

const router = Router();
const FinalProduction = FinalProductionRaw as any;

// GET all final production records
router.get("/", async (req, res) => {
  try {
    const records = await FinalProduction.find({});
    res.json(records);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST sync final production records
router.post("/sync", async (req, res) => {
  try {
    const data = req.body;
    await FinalProduction.deleteMany({});
    if (Array.isArray(data) && data.length > 0) {
      await FinalProduction.insertMany(data);
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
