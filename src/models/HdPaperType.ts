import mongoose from 'mongoose';

const HdPaperTypeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  unit: { type: String, required: true, default: 'pieces' },
  quantity: { type: Number, required: true, default: 0 },
  costPerUnit: { type: Number, required: true, default: 0 },
  minThreshold: { type: Number, required: true, default: 0 },
  conversionFactor: { type: Number, required: true, default: 1 },
  createdAt: { type: String, required: true },
}, { timestamps: true });

export const HdPaperType = mongoose.models.HdPaperType || mongoose.model('HdPaperType', HdPaperTypeSchema);
