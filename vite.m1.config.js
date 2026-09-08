import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// 1+2-Modul demo build: modul1.html (ikkala modul katalogi) — alohida Vercel loyihasi, chiqish: dist-m1/
export default defineConfig({
  // Jonli-dars API manzili (src/live/liveClient.js): DARS_API_URL env → define; bo'sh → prod dars-api.coddycamp.uz (2026-09-08)
  define: { __DARS_API_URL__: JSON.stringify(process.env.DARS_API_URL || '') },
  plugins: [react()],
  build: {
    outDir: 'dist-m1',
    rollupOptions: {
      input: resolve(__dirname, 'modul1.html'),
    },
  },
})
