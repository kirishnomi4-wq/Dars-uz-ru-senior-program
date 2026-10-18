import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// MUSTAQIL NUSXA: o'z ildizi va o'z dist/ papkasi. Asosiy loyihaning configlariga bog'liq emas.
// Build: npx vite build --config mustaqil/internet-dars/vite.config.js  (repo ildizidan)
export default defineConfig({
  root: __dirname,
  plugins: [react()],
  build: { outDir: 'dist', emptyOutDir: true },
})
