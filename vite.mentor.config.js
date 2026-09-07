import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { renameSync, existsSync } from 'fs'

// MENTOR YUZASI — LMS ishlamay qolganda dars o'tiladigan zaxira sayt.
// 5 modul (2→6), UZ/RU. Alohida Vercel loyihasi, chiqish: dist-mentor/
//
// `input` sifatida mentor.html berilgani uchun Vite chiqishga ham mentor.html yozadi,
// Vercel esa ildizda index.html kutadi. Oldingi demolarda buni QO'LDA tiklashardi va
// unutilib qolardi — shuning uchun bu yerda qayta nomlash avtomatlashtirilgan.
const indexRename = () => ({
  name: 'mentor-index-rename',
  closeBundle() {
    const from = resolve(__dirname, 'dist-mentor/mentor.html')
    const to = resolve(__dirname, 'dist-mentor/index.html')
    if (existsSync(from)) {
      renameSync(from, to)
      console.log('\n  mentor.html → index.html (Vercel ildizi uchun)')
    }
  },
})

export default defineConfig({
  plugins: [react(), indexRename()],
  build: {
    outDir: 'dist-mentor',
    rollupOptions: {
      input: resolve(__dirname, 'mentor.html'),
    },
  },
})
