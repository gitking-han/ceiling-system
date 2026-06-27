import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'staff'], required: true },
  name: { type: String, required: true }
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
