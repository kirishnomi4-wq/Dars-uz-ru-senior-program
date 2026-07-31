import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Etalon-test build: faqat etalon-test.html (PmLesson2 + PmUserStory) — coddycamp-etalon-test.vercel.app uchun, chiqish: dist-etalon-test/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-etalon-test',
    rollupOptions: {
      input: resolve(__dirname, 'etalon-test.html'),
    },
  },
})
