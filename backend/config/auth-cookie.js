import { isProductionDeployment } from './env.js';

export const getAuthCookieOptions = () => ({
  httpOnly: true,
  secure: isProductionDeployment(),
  sameSite: isProductionDeployment() ? 'none' : 'lax',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

export const getAuthCookieClearOptions = () => {
  const { maxAge, ...options } = getAuthCookieOptions();
  void maxAge;
  return options;
};