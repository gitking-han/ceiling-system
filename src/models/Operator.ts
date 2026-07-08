import mongoose from 'mongoose';

const OperatorSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  stage: { type: String, enum: ['wet', 'dry', 'final', 'waste'], required: true },
  ratePerPlate: { type: Number, required: true, default: 6 },
  balanceDue: { type: Number, required: true, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: String, required: true }
}, { timestamps: true });

export const Operator = mongoose.models.Operator || mongoose.model('Operator', OperatorSchema);
