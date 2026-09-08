import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Etalon-test build: faqat etalon-test.html (PmLesson2 + PmUserStory) — coddycamp-etalon-test.vercel.app uchun, chiqish: dist-etalon-test/
export default defineConfig({
  // Jonli-dars API manzili (src/live/liveClient.js): DARS_API_URL env → define; bo'sh → prod dars-api.coddycamp.uz (2026-09-08)
  define: { __DARS_API_URL__: JSON.stringify(process.env.DARS_API_URL || '') },
  plugins: [react()],
  build: {
    outDir: 'dist-etalon-test',
    rollupOptions: {
      input: resolve(__dirname, 'etalon-test.html'),
    },
  },
})
