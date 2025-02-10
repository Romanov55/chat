import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, unique: true, sparse: true },
  avatar: { type: String },
  codeUser:  { type: String },
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
