import axios from 'axios';

const SESSION_TOKEN_KEY = 'unio:session-token';

export const setSessionToken = (token) => {
  if (!token || typeof token !== 'string') return false;
  sessionStorage.setItem(SESSION_TOKEN_KEY, token);
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  return true;
};

export const restoreSessionToken = () => {
  const token = sessionStorage.getItem(SESSION_TOKEN_KEY);
  if (token) axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  return token;
};

export const clearSessionToken = () => {
  sessionStorage.removeItem(SESSION_TOKEN_KEY);
  delete axios.defaults.headers.common.Authorization;
};
