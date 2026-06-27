import mongoose from 'mongoose';

const WasteRecordSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  source: { type: String, enum: ['wet', 'dry', 'manual'], required: true },
  quantity: { type: Number, required: true },
  notes: { type: String },
  createdAt: { type: String, required: true }
}, { timestamps: true });

export const WasteRecord = mongoose.models.WasteRecord || mongoose.model('WasteRecord', WasteRecordSchema);
