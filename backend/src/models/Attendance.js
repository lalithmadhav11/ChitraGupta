import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  attended: { type: Number, required: true },
  total: { type: Number, required: true },
  percentage: Number,
  risk: { type: String, enum: ['critical', 'warning', 'safe'], default: 'safe' },
  canMiss: { type: Number, default: 0 },
  needToAttend: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;
