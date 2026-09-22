import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { renameSync, existsSync } from 'fs'

// UYGA VAZIFA — QA KO'RIK SAYTI. Alohida Vercel loyihasi, chiqish: dist-hwqa/
// Kontent manbasi: src/hw-qa/data.js (npm run gen:hwqa bilan qayta yig'iladi).
//
// `input` sifatida hw-qa.html berilgani uchun Vite chiqishga ham hw-qa.html yozadi,
// Vercel esa ildizda index.html kutadi — shuning uchun qayta nomlash avtomatlashtirilgan
// (naqsh: vite.mentor.config.js).
const indexRename = () => ({
  name: 'hwqa-index-rename',
  closeBundle() {
    const from = resolve(__dirname, 'dist-hwqa/hw-qa.html')
    const to = resolve(__dirname, 'dist-hwqa/index.html')
    if (existsSync(from)) {
      renameSync(from, to)
      console.log('\n  hw-qa.html → index.html (Vercel ildizi uchun)')
    }
  },
})

export default defineConfig({
  plugins: [react(), indexRename()],
  build: {
    outDir: 'dist-hwqa',
    rollupOptions: {
      input: resolve(__dirname, 'hw-qa.html'),
    },
  },
})
