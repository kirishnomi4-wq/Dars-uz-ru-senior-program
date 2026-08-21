import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// 4-Modul ko'rik-build: modul4.html -> dist-m4/ (alohida Vercel loyihasi)
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-m4',
    rollupOptions: {
      input: resolve(__dirname, 'modul4.html'),
    },
  },
})
