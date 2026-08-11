import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import '../config/env.js';
import '../config/passport.config.js';
import authRouter from '../routes/auth.routes.js';
import googleAuthRouter from '../routes/googleAuth.routes.js';
import resourcesRouter from '../routes/resources.routes.js';
import notesRouter from '../routes/notes.routes.js';
import subjectsRouter from '../routes/subjects.routes.js';

const app = express();
const allowedOrigins = [process.env.FRONTEND_URL, process.env.BACKEND_URL, ...(process.env.CORS_ORIGINS || '').split(',')]
  .map((origin) => origin?.trim().replace(/\/$/, '')).filter(Boolean);

if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(cors({
  origin(origin, callback) {
    const normalizedOrigin = origin?.replace(/\/$/, '');
    if (!origin || allowedOrigins.includes(normalizedOrigin)) return callback(null, true);
    return callback(new Error('Origin is not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(passport.initialize());
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', `default-src 'none'; base-uri 'none'; frame-ancestors 'self' ${allowedOrigins.join(' ')}`.trim());
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});
app.get('/api/health', (req, res) => {
  const databaseReady = mongoose.connection.readyState === 1;
  res.status(databaseReady ? 200 : 503).json({ status: databaseReady ? 'ready' : 'unavailable', database: databaseReady ? 'connected' : 'disconnected' });
});
app.use('/api/auth', authRouter);
app.use('/api/auth', googleAuthRouter);
app.use('/api/resources', resourcesRouter);
app.use('/api/notes', notesRouter);
app.use('/api/subjects', subjectsRouter);
app.use((err, req, res, next) => {
  void req; void next;
  const corsError = err?.message === 'Origin is not allowed by CORS';
  console.error('Unhandled error:', err?.stack || err);
  res.status(corsError ? 403 : 500).json({ success: false, message: corsError ? 'Origin not allowed' : 'Internal Server Error' });
});

export default app;