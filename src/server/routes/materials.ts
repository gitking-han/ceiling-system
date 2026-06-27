import { Router } from "express";
import { RawMaterial as RawMaterialRaw } from "../../models/RawMaterial";

const router = Router();
const RawMaterial = RawMaterialRaw as any;

// GET all raw materials
router.get("/", async (req, res) => {
  try {
    const materials = await RawMaterial.find({});
    res.json(materials);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST sync raw materials
router.post("/sync", async (req, res) => {
  try {
    const data = req.body;
    await RawMaterial.deleteMany({});
    if (Array.isArray(data) && data.length > 0) {
      await RawMaterial.insertMany(data);
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
