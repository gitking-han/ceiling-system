import { Router } from "express";
import { Sale as SaleRaw } from "../../models/Sale";

const router = Router();
const Sale = SaleRaw as any;

// GET all sales
router.get("/", async (req, res) => {
  try {
    const sales = await Sale.find({});
    res.json(sales);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST sync sales
router.post("/sync", async (req, res) => {
  try {
    const data = req.body;
    await Sale.deleteMany({});
    if (Array.isArray(data) && data.length > 0) {
      await Sale.insertMany(data);
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
