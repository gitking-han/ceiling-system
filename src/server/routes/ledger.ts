import { Router } from "express";
import { CustomerLedgerEntry as CustomerLedgerEntryRaw } from "../../models/CustomerLedgerEntry";

const router = Router();
const CustomerLedgerEntry = CustomerLedgerEntryRaw as any;

function sanitizeRawPayload(rawPayload: any) {
  if (Array.isArray(rawPayload)) {
    return rawPayload.map((item) => sanitizeRawPayload(item));
  }
  if (rawPayload && typeof rawPayload === 'object') {
    const { _id, __v, ...rest } = rawPayload;
    return rest;
  }
  return rawPayload;
}

// GET all ledger entries
router.get("/", async (req, res) => {
  try {
    const entries = await CustomerLedgerEntry.find({});
    res.json(entries);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST sync ledger entries
router.post("/sync", async (req, res) => {
  try {
    const data = sanitizeRawPayload(req.body);
    await CustomerLedgerEntry.deleteMany({});
    if (Array.isArray(data) && data.length > 0) {
      await CustomerLedgerEntry.insertMany(data);
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
