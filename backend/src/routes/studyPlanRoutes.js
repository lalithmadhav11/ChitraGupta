import express from 'express';
import { protect } from '../middleware/auth.js';
import { generateStudyPlan } from '../services/geminiService.js';
import StudyPlan from '../models/StudyPlan.js';
import Assignment from '../models/Assignment.js';
import Attendance from '../models/Attendance.js';

const router = express.Router();

router.post('/generate', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const assignments = await Assignment.find({ userId });
    const attendanceData = await Attendance.find({ userId });
    
    console.log(`Generating study plan for user ${userId}`);
    console.log(`Assignments: ${assignments.length}, Attendance: ${attendanceData.length}`);
    
    const planData = await generateStudyPlan(assignments, attendanceData);
    
    // Replace existing plan for this user
    const plan = await StudyPlan.findOneAndUpdate(
      { userId },
      { userId, planData, completion: 0, createdAt: new Date() },
      { upsert: true, new: true }
    );
    
    res.json(plan);
  } catch (error) {
    console.error('Study plan generation error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const plan = await StudyPlan.findOne({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(plan || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
