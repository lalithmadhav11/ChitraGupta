import express from 'express';
import { protect } from '../middleware/auth.js';
import { analyzeAttendance } from '../services/prologService.js';
import Attendance from '../models/Attendance.js';

const router = express.Router();

router.post('/log', protect, async (req, res) => {
  try {
    const { subject, attended, total } = req.body;
    console.log(`Attendance Log Attempt - Subject: ${subject}, Attended: ${attended}, Total: ${total}`);
    
    if (!subject || attended === undefined || total === undefined) {
      console.log('Validation Failed: Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const att = Number(attended);
    const tot = Number(total);

    if (isNaN(att) || isNaN(tot) || tot <= 0 || att > tot || att < 0) {
      console.log(`Validation Failed: Invalid numbers - Attended: ${attended} (${att}), Total: ${total} (${tot})`);
      return res.status(400).json({ 
        error: isNaN(att) || isNaN(tot) ? 'Attendance and Total must be numbers' : 'Invalid attendance numbers' 
      });
    }

    const percentage = (att / tot) * 100;
    
    // Analyze using Prolog rules
    const analysis = analyzeAttendance(att, tot);

    const record = await Attendance.findOneAndUpdate(
      { userId: req.user._id, subject },
      { 
        $set: {
          attended: att,
          total: tot,
          percentage,
          risk: analysis.risk,
          canMiss: analysis.canMiss,
          needToAttend: analysis.needToAttend,
          updatedAt: Date.now()
        }
      },
      { upsert: true, new: true }
    );

    res.json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/summary', protect, async (req, res) => {
  try {
    const records = await Attendance.find({ userId: req.user._id });

    // Custom sort: critical first, then warning, then safe
    const riskOrder = { 'critical': 1, 'warning': 2, 'safe': 3 };
    
    records.sort((a, b) => riskOrder[a.risk] - riskOrder[b.risk]);

    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
