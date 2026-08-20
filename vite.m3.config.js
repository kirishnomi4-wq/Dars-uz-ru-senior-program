import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// 3-Modul ko'rik-build: modul3.html -> dist-m3/ (alohida Vercel loyihasi)
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-m3',
    rollupOptions: {
      input: resolve(__dirname, 'modul3.html'),
    },
  },
})
