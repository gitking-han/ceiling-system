import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  category: { type: String, enum: ['Gas', 'Electricity', 'Labour', 'Transport', 'Other'], required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  isLabourFormula: { type: Boolean, default: false },
  finalPlatesCount: { type: Number },
  createdAt: { type: String, required: true }
}, { timestamps: true });

export const Expense = mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);
