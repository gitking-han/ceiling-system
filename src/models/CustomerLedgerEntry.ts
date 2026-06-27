import mongoose from 'mongoose';

const CustomerLedgerEntrySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  customerId: { type: String, required: true },
  date: { type: String, required: true },
  type: { type: String, enum: ['Opening Balance', 'Sale', 'Payment', 'Return'], required: true },
  referenceId: { type: String, required: true },
  debit: { type: Number, required: true, default: 0 },
  credit: { type: Number, required: true, default: 0 },
  balance: { type: Number, required: true, default: 0 },
  description: { type: String, required: true }
}, { timestamps: true });

export const CustomerLedgerEntry = mongoose.models.CustomerLedgerEntry || mongoose.model('CustomerLedgerEntry', CustomerLedgerEntrySchema);
