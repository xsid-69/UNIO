import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Provider } from 'react-redux';
import { store } from './store/store.js';
import { AuthProvider } from './context/AuthContext.jsx'; // Import AuthProvider

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <AuthProvider> {/* Wrap App with AuthProvider */}
      <App />
    </AuthProvider>
  </Provider>
);
