import mongoose from 'mongoose';

const FormulaSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  materialName: { type: String, required: true },
  amount: { type: Number, required: true },
  unit: { type: String, required: true },
  updatedAt: { type: String, required: true }
}, { timestamps: true });

export const Formula = mongoose.models.Formula || mongoose.model('Formula', FormulaSchema);
