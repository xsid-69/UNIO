import './config/env.js';
import app from './src/app.js';
import connectDB from './db/db.js';
import { validateEnvironment } from './config/env.js';

validateEnvironment();
await connectDB();

if (!process.env.VERCEL) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server is running on port ${port}`));
}

export default app;