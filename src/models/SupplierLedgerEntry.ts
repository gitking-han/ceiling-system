import mongoose from 'mongoose';

const SupplierLedgerEntrySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  supplierId: { type: String, required: true },
  date: { type: String, required: true },
  type: { type: String, enum: ['Opening Balance', 'Purchase', 'Payment', 'Return'], required: true },
  referenceId: { type: String, required: true },
  debit: { type: Number, required: true, default: 0 },
  credit: { type: Number, required: true, default: 0 },
  balance: { type: Number, required: true, default: 0 },
  description: { type: String, required: true }
}, { timestamps: true });

export const SupplierLedgerEntry = mongoose.models.SupplierLedgerEntry || mongoose.model('SupplierLedgerEntry', SupplierLedgerEntrySchema);
