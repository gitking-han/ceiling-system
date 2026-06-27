import { Router } from "express";
import { Payment as PaymentRaw } from "../../models/Payment";

const router = Router();
const Payment = PaymentRaw as any;

// GET all payments
router.get("/", async (req, res) => {
  try {
    const payments = await Payment.find({});
    res.json(payments);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST sync payments
router.post("/sync", async (req, res) => {
  try {
    const data = req.body;
    await Payment.deleteMany({});
    if (Array.isArray(data) && data.length > 0) {
      await Payment.insertMany(data);
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
