import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { renameSync, existsSync } from 'fs'

// UYGA VAZIFA DEMO — PmLesson2.homework alohida Vercel loyihasi. Chiqish: dist-hw/
// Naqsh: vite.mentor.config.js (input hw-demo.html → chiqishda index.html ga avto-qayta nomlash).
const indexRename = () => ({
  name: 'hw-index-rename',
  closeBundle() {
    const from = resolve(__dirname, 'dist-hw/hw-demo.html')
    const to = resolve(__dirname, 'dist-hw/index.html')
    if (existsSync(from)) {
      renameSync(from, to)
      console.log('\n  hw-demo.html → index.html (Vercel ildizi uchun)')
    }
  },
})

export default defineConfig({
  plugins: [react(), indexRename()],
  build: {
    outDir: 'dist-hw',
    rollupOptions: {
      input: resolve(__dirname, 'hw-demo.html'),
    },
  },
})
