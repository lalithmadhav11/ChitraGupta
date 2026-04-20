import mongoose from 'mongoose';

const emailSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  gmailId: { type: String, required: true },  // Gmail message ID for deduplication
  subject: String,
  sender: String,
  snippet: String,
  body: String,
  date: Date,
  isArchived: { type: Boolean, default: false },
  priority: { type: String, enum: ['urgent', 'important', 'normal', 'spam'], default: 'normal' },
  isRead: { type: Boolean, default: false }
});

// Add compound index: { userId: 1, gmailId: 1 } unique: true (prevents duplicates on re-sync)
emailSchema.index({ userId: 1, gmailId: 1 }, { unique: true });

const Email = mongoose.model('Email', emailSchema);
export default Email;
