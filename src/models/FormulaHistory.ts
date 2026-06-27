import mongoose from 'mongoose';

const FormulaHistorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  formulaId: { type: String, required: true },
  materialName: { type: String, required: true },
  oldAmount: { type: Number, required: true },
  newAmount: { type: Number, required: true },
  unit: { type: String, required: true },
  changedBy: { type: String, required: true },
  date: { type: String, required: true }
}, { timestamps: true });

export const FormulaHistory = mongoose.models.FormulaHistory || mongoose.model('FormulaHistory', FormulaHistorySchema);
