import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// «Internet qanday ishlaydi» QA-build: internet.html -> dist-internet/ (bitta dars, LMS emas) (alohida Vercel loyihasi internet-nima)
export default defineConfig({
  // Jonli-dars API manzili (src/live/liveClient.js): DARS_API_URL env → define; bo'sh → prod dars-api.coddycamp.uz (2026-09-08)
  define: { __DARS_API_URL__: JSON.stringify(process.env.DARS_API_URL || '') },
  plugins: [react()],
  build: {
    outDir: 'dist-internet',
    rollupOptions: {
      input: resolve(__dirname, 'internet.html'),
    },
  },
})
