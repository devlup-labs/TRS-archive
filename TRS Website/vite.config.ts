import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

const env = dotenv.config({ path: `.env` }).parsed;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react-dom'],
  },
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:8000'
    }
  },
  define: {
    'import.meta.env.BACKEND_URL': JSON.stringify(env.BACKEND_URL),
  },
})
