import express from "express";
import path from "path";
import mongoose from "mongoose";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Import separate route files
import authRoutes from "./src/server/routes/auth";
import userRoutes from "./src/server/routes/users";
import materialRoutes from "./src/server/routes/materials";
import transactionRoutes from "./src/server/routes/transactions";
import formulaRoutes from "./src/server/routes/formulas";
import formulaHistoryRoutes from "./src/server/routes/formula-history";
import wetProductionRoutes from "./src/server/routes/wet-production";
import dryProductionRoutes from "./src/server/routes/dry-production";
import finalProductionRoutes from "./src/server/routes/final-production";
import wasteRoutes from "./src/server/routes/waste";
import expenseRoutes from "./src/server/routes/expenses";
import customerRoutes from "./src/server/routes/customers";
import ledgerRoutes from "./src/server/routes/ledger";
import saleRoutes from "./src/server/routes/sales";
import paymentRoutes from "./src/server/routes/payments";

// Import MongoDB Models for Bootstrap seeding and delegation
import { User as UserRaw } from "./src/models/User";
import { RawMaterial as RawMaterialRaw } from "./src/models/RawMaterial";
import { InventoryTransaction as InventoryTransactionRaw } from "./src/models/InventoryTransaction";
import { Formula as FormulaRaw } from "./src/models/Formula";
import { FormulaHistory as FormulaHistoryRaw } from "./src/models/FormulaHistory";
import { WetProduction as WetProductionRaw } from "./src/models/WetProduction";
import { DryProduction as DryProductionRaw } from "./src/models/DryProduction";
import { FinalProduction as FinalProductionRaw } from "./src/models/FinalProduction";
import { WasteRecord as WasteRecordRaw } from "./src/models/WasteRecord";
import { Expense as ExpenseRaw } from "./src/models/Expense";
import { Customer as CustomerRaw } from "./src/models/Customer";
import { CustomerLedgerEntry as CustomerLedgerEntryRaw } from "./src/models/CustomerLedgerEntry";
import { Sale as SaleRaw } from "./src/models/Sale";
import { Payment as PaymentRaw } from "./src/models/Payment";

const User = UserRaw as any;
const RawMaterial = RawMaterialRaw as any;
const InventoryTransaction = InventoryTransactionRaw as any;
const Formula = FormulaRaw as any;
const FormulaHistory = FormulaHistoryRaw as any;
const WetProduction = WetProductionRaw as any;
const DryProduction = DryProductionRaw as any;
const FinalProduction = FinalProductionRaw as any;
const WasteRecord = WasteRecordRaw as any;
const Expense = ExpenseRaw as any;
const Customer = CustomerRaw as any;
const CustomerLedgerEntry = CustomerLedgerEntryRaw as any;
const Sale = SaleRaw as any;
const Payment = PaymentRaw as any;

const app = express();
app.use(express.json({ limit: "50mb" }));
const PORT = 3000;

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/platepro";

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("Successfully connected to MongoDB.");
  })
  .catch((err) => {
    console.error("MongoDB connection warning:", err.message);
  });

// Mount separate, clean routes for each entity/mongodb model
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/formulas", formulaRoutes);
app.use("/api/formula-history", formulaHistoryRoutes);
app.use("/api/wet-production", wetProductionRoutes);
app.use("/api/dry-production", dryProductionRoutes);
app.use("/api/final-production", finalProductionRoutes);
app.use("/api/waste", wasteRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/ledger", ledgerRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/payments", paymentRoutes);

// LocalStorage key map matching storage.ts keys
const KEYS = {
  USER: 'factory_erp_user',
  MATERIALS: 'factory_erp_materials',
  TRANSACTIONS: 'factory_erp_transactions',
  FORMULAS: 'factory_erp_formulas',
  FORMULA_HISTORY: 'factory_erp_formula_history',
  WET_PROD: 'factory_erp_wet_production',
  DRY_PROD: 'factory_erp_dry_production',
  FINAL_PROD: 'factory_erp_final_production',
  WASTE: 'factory_erp_waste',
  EXPENSES: 'factory_erp_expenses',
  CUSTOMERS: 'factory_erp_customers',
  LEDGER: 'factory_erp_ledger',
  SALES: 'factory_erp_sales',
  PAYMENTS: 'factory_erp_payments',
};

// 1. GET /api/bootstrap - Retrieves all database collections from MongoDB (no auto-seeding)
app.get("/api/bootstrap", async (req, res) => {
  try {
    const users = await User.find({});
    const rawmaterials = await RawMaterial.find({});
    const inventorytransactions = await InventoryTransaction.find({});
    const formulas = await Formula.find({});
    const formulahistories = await FormulaHistory.find({});
    const wetproductions = await WetProduction.find({});
    const dryproductions = await DryProduction.find({});
    const finalproductions = await FinalProduction.find({});
    const wasterecords = await WasteRecord.find({});
    const expenses = await Expense.find({});
    const customers = await Customer.find({});
    const customerledgerentries = await CustomerLedgerEntry.find({});
    const sales = await Sale.find({});
    const payments = await Payment.find({});

    // Return all existing collections as-is. NO auto-seeding of demo data.
    res.json({
      [KEYS.USER]: users[0] || null,
      [KEYS.MATERIALS]: rawmaterials,
      [KEYS.TRANSACTIONS]: inventorytransactions,
      [KEYS.FORMULAS]: formulas,
      [KEYS.FORMULA_HISTORY]: formulahistories,
      [KEYS.WET_PROD]: wetproductions,
      [KEYS.DRY_PROD]: dryproductions,
      [KEYS.FINAL_PROD]: finalproductions,
      [KEYS.WASTE]: wasterecords,
      [KEYS.EXPENSES]: expenses,
      [KEYS.CUSTOMERS]: customers,
      [KEYS.LEDGER]: customerledgerentries,
      [KEYS.SALES]: sales,
      [KEYS.PAYMENTS]: payments,
    });
  } catch (error: any) {
    console.error("Bootstrap API error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Helper model maps to map KEYS to Mongoose model collections
const MODEL_MAP: Record<string, mongoose.Model<any>> = {
  [KEYS.USER]: User,
  [KEYS.MATERIALS]: RawMaterial,
  [KEYS.TRANSACTIONS]: InventoryTransaction,
  [KEYS.FORMULAS]: Formula,
  [KEYS.FORMULA_HISTORY]: FormulaHistory,
  [KEYS.WET_PROD]: WetProduction,
  [KEYS.DRY_PROD]: DryProduction,
  [KEYS.FINAL_PROD]: FinalProduction,
  [KEYS.WASTE]: WasteRecord,
  [KEYS.EXPENSES]: Expense,
  [KEYS.CUSTOMERS]: Customer,
  [KEYS.LEDGER]: CustomerLedgerEntry,
  [KEYS.SALES]: Sale,
  [KEYS.PAYMENTS]: Payment,
};

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

// 2. POST /api/save - Generic background sync handler
app.post("/api/save", async (req, res) => {
  const { key, data } = req.body;
  if (!key) {
    return res.status(400).json({ error: "Missing storage key" });
  }

  const Model = MODEL_MAP[key];
  if (!Model) {
    return res.status(400).json({ error: "Invalid storage key mapped to no MongoDB model" });
  }

  try {
    const sanitizedData = sanitizeRawPayload(data);

    if (key === KEYS.USER) {
      await User.deleteMany({});
      if (sanitizedData && Object.keys(sanitizedData).length > 0) {
        await User.create(sanitizedData);
      }
      return res.json({ success: true });
    }

    const arrayData = Array.isArray(sanitizedData)
      ? sanitizedData
      : sanitizedData
      ? [sanitizedData]
      : [];

    await Model.deleteMany({});
    if (arrayData.length > 0) {
      await Model.insertMany(arrayData);
    }

    res.json({ success: true, count: arrayData.length });
  } catch (err: any) {
    console.error(`Save API error for key ${key}:`, err);
    res.status(500).json({ error: err.message });
  }
});

// Vite middleware configuration for development mode
if (process.env.NODE_ENV !== "production") {
  createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  }).then((vite) => {
    app.use(vite.middlewares);

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Development server running at http://localhost:${PORT}`);
    });
  });
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Production server running on port ${PORT}`);
  });
}
