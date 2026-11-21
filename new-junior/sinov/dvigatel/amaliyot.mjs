// Amaliyot sinovi (6-dars, 20.11): manba 006-amaliyot «Topshiriqlar» jadvalidagi har yechim va xato varianti 6-darsning HAQIQIY ekranlarida
// (demo-006.html) yuriladi va shu fayldagi MUSTAQIL simulyatsiya bilan solishtiriladi (dvigatel kodidan foydalanmaydi).
// Yana: kechiktirilgan «Maslahat» (qulf → birinchi ishga tushirishdan keyin ochiladi), chegara (6-darsdagi «Joy qolmadi!» ishorasi), huk kartalari,
// 15 · 3 — bola pog'onasida tayyor dastur, ★ sharti (go to ham, repeat ham).
// Ishlatish (lokal server 5340 yoniq, demo-006 yig'ilgan):  node new-junior/sinov/dvigatel/amaliyot.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-006.html', W = 7, H = 5
const D = { r: [1, 0], l: [-1, 0], u: [0, 1], d: [0, -1] }
// dastur yozuvi: 'p5[r]' — repeat 5 ichida move right; 'g5,2' — go to x: 5 y: 2; oddiy harflar — move
const pars = (s) => [...s.matchAll(/p(\d+)\[([rlud]*)\]|g(\d),(\d)|[rlud]/g)].map((m) => (m[1] ? { t: 'p', m: m[1], ichki: [...m[2]].map((t) => ({ t })) } : m[3] ? { t: 'x', m: m[3] + ',' + m[4] } : { t: m[0] }))
const ochil = (d) => d.flatMap((x) => (x.t === 'p' ? Array.from({ length: +x.m }, () => x.ichki.map((y) => y.t)).flat() : [x.t === 'x' ? 'x' + x.m : x.t]))
// yol — qahramon qo'ngan kataklar (go to — faqat qo'ngan katak)
function sim(start, d) { let [x, y] = start; const yol = [[x, y]]; for (const t of ochil(d)) { if (t[0] === 'x') { [x, y] = t.slice(1).split(',').map(Number); yol.push([x, y]); continue } const nx = x + D[t][0], ny = y + D[t][1]; if (nx < 0 || ny < 0 || nx >= W || ny >= H) return { x, y, yol, chet: true }; x = nx; y = ny; yol.push([x, y]) } return { x, y, yol, chet: false } }
const Y = (p) => '(' + p[0] + ', ' + p[1] + ')', teng = (a, b) => a[0] === b[0] && a[1] === b[1], k = (p) => p.join()
// manba: topshiriqlar (start, yulduz, olmalar, rasm — rasm yechimidan yuriladi)
const yolK = (start, s) => { const r = []; for (const p of sim(start, pars(s)).yol) if (!r.some((q) => teng(q, p))) r.push(p); return r }
const T = {
  B1A: { start: [0, 0], yulduz: [2, 2], olma: [[0, 2]], otib: true }, B1B: { start: [0, 0], yulduz: [6, 4], olma: [], otib: true },
  B1C: { start: [0, 0], yulduz: [4, 4], olma: [[2, 4], [3, 4]], otib: true }, B1Y: { start: [0, 0], yulduz: [2, 4], olma: [[3, 0], [6, 2]], otib: true },
  B2A: { start: [0, 2], rasm: yolK([0, 2], 'p6[r]') }, B2B: { start: [0, 0], rasm: yolK([0, 0], 'p3[r] p2[u] p3[l] p2[d]') },
  B2C: { start: [2, 0], rasm: yolK([2, 0], 'urrurr') }, B2Y: { start: [2, 0], rasm: yolK([2, 0], 'uurddruurddr') },
  B3A: { start: [0, 0], yulduz: [3, 4], olma: [[3, 1], [3, 2], [3, 3]], otib: true }, B3B: { start: [0, 0], rasm: yolK([0, 0], 'p3[r] g0,2 p3[r]') },
  B3C: { start: [0, 0], yulduz: [5, 0], olma: [[5, 2], [5, 1]] }, B3Y: { start: [0, 0], erkin: true },
}
const CHET = 'Qahramon shu blokda to‘xtadi. Son va yo‘nalishni tekshiring'
// mustaqil baho (manba «Yordam va xato» jadvali) → [muammocha, ishora]
function kut(id, s) {
  const t = T[id], d = pars(s), r = sim(t.start, d), joy = [r.x, r.y]
  if (r.chet) return ['kamvoy:Maydon tugadi!', id === 'B3C' ? 'Qahramon shu blokda to‘xtadi. Bloklar tartibini tekshiring' : CHET]
  if (t.erkin) return d.some((x) => x.t === 'x') && d.some((x) => x.t === 'p' && x.ichki.length) ? ['', 'Rasmingiz tayyor!'] : ['kamvoy:Oz qoldi!', 'Dasturda go to ham, repeat ham bo‘lsin']
  if (t.rasm) {
    const chiq = r.yol.find((p) => !t.rasm.some((q) => teng(q, p)))
    if (chiq) return ['ortiqvoy:Rasmdan chiqdi!', 'Qahramon ' + Y(chiq) + ' ga chiqdi — u kulrang emas. Kerak bo‘lsa — sakrang']
    const qol = t.rasm.filter((q) => !r.yol.some((p) => teng(p, q)))
    if (qol.length) { const m = (q) => Math.abs(q[0] - r.x) + Math.abs(q[1] - r.y); const e = qol.reduce((a, q) => (m(q) < m(a) ? q : a)); return ['kamvoy:Oz qoldi!', 'Kulrang katak qoldi — ' + Y(e) + '. Son va yo‘nalishni tekshiring'] }
    return ['', /B2C|B2Y/.test(id) ? 'Qisqartirdingiz!' : 'Rasm tayyor!']
  }
  const qoldi = t.olma.filter((q) => !r.yol.some((p) => teng(p, q)))
  if (qoldi.length) return ['kamvoy:Olma qoldi-ku!', 'Avval olmaga boring — u ' + Y(qoldi[0]) + ' da']
  if (teng(joy, t.yulduz)) return ['', 'Yetib bordi!']
  if (t.otib && r.yol.some((p) => teng(p, t.yulduz))) return ['ortiqvoy:Ko‘payib ketdi!', 'Qahramon yulduzdan o‘tib ketdi — oxirgi blokni tekshiring']
  return ['kamvoy:Yulduz bu yerda emas!', 'Qahramon ' + Y(joy) + ' da. Yulduzning manzilini o‘qing']
}
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }), xato = []
const p = await (await b.newContext({ viewport: { width: 1440, height: 810 } })).newPage()
p.on('pageerror', (e) => xato.push(e.message)); p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) xato.push(m.text()) })
let ok = 0, jami = 0
const tek = (nom, shart, iz = '') => { jami++; if (shart) ok++; console.log((shart ? '✓ ' : '✗ ') + nom + (shart || !iz ? '' : '  — ' + iz)) }
await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'momiq') })
await p.goto(U + '?rol=bola&xona=amaliyot-sinov'); await p.waitForTimeout(900)
await p.evaluate(() => { bolaKeyingi = () => {}; window.__ijroAsl = ijro; ijro = (d, f, op) => window.__ijroAsl(d, f, { ...(op || {}), kut: 90 }) })
const och = (id) => p.evaluate((id) => { const il = document.getElementById('ilova'), bola = id[0] === 'B'; il.innerHTML = bola ? '<div id="bol">' + ekran(id, null, true) + '</div>' : '<div id="ust">' + ekran(id) + '</div>'; studiyaTayyorla(il.firstChild); il.querySelectorAll('.dv-muam,.konfeti').forEach((x) => x.remove()) }, id).then(() => p.waitForTimeout(300))
const qur = (s) => p.evaluate((d) => { const ek = document.querySelector('#ilova .ekran'); blQur(ek, d); sanoq(ek) }, pars(s))
const ishga = async () => { await p.evaluate(() => ishgaTushir(document.querySelector('#ilova .ekran'))); await p.waitForFunction(() => !document.querySelector('#ilova .ekran').dataset.yuryapti, null, { timeout: 20000 }); await p.waitForTimeout(250) }
const korin = () => p.evaluate(() => {
  const ek = document.querySelector('#ilova .ekran'), mu = ek.querySelector('.dv-muam')
  return { muam: mu ? (mu.className.match(/m-(\w+)/) || [])[1] + ':' + mu.textContent.trim() : '', ishora: (ek.querySelector('.hn .hint') || {}).textContent || '', konfeti: !!ek.querySelector('.oyna .konfeti'), dsn: (ek.querySelector('.dsn') || {}).textContent || '', qulf: !!ek.querySelector('.hn .mas.qulf') }
})
const javon = async (f, nom) => { await p.click('#ilova .rg .rd.f-' + f); await p.waitForTimeout(100); await p.locator('#ilova .pl .mbw:not(.yopiq) .mb', { hasText: nom }).first().click(); await p.waitForTimeout(150) }

// 1) kechiktirilgan Maslahat
await och('B1A'); let r = await korin()
tek('B1A ochildi: «Maslahat» qulf bilan; «0 / 4 ta blok»', r.qulf && r.dsn === '0 / 4 ta blok', JSON.stringify(r))
await p.click('#ilova .hn .mas'); r = await korin()
tek('qulfli «Maslahat» bosildi — «Avval bir marta ishga tushiring»', r.ishora === 'Avval bir marta ishga tushiring', r.ishora)
await qur('rr'); await ishga(); await p.click('#ilova .hn .mas'); r = await korin()
tek('bir ishga tushirgandan keyin ochildi — manbadagi maslahat', !r.qulf && r.ishora === 'Olma yo‘lda — avval olmaga boring', JSON.stringify(r))
// 2) javon: go to va repeat birga; chegara 1 (B1B)
await och('B1B'); await javon('h', 'go to'); await javon('h', 'move right'); r = await korin()
tek('B1B chegara 1: ikkinchi blok qo‘shilmadi — Ortiqvoy «Joy qolmadi!», 6-darsdagi ishora', r.dsn === '1 / 1 ta blok' && r.muam === 'ortiqvoy:Joy qolmadi!' && r.ishora === 'Dasturga 1 ta blok sig‘adi. Boshqa blok tanlang', JSON.stringify(r))
// 3) yechimlar va xato variantlari (manba jadvali)
const ISH = [
  ['B1A', 'uurr'], ['B1A', 'rruu'], ['B1A', 'uurrr'], ['B1B', 'g6,4'], ['B1B', 'g6,3'],
  ['B1C', 'g2,4 r r'], ['B1C', 'g2,4 g3,4 g4,4'], ['B1C', 'g4,4'], ['B1Y', 'g3,0 g6,2 g2,4'], ['B1Y', 'g3,0 g2,4 g6,2'],
  ['B2A', 'p6[r]'], ['B2A', 'p7[r]'], ['B2A', 'p5[r]'], ['B2B', 'p3[r] p2[u] p3[l] p2[d]'], ['B2B', 'p2[u] p3[r] p2[d] p3[l]'], ['B2B', 'p3[r] p3[u]'],
  ['B2C', 'p2[urr]'], ['B2C', 'p2[rru]'], ['B2Y', 'p2[uurddr]'],
  ['B3A', 'g3,1 p3[u]'], ['B3A', 'g3,0 p4[u]'], ['B3A', 'g3,1 p4[u]'], ['B3B', 'p3[r] g0,2 p3[r]'], ['B3B', 'p3[r] g3,2 p3[l]'], ['B3B', 'p3[r] p2[u] p3[l]'],
  ['B3C', 'g5,3 p3[d]'], ['B3C', 'g5,2 p2[d]'], ['B3Y', 'p2[rru] g5,0 p3[u]'], ['B3Y', 'p3[r]'], ['B3Y', 'g2,2'],
]
for (const [id, s] of ISH) {
  await och(id); await qur(s); await ishga(); r = await korin()
  const [m, i] = kut(id, s), yaxshi = !m
  tek((id + ' ' + s).padEnd(30) + ' → ' + (m || 'tayyor') + ' · ' + i, r.muam === m && r.ishora === i && r.konfeti === yaxshi, JSON.stringify(r))
}
// 4) 15 · 3: bola pog'onasida tayyor dastur — o'zi ishga tushiradi: birinchi blokda chet
await och('B3C'); r = await korin()
tek('B3C: tayyor dastur Blockly’da — «3 / 3 ta blok»', r.dsn === '3 / 3 ta blok', r.dsn)
await ishga(); r = await korin()
tek('B3C tayyor dastur → Kamvoy «Maydon tugadi!», «Bloklar tartibini tekshiring»', r.muam === 'kamvoy:Maydon tugadi!' && r.ishora === 'Qahramon shu blokda to‘xtadi. Bloklar tartibini tekshiring', JSON.stringify(r))
// 5) huk: A sig'madi, B olmalar qoldi, C yetdi
await och('P2S'); await p.waitForFunction(() => document.querySelectorAll('#ilova .jk .jn').length >= 1, null, { timeout: 20000 }).catch(() => {})
for (let n = 2; n <= 3; n++) { await p.waitForFunction(() => !document.querySelector('#ilova .ekran').dataset.yuryapti, null, { timeout: 20000 }); await p.click('#ilova .hn .asos'); await p.waitForFunction((n) => document.querySelectorAll('#ilova .jk .jn').length >= n && !document.querySelector('#ilova .ekran').dataset.yuryapti, n, { timeout: 25000 }).catch(() => {}) }
const huk = await p.evaluate(() => [...document.querySelectorAll('#ilova .jk .jn')].map((x) => x.textContent).join(' | '))
tek('huk: A «✕ sig‘madi: 4 ta blok», B «✕ olmalar qoldi», C «✓ 3 ta blok»', huk === '✕ sig‘madi: 4 ta blok | ✕ olmalar qoldi | ✓ 3 ta blok', huk)
tek('konsolda xato yo‘q', !xato.length, xato.slice(0, 3).join(' | '))
console.log(`\n${ok} / ${jami} — ${ok === jami ? 'HAMMASI TO‘G‘RI' : 'XATO BOR'}`)
await b.close(); process.exit(ok === jami ? 0 : 1)
