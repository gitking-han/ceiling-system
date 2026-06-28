import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongoose';

import { User } from '../../src/models/User';
import { RawMaterial } from '../../src/models/RawMaterial';
import { InventoryTransaction } from '../../src/models/InventoryTransaction';
import { Formula } from '../../src/models/Formula';
import { FormulaHistory } from '../../src/models/FormulaHistory';
import { WetProduction } from '../../src/models/WetProduction';
import { DryProduction } from '../../src/models/DryProduction';
import { FinalProduction } from '../../src/models/FinalProduction';
import { WasteRecord } from '../../src/models/WasteRecord';
import { Expense } from '../../src/models/Expense';
import { Customer } from '../../src/models/Customer';
import { CustomerLedgerEntry } from '../../src/models/CustomerLedgerEntry';
import { Sale } from '../../src/models/Sale';
import { Payment } from '../../src/models/Payment';

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

const MODEL_MAP: Record<string, any> = {
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { key, data } = req.body;
  if (!key) {
    return res.status(400).json({ error: 'Missing storage key' });
  }

  const Model = MODEL_MAP[key];
  if (!Model) {
    return res.status(400).json({ error: 'Invalid storage key mapped to no MongoDB model' });
  }

  try {
    await connectToDatabase();

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
}
