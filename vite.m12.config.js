import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// 14-Modul (src/12-Modull) QA-build: modul12.html -> dist-m12/ (QA uchun, LMS emas) (alohida Vercel loyihasi)
export default defineConfig({
  // Jonli-dars API manzili (src/live/liveClient.js): DARS_API_URL env → define; bo'sh → prod dars-api.coddycamp.uz (2026-09-08)
  define: { __DARS_API_URL__: JSON.stringify(process.env.DARS_API_URL || '') },
  plugins: [react()],
  build: {
    outDir: 'dist-m12',
    rollupOptions: {
      input: resolve(__dirname, 'modul12.html'),
    },
  },
})
