import {
  User,
  RawMaterial,
  InventoryTransaction,
  Formula,
  FormulaHistory,
  WetProduction,
  DryProduction,
  FinalProduction,
  WasteRecord,
  Expense,
  Customer,
  CustomerLedgerEntry,
  Sale,
  Payment,
} from '../types';

// Helper to get today's date in YYYY-MM-DD format
export function getTodayStr(offsetDays = 0): string {
  const d = new Date();
  if (offsetDays !== 0) {
    d.setDate(d.getDate() + offsetDays);
  }
  return d.toISOString().split('T')[0];
}

// LocalStorage Keys - Exported for use throughout the app
export const KEYS = {
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

function getStorage(): Storage | null {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }
  return window.localStorage;
}

const LOGIN_SESSION_TTL_MS = 24 * 60 * 60 * 1000;

// User Actions
export function getCurrentUser(): User | null {
  const storage = getStorage();
  if (!storage) return null;

  const storedValue = storage.getItem(KEYS.USER);
  if (!storedValue) return null;

  try {
    const parsed = JSON.parse(storedValue);
    if (!parsed || typeof parsed !== 'object') {
      storage.removeItem(KEYS.USER);
      return null;
    }

    if (parsed.user && typeof parsed.expiresAt === 'number') {
      if (Date.now() > parsed.expiresAt) {
        storage.removeItem(KEYS.USER);
        return null;
      }
      return parsed.user as User;
    }

    storage.removeItem(KEYS.USER);
    return null;
  } catch (error) {
    storage.removeItem(KEYS.USER);
    return null;
  }
}

export function setCurrentUser(user: User | null): void {
  const storage = getStorage();
  if (!storage) return;

  if (user) {
    storage.setItem(KEYS.USER, JSON.stringify({
      user,
      expiresAt: Date.now() + LOGIN_SESSION_TTL_MS,
    }));
  } else {
    storage.removeItem(KEYS.USER);
  }
}

// CRUD generic getter & setters
export function getData<T>(key: string, defaultValue: T[] = []): T[] {
  const storage = getStorage();
  if (!storage) return defaultValue;

  const data = storage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
}

export function saveData<T>(key: string, data: T[]): void {
  const storage = getStorage();
  if (!storage) return;

  storage.setItem(key, JSON.stringify(data));

  fetch('/api/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, data }),
  }).catch((err) => {
    console.error(`Failed to push background sync for key ${key}:`, err);
  });
}

export function normalizeMaterial(material: RawMaterial): RawMaterial {
  const name = material?.name?.toLowerCase() || '';
  const unit = material?.unit?.toLowerCase() || '';

  let targetUnit = unit;
  let conversionFactor = material.conversionFactor && material.conversionFactor > 0 ? material.conversionFactor : 1;
  let quantity = material.quantity || 0;

  if (name.includes('plaster')) {
    targetUnit = 'bags';
    conversionFactor = material.conversionFactor && material.conversionFactor > 0 ? material.conversionFactor : 25;
    if (unit === 'kg') {
      quantity = quantity / conversionFactor;
    } else if (unit === 'g') {
      quantity = quantity / 1000 / conversionFactor;
    } else if (unit === 'pieces') {
      quantity = quantity / conversionFactor;
    }
  } else if (name.includes('tape')) {
    targetUnit = 'rolls';
    conversionFactor = 272;
    if (unit === 'feet') {
      quantity = quantity / 272;
    }
  } else if (name.includes('brown paper')) {
    targetUnit = 'rims';
    conversionFactor = 500;
    if (unit === 'pieces') {
      quantity = quantity / 500;
    }
  } else if (name.includes('panni')) {
    targetUnit = 'kg';
    conversionFactor = 50;
    if (unit === 'pieces') {
      quantity = quantity / 50;
    }
  } else if (name.includes('packing shopper')) {
    targetUnit = 'kg';
    conversionFactor = 40;
    if (unit === 'pieces') {
      quantity = quantity / 40;
    }
  }

  return {
    ...material,
    quantity: Math.round(quantity * 1000) / 1000,
    unit: targetUnit,
    conversionFactor,
    updatedAt: material.updatedAt || getTodayStr(),
  };
}

export function normalizeMaterials(materials: RawMaterial[]): RawMaterial[] {
  return materials.map(normalizeMaterial);
}

// Unified getters and setters for components
export const db = {
  getMaterials: () => {
    const materials = getData<RawMaterial>(KEYS.MATERIALS);
    const normalized = normalizeMaterials(materials);
    if (JSON.stringify(normalized) !== JSON.stringify(materials)) {
      saveData<RawMaterial>(KEYS.MATERIALS, normalized);
    }
    return normalized;
  },
  saveMaterials: (data: RawMaterial[]) => {
    const normalized = normalizeMaterials(data);
    saveData<RawMaterial>(KEYS.MATERIALS, normalized);
    return normalized;
  },

  getTransactions: () => getData<InventoryTransaction>(KEYS.TRANSACTIONS),
  saveTransactions: (data: InventoryTransaction[]) => saveData<InventoryTransaction>(KEYS.TRANSACTIONS, data),

  getFormulas: () => getData<Formula>(KEYS.FORMULAS),
  saveFormulas: (data: Formula[]) => saveData<Formula>(KEYS.FORMULAS, data),

  getFormulaHistory: () => getData<FormulaHistory>(KEYS.FORMULA_HISTORY),
  saveFormulaHistory: (data: FormulaHistory[]) => saveData<FormulaHistory>(KEYS.FORMULA_HISTORY, data),

  getWetProduction: () => getData<WetProduction>(KEYS.WET_PROD),
  saveWetProduction: (data: WetProduction[]) => saveData<WetProduction>(KEYS.WET_PROD, data),

  getDryProduction: () => getData<DryProduction>(KEYS.DRY_PROD),
  saveDryProduction: (data: DryProduction[]) => saveData<DryProduction>(KEYS.DRY_PROD, data),

  getFinalProduction: () => getData<FinalProduction>(KEYS.FINAL_PROD),
  saveFinalProduction: (data: FinalProduction[]) => saveData<FinalProduction>(KEYS.FINAL_PROD, data),

  getWasteRecords: () => getData<WasteRecord>(KEYS.WASTE),
  saveWasteRecords: (data: WasteRecord[]) => saveData<WasteRecord>(KEYS.WASTE, data),

  getExpenses: () => getData<Expense>(KEYS.EXPENSES),
  saveExpenses: (data: Expense[]) => saveData<Expense>(KEYS.EXPENSES, data),

  getCustomers: () => getData<Customer>(KEYS.CUSTOMERS),
  saveCustomers: (data: Customer[]) => saveData<Customer>(KEYS.CUSTOMERS, data),

  getLedger: () => getData<CustomerLedgerEntry>(KEYS.LEDGER),
  saveLedger: (data: CustomerLedgerEntry[]) => saveData<CustomerLedgerEntry>(KEYS.LEDGER, data),

  getSales: () => getData<Sale>(KEYS.SALES),
  saveSales: (data: Sale[]) => saveData<Sale>(KEYS.SALES, data),

  getPayments: () => getData<Payment>(KEYS.PAYMENTS),
  savePayments: (data: Payment[]) => saveData<Payment>(KEYS.PAYMENTS, data),
};

// HELPER BUSINESS LOGICS

export function getConversionLabel(unit: string): string {
  const normalized = unit?.toLowerCase() || '';
  if (normalized === 'rolls') return 'Feet per roll';
  if (normalized === 'rims') return 'Pieces per rim';
  if (normalized === 'bags') return 'Kg per bag';
  if (normalized === 'kg') return 'Pieces per kg';
  if (normalized === 'grams') return 'Pieces per gram';
  return 'Units per stock item';
}

export function getMaterialConversionFactor(material: RawMaterial | null | undefined): number {
  if (!material) return 1;
  if (typeof material.conversionFactor === 'number' && material.conversionFactor > 0) {
    return material.conversionFactor;
  }

  const name = material.name?.toLowerCase() || '';
  const unit = material.unit?.toLowerCase() || '';

  if (name.includes('plaster')) return 25;
  if (name.includes('tape')) return 272;
  if (name.includes('brown paper')) return 500;
  if (name.includes('panni')) return 50;
  if (name.includes('packing shopper')) return 40;
  if (unit === 'rolls') return 272;
  if (unit === 'rims') return 500;
  if (unit === 'kg') return 50;

  return 1;
}

export function convertFormulaAmountToStock(amount: number, formulaUnit: string, material: RawMaterial | null | undefined) {
  const normalizedFormulaUnit = formulaUnit?.toLowerCase() || '';
  const normalizedMaterialUnit = material?.unit?.toLowerCase() || '';
  const conversionFactor = getMaterialConversionFactor(material);

  if (normalizedFormulaUnit === 'g' && normalizedMaterialUnit === 'kg') {
    return { amount: amount / 1000, unit: 'kg' };
  }
  if (normalizedFormulaUnit === 'g' && normalizedMaterialUnit === 'bags' && conversionFactor > 0) {
    return { amount: amount / 1000 / conversionFactor, unit: 'bags' };
  }
  if (normalizedFormulaUnit === 'kg' && normalizedMaterialUnit === 'g') {
    return { amount: amount * 1000, unit: 'g' };
  }
  if (normalizedFormulaUnit === 'kg' && normalizedMaterialUnit === 'bags' && conversionFactor > 0) {
    return { amount: amount / conversionFactor, unit: 'bags' };
  }
  if (normalizedFormulaUnit === 'feet' && normalizedMaterialUnit === 'rolls' && conversionFactor > 0) {
    return { amount: amount / conversionFactor, unit: 'rolls' };
  }
  if (normalizedFormulaUnit === 'pieces' && conversionFactor > 0 && ['rims', 'kg', 'rolls', 'pieces'].includes(normalizedMaterialUnit)) {
    return { amount: amount / conversionFactor, unit: normalizedMaterialUnit || 'pieces' };
  }
  if (normalizedFormulaUnit === normalizedMaterialUnit) {
    return { amount, unit: normalizedMaterialUnit || normalizedFormulaUnit };
  }

  return { amount, unit: normalizedMaterialUnit || normalizedFormulaUnit };
}

// 1. Log Material Transaction & update materials main quantity
export function adjustMaterialStock(
  materialId: string,
  quantityDelta: number,
  type: 'in' | 'out',
  cost: number,
  date: string,
  notes: string
) {
  const materials = db.getMaterials();
  const index = materials.findIndex((m) => m.id === materialId);
  if (index !== -1) {
    const mat = materials[index];
    if (type === 'in') {
      mat.quantity += quantityDelta;
    } else {
      mat.quantity -= quantityDelta;
    }
    mat.updatedAt = date;
    db.saveMaterials(materials);

    const txs = db.getTransactions();
    const newTx: InventoryTransaction = {
      id: 'tx_' + Math.random().toString(36).substr(2, 9),
      materialId,
      materialName: mat.name,
      type,
      quantity: quantityDelta,
      cost,
      date,
      notes,
      unit: mat.unit,
    };
    txs.push(newTx);
    db.saveTransactions(txs);
  }
}

// 2. Add Customer Ledger entry
export function addLedgerEntry(
  customerId: string,
  date: string,
  type: CustomerLedgerEntry['type'],
  referenceId: string,
  debit: number,
  credit: number,
  description: string
) {
  const ledger = db.getLedger();
  const customerLedgers = ledger.filter((l) => l.customerId === customerId);

  let lastBalance = 0;
  if (customerLedgers.length > 0) {
    const sorted = [...customerLedgers].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    lastBalance = sorted[sorted.length - 1].balance;
  } else {
    const customers = db.getCustomers();
    const cust = customers.find((c) => c.id === customerId);
    if (cust) {
      lastBalance = cust.openingBalance;
    }
  }

  const newBalance = lastBalance + debit - credit;

  const newEntry: CustomerLedgerEntry = {
    id: 'led_' + Math.random().toString(36).substr(2, 9),
    customerId,
    date,
    type,
    referenceId,
    debit,
    credit,
    balance: newBalance,
    description,
  };

  ledger.push(newEntry);
  db.saveLedger(ledger);
  recalculateCustomerLedger(customerId);
}

// Recalculate customer ledger balance from scratch
export function recalculateCustomerLedger(customerId: string) {
  const ledger = db.getLedger();
  const otherCustomersEntries = ledger.filter((l) => l.customerId !== customerId);
  const thisCustomerEntries = ledger.filter((l) => l.customerId === customerId);

  thisCustomerEntries.sort((a, b) => {
    const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
    if (diff !== 0) return diff;
    if (a.type === 'Opening Balance') return -1;
    if (b.type === 'Opening Balance') return 1;
    return 0;
  });

  const customers = db.getCustomers();
  const cust = customers.find((c) => c.id === customerId);
  let runningBalance = cust ? cust.openingBalance : 0;

  const updatedEntries = thisCustomerEntries.map((entry) => {
    if (entry.type === 'Opening Balance') {
      runningBalance = entry.debit;
      return { ...entry, balance: runningBalance };
    }
    runningBalance = runningBalance + entry.debit - entry.credit;
    return { ...entry, balance: runningBalance };
  });

  db.saveLedger([...otherCustomersEntries, ...updatedEntries]);
}

// 3. Delete Customer Ledger entries
export function deleteLedgerByReference(referenceId: string, customerId: string) {
  const ledger = db.getLedger();
  const filtered = ledger.filter((l) => !(l.referenceId === referenceId && l.customerId === customerId));
  db.saveLedger(filtered);
  recalculateCustomerLedger(customerId);
}

// Get outstanding balance for customer
export function getCustomerOutstandingBalance(customerId: string): number {
  const ledger = db.getLedger().filter((l) => l.customerId === customerId);
  if (ledger.length === 0) {
    const customers = db.getCustomers();
    const cust = customers.find((c) => c.id === customerId);
    return cust ? cust.openingBalance : 0;
  }

  const sorted = [...ledger].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return sorted[sorted.length - 1].balance;
}
