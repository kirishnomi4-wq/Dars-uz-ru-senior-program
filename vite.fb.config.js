import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// «Frontend-Backend darslari» build: frontend-backend.html -> dist-fb/ (alohida Vercel loyihasi, 2026-08-21)
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-fb',
    rollupOptions: {
      input: resolve(__dirname, 'frontend-backend.html'),
    },
  },
})
