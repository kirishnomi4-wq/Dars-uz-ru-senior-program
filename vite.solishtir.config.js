import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Solishtiruv-ko'rik build: faqat solishtir.html (4 dars) — chiqish: dist-solishtir/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-solishtir',
    rollupOptions: {
      input: resolve(__dirname, 'solishtir.html'),
    },
  },
})
