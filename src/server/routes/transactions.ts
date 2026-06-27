import { Router } from "express";
import { InventoryTransaction as InventoryTransactionRaw } from "../../models/InventoryTransaction";

const router = Router();
const InventoryTransaction = InventoryTransactionRaw as any;

// GET all transactions
router.get("/", async (req, res) => {
  try {
    const transactions = await InventoryTransaction.find({});
    res.json(transactions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST sync transactions
router.post("/sync", async (req, res) => {
  try {
    const data = req.body;
    await InventoryTransaction.deleteMany({});
    if (Array.isArray(data) && data.length > 0) {
      await InventoryTransaction.insertMany(data);
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
