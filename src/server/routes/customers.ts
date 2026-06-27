import { Router } from "express";
import { Customer as CustomerRaw } from "../../models/Customer";

const router = Router();
const Customer = CustomerRaw as any;

// GET all customers
router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find({});
    res.json(customers);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST sync customers
router.post("/sync", async (req, res) => {
  try {
    const data = req.body;
    await Customer.deleteMany({});
    if (Array.isArray(data) && data.length > 0) {
      await Customer.insertMany(data);
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
