import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Etalon test-build: etalon.html (2 etalon dars: PmLesson2 + PmUserStory) — alohida
// Vercel loyihasi uchun, chiqish: dist-etalon/
export default defineConfig({
  // Jonli-dars API manzili (src/live/liveClient.js): DARS_API_URL env → define; bo'sh → prod dars-api.coddycamp.uz (2026-09-08)
  define: { __DARS_API_URL__: JSON.stringify(process.env.DARS_API_URL || '') },
  plugins: [react()],
  build: {
    outDir: 'dist-etalon',
    rollupOptions: {
      input: resolve(__dirname, 'etalon.html'),
    },
  },
})
