import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Kompilyator QA-build (F-1001-91): kompilyator.html -> dist-kompilyator/ (5 dars, LMS emas; Vercel loyihasi coddycamp-kompilyator)
export default defineConfig({
  // Jonli-dars API manzili (src/live/liveClient.js): DARS_API_URL env → define; bo'sh → prod dars-api.coddycamp.uz (2026-09-08)
  define: { __DARS_API_URL__: JSON.stringify(process.env.DARS_API_URL || '') },
  plugins: [react()],
  build: {
    outDir: 'dist-kompilyator',
    rollupOptions: {
      input: resolve(__dirname, 'kompilyator.html'),
    },
  },
})
