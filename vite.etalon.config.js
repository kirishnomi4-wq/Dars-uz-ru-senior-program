import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Etalon test-build: etalon.html (2 etalon dars: PmLesson2 + PmUserStory) — alohida
// Vercel loyihasi uchun, chiqish: dist-etalon/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-etalon',
    rollupOptions: {
      input: resolve(__dirname, 'etalon.html'),
    },
  },
})
