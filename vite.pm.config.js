import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// PM-demo build: faqat pm.html (3 PM dars) — alohida Vercel loyihasi uchun, chiqish: dist-pm/
export default defineConfig({
  // Jonli-dars API manzili (src/live/liveClient.js): DARS_API_URL env → define; bo'sh → prod dars-api.coddycamp.uz (2026-09-08)
  define: { __DARS_API_URL__: JSON.stringify(process.env.DARS_API_URL || '') },
  plugins: [react()],
  build: {
    outDir: 'dist-pm',
    rollupOptions: {
      input: resolve(__dirname, 'pm.html'),
    },
  },
})
