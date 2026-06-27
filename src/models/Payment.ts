import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  saleId: { type: String },
  invoiceNumber: { type: String },
  amount: { type: Number, required: true },
  date: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  notes: { type: String },
  createdAt: { type: String, required: true }
}, { timestamps: true });

export const Payment = mongoose.models.Payment || mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
