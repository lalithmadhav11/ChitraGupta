import express from 'express';
import { protect } from '../middleware/auth.js';
import { fetchRealEmails, sendRealEmail } from '../services/realGmail.js';
import { classifyEmail } from '../services/prologService.js';
import Email from '../models/Email.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const emails = await Email.find({ userId: req.user._id, isArchived: { $ne: true } }).sort({ date: -1 });
    res.json(emails);
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

    const fetchedEmails = await fetchRealEmails(user.accessToken, user.refreshToken);

    for (const emailData of fetchedEmails) {
      const priority = classifyEmail(emailData.subject, emailData.sender, emailData.snippet);
      
      await Email.findOneAndUpdate(
        { userId: user._id, gmailId: emailData.gmailId },
        { 
          $set: {
            subject: emailData.subject,
            sender: emailData.sender,
            snippet: emailData.snippet,
            body: emailData.body,
            date: emailData.date,
            priority: priority,
            isRead: emailData.isRead
          }
        },
        { upsert: true, new: true }
      );
    }

    const allEmails = await Email.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(allEmails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const email = await Email.findOne({ _id: req.params.id, userId: req.user._id });
    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }
    res.json(email);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const email = await Email.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }
    // Optional: Add logic to delete from Gmail via API
    res.json({ message: 'Email deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id/archive', protect, async (req, res) => {
  try {
    const email = await Email.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: { isArchived: true } }, // Need to add this field or just remove from view
      { new: true }
    );
    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }
    // Optional: Add logic to remove 'INBOX' label in Gmail
    res.json(email);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id/read', protect, async (req, res) => {
  try {
    const email = await Email.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: { isRead: true } },
      { new: true }
    );
    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }
    res.json(email);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/send', protect, async (req, res) => {
  try {
    const { to, subject, body } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user.accessToken) {
      return res.status(400).json({ error: 'Google Access Token missing.' });
    }

    const result = await sendRealEmail(user.accessToken, user.refreshToken, { to, subject, body });
    res.json({ message: 'Email sent successfully', result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
