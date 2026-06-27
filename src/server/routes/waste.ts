import { Router } from "express";
import { WasteRecord as WasteRecordRaw } from "../../models/WasteRecord";

const router = Router();
const WasteRecord = WasteRecordRaw as any;

// GET all waste records
router.get("/", async (req, res) => {
  try {
    const records = await WasteRecord.find({});
    res.json(records);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST sync waste records
router.post("/sync", async (req, res) => {
  try {
    const data = req.body;
    await WasteRecord.deleteMany({});
    if (Array.isArray(data) && data.length > 0) {
      await WasteRecord.insertMany(data);
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
