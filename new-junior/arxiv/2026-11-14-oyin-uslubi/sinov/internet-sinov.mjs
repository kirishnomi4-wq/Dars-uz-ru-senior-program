// Internet orqali ulanishni (api/sinf.mjs) Vercel va Upstash'siz, lokal sinash uchun server.
// Bitta portda: yig'ma sayt (new-junior/dist) + /api/sinf (funksiyaning o'zi, Vercel'dagidek chaqiriladi) + xotiradagi «Upstash» o'xshatmasi.
// Lokal sinf serveri (/__sinf) yo'q — dars xuddi Vercel'dagidek internet yo'liga o'tadi. Keyin oddiy sinovlar shu manzilga yurgiziladi.
// Upstash ulanmagan holatni ko'rish: oxiriga --redissiz.
// Buyruq (loyiha ildizidan): npx vite build --config new-junior/vite.config.js && node new-junior/sinov/internet-sinov.mjs 5360
//   so'ng: node new-junior/sinov/ikki-brauzer.mjs "http://localhost:5360"
import http from 'node:http'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const PORT = Number(process.argv[2] || 5360)
const REDISSIZ = process.argv.includes('--redissiz') // Upstash ulanmagan holat (Vercel'ga integratsiya qo'shilmaguncha): eshik buni aytishi kerak
const ILDIZ = fileURLToPath(new URL('..', import.meta.url))
const DIST = path.join(ILDIZ, 'dist')

// --- Upstash REST o'xshatmasi (faqat funksiya ishlatadigan buyruqlar) ---
const kv = new Map() // kalit -> qiymat (satr yoki ro'yxat)
const bajar = ([b, ...a]) => {
  b = String(b).toUpperCase()
  if (b === 'GET') return kv.has(a[0]) ? String(kv.get(a[0])) : null
  if (b === 'SET') { kv.set(a[0], String(a[1])); return 'OK' }
  if (b === 'INCR') { const n = Number(kv.get(a[0]) || 0) + 1; kv.set(a[0], String(n)); return n }
  if (b === 'RPUSH') { const l = kv.get(a[0]) || []; l.push(...a.slice(1).map(String)); kv.set(a[0], l); return l.length }
  if (b === 'LTRIM') { const l = kv.get(a[0]) || []; const s = Number(a[1]) < 0 ? Math.max(0, l.length + Number(a[1])) : Number(a[1]); kv.set(a[0], l.slice(s)); return 'OK' }
  if (b === 'LRANGE') { const l = kv.get(a[0]) || []; const s = Number(a[1]) < 0 ? Math.max(0, l.length + Number(a[1])) : Number(a[1]); return l.slice(s) }
  if (b === 'EXPIRE') return 1
  if (b === 'EVAL') {
    // funksiyadagi ikki skript: xabar (INCR + RPUSH + LTRIM) yoki holat (INCR + SET + SET)
    const [skript, nk, ...qolgan] = a
    const kalitlar = qolgan.slice(0, Number(nk)), arg = qolgan.slice(Number(nk))
    const n = bajar(['INCR', kalitlar[0]])
    if (skript.includes("'RPUSH'")) { bajar(['RPUSH', kalitlar[1], n + '|' + arg[0] + '|' + arg[1]]); bajar(['LTRIM', kalitlar[1], '-150', '-1']) }
    else { bajar(['SET', kalitlar[1], n + '|' + arg[0] + '|' + arg[1]]); bajar(['SET', kalitlar[2], String(n)]) }
    return n
  }
  throw new Error('nomaʼlum buyruq ' + b)
}
const upstash = http.createServer(async (req, res) => {
  let t = ''; for await (const c of req) t += c
  try {
    const d = JSON.parse(t)
    const javob = req.url.startsWith('/pipeline') ? d.map((x) => { try { return { result: bajar(x) } } catch (e) { return { error: e.message } } }) : { result: bajar(d) }
    res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(javob))
  } catch (e) { res.writeHead(400); res.end(JSON.stringify({ error: e.message })) }
})
await new Promise((r) => upstash.listen(0, '127.0.0.1', r))
if (!REDISSIZ) {
  process.env.UPSTASH_REDIS_REST_URL = 'http://127.0.0.1:' + upstash.address().port
  process.env.UPSTASH_REDIS_REST_TOKEN = 'sinov'
}
const fn = await import(path.join(ILDIZ, 'api', 'sinf.mjs'))

// --- sayt va funksiya ---
const TUR = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.mp3': 'audio/mpeg', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp' }
http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://localhost')
  if (u.pathname === '/api/sinf') {
    let tana = null
    if (req.method === 'POST') { const b = []; for await (const c of req) b.push(c); tana = Buffer.concat(b) }
    const javob = await fn[req.method === 'POST' ? 'POST' : 'GET'](new Request('http://localhost' + req.url, { method: req.method, headers: req.headers, body: tana }))
    res.writeHead(javob.status, Object.fromEntries(javob.headers)); res.end(Buffer.from(await javob.arrayBuffer()))
    return
  }
  const fayl = path.join(DIST, u.pathname === '/' ? 'index.html' : decodeURIComponent(u.pathname))
  if (!fayl.startsWith(DIST)) { res.writeHead(403); res.end(); return }
  try { const d = await readFile(fayl); res.writeHead(200, { 'Content-Type': TUR[path.extname(fayl)] || 'application/octet-stream' }); res.end(d) }
  catch { res.writeHead(404); res.end() }
}).listen(PORT, () => console.log(`internet sinovi: http://localhost:${PORT} (Upstash o'xshatmasi ${process.env.UPSTASH_REDIS_REST_URL})`))
