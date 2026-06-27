import mongoose from 'mongoose';

const FinalProductionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  dryPlatesReceived: { type: Number, required: true },
  finalPlatesProduced: { type: Number, required: true },
  notes: { type: String },
  createdAt: { type: String, required: true },
  consumptions: [{
    materialName: { type: String, required: true },
    calculatedAmount: { type: Number, required: true },
    unit: { type: String, required: true }
  }]
}, { timestamps: true });

export const FinalProduction = mongoose.models.FinalProduction || mongoose.model('FinalProduction', FinalProductionSchema);
