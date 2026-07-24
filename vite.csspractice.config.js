import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// CSS Praktika solo build: faqat css-praktika.html — alohida Vercel loyihasi, chiqish: dist-csspractice/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-csspractice',
    rollupOptions: {
      input: resolve(__dirname, 'css-praktika.html'),
    },
  },
})
