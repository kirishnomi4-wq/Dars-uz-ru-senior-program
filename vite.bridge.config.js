import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { renameSync, existsSync, writeFileSync } from 'fs'

// BRIDGE (O'TISH) DARSLARI — Web Senior → AI Startup o'rtadan qo'shilgan o'quvchi uchun 7 PM dars.
// Alohida Vercel loyihasi, chiqish: dist-bridge/. LMS'siz; jonli ball — eski Supabase.
//
// Jonli-ball transporti: src/live/ ichidagi './liveClient.js' importi src/bridge/liveClientSupabase.js ga
// yo'naltiriladi (interfeys aynan bir xil). Umumiy src/live/ fayllari, LMS yig'malari va mentor sayti o'zgarmaydi.
const BRIDGE_LIVE = resolve(__dirname, 'src/bridge/liveClientSupabase.js')
const liveToSupabase = () => ({
  name: 'bridge-live-supabase',
  enforce: 'pre',
  resolveId(source, importer) {
    if (source === './liveClient.js' && importer && importer.replace(/\\/g, '/').includes('/src/live/')) return BRIDGE_LIVE
    return null
  },
})
const indexRename = () => ({
  name: 'bridge-index-rename',
  closeBundle() {
    const from = resolve(__dirname, 'dist-bridge/bridge.html')
    const to = resolve(__dirname, 'dist-bridge/index.html')
    if (existsSync(from)) { renameSync(from, to); console.log('\n  bridge.html → index.html (Vercel ildizi uchun)') }
    // Har o'tish manzili (/1…/4) ham shu sahifani ochadi — mavjud fayllar (assets/…) o'zgarmay beriladi.
    writeFileSync(resolve(__dirname, 'dist-bridge/vercel.json'), JSON.stringify({ rewrites: [{ source: '/:n([1-9])', destination: '/index.html' }, { source: '/:n([1-9])/', destination: '/index.html' }] }, null, 2))
  },
})

export default defineConfig({
  plugins: [liveToSupabase(), react(), indexRename()],
  build: {
    outDir: 'dist-bridge',
    rollupOptions: { input: resolve(__dirname, 'bridge.html') },
  },
})
