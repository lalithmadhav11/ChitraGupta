import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  classroomId: String,   // Google Classroom courseWork ID
  courseId: String,
  courseName: String,
  title: String,
  description: String,
  type: String,
  dueDate: Date,         // null if no due date
  daysRemaining: Number, // null if no due date
  urgency: { type: String, enum: ['critical', 'high', 'medium', 'low'], default: 'low' },
  submissionState: String,
  maxPoints: Number
});

// Add compound index: { userId: 1, classroomId: 1 } unique: true
assignmentSchema.index({ userId: 1, classroomId: 1 }, { unique: true });

const Assignment = mongoose.model('Assignment', assignmentSchema);
export default Assignment;
