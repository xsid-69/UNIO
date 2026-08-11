import mongoose from 'mongoose';

const authExchangeSchema = new mongoose.Schema({
  codeHash: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 },
  },
}, { timestamps: true });

export default mongoose.model('authExchange', authExchangeSchema);
