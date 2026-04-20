import mongoose from 'mongoose';

const studyPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  planData: mongoose.Schema.Types.Mixed,  // full 7-day JSON from Gemini
  completion: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const StudyPlan = mongoose.model('StudyPlan', studyPlanSchema);
export default StudyPlan;
