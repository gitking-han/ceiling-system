import mongoose from 'mongoose';

const DryProductionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  wetPlatesReceived: { type: Number, required: true },
  dryPlatesProduced: { type: Number, required: true },
  wastePlates: { type: Number, required: true },
  notes: { type: String },
  createdAt: { type: String, required: true }
}, { timestamps: true });

export const DryProduction = mongoose.models.DryProduction || mongoose.model('DryProduction', DryProductionSchema);
