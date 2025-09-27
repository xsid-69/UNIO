import express from 'express';
import authRouter from '../routes/auth.routes.js';
import googleAuthRouter from '../routes/googleAuth.routes.js';
import resourcesRouter from '../routes/resources.routes.js';
import notesRouter from '../routes/notes.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import "./../config/passport.config.js";

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; connect-src 'self' http://localhost:3000 http://localhost:5173; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  );
  next();
});
app.use('/api/auth', authRouter);
app.use('/api/auth', googleAuthRouter); // Use googleAuthRouter for /api/auth
app.use('/api/resources', resourcesRouter);
app.use('/api/notes', notesRouter);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && err.stack ? err.stack : err);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

export default app;
