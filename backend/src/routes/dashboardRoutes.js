import express from 'express';
import { protect } from '../middleware/auth.js';
import Email from '../models/Email.js';
import Assignment from '../models/Assignment.js';
import Attendance from '../models/Attendance.js';
import StudyPlan from '../models/StudyPlan.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const [
      urgentEmailCount,
      criticalAssignments,
      atRiskSubjects,
      latestStudyPlan
    ] = await Promise.all([
      // Count emails with priority='urgent' and isRead=false
      Email.countDocuments({ userId, priority: 'urgent', isRead: false }),
      
      // Find assignments with urgency='critical'
      Assignment.find({ userId, urgency: 'critical' }).sort({ dueDate: 1 }),
      
      // Find attendance records with risk='critical' or risk='warning'
      Attendance.find({ userId, risk: { $in: ['critical', 'warning'] } }),

      // Get latest study plan
      StudyPlan.findOne({ userId }).sort({ createdAt: -1 })
    ]);

    // Extract today's tasks
    let todayTasks = [];
    if (latestStudyPlan && latestStudyPlan.planData && latestStudyPlan.planData.days) {
      const todayStr = new Date().toISOString().split('T')[0];
      const todayPlan = latestStudyPlan.planData.days.find(d => d.date === todayStr);
      if (todayPlan && todayPlan.tasks) {
        todayTasks = todayPlan.tasks;
      }
    }

    // Sort atRiskSubjects: critical comes first
    atRiskSubjects.sort((a, b) => {
      const rank = { 'critical': 1, 'warning': 2 };
      return rank[a.risk] - rank[b.risk];
    });

    res.json({
      urgentEmailCount,
      criticalAssignments,
      atRiskSubjects,
      todayTasks,
      user: {
        name: req.user.name,
        email: req.user.email,
        picture: req.user.picture
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
