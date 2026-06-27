import { Router } from "express";
import { WetProduction as WetProductionRaw } from "../../models/WetProduction";

const router = Router();
const WetProduction = WetProductionRaw as any;

// GET all wet production records
router.get("/", async (req, res) => {
  try {
    const records = await WetProduction.find({});
    res.json(records);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST sync wet production records
router.post("/sync", async (req, res) => {
  try {
    const data = req.body;
    await WetProduction.deleteMany({});
    if (Array.isArray(data) && data.length > 0) {
      await WetProduction.insertMany(data);
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
