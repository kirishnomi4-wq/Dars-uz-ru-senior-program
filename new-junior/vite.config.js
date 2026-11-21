import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'

// New Junior — alohida sayt. Ildiz = shu papka; AI Startup sahifalari bu yig'maga kirmaydi.
// Ishga tushirish (loyiha ildizidan): npx vite --config new-junior/vite.config.js
const ildiz = fileURLToPath(new URL('.', import.meta.url))

// «Sinf aloqasi»: ustoz va o'quvchi oynalari orasidagi xabar tashuvchi (lokal ko'rik uchun; haqiqiy server keyin — KONSEPSIYA 9-qaror).
// Hech narsani saqlamaydi va tushunmaydi: bitta xonadagi oynadan kelgan xabarni o'sha xonadagi qolgan oynalarga uzatadi.
// Shu tufayli dars ikki XIL brauzerda (masalan, Chrome va Firefox) yoki ikki kompyuterda ochilsa ham birga yuradi.
//   GET  /__sinf/oqim?xona=..&id=..   — oynaga keladigan xabarlar oqimi (SSE)
//   POST /__sinf/yubor?xona=..&id=..  — oynadan ketadigan xabar (JSON)
// Oyna yopilsa, qolganlarga { t: 'ketdi', kim } yuboriladi.
function sinfAloqa() {
  const xonalar = new Map() // xona → Map(oyna belgisi → javob oqimi)
  const ishlov = (req, res, next) => {
    if (!req.url || !req.url.startsWith('/__sinf/')) return next()
    const u = new URL(req.url, 'http://lokal')
    const xona = u.searchParams.get('xona') || 'sinf', id = u.searchParams.get('id') || ''
    if (!xonalar.has(xona)) xonalar.set(xona, new Map())
    const oynalar = xonalar.get(xona)
    const uzat = (kimdan, matn) => { for (const [k, r] of oynalar) if (k !== kimdan) r.write('data: ' + matn + '\n\n') }
    if (u.pathname === '/__sinf/oqim' && id) {
      res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache, no-transform', Connection: 'keep-alive' })
      res.write('retry: 1000\n\n')
      oynalar.set(id, res)
      const yurak = setInterval(() => res.write(': tirik\n\n'), 20000)
      req.on('close', () => {
        clearInterval(yurak)
        if (oynalar.get(id) !== res) return
        oynalar.delete(id); uzat(id, JSON.stringify({ t: 'ketdi', kim: id }))
      })
      return
    }
    if (u.pathname === '/__sinf/yubor' && req.method === 'POST') {
      let tana = ''
      req.on('data', (b) => { tana += b; if (tana.length > 300000) req.destroy() })
      req.on('end', () => { uzat(id, tana.replace(/[\r\n]/g, '')); res.writeHead(204); res.end() })
      return
    }
    // dars eshigi so'raydi: sinf serveri bormi (statik saytda — masalan Vercel'da — bu yo'l yo'q, ikki noutbuk ulanmaydi)
    if (u.pathname === '/__sinf/bor') { res.writeHead(200, { 'Content-Type': 'text/plain' }); res.end('ha'); return }
    res.writeHead(404); res.end()
  }
  return {
    name: 'sinf-aloqa',
    configureServer(server) { server.middlewares.use(ishlov) },
    configurePreviewServer(server) { server.middlewares.use(ishlov) },
  }
}

export default defineConfig({
  root: ildiz,
  plugins: [react(), sinfAloqa()],
  server: { port: 5340 },
  build: { outDir: 'dist', emptyOutDir: true },
})
