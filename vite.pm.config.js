import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// PM-demo build: faqat pm.html (3 PM dars) — alohida Vercel loyihasi uchun, chiqish: dist-pm/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-pm',
    rollupOptions: {
      input: resolve(__dirname, 'pm.html'),
    },
  },
})
