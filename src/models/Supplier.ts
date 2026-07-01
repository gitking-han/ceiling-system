import mongoose from 'mongoose';

const SupplierSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  openingBalance: { type: Number, required: true, default: 0 },
  supplierMaterials: { type: [String], required: true, default: [] },
  createdAt: { type: String, required: true }
}, { timestamps: true });

export const Supplier = mongoose.models.Supplier || mongoose.model('Supplier', SupplierSchema);
