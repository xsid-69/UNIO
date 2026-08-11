import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.jsx';
import { store } from './store/store.js';
import './index.css';

const redirectStorageKey = 'unio:redirect';
const savedRedirect = sessionStorage.getItem(redirectStorageKey);
if (savedRedirect) {
  sessionStorage.removeItem(redirectStorageKey);
  try {
    const target = new URL(savedRedirect);
    if (target.origin === window.location.origin) {
      window.history.replaceState(null, '', `${target.pathname}${target.search}${target.hash}`);
    }
  } catch {
    // Ignore malformed redirect state and continue at the application root.
  }
}

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>,
);