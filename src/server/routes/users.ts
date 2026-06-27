import { Router } from "express";
import { User as UserRaw } from "../../models/User";

const router = Router();
const User = UserRaw as any;

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST sync users
router.post("/sync", async (req, res) => {
  try {
    const data = req.body;
    await User.deleteMany({});
    if (Array.isArray(data) && data.length > 0) {
      await User.insertMany(data);
    } else if (data && typeof data === 'object' && !Array.isArray(data)) {
      await User.create(data);
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
