import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
// Jon va qadam sinovi (12-dars, 21.11): manba 012 «Topshiriqlar» jadvalidagi har da'vo — avval shu fayldagi MUSTAQIL simulyatorda (dvigatel kodisiz):
// kaktusga tegmagan eng qisqa yo'l (kaktus — devor, BFS + olmalar tartibi), har yechim va xato variantida o'yin qaysi bosishda tugashi, yakuniy ball, jon, qadam;
// bezak kataklari; bosish tartibi: strelka (yurish yoki kaktusga tegish → tegish dasturchasi) → istalgan tugma → yulduz tekshiruvi.
// 2-qism — o'sha jadvallar 12-darsning HAQIQIY ekranlarida (demo-012: Blockly, kaktus, shart, game over, istalgan tugma, klaviatura).
// Ishlatish (lokal server 5340 yoniq, demo-012 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/dvigatel/jon.mjs
let ok = 0, jami = 0
const tek = (nom, shart, iz = '') => { jami++; if (shart) ok++; console.log((shart ? '✓ ' : '✗ ') + nom + (shart || !iz ? '' : '  — ' + iz)) }
const BEZAK = [[1, 1], [4, 3], [6, 1], [0, 4], [2, 3], [5, 4], [6, 3], [1, 2]]
const W = 7, H = 5, K = (p) => p[0] + ',' + p[1]
const ichida = ([x, y]) => x >= 0 && y >= 0 && x < W && y < H
// kaktusga tegmagan eng qisqa masofa (BFS)
function bfs(a, b, kak) { const ks = new Set(kak.map(K)), q = [[a, 0]], kor = new Set([K(a)]); while (q.length) { const [p, d] = q.shift(); if (K(p) === K(b)) return d; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const n = [p[0] + dx, p[1] + dy]; if (ichida(n) && !ks.has(K(n)) && !kor.has(K(n))) { kor.add(K(n)); q.push([n, d + 1]) } } } return Infinity }
function engQisqa(s, nuq, y, kak) { let eng = Infinity; const perm = (q, j, d) => { if (d >= eng) return; if (!q.length) { eng = Math.min(eng, d + (y ? bfs(j, y, kak) : 0)); return } q.forEach((n, i) => perm(q.filter((_, k) => k !== i), n, d + bfs(j, n, kak))) }; perm(nuq, s, 0); return eng }
// o'yin simulyatori: dastur — { start: {ozg: son}, olma: [[ozg, n]…], oltin: […], kaktus: [['c', ozg, n] | ['if', ozg, n, 'go'] | ['go']], har: (istalgan tugma) [...] }
// bosishlar — strelkalar; natija: { tugadi: bosish | null, yutdi, v, tegish }
function oyna(m, d, bosish) {
  const v = { ball: 0, jon: 0, qadam: 0 }; for (const k in d.start || {}) v[k] = d.start[k]
  let [x, y] = m.s, teg = 0; const ol = new Set(), jamiO = m.o.length + (m.g || []).length
  const ijro = (r) => { for (const b of r || []) { if (b[0] === 'c') v[b[1]] += b[2]; if (b[0] === 'go') return 'go'; if (b[0] === 'if' && v[b[1]] === b[2]) { const z = ijro(b[3]); if (z) return z } } return '' }
  const D = { '→': [1, 0], '←': [-1, 0], '↑': [0, 1], '↓': [0, -1] }
  for (let i = 0; i < bosish.length; i++) {
    const [dx, dy] = D[bosish[i]], n = [x + dx, y + dy]
    if (!ichida(n)) { /* chet — turtiladi */ } else if ((m.k || []).some((k) => K(k) === K(n))) { teg++; if (ijro(d.kaktus) === 'go') return { tugadi: i + 1, yutdi: false, v, teg } } else {
      x = n[0]; y = n[1]
      if (m.o.some((o) => K(o) === K(n)) && !ol.has(K(n))) { ol.add(K(n)); if (ijro(d.olma) === 'go') return { tugadi: i + 1, yutdi: false, v, teg } }
      if ((m.g || []).some((o) => K(o) === K(n)) && !ol.has(K(n))) { ol.add(K(n)); if (ijro(d.oltin) === 'go') return { tugadi: i + 1, yutdi: false, v, teg } }
    }
    if (ijro(d.har) === 'go') return { tugadi: i + 1, yutdi: false, v, teg }
    if (m.y && ol.size === jamiO && x === m.y[0] && y === m.y[1]) return { tugadi: null, yutdi: true, bosish: i + 1, v, teg }
  }
  return { tugadi: null, yutdi: false, v, teg }
}
// eng qisqa yo'lning bosishlari (BFS yo'li bilan, olmalar eng yaxshi tartibda)
function yolBos(s, nuq, y, kak) {
  const ks = new Set(kak.map(K)), yol = (a, b) => { const q = [a], ota = { [K(a)]: null }; while (q.length) { const p = q.shift(); if (K(p) === K(b)) break; for (const [dx, dy, c] of [[1, 0, '→'], [-1, 0, '←'], [0, 1, '↑'], [0, -1, '↓']]) { const n = [p[0] + dx, p[1] + dy]; if (ichida(n) && !ks.has(K(n)) && !(K(n) in ota)) { ota[K(n)] = [p, c]; q.push(n) } } } let r = '', t = b; while (ota[K(t)]) { r = ota[K(t)][1] + r; t = ota[K(t)][0] } return r }
  let eng = null, uz = Infinity; const perm = (q, j, d, t) => { if (d >= uz) return; if (!q.length) { const k = d + (y ? bfs(j, y, kak) : 0); if (k < uz) { uz = k; eng = t } return } q.forEach((n, i) => perm(q.filter((_, k) => k !== i), n, d + bfs(j, n, kak), [...t, n])) }
  perm(nuq, s, 0, []); let r = '', j = s; for (const n of [...eng, ...(y ? [y] : [])]) { r += yol(j, n); j = n } return r
}
const JQ = [['c', 'jon', -1], ['if', 'jon', 0, [['go']]]]
const QQ = [['c', 'qadam', -1], ['if', 'qadam', 0, [['go']]]]
// manba jadvali: s start, o olmalar, g oltin, k kaktuslar, y yulduz; bos — eng qisqa (kaktussiz); d — yechim
const M = {
  HUK: { s: [0, 0], o: [], k: [[2, 0]] },
  P6: { s: [0, 0], o: [], k: [[0, 1], [3, 0]] },
  B1A: { s: [0, 0], o: [], k: [[2, 0], [0, 2]] },
  B1B: { s: [3, 0], o: [], k: [[2, 0], [4, 0], [3, 1]] },
  B1C: { s: [0, 0], o: [], k: [[1, 0], [2, 1], [3, 0], [3, 2], [5, 1], [4, 4]], y: [6, 0], bos: 12 },
  B1Y: { s: [0, 0], o: [], k: [[1, 0], [0, 2], [2, 2], [2, 0], [4, 1], [4, 2], [3, 4], [5, 0], [6, 2]], y: [6, 0], bos: 12 },
  P7: { s: [0, 0], o: [[2, 0], [3, 2], [5, 2]], k: [[1, 0], [3, 1], [4, 2], [6, 0]], y: [6, 4] },
  B2A: { s: [0, 0], o: [[0, 3], [3, 1], [5, 2]], k: [[1, 0], [2, 1], [4, 1], [3, 3]], y: [6, 0], bos: 14 },
  B2B: { s: [6, 0], o: [[4, 0], [2, 2], [0, 1]], g: [[5, 2]], k: [[3, 0], [3, 2], [0, 2]], y: [3, 4], bos: 17 },
  B2C: { s: [0, 0], o: [[2, 0], [0, 3], [3, 3]], k: [[1, 0], [3, 1], [2, 2], [3, 4], [4, 2]], y: [5, 2], bos: 15 },
  B2Y: { s: [0, 0], o: [[2, 0], [2, 2], [4, 0], [4, 2], [3, 4]], k: [[1, 0], [3, 0], [3, 1], [3, 2], [5, 0]], y: [6, 0], bos: 18 },
  P8: { s: [0, 0], o: [], k: [], y: [4, 0] },
  B3A: { s: [0, 0], o: [], k: [], y: [6, 2] },
  B3B: { s: [0, 0], o: [[2, 0], [3, 2], [5, 2]], k: [[3, 0], [2, 2], [4, 1]], y: [5, 0], bos: 9 },
  B3C: { s: [6, 0], o: [[4, 0], [3, 2], [5, 2]], k: [[5, 0], [3, 0], [4, 2], [2, 2], [3, 3]], y: [0, 0], bos: 14 },
  B3Y: { s: [0, 0], o: [[2, 0], [0, 3], [5, 2], [3, 4]], k: [[3, 0], [3, 2], [4, 1], [2, 4], [1, 3]], y: [6, 4], bos: 20 },
}
console.log('— 1. Maydonlar')
for (const id in M) {
  const m = M[id], hamma = [m.s, ...m.o, ...(m.g || []), ...m.k, ...(m.y ? [m.y] : [])]
  const bez = hamma.filter((k) => BEZAK.some((b) => K(b) === K(k)))
  tek(id + ': start, olma, kaktus, yulduz bezak kataklarida va (1, 2) da emas', !bez.length, JSON.stringify(bez))
  tek(id + ': maydon ichida, takrorlanmaydi', hamma.every(ichida) && new Set(hamma.map(K)).size === hamma.length)
  if (m.bos) { const e = engQisqa(m.s, [...m.o, ...(m.g || [])], m.y, m.k); tek(id + ': kaktusga tegmagan eng qisqa yo‘l — ' + m.bos, e === m.bos, String(e)) }
}
console.log('— 2. O‘yinlar (manba «Topshiriqlar»)')
let r
// huk: →→→→→ — A game over darhol (2-bosish), B 4 tegish jon −1, C 4-bosishda jon 0
r = oyna(M.HUK, { start: { jon: 3 }, kaktus: [['go']] }, '→→→→→'); tek('huk A: 2-bosishda (1-tegish) tugadi, jon 3', r.tugadi === 2 && r.v.jon === 3 && r.teg === 1, JSON.stringify(r))
r = oyna(M.HUK, { start: { jon: 3 }, kaktus: [['c', 'jon', -1]] }, '→→→→→'); tek('huk B: 4 tegish, jon −1, o‘yin davom', r.tugadi === null && r.v.jon === -1 && r.teg === 4, JSON.stringify(r))
r = oyna(M.HUK, { start: { jon: 3 }, kaktus: JQ }, '→→→→→'); tek('huk C: 4-bosishda (3-tegish) jon 0 — tugadi', r.tugadi === 4 && r.v.jon === 0 && r.teg === 3, JSON.stringify(r))
r = oyna(M.P6, { start: { jon: 3 }, kaktus: JQ }, '↑↑↑'); tek('7: ↑↑↑ — 3 tegish, jon 0, tugadi', r.tugadi === 3 && r.v.jon === 0)
r = oyna(M.B1A, { start: { jon: 3 }, kaktus: JQ }, '→→→→'); tek('8 · 1: →→→→ — 3-tegishda jon 0, tugadi', r.tugadi === 4 && r.v.jon === 0 && r.teg === 3, JSON.stringify(r))
r = oyna(M.B1A, { start: { jon: 3 }, kaktus: [['c', 'jon', -1]] }, '→→→→→'); tek('8 · 1: shartsiz — jon −1, davom', r.tugadi === null && r.v.jon === -1)
r = oyna(M.B1A, { start: { jon: 3 }, kaktus: [['c', 'jon', -1], ['if', 'jon', 1, [['go']]]] }, '→→→→'); tek('8 · 1: if jon = 1 — 2-tegishda, jon 1 da tugadi (erta)', r.tugadi === 3 && r.v.jon === 1 && r.teg === 2, JSON.stringify(r))
r = oyna(M.B1B, { start: { jon: 4 }, kaktus: [['c', 'jon', -2], ['if', 'jon', 0, [['go']]]] }, '↑→'); tek('8 · 2: ↑→ — 2-tegishda jon 0', r.tugadi === 2 && r.v.jon === 0 && r.teg === 2, JSON.stringify(r))
r = oyna(M.B1B, { start: { jon: 4 }, kaktus: JQ }, '↑→←↑'); tek('8 · 2: −1 qoldi — 4-tegishda tugadi', r.tugadi === 4 && r.teg === 4)
r = oyna(M.B1B, { start: { jon: 3 }, kaktus: [['c', 'jon', -2], ['if', 'jon', 0, [['go']]]] }, '↑→'); tek('8 · 2: jon 3 qoldi — 3 → 1 → −1, davom', r.tugadi === null && r.v.jon === -1)
for (const [id, jon] of [['B1C', 2], ['B1Y', 1]]) {
  const y = yolBos(M[id].s, [], M[id].y, M[id].k)
  r = oyna(M[id], { start: { jon }, kaktus: JQ }, y); tek(`${id}: ${y} — yutdi, jon ${jon}`, r.yutdi && r.v.jon === jon && y.length === M[id].bos, JSON.stringify(r))
}
// 8 · 3: bitta tegish — yutdi, jon 1; 8 · ★: bitta tegish — tugadi
r = oyna(M.B1C, { start: { jon: 2 }, kaktus: JQ }, '→' + yolBos(M.B1C.s, [], M.B1C.y, M.B1C.k)); tek('8 · 3: bitta tegish — yutdi, jon 1', r.yutdi && r.v.jon === 1)
r = oyna(M.B1Y, { start: { jon: 1 }, kaktus: JQ }, '→'); tek('8 · ★: bitta tegish — o‘yin tugadi', r.tugadi === 1)
// 2-bekat
const B = (s, o, k, g) => ({ start: s, olma: o, kaktus: k, ...(g ? { oltin: g } : {}) })
r = oyna(M.P7, B({ ball: 0, jon: 3 }, [['c', 'ball', 1]], JQ), '→' + yolBos([0, 0], M.P7.o, M.P7.y, M.P7.k)); tek('10: ataylab → + yo‘l — jon 2, ball 3, yutdi', r.yutdi && r.v.jon === 2 && r.v.ball === 3, JSON.stringify(r))
r = oyna(M.B2A, B({ ball: 0, jon: 3 }, [['c', 'ball', 1]], JQ), yolBos(M.B2A.s, M.B2A.o, M.B2A.y, M.B2A.k)); tek('11 · 1: ball 3, jon 3 — yutdi', r.yutdi && r.v.ball === 3 && r.v.jon === 3)
r = oyna(M.B2B, B({ ball: 0, jon: 1 }, [['c', 'ball', 1]], JQ, [['c', 'jon', 1]]), yolBos(M.B2B.s, [...M.B2B.o, ...M.B2B.g], M.B2B.y, M.B2B.k)); tek('11 · 2: ball 3, jon 2 — yutdi', r.yutdi && r.v.ball === 3 && r.v.jon === 2, JSON.stringify(r))
r = oyna(M.B2B, B({ ball: 0, jon: 1 }, [['c', 'ball', 1]], JQ, [['c', 'ball', 1]]), yolBos(M.B2B.s, [...M.B2B.o, ...M.B2B.g], M.B2B.y, M.B2B.k)); tek('11 · 2: oltin ballga — ball 4, jon 1', r.yutdi && r.v.ball === 4 && r.v.jon === 1)
const KB = [['c', 'jon', -1], ['c', 'ball', -2], ['if', 'jon', 0, [['go']]]]
r = oyna(M.B2C, B({ ball: 0, jon: 3 }, [['c', 'ball', 1]], KB), yolBos(M.B2C.s, M.B2C.o, M.B2C.y, M.B2C.k)); tek('11 · 3: tegmasdan — ball 3, jon 3', r.yutdi && r.v.ball === 3 && r.v.jon === 3)
r = oyna(M.B2C, B({ ball: 0, jon: 3 }, [['c', 'ball', 1]], KB), '→' + yolBos(M.B2C.s, M.B2C.o, M.B2C.y, M.B2C.k)); tek('11 · 3: bitta tegish — ball 1, jon 2', r.yutdi && r.v.ball === 1 && r.v.jon === 2, JSON.stringify(r))
r = oyna(M.B2Y, B({ ball: 0, jon: 1 }, [['c', 'ball', 2]], JQ), yolBos(M.B2Y.s, M.B2Y.o, M.B2Y.y, M.B2Y.k)); tek('11 · ★: ball 10, jon 1', r.yutdi && r.v.ball === 10 && r.v.jon === 1)
r = oyna(M.B2Y, B({ ball: 0, jon: 1 }, [['c', 'ball', 1]], JQ), yolBos(M.B2Y.s, M.B2Y.o, M.B2Y.y, M.B2Y.k)); tek('11 · ★: O[+1] qoldi — ball 5', r.yutdi && r.v.ball === 5)
// 3-bekat: qadam
r = oyna(M.P8, { start: { qadam: 6 }, har: QQ }, '↑↑↓↓↑↑'); tek('14: ↑↑↓↓↑↑ — 6-bosishda qadam 0, tugadi', r.tugadi === 6 && r.v.qadam === 0)
r = oyna(M.P8, { start: { qadam: 6 }, har: QQ }, '→→→→'); tek('14: →→→→ — yutdi, qadam 2', r.yutdi && r.v.qadam === 2)
r = oyna(M.B3A, { start: { qadam: 5 }, har: QQ }, '→→→→→'); tek('15 · 1: 5-bosishda qadam 0 — tugadi (yulduzgacha 8)', r.tugadi === 5 && r.v.qadam === 0 && engQisqa([0, 0], [], M.B3A.y, []) === 8)
r = oyna(M.B3A, { start: { qadam: 5 }, har: [['c', 'qadam', -1], ['if', 'qadam', 1, [['go']]]] }, '→→→→→'); tek('15 · 1: if qadam = 1 — 4-bosishda (erta)', r.tugadi === 4)
r = oyna(M.B3A, { start: { qadam: 5 }, har: [['c', 'qadam', -1]] }, '→→→→→→'); tek('15 · 1: shartsiz — qadam −1, davom', r.tugadi === null && r.v.qadam === -1)
const TY = (q, j = 3) => ({ start: { ball: 0, jon: j, qadam: q }, olma: [['c', 'ball', 1]], kaktus: JQ, har: QQ })
const y2 = yolBos(M.B3B.s, M.B3B.o, M.B3B.y, M.B3B.k)
r = oyna(M.B3B, TY(12), y2); tek(`15 · 2: ${y2} — ball 3, qadam 3`, r.yutdi && r.v.ball === 3 && r.v.qadam === 3, JSON.stringify(r))
r = oyna(M.B3B, TY(12), '↑↓' + y2); tek('15 · 2: 2 ta ortiqcha — yutdi, qadam 1', r.yutdi && r.v.qadam === 1)
r = oyna(M.B3B, TY(12), '↑↓↑' + y2); tek('15 · 2: 3 ta ortiqcha — o‘yin tugadi', r.tugadi === 12)
r = oyna(M.B3B, TY(5), y2); tek('15 · 2: qadam 5 qoldi — 5-bosishda tugadi', r.tugadi === 5)
const y3 = yolBos(M.B3C.s, M.B3C.o, M.B3C.y, M.B3C.k)
r = oyna(M.B3C, TY(16, 2), y3); tek('15 · 3: ball 3, jon 2, qadam 2 — yutdi', r.yutdi && r.v.ball === 3 && r.v.jon === 2 && r.v.qadam === 2, JSON.stringify(r))
r = oyna(M.B3C, TY(16, 2), '←' + y3); tek('15 · 3: bitta tegish — jon 1, qadam 1, yutdi', r.yutdi && r.v.jon === 1 && r.v.qadam === 1, JSON.stringify(r))
r = oyna(M.B3C, TY(14, 2), y3); tek('15 · 3: qadam 14 — 14-bosishda tugadi', r.tugadi === 14)
const y4 = yolBos(M.B3Y.s, M.B3Y.o, M.B3Y.y, M.B3Y.k)
r = oyna(M.B3Y, { start: { ball: 0, jon: 3, qadam: 25 }, olma: [['c', 'ball', 5]], kaktus: JQ, har: QQ }, y4); tek('15 · ★: namuna — ball 20, qadam 5', r.yutdi && r.v.ball === 20 && r.v.qadam === 5)
r = oyna(M.B3Y, { start: { ball: 0, jon: 3, qadam: 20 }, olma: [['c', 'ball', 5]], kaktus: JQ, har: QQ }, y4); tek('15 · ★: qadam 20 — 20-bosishda tugadi', r.tugadi === 20)

// ---------- 3. Haqiqiy ekranlar ----------
console.log('— 3. 12-darsning haqiqiy ekranlari (demo-012)')
const U = 'http://localhost:5340/demo-012.html'
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }), xato = []
const p = await (await b.newContext({ viewport: { width: 1440, height: 810 } })).newPage()
p.on('pageerror', (e) => xato.push(e.message)); p.on('console', (mm) => { if (mm.type() === 'error' && !/Failed to load resource/.test(mm.text())) xato.push(mm.text()) })
await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'momiq') })
await p.goto(U + '?rol=bola&xona=jon-sinov'); await p.waitForTimeout(900)
await p.evaluate(() => { bolaKeyingi = () => {}; window.__ijroAsl = ijro; ijro = (d, f, op) => window.__ijroAsl(d, f, { ...(op || {}), kut: 30 }) })
const och = (id, bola = id[0] === 'B') => p.evaluate(([id, bola]) => { const il = document.getElementById('ilova'); il.innerHTML = bola ? '<div id="bol">' + ekran(id, null, true) + '</div>' : '<div id="ust">' + ekran(id) + '</div>'; studiyaTayyorla(il.firstChild) }, [id, bola]).then(() => p.waitForTimeout(500))
const tinch = () => p.waitForFunction(() => !document.querySelector('#ilova .ekran').dataset.yuryapti, null, { timeout: 20000 })
const KEY = { '→': 'ArrowRight', '←': 'ArrowLeft', '↑': 'ArrowUp', '↓': 'ArrowDown' }
const bos = async (s) => { for (const c of s) { await p.keyboard.press(KEY[c]); await p.waitForTimeout(30); await tinch() } await p.waitForTimeout(250) }
const tugma = () => p.evaluate(() => (document.querySelector('#ilova .hn .ishga') ? '#ilova .hn .ishga' : '#ilova .hn .asos'))
const boshla = async () => { await p.click(await tugma()); await p.waitForTimeout(300); await tinch() }
const toxtat = async () => { if (await p.evaluate(() => !!document.querySelector('#ilova .ekran').dataset.oyin)) { await p.click(await tugma()); await p.waitForTimeout(150) } }
const korin = () => p.evaluate(() => { const ek = document.querySelector('#ilova .ekran'), mu = ek.querySelector('.dv-muam'), v = {}; ek.querySelectorAll('.oyna .ball-k[data-v]:not(.yoq)').forEach((k) => { v[k.dataset.v] = k.querySelector('b').textContent }); return { muam: mu ? (mu.className.match(/m-(\w+)/) || [])[1] + ':' + mu.textContent.trim() : '', ishora: (ek.querySelector('.hn .hint') || {}).textContent || '', konfeti: !!ek.querySelector('.konfeti'), oyin: !!ek.dataset.oyin, tugadi: !!ek.querySelector('.oyin-tugadi'), v } })
// dastur: [[hodisa t, m], [ostidagilar…]] — ichma-ich (if ichida [t, m, ichki]) — Blockly bloklari bevosita
const dastur = (d) => p.evaluate((d) => {
  const ek = document.querySelector('#ilova .ekran'), ws = BL_WS.get(ek); ws.clear()
  const zanjir = (ota, r, ichki) => { let o = null; for (const [t, m, ich] of r) { const x = blYangi(ws, t, m); if (o) o.nextConnection.connect(x.previousConnection); else if (ichki) ota.getInput('DO').connection.connect(x.previousConnection); else ota.nextConnection.connect(x.previousConnection); if (ich) zanjir(x, ich, true); o = x } }
  d.forEach(([[t, m], r], i) => { const h = blYangi(ws, t, m); h.moveTo(new Blockly.utils.Coordinate(0, 1000 * i)); zanjir(h, r || [], false) })
  ws.getAllBlocks(false).forEach(blBelgila); blTartib(ws); blMasshtab(ek, ws); sanoq(ek)
}, d).then(() => p.waitForTimeout(300))
const ST = (o) => [['f'], Object.entries(o).map(([n, v]) => ['z', n + ':' + v])]
const KAK = (r) => [['q', 'cactus'], r]
const JQR = [['c', 'jon:-1'], ['i', 'jon:0', [['g']]]], QQR = [['c', 'qadam:-1'], ['i', 'qadam:0', [['g']]]]
const OLM = (n) => [['q', 'apple'], [['c', 'ball:' + n]]]
const ANY = (r) => [['k', 'any'], r]
const Y = (id) => yolBos(M[id].s, [...M[id].o, ...(M[id].g || [])], M[id].y, M[id].k)
const SG = 'Shart ishladi: jon 0 — o‘yin tugadi!', JT = 'Jon tugadi. ▶ Boshlash — yana o‘ynang'
// 7-qadam (ustoz): javondan HAQIQIY bosish — when touching (cactus), change (jon, −1), if (jon = 0), game over
await och('P6', false); r = await korin()
tek('7: tayyor when ▶ clicked → set jon to 3; kapsula «jon: 0»; javonda when any key yopiq', JSON.stringify(r.v) === '{"jon":"0"}' && await p.evaluate(() => !!document.querySelector('#ilova .pl .mbw.yopiq .mb[data-tugma="any"]')), JSON.stringify(r))
const menyu = async (blok, n, qiymat) => { await p.locator(`#ilova .jr-bl .mb[data-tur="${blok}"]`).last().locator('.blocklyDropdownField').nth(n).click(); await p.waitForTimeout(180); await p.locator('.blocklyDropDownDiv .blocklyMenuItem').filter({ hasText: new RegExp('^\\s*' + qiymat + '\\s*$') }).first().click(); await p.waitForTimeout(180) }
const jav = async (f, sel) => { await p.click('#ilova .rg .rd.f-' + f); await p.waitForTimeout(120); await p.click('#ilova .pl .mbw:not(.yopiq) ' + sel); await p.waitForTimeout(300) }
await jav('e', '.mb[data-tur="q"]'); await menyu('q', 0, 'cactus')
await jav('o', '.mb[data-tur="c"]'); await menyu('c', 0, 'jon'); await menyu('c', 1, '−1')
await jav('a', '.mb[data-tur="i"]'); await menyu('i', 0, 'jon'); await jav('e', '.mb[data-tur="g"]')
const tuz = () => p.evaluate(() => blDasturchalar(document.querySelector('#ilova .ekran')).map((x) => x.tur + ':' + (x.olma || x.tugma || '') + '[' + x.daraxt.map(function f(t) { const el = t.el, ty = blokTuri(el); return ty + (ozgNom(el) && ty !== 'g' ? '(' + ozgNom(el) + ' ' + blokSon(el) + ')' : '') + (t.ichki.length ? '{' + t.ichki.map(f).join(',') + '}' : '') }).join(',') + ']').join(' '))
tek('7: javondan — when touching cactus → change jon by −1, if jon = 0 then { game over }', (await tuz()) === 'when_start:[z(jon 3)] when_touch:cactus[c(jon -1),i(jon 0){g}]', await tuz())
await boshla(); r = await korin(); tek('7: «▶ Boshlash» — «jon: 3»', r.v.jon === '3', JSON.stringify(r))
await bos('↑'); r = await korin(); tek('7: ↑ — kaktusga tegdi, «jon: 2», o‘yin davom; if yonida «✕ yo‘q»', r.v.jon === '2' && r.oyin && !r.tugadi, JSON.stringify(r))
await bos('↑↑'); r = await korin(); tek('7: yana ↑↑ — «jon: 0», «O‘yin tugadi», muammochasiz', r.v.jon === '0' && r.tugadi && !r.oyin && !r.muam && r.ishora === JT, JSON.stringify(r))
// 8 · 1 sinov
await och('B1A'); r = await korin(); tek('B1A: tayyor bo‘lak — ▶ set jon 3, bo‘sh kaktus dasturchasi; ishora', (await tuz()) === 'when_start:[z(jon 3)] when_touch:cactus[]' && r.ishora === 'Kaktusga tekkanda jon kamaysin, jon 0 bo‘lsa — o‘yin tugasin', await tuz())
await boshla(); await bos('→→'); r = await korin(); tek('B1A: kaktus dasturchasi bo‘sh — Bo‘shvoy «Tegdim — nima qilay?»', r.muam === 'boshvoy:Tegdim — nima qilay?' && r.ishora === 'Kaktusga tekkanda jon kamaysin — dasturchaga blok ulang' && r.oyin, JSON.stringify(r)); await toxtat()
await dastur([ST({ jon: 3 }), KAK([['c', 'jon:-1'], ['i', 'jon:0']])]); await boshla(); r = await korin(); tek('B1A: if ichi bo‘sh — Bo‘shvoy «Ichi bo‘sh-ku…», o‘yin boshlanmadi', r.muam === 'boshvoy:Ichi bo‘sh-ku…' && !r.oyin, JSON.stringify(r))
await dastur([ST({ jon: 3 }), KAK([['c', 'jon:-1']])]); await boshla(); await bos('→→→→→'); r = await korin()
tek('B1A: shartsiz — jon −1, o‘yin davom: Kamvoy «Jon tugadi-ku!», «Jon −1 bo‘ldi, …»', r.muam === 'kamvoy:Jon tugadi-ku!' && r.ishora === 'Jon −1 bo‘ldi, o‘yin esa davom etyapti. Jon 0 bo‘lganda o‘yin tugashi uchun shart kerak' && r.oyin && r.v.jon === '−1', JSON.stringify(r)); await toxtat()
await dastur([ST({ jon: 3 }), KAK([['c', 'jon:-1'], ['i', 'jon:1', [['g']]]])]); await boshla(); await bos('→→→'); r = await korin()
tek('B1A: if jon = 1 — 2-tegishda tugadi: Ortiqvoy «Erta tugadi!», «Jon 1 qoldi, …»', r.muam === 'ortiqvoy:Erta tugadi!' && r.ishora === 'Jon 1 qoldi, o‘yin esa tugadi. Shart qachon «ha» deydi — sonni tekshiring' && r.tugadi, JSON.stringify(r))
await dastur([ST({ jon: 3 }), KAK(JQR)]); await boshla(); await bos('→→→→'); r = await korin()
tek('B1A: K[−1; =0] — 3-tegishda «O‘yin tugadi», «Shart ishladi: jon 0 — o‘yin tugadi!», konfeti', r.tugadi && r.konfeti && r.ishora === SG && r.v.jon === '0', JSON.stringify(r))
// 8 · 2
await och('B1B'); tek('B1B: dastur oldingi pog‘onadan — if ichidagisi bilan', (await tuz()) === 'when_start:[z(jon 3)] when_touch:cactus[c(jon -1),i(jon 0){g}]', await tuz())
await dastur([ST({ jon: 4 }), KAK(JQR)]); await boshla(); await bos('↑→←↑'); r = await korin(); tek('B1B: −1 qoldi — 4-tegishda tugadi: Kamvoy «Kaktus kam oldi!»', r.muam === 'kamvoy:Kaktus kam oldi!' && r.ishora === 'Kaktus har tegishda 2 ta jon olsin', JSON.stringify(r))
await dastur([ST({ jon: 3 }), KAK([['c', 'jon:-2'], ['i', 'jon:0', [['g']]]])]); await boshla(); await bos('↑→'); r = await korin(); tek('B1B: jon 3 qoldi — 3 → 1 → −1: Kamvoy «Jon tugadi-ku!»', r.muam === 'kamvoy:Jon tugadi-ku!' && r.v.jon === '−1', JSON.stringify(r)); await toxtat()
await dastur([ST({ jon: 4 }), KAK([['c', 'jon:-2'], ['i', 'jon:0', [['g']]]])]); await boshla(); await bos('↑→'); r = await korin(); tek('B1B: ▶[jon 4] K[−2; =0] — 2-tegishda «Shart ishladi»', r.ishora === SG && r.konfeti, JSON.stringify(r))
// 8 · 3, ★
await och('B1C'); await dastur([ST({ jon: 2 }), KAK([['c', 'jon:-1']])]); await boshla(); await bos(Y('B1C')); r = await korin(); tek('B1C: qoidasiz yutdi — Kamvoy «Qoida-chi?»', r.muam === 'kamvoy:Qoida-chi?' && r.ishora === 'Jon 0 bo‘lsa, o‘yin tugashi kerak: kaktus dasturchasida shart bormi?', JSON.stringify(r))
await dastur([ST({ jon: 2 }), KAK(JQR)]); await boshla(); await bos('→' + Y('B1C')); r = await korin(); tek('B1C: bitta tegish — jon 1, yutdi', r.v.jon === '1' && r.konfeti && r.ishora === 'Siz yutdingiz!', JSON.stringify(r))
await och('B1Y'); await dastur([ST({ jon: 1 }), KAK(JQR)]); await boshla(); await bos('→'); r = await korin(); tek('B1Y: bitta tegish — «O‘yin tugadi», «Jon tugadi. ▶ Boshlash — yana o‘ynang» (muammo emas)', r.tugadi && !r.muam && r.ishora === JT, JSON.stringify(r))
await boshla(); await bos(Y('B1Y')); r = await korin(); tek('B1Y: qayta — 12 bosish, yutdi, jon 1', r.konfeti && r.v.jon === '1', JSON.stringify(r))
// 2-bekat
await och('B2A'); await dastur([ST({ jon: 3 }), KAK(JQR)]); await boshla(); await bos(Y('B2A').slice(0, 3)); r = await korin(); tek('B2A: ball qismi yo‘q — Bo‘shvoy «Olma terildi, ball-chi?»', r.muam === 'boshvoy:Olma terildi, ball-chi?', JSON.stringify(r)); await toxtat()
await dastur([ST({ ball: 0, jon: 3 }), OLM(1), KAK(JQR)]); await boshla(); await bos(Y('B2A')); r = await korin(); tek('B2A: ball 3, jon 3 — yutdi; ikkala kapsula', r.konfeti && r.v.ball === '3' && r.v.jon === '3' && Object.keys(r.v).length === 2, JSON.stringify(r))
await och('B2B'); await dastur([ST({ ball: 0, jon: 1 }), OLM(1), KAK(JQR)]); await boshla(); await bos(Y('B2B')); r = await korin()
tek('B2B: oltin olma dasturchasiz — Bo‘shvoy «Oltin olma-chi?» (12-darsdagi gap)', /Oltin olma-chi\?|Jon-chi\?/.test(r.muam), JSON.stringify(r))
await dastur([ST({ ball: 0, jon: 1 }), OLM(1), [['q', 'gold'], [['c', 'ball:1']]], KAK(JQR)]); await boshla(); const yb = Y('B2B'); let k0 = 0; for (const c of yb) { await bos(c); k0++; r = await korin(); if (r.muam) break }
tek('B2B: oltin ballga qo‘shdi — terilganda Kamvoy «Jon-chi?»', r.muam === 'kamvoy:Jon-chi?' && r.ishora === 'Oltin olma jon bersin — uning dasturchasini tekshiring' && r.oyin, JSON.stringify(r)); await toxtat()
await dastur([ST({ ball: 0, jon: 1 }), OLM(1), [['q', 'gold'], [['c', 'jon:1']]], KAK(JQR)]); await boshla(); await bos(yb); r = await korin(); tek('B2B: OO[jon +1] — ball 3, jon 2, yutdi', r.konfeti && r.v.ball === '3' && r.v.jon === '2', JSON.stringify(r))
await och('B2C'); await dastur([ST({ ball: 0, jon: 3 }), OLM(1), KAK(JQR)]); await boshla(); await bos('→'); r = await korin(); tek('B2C: kaktus ballni olmadi — Kamvoy «Kaktus-chi?»', r.muam === 'kamvoy:Kaktus-chi?', JSON.stringify(r)); await toxtat()
await dastur([ST({ ball: 0, jon: 3 }), OLM(1), KAK([['c', 'jon:-1'], ['c', 'ball:-2'], ['i', 'jon:0', [['g']]]])]); await boshla(); await bos('→' + Y('B2C')); r = await korin(); tek('B2C: bitta tegish — ball 1, jon 2, yutdi', r.konfeti && r.v.ball === '1' && r.v.jon === '2', JSON.stringify(r))
await och('B2Y'); await dastur([ST({ ball: 0, jon: 1 }), OLM(1), KAK(JQR)]); await boshla(); await bos(Y('B2Y')); r = await korin(); tek('B2Y: O[+1] — ball 5: Kamvoy «Ball kam!»', r.muam === 'kamvoy:Ball kam!' && r.v.ball === '5', JSON.stringify(r))
await dastur([ST({ ball: 0, jon: 1 }), OLM(2), KAK(JQR)]); await boshla(); await bos(Y('B2Y')); r = await korin(); tek('B2Y: O[+2] — ball 10, yutdi', r.konfeti && r.v.ball === '10', JSON.stringify(r))
// 3-bekat
await och('P8', false); await dastur([ST({ qadam: 6 }), ANY(QQR)]); await boshla(); r = await korin(); tek('14: «qadam: 6», faqat qadam kapsulasi', r.v.qadam === '6' && Object.keys(r.v).length === 1, JSON.stringify(r))
await bos('↑↑↓↓↑↑'); r = await korin(); tek('14: ↑↑↓↓↑↑ — 6-bosishda «O‘yin tugadi», «Qadam tugadi. Qisqaroq yo‘l toping. …»', r.tugadi && r.v.qadam === '0' && r.ishora === 'Qadam tugadi. Qisqaroq yo‘l toping. ▶ Boshlash — yana o‘ynang', JSON.stringify(r))
await boshla(); await bos('→→→→'); r = await korin(); tek('14: →→→→ — yutdi, «qadam: 2»', r.konfeti && r.v.qadam === '2', JSON.stringify(r))
await och('B3A'); tek('B3A: tayyor o‘yin (9 blok)', (await tuz()) === 'when_start:[z(ball 0),z(jon 3)] when_touch:apple[c(ball 1)] when_touch:cactus[c(jon -1),i(jon 0){g}]', await tuz())
const T3 = (q, j = 3) => [ST({ ball: 0, jon: j, qadam: q }), OLM(1), KAK(JQR), ANY(QQR)]
await boshla(); await bos('→→'); r = await korin(); tek('B3A: qadam qoidasi yo‘q — 2-bosishdan keyin Kamvoy «Qadam-chi?»', r.muam === 'kamvoy:Qadam-chi?' && r.ishora === 'Har bosishda qadam kamaysin: qaysi hodisa bloki har bosishda ishlaydi?', JSON.stringify(r)); await toxtat()
await dastur([ST({ ball: 0, jon: 3, qadam: 5 }), OLM(1), KAK(JQR), ANY([['c', 'qadam:-1']])]); await boshla(); await bos('→→→→→→'); r = await korin(); tek('B3A: shartsiz — qadam −1: Kamvoy «Qadam tugadi-ku!»', r.muam === 'kamvoy:Qadam tugadi-ku!' && r.ishora === 'Qadam −1 bo‘ldi, o‘yin esa davom etyapti. Qadam 0 bo‘lganda o‘yin tugashi uchun shart kerak', JSON.stringify(r)); await toxtat()
await dastur([ST({ ball: 0, jon: 3, qadam: 5 }), OLM(1), KAK(JQR), ANY([['c', 'qadam:-1'], ['i', 'qadam:1', [['g']]]])]); await boshla(); await bos('→→→→'); r = await korin(); tek('B3A: if qadam = 1 — 4-bosishda: Ortiqvoy «Erta tugadi!»', r.muam === 'ortiqvoy:Erta tugadi!' && r.ishora === 'Qadam 1 qoldi, o‘yin esa tugadi. Shart qachon «ha» deydi — sonni tekshiring', JSON.stringify(r))
await dastur(T3(6)); await boshla(); await bos('→→→→→→'); r = await korin(); tek('B3A: qadam 6 — 6-bosishda: «Qadam 5 bo‘lsin…»', r.muam === 'kamvoy:Oz qoldi!' && r.ishora === 'Qadam 5 bo‘lsin: 5-bosishda o‘yin tugasin', JSON.stringify(r))
await dastur(T3(5)); await boshla(); await bos('→→→→→'); r = await korin(); tek('B3A: qadam 5 — 5-bosishda «Shart ishladi: qadam 0 — o‘yin tugadi!»', r.konfeti && r.ishora === 'Shart ishladi: qadam 0 — o‘yin tugadi!' && Object.keys(r.v).length === 3, JSON.stringify(r))
await och('B3B'); await dastur(T3(12)); await boshla(); await bos('↑↓↑' + Y('B3B')); r = await korin(); tek('B3B: 3 ta ortiqcha — 12-bosishda «O‘yin tugadi» (qadam)', r.tugadi && r.ishora === 'Qadam tugadi. Qisqaroq yo‘l toping. ▶ Boshlash — yana o‘ynang', JSON.stringify(r))
await boshla(); await bos(Y('B3B')); r = await korin(); tek('B3B: 9 bosish — ball 3, qadam 3, yutdi', r.konfeti && r.v.ball === '3' && r.v.qadam === '3', JSON.stringify(r))
await och('B3C'); await dastur(T3(16, 2)); await boshla(); await bos('←' + Y('B3C')); r = await korin(); tek('B3C: bitta tegish — jon 1, qadam 1, yutdi', r.konfeti && r.v.jon === '1' && r.v.qadam === '1', JSON.stringify(r))
await och('B3Y'); await dastur([ST({ ball: 0, jon: 3 }), OLM(5), KAK(JQR)]); await boshla(); await bos(Y('B3Y')); r = await korin(); tek('B3Y: qadam yo‘q — «Oz qoldi!», «O‘yin boshida jon va qadamni qo‘ying»', r.muam === 'kamvoy:Oz qoldi!' && r.ishora === 'O‘yin boshida jon va qadamni qo‘ying', JSON.stringify(r))
await dastur([[['f'], [['z', 'ball:0'], ['z', 'jon:3'], ['z', 'qadam:25']]], OLM(5), KAK(JQR), ANY(QQR)]); await boshla(); await bos(Y('B3Y')); r = await korin(); tek('B3Y: namuna — ball 20, qadam 5, «O‘yiningiz tayyor!»', r.konfeti && r.ishora === 'O‘yiningiz tayyor!' && r.v.ball === '20' && r.v.qadam === '5', JSON.stringify(r))
tek('natija: o‘yin yutdi 8 (B1C, B1Y, B2A–B2Y, B3B, B3C… sinovsiz), shart eng ko‘pi 2, o‘zgaruvchi 3', await p.evaluate(() => { const j = blokJami(); return j.W >= 8 && j.eng.S === 2 && j.eng.V === 3 }), await p.evaluate(() => JSON.stringify(blokJami())))
// huk (3-qadam)
await och('P2S', false); await p.waitForTimeout(400)
const kN = (i) => p.evaluate((i) => (document.querySelectorAll('#ilova .jk')[i].querySelector('.jn') || {}).textContent || '', i)
const kutJ = (n) => p.waitForFunction((n) => document.querySelectorAll('#ilova .jk .jn').length >= n && !document.querySelector('#ilova .ekran').dataset.yuryapti, n, { timeout: 30000 })
await kutJ(1); r = await korin(); tek('3: A — «✕ jon 3 — tugadi», «O‘yin tugadi»', (await kN(0)) === '✕ jon 3 — tugadi' && r.tugadi && r.v.jon === '3', JSON.stringify(r))
await p.click('#ilova .hn .asos'); await kutJ(2); r = await korin(); tek('3: B — «✕ jon −1», o‘yin tugamadi', (await kN(1)) === '✕ jon −1' && !r.tugadi && r.v.jon === '−1', JSON.stringify(r))
await p.click('#ilova .hn .asos'); await kutJ(3); r = await korin(); tek('3: C — «✓ jon 0 — tugadi»', (await kN(2)) === '✓ jon 0 — tugadi' && r.tugadi && r.v.jon === '0', JSON.stringify(r))
tek('sahifada xato yo‘q', !xato.length, xato.join(' | '))
await b.close()
console.log(`\n${ok} / ${jami}`)
process.exit(ok === jami ? 0 : 1)
