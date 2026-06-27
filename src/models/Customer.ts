import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  openingBalance: { type: Number, required: true, default: 0 },
  createdAt: { type: String, required: true }
}, { timestamps: true });

export const Customer = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
