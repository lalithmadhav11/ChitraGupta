import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Passport configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'dummy',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = new User({
            googleId: profile.id,
            email: profile.emails?.[0]?.value || '',
            name: profile.displayName || 'Unknown',
            picture: profile.photos?.[0]?.value || '',
          });
        }

        user.accessToken = accessToken;
        if (refreshToken) user.refreshToken = refreshToken;
        user.tokenExpiry = new Date(Date.now() + 3500000); // ~1 hr
        await user.save();

        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// OAuth Scopes
const scope = [
  'profile',
  'email',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/classroom.courses.readonly',
  'https://www.googleapis.com/auth/classroom.coursework.me.readonly',
  'https://www.googleapis.com/auth/classroom.student-submissions.me.readonly'
];

router.get('/google', passport.authenticate('google', { 
  scope, 
  accessType: 'offline', 
  prompt: 'consent' 
}));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: process.env.FRONTEND_URL + '/login' }),
  (req, res) => {
    // Generate JWT
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie
    res.cookie('chitraguptha_token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'lax',
      secure: false // set to true in production with https
    });

    res.redirect((process.env.FRONTEND_URL || 'http://localhost:3000') + '/dashboard');
  }
);

router.get('/me', protect, (req, res) => {
  res.json({
    _id: req.user._id,
    email: req.user.email,
    name: req.user.name,
    picture: req.user.picture
  });
});

router.post('/logout', (req, res) => {
  res.clearCookie('chitraguptha_token');
  res.json({ message: 'Logged out' });
});

export default router;
