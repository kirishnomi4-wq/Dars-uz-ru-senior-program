import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// 3+4-Modul demo build: modul34.html — alohida Vercel loyihasi, chiqish: dist-m34/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-m34',
    rollupOptions: {
      input: resolve(__dirname, 'modul34.html'),
    },
  },
})
