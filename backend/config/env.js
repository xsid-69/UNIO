import dotenv from 'dotenv';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseEnvPath = path.join(__dirname, '../.env');
const localEnvPath = path.join(__dirname, '../.env.local');

dotenv.config({ path: baseEnvPath });
if (process.env.NODE_ENV !== 'production' && existsSync(localEnvPath)) {
  dotenv.config({ path: localEnvPath, override: true });
}

const productionVariables = [
  'MONGO_DB_URI', 'JWT_SECRET', 'FRONTEND_URL', 'BACKEND_URL',
  'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET',
  'IMAGEKIT_PUBLIC_KEY', 'IMAGEKIT_PRIVATE_KEY', 'IMAGEKIT_URL_ENDPOINT',
];

export function validateEnvironment() {
  if (process.env.NODE_ENV !== 'production') return;
  const missing = productionVariables.filter((name) => !process.env[name]?.trim());
  if (missing.length) throw new Error(`Missing required production environment variables: ${missing.join(', ')}`);
  for (const name of ['FRONTEND_URL', 'BACKEND_URL', 'IMAGEKIT_URL_ENDPOINT']) {
    const url = new URL(process.env[name]);
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error(`${name} must use HTTP(S)`);
  }
}