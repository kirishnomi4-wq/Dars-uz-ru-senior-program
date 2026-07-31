import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Texnik darslar demo build: faqat texnik.html (1–6 modul, Kod+Proyekt) — alohida Vercel loyihasi, chiqish: dist-texnik/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-texnik',
    rollupOptions: {
      input: resolve(__dirname, 'texnik.html'),
    },
  },
})
