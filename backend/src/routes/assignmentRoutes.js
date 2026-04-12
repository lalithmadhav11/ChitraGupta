import express from 'express';
import { protect } from '../middleware/auth.js';
import { fetchRealAssignments } from '../services/realClassroom.js';
import { getUrgency } from '../services/prologService.js';
import Assignment from '../models/Assignment.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const assignments = await Assignment.find({ userId: req.user._id }).sort({ dueDate: 1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/sync', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.accessToken) {
      return res.status(400).json({ error: 'Google Access Token missing. Relogin required.' });
    }

    const fetchedAssignments = await fetchRealAssignments(user.accessToken, user.refreshToken);
    const now = new Date();

    for (const assignmentData of fetchedAssignments) {
      let daysRemaining = null;
      let urgency = 'low';

      if (assignmentData.dueDate) {
        daysRemaining = Math.ceil((assignmentData.dueDate - now) / (1000 * 60 * 60 * 24));
        urgency = getUrgency(daysRemaining);
      }

      await Assignment.findOneAndUpdate(
        { userId: user._id, classroomId: assignmentData.classroomId },
        { 
          $set: {
            ...assignmentData,
            daysRemaining,
            urgency
          }
        },
        { upsert: true, new: true }
      );
    }

    const allAssignments = await Assignment.find({ userId: req.user._id }).sort({ dueDate: 1 });
    res.json(allAssignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
