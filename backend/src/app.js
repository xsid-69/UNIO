import express from 'express';
import authRouter from '../routes/auth.routes.js';
import googleAuthRouter from '../routes/googleAuth.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import "./../config/passport.config.js";

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
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

export default app;
