import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// 10-Modul (src/8-Modull) QA-build: modul8.html -> dist-m8/ (QA uchun, LMS emas) (alohida Vercel loyihasi)
export default defineConfig({
  // Jonli-dars API manzili (src/live/liveClient.js): DARS_API_URL env → define; bo'sh → prod dars-api.coddycamp.uz (2026-09-08)
  define: { __DARS_API_URL__: JSON.stringify(process.env.DARS_API_URL || '') },
  plugins: [react()],
  build: {
    outDir: 'dist-m8',
    rollupOptions: {
      input: resolve(__dirname, 'modul8.html'),
    },
  },
})
