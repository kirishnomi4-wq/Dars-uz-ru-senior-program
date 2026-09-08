import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Texnik darslar demo build: faqat texnik.html (1–6 modul, Kod+Proyekt) — alohida Vercel loyihasi, chiqish: dist-texnik/
export default defineConfig({
  // Jonli-dars API manzili (src/live/liveClient.js): DARS_API_URL env → define; bo'sh → prod dars-api.coddycamp.uz (2026-09-08)
  define: { __DARS_API_URL__: JSON.stringify(process.env.DARS_API_URL || '') },
  plugins: [react()],
  build: {
    outDir: 'dist-texnik',
    rollupOptions: {
      input: resolve(__dirname, 'texnik.html'),
    },
  },
})
