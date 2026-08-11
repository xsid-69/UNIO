const isProduction = () => process.env.NODE_ENV === 'production';

export const getAuthCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction(),
  sameSite: isProduction() ? 'none' : 'lax',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

export const getAuthCookieClearOptions = () => {
  const { maxAge, ...options } = getAuthCookieOptions();
  void maxAge;
  return options;
};