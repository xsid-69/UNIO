import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import isAuthenticated from '../middlewares/auth.middleware.js';
import { getAuthCookieOptions } from '../config/auth-cookie.js';

const router = express.Router();
const frontendUrl = () => (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${frontendUrl()}/login?error=${encodeURIComponent('Google authentication failed')}`,
    session: false,
  }),
  (req, res) => {
    try {
      const token = jwt.sign({ id: req.user._id, email: req.user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.cookie('token', token, getAuthCookieOptions());
      return res.redirect(`${frontendUrl()}/login/success`);
    } catch (error) {
      console.error('Error completing Google authentication:', error.message);
      return res.redirect(`${frontendUrl()}/login?error=${encodeURIComponent('Authentication failed')}`);
    }
  },
);
router.get('/me', isAuthenticated, (req, res) => res.json({ success: true, user: req.user }));

export default router;