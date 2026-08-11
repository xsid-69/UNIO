import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { createHash, randomBytes } from 'node:crypto';
import isAuthenticated from '../middlewares/auth.middleware.js';
import userModel from '../models/user.model.js';
import authExchangeModel from '../models/auth-exchange.model.js';
import { getAuthCookieOptions } from '../config/auth-cookie.js';

const router = express.Router();
const EXCHANGE_TTL_MS = 2 * 60 * 1000;
const frontendUrl = () => (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/+$/, '');
const hashExchangeCode = (code) => createHash('sha256').update(code).digest('hex');
const createSessionToken = (user) => jwt.sign(
  { id: user._id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '7d' },
);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${frontendUrl()}/login?error=${encodeURIComponent('Google authentication failed')}`,
    session: false,
  }),
  async (req, res) => {
    try {
      const token = createSessionToken(req.user);
      const exchangeCode = randomBytes(32).toString('base64url');
      await authExchangeModel.create({
        codeHash: hashExchangeCode(exchangeCode),
        user: req.user._id,
        expiresAt: new Date(Date.now() + EXCHANGE_TTL_MS),
      });

      res.cookie('token', token, getAuthCookieOptions());
      const successUrl = new URL('/login/success', `${frontendUrl()}/`);
      successUrl.searchParams.set('code', exchangeCode);
      return res.redirect(successUrl.toString());
    } catch (error) {
      console.error('Error completing Google authentication:', error.message);
      return res.redirect(`${frontendUrl()}/login?error=${encodeURIComponent('Authentication failed')}`);
    }
  },
);

router.post('/google/exchange', async (req, res) => {
  try {
    const code = typeof req.body?.code === 'string' ? req.body.code.trim() : '';
    if (!/^[A-Za-z0-9_-]{43}$/.test(code)) {
      return res.status(400).json({ success: false, message: 'Invalid authentication exchange' });
    }

    const exchange = await authExchangeModel.findOneAndDelete({
      codeHash: hashExchangeCode(code),
      expiresAt: { $gt: new Date() },
    });
    if (!exchange) {
      return res.status(401).json({ success: false, message: 'Authentication exchange expired or already used' });
    }

    const user = await userModel.findById(exchange.user);
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });

    const token = createSessionToken(user);
    res.cookie('token', token, getAuthCookieOptions());
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ success: true, user, token });
  } catch (error) {
    console.error('Error exchanging Google authentication:', error.message);
    return res.status(500).json({ success: false, message: 'Unable to complete authentication' });
  }
});

router.get('/me', isAuthenticated, (req, res) => res.json({ success: true, user: req.user }));

export default router;