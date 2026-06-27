import mongoose from 'mongoose';

const InventoryTransactionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  materialId: { type: String, required: true },
  materialName: { type: String, required: true },
  type: { type: String, enum: ['in', 'out'], required: true },
  quantity: { type: Number, required: true },
  cost: { type: Number, required: true },
  date: { type: String, required: true },
  notes: { type: String, required: true },
  unit: { type: String }
}, { timestamps: true });

export const InventoryTransaction = mongoose.models.InventoryTransaction || mongoose.model('InventoryTransaction', InventoryTransactionSchema);
