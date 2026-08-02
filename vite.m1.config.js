import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// 1+2-Modul demo build: modul1.html (ikkala modul katalogi) — alohida Vercel loyihasi, chiqish: dist-m1/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-m1',
    rollupOptions: {
      input: resolve(__dirname, 'modul1.html'),
    },
  },
})
