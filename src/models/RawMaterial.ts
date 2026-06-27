import mongoose from 'mongoose';

const RawMaterialSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  quantity: { type: Number, required: true, default: 0 },
  unit: { type: String, required: true },
  costPerUnit: { type: Number, required: true, default: 0 },
  minThreshold: { type: Number, required: true, default: 0 },
  updatedAt: { type: String, required: true }
}, { timestamps: true });

export const RawMaterial = mongoose.models.RawMaterial || mongoose.model('RawMaterial', RawMaterialSchema);
