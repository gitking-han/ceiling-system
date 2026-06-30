export interface User {
  id: string;
  username: string;
  role: 'admin' | 'staff';
  name: string;
}

export interface RawMaterial {
  id: string;
  name: string;
  quantity: number; // current stock quantity
  unit: string;     // e.g., "kg", "grams", "feet", "pieces", "rolls", "rims"
  costPerUnit: number; // cost per stock unit in Rupees
  minThreshold: number; // for low stock alert
  conversionFactor: number; // e.g. 272 feet per roll, 500 pieces per rim, 50 pieces per kg
  updatedAt: string;
}

export interface InventoryTransaction {
  id: string;
  materialId: string;
  materialName: string;
  type: 'in' | 'out'; // in = add stock, out = production consumption or manual adjustment
  quantity: number;
  cost: number;
  date: string;
  notes: string;
  unit?: string;
}

export interface Formula {
  id: string;
  materialName: string; // matches RawMaterial name
  amount: number;       // amount used per final plate
  unit: string;         // e.g., "g", "pieces", "feet", "packet"
  updatedAt: string;
}

export interface FormulaHistory {
  id: string;
  formulaId: string;
  materialName: string;
  oldAmount: number;
  newAmount: number;
  unit: string;
  changedBy: string;
  date: string;
}

export interface WetProduction {
  id: string;
  productionDate: string;
  wetPlatesProduced: number;
  plasterParisUsed: number; // in kg (manually input)
  notes: string;
  createdAt: string;
}

export interface DryProduction {
  id: string;
  date: string;
  wetPlatesReceived: number;
  dryPlatesProduced: number;
  wastePlates: number; // Auto calculated: Received - Produced
  notes?: string;
  createdAt: string;
}

export interface FinalProduction {
  id: string;
  date: string;
  dryPlatesReceived: number;
  finalPlatesProduced: number;
  notes?: string;
  panniType?: string;
  createdAt: string;
  consumptions: {
    materialName: string;
    calculatedAmount: number;
    unit: string;
  }[];
}

export interface WasteRecord {
  id: string;
  date: string;
  source: 'wet' | 'dry' | 'manual';
  quantity: number;
  notes: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  date: string;
  category: 'Gas' | 'Electricity' | 'Labour' | 'Transport' | 'Other';
  amount: number;
  description: string;
  isLabourFormula?: boolean;
  finalPlatesCount?: number; // if based on final production labour formula
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  openingBalance: number; // outstanding balance at start
  createdAt: string;
}

export interface CustomerLedgerEntry {
  id: string;
  customerId: string;
  date: string;
  type: 'Opening Balance' | 'Sale' | 'Payment' | 'Return';
  referenceId: string; // Sale ID, Payment ID, or "opening"
  debit: number;       // Increase outstanding balance (sales)
  credit: number;      // Decrease outstanding balance (payments)
  balance: number;     // Running balance
  description: string;
}

export interface Sale {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  productName: string; // e.g. "Double Panni Plate"
  quantity: number;
  rate: number;
  totalAmount: number; // quantity * rate
  discount: number;    // discount amount
  grandTotal: number;  // totalAmount - discount
  date: string;
  notes?: string;
  createdAt: string;

  // Optional fields for legacy seed data compatibility
  paidAmount?: number;
  dueAmount?: number;
  status?: 'Paid' | 'Partial' | 'Unpaid';
}

export interface Payment {
  id: string;
  customerId: string;
  customerName: string;
  saleId?: string; // specific invoice if any
  invoiceNumber?: string;
  amount: number;
  date: string;
  paymentMethod: string; // "Cash", "Bank Transfer", etc.
  notes: string;
  createdAt: string;
}
