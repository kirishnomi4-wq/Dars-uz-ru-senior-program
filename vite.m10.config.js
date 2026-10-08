import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// 12-Modul (src/10-Modull) QA-build: modul10.html -> dist-m10/ (QA uchun, LMS emas) (alohida Vercel loyihasi)
export default defineConfig({
  // Jonli-dars API manzili (src/live/liveClient.js): DARS_API_URL env → define; bo'sh → prod dars-api.coddycamp.uz (2026-09-08)
  define: { __DARS_API_URL__: JSON.stringify(process.env.DARS_API_URL || '') },
  plugins: [react()],
  build: {
    outDir: 'dist-m10',
    rollupOptions: {
      input: resolve(__dirname, 'modul10.html'),
    },
  },
})
