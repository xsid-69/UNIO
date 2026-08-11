import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const apiUrl = env.VITE_BACKEND_URL?.trim();

  if (mode === 'production' && env.RENDER === 'true') {
    if (!apiUrl) throw new Error('VITE_BACKEND_URL is required for a Render production build');
    const parsedApiUrl = new URL(apiUrl);
    if (parsedApiUrl.protocol !== 'https:' || parsedApiUrl.origin !== apiUrl.replace(/\/+$/, '')) {
      throw new Error('VITE_BACKEND_URL must be an HTTPS origin without a path in production');
    }
  }

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': {
          target: env.BACKEND_URL || env.VITE_BACKEND_URL || 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined;
            if (/pdfjs-dist|react-pdf/.test(id)) return 'pdf-reader';
            if (/gsap|lenis|framer-motion|\/motion\//.test(id)) return 'motion';
            if (/@mui|@emotion|styled-components/.test(id)) return 'ui-vendor';
            if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react-core';
            if (/node_modules\/(@reduxjs|react-redux|redux|react-router|react-router-dom|immer|reselect|use-sync-external-store)\//.test(id)) return 'route-state';
            return undefined;
          },
        },
      },
    },
  };
});
