import dotenv from 'dotenv';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseEnvPath = path.join(__dirname, '../.env');
const localEnvPath = path.join(__dirname, '../.env.local');

const isHostedEnvironment = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';

dotenv.config({ path: baseEnvPath, override: !isHostedEnvironment });
if (!isHostedEnvironment && existsSync(localEnvPath)) {
  dotenv.config({ path: localEnvPath, override: true });
}

// Render exposes RENDER=true. Treat hosted services as production even when
// NODE_ENV was omitted in the dashboard so auth cookies cannot silently fall
// back to development settings.
if (!process.env.NODE_ENV && process.env.RENDER === 'true') {
  process.env.NODE_ENV = 'production';
}

const runtimeVariables = ['MONGO_DB_URI', 'JWT_SECRET', 'FRONTEND_URL', 'BACKEND_URL'];
const productionVariables = [
  ...runtimeVariables,
  'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET',
  'IMAGEKIT_PUBLIC_KEY', 'IMAGEKIT_PRIVATE_KEY', 'IMAGEKIT_URL_ENDPOINT',
];

export const isProductionDeployment = () => (
  process.env.NODE_ENV === 'production' || process.env.RENDER === 'true'
);

export function validateEnvironment() {
  const requiredVariables = isProductionDeployment() ? productionVariables : runtimeVariables;
  const missing = requiredVariables.filter((name) => !process.env[name]?.trim());
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  for (const name of ['FRONTEND_URL', 'BACKEND_URL', 'IMAGEKIT_URL_ENDPOINT']) {
    const value = process.env[name]?.trim();
    if (!value) continue;

    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
      throw new Error(`${name} must be a credential-free HTTP(S) URL`);
    }
    if (isProductionDeployment() && url.protocol !== 'https:') {
      throw new Error(`${name} must use HTTPS in production`);
    }
    if (name !== 'IMAGEKIT_URL_ENDPOINT' && url.origin !== value.replace(/\/+$/, '')) {
      throw new Error(`${name} must be an origin without a path, query, or fragment`);
    }
  }
}