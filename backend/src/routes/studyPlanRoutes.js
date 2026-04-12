import express from 'express';
import { protect } from '../middleware/auth.js';
import { generateStudyPlan } from '../services/geminiService.js';
import Assignment from '../models/Assignment.js';
import Attendance from '../models/Attendance.js';
import StudyPlan from '../models/StudyPlan.js';

const router = express.Router();

router.post('/generate', protect, async (req, res) => {
  try {
    const assignments = await Assignment.find({ userId: req.user._id });
    const attendance = await Attendance.find({ userId: req.user._id });

    const planData = await generateStudyPlan(assignments, attendance);

    const studyPlan = await StudyPlan.findOneAndUpdate(
      { userId: req.user._id },
      { 
        $set: {
          planData,
          createdAt: Date.now()
        }
      },
      { upsert: true, new: true }
    );

    res.json(studyPlan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const plan = await StudyPlan.findOne({ userId: req.user._id });
    res.json(plan || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
