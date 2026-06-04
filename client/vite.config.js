import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on the current mode from the root directory
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    server: {
      host: '0.0.0.0',
      proxy: {
        '/api': {
          // Fixed: read from 'env' object instead of 'import.meta.env'
          target: `http://${env.VITE_NETWORK_IP || 'localhost'}:8000`,
          changeOrigin: true,
          secure: false,
        }
      }
    }
  };
});
