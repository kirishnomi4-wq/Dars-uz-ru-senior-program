// Sinf aloqasi INTERNET orqali (Vercel Function + Upstash Redis REST) — ustoz va o'quvchi istalgan tarmoqdan ulanadi (14.11, ulanish A).
// Lokal ishda bu fayl ishlamaydi: u yerda vite.config.js dagi «sinf-aloqa» (/__sinf). Mijoz tomoni — src/dars001/sinf.js (internetAloqa).
// Kerak: Vercel loyihasiga Upstash Redis integratsiyasi (UPSTASH_REDIS_REST_URL/TOKEN yoki KV_REST_API_URL/TOKEN). Kutubxona kerak emas — oddiy fetch.
//   GET  /api/sinf?bor=1                     → { bor: true, redis: true|false }
//   GET  /api/sinf?xona=K&id=I&dan=N         → { n, x: [xabar…] } — N dan keyingi xabarlar (o'ziniki emas); dan=-1 — faqat n
//   POST /api/sinf?xona=K&id=I  (JSON xabar) → 204. «holat» xabari ro'yxatga emas, bitta kalitga yoziladi (eng oxirgisi kerak, katta)
// Xona 6 soatdan keyin o'zi o'chadi.
const R_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
const R_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
const MUDDAT = String(6 * 3600)
const XONA = /^[A-Za-z0-9_-]{3,16}$/
const ID = /^[A-Za-z0-9_-]{1,40}$/
const OXIRGI = 150 // ro'yxatda saqlanadigan kichik xabarlar soni
const KESHSIZ = { 'Cache-Control': 'no-store' }

// INCR va yozish bitta skriptda — tartib buzilmaydi (ikki xabar bir vaqtda kelsa ham raqami va o'rni mos)
const S_XABAR = "local n=redis.call('INCR',KEYS[1]) redis.call('RPUSH',KEYS[2],n..'|'..ARGV[1]..'|'..ARGV[2]) redis.call('LTRIM',KEYS[2],-" + OXIRGI + ",-1) redis.call('EXPIRE',KEYS[1],ARGV[3]) redis.call('EXPIRE',KEYS[2],ARGV[3]) return n"
const S_HOLAT = "local n=redis.call('INCR',KEYS[1]) redis.call('SET',KEYS[2],n..'|'..ARGV[1]..'|'..ARGV[2],'EX',ARGV[3]) redis.call('SET',KEYS[3],n,'EX',ARGV[3]) redis.call('EXPIRE',KEYS[1],ARGV[3]) return n"

async function redis(buyruq) {
  const j = await fetch(R_URL, { method: 'POST', headers: { Authorization: 'Bearer ' + R_TOKEN, 'Content-Type': 'application/json' }, body: JSON.stringify(buyruq) })
  const d = await j.json()
  if (d.error) throw new Error(d.error)
  return d.result
}
async function quvur(buyruqlar) {
  const j = await fetch(R_URL.replace(/\/$/, '') + '/pipeline', { method: 'POST', headers: { Authorization: 'Bearer ' + R_TOKEN, 'Content-Type': 'application/json' }, body: JSON.stringify(buyruqlar) })
  const d = await j.json()
  return d.map((x) => { if (x.error) throw new Error(x.error); return x.result })
}
// «n|kim|json» → { n, kim, matn } (json ichida «|» bo'lishi mumkin — faqat birinchi ikkitasi bo'linadi)
function och(s) {
  const a = s.indexOf('|'), b = s.indexOf('|', a + 1)
  return { n: Number(s.slice(0, a)), kim: s.slice(a + 1, b), matn: s.slice(b + 1) }
}
function oqi(req) {
  const u = new URL(req.url)
  const xona = u.searchParams.get('xona') || '', id = u.searchParams.get('id') || ''
  return { u, xona, id, ok: XONA.test(xona) && ID.test(id), k: 'sinf:' + xona }
}

export async function GET(req) {
  const { u, id, ok, k } = oqi(req)
  if (u.searchParams.has('bor')) return Response.json({ bor: true, redis: !!(R_URL && R_TOKEN) }, { headers: KESHSIZ })
  if (!R_URL || !R_TOKEN) return Response.json({ xato: 'redis yo\'q' }, { status: 503, headers: KESHSIZ })
  if (!ok) return Response.json({ xato: 'xona yoki id' }, { status: 400, headers: KESHSIZ })
  const dan = Number(u.searchParams.get('dan') ?? -1)
  try {
    const [n, hn, royxat] = await quvur([['GET', k + ':n'], ['GET', k + ':hn'], ['LRANGE', k + ':x', String(-OXIRGI), '-1']])
    const eng = Number(n) || 0
    if (!(dan >= 0)) return Response.json({ n: eng, x: [] }, { headers: KESHSIZ })
    const x = []
    for (const s of royxat || []) { const e = och(s); if (e.n > dan && e.kim !== id) x.push(e) }
    if (Number(hn) > dan) { const h = await redis(['GET', k + ':h']); if (h) { const e = och(h); if (e.n > dan && e.kim !== id) x.push(e) } }
    x.sort((a, b) => a.n - b.n)
    return Response.json({ n: eng, x: x.map((e) => JSON.parse(e.matn)) }, { headers: KESHSIZ })
  } catch (e) {
    return Response.json({ xato: String(e.message || e).slice(0, 120) }, { status: 502, headers: KESHSIZ })
  }
}

export async function POST(req) {
  const { ok, id, k } = oqi(req)
  if (!R_URL || !R_TOKEN) return Response.json({ xato: 'redis yo\'q' }, { status: 503, headers: KESHSIZ })
  if (!ok) return Response.json({ xato: 'xona yoki id' }, { status: 400, headers: KESHSIZ })
  const matn = (await req.text()).replace(/[\r\n]/g, '')
  if (!matn || matn.length > 300000) return Response.json({ xato: 'xabar' }, { status: 413, headers: KESHSIZ })
  let m
  try { m = JSON.parse(matn) } catch { return Response.json({ xato: 'json' }, { status: 400, headers: KESHSIZ }) }
  try {
    if (m.t === 'holat') await redis(['EVAL', S_HOLAT, '3', k + ':n', k + ':h', k + ':hn', id, matn, MUDDAT])
    else await redis(['EVAL', S_XABAR, '2', k + ':n', k + ':x', id, matn, MUDDAT])
    return new Response(null, { status: 204, headers: KESHSIZ })
  } catch (e) {
    return Response.json({ xato: String(e.message || e).slice(0, 120) }, { status: 502, headers: KESHSIZ })
  }
}
