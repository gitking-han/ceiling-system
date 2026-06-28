import mongoose from 'mongoose';

const WetProductionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  productionDate: { type: String, required: true },
  wetPlatesProduced: { type: Number, required: true },
  plasterParisUsed: { type: Number, required: true },
  notes: { type: String },
  createdAt: { type: String, required: true }
}, { timestamps: true });

export const WetProduction = mongoose.models.WetProduction || mongoose.model('WetProduction', WetProductionSchema);
