import mongoose from 'mongoose';

const LabourLedgerEntrySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  operatorId: { type: String, required: true },
  operatorName: { type: String, required: true },
  date: { type: String, required: true },
  stage: { type: String, enum: ['wet', 'dry', 'final', 'waste'], required: true },
  plates: { type: Number, required: true, default: 0 },
  ratePerPlate: { type: Number, required: true, default: 6 },
  amount: { type: Number, required: true, default: 0 },
  type: { type: String, enum: ['earning', 'payment'], required: true },
  referenceId: { type: String, required: true },
  notes: { type: String, default: '' },
  createdAt: { type: String, required: true }
}, { timestamps: true });

export const LabourLedgerEntry = mongoose.models.LabourLedgerEntry || mongoose.model('LabourLedgerEntry', LabourLedgerEntrySchema);
