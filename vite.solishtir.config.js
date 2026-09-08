import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Solishtiruv-ko'rik build: faqat solishtir.html (4 dars) — chiqish: dist-solishtir/
export default defineConfig({
  // Jonli-dars API manzili (src/live/liveClient.js): DARS_API_URL env → define; bo'sh → prod dars-api.coddycamp.uz (2026-09-08)
  define: { __DARS_API_URL__: JSON.stringify(process.env.DARS_API_URL || '') },
  plugins: [react()],
  build: {
    outDir: 'dist-solishtir',
    rollupOptions: {
      input: resolve(__dirname, 'solishtir.html'),
    },
  },
})
