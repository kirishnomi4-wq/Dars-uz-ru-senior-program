// Labirint o'yini 2 sinovi (10-dars, 20.11): manba 010 «Labirintlar» va «Pog'ona shartlari» — avval MUSTAQIL simulyatorda (dvigatel kodisiz; o'lchovlar
// boshqa usulda: hamma eng qisqa yo'llar to'liq sanaladi — eng kam burilish va borib qaytish shulardan), keyin 10-darsning HAQIQIY ekranlarida (demo-010.html):
// dvigatel o'lchovi simulyator bilan bir xilmi; labirint yasash — asbob va katak HAQIQIY sichqoncha bosishi bilan; o'lchov qatori; muammochalar;
// «Sinab ko‘rish» (klaviatura) va pog'ona shartlari; darajalar («2-daraja!»); chek-list; «Do‘stingiz o‘ynaydi»; huk.
// Ishlatish (lokal server 5340 yoniq, demo-010 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/dvigatel/labirint2.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-010.html'
const m = (s) => s.replace(/·/g, '.').replace(/★/g, '*')
const LB = { // manba jadvali (mustaqil nusxa)
  D1: '##···#★|#K#·##·|#·#··E·|#·#·###|S···###', D1B: '##··##★|#K#·##·|#····E·|#·#·###|S···###', Z: '····#·★|·##·#·#|·#··#·#|·#·##··|S······',
  BOSH: '······★|·······|·······|·······|S······', U1: '··#···★|·##·#·#|····#··|·##·##·|S······', U2: '··#··E★|·##·#·#|K···#··|·##·##·|S······',
  N1: '······★|·##·##·|·······|·#·##·#|S······', N2: '······★|····###|·······|######·|S······', N3: '#####·★|#···#·#|#·#·#·#|#·#···#|S·#####',
  NY: '·####·★|····#·#|#·#·#·#|#·#····|S··###·', NK1: '·####E★|····#·#|#K#·#·#|#·#····|S··###·', NK2: 'K####E★|····#·#|#·#·#·#|#·#····|S··###·',
  NKY: '·K···E★|·#·####|·#·····|######·|S······',
}
const qoy = (id, x, y, c) => { const r = m(LB[id]).split('|'), q = r.length - 1 - y; r[q] = r[q].slice(0, x) + c + r[q].slice(x + 1); return r.join('|') }
LB.U1X = qoy('U1', 5, 4, '#'); LB.U1E = qoy('U1', 3, 4, 'E')
// manba: [devor, yol (null — yo'q), burilish, boshiBerk, eshikTosadi, kalitYol, qaytish] (undefined — manbada aytilmagan, tekshirilmaydi)
const JAD = {
  D1: { devor: 17, yol: 16, burilish: 6, eshikTosadi: true, qaytish: true }, D1B: { devor: 17, yol: 12 }, Z: { devor: 11, yol: 10, burilish: 2 },
  BOSH: { devor: 0, yol: 10, burilish: 1 }, U1: { devor: 10, yol: 10, burilish: 2 }, U1X: { yol: null }, U1E: { eshikTosadi: false },
  U2: { yol: 10, eshikTosadi: true, kalitYol: true }, N1: { devor: 8, yol: 10 }, N2: { yol: 16, burilish: 4 }, N3: { burilish: 6, boshiBerk: 0, yol: 14 },
  NY: { boshiBerk: 3, yol: 14 }, NK1: { eshikTosadi: true, kalitYol: true, qaytish: false, yol: 14 }, NK2: { qaytish: true, yol: 18 },
  NKY: { yol: 20, eshikTosadi: true, kalitYol: true, qaytish: true },
}
let ok = 0, jami = 0
const tek = (nom, shart, iz = '') => { jami++; if (shart) ok++; console.log((shart ? '✓ ' : '✗ ') + nom + (shart || !iz ? '' : '  — ' + iz)) }
// ---------- mustaqil o'lchov: hamma eng qisqa yo'llar ----------
const D = [[1, 0, '→'], [-1, 0, '←'], [0, -1, '↑'], [0, 1, '↓']]
function olch(xarita) {
  const xr = m(xarita).split('|'), H = xr.length, W = xr[0].length, c = (x, y) => (xr[y] || '')[x]
  const top = (b) => { for (let y = 0; y < H; y++) { const i = xr[y].indexOf(b); if (i >= 0) return [i, y] } return null }
  const S = top('S'), Y = top('*'), K = top('K'), E = top('E')
  const o = { devor: [...xr.join('')].filter((x) => x === '#').length, boshiBerk: 0 }
  const och = (x, y) => c(x, y) !== undefined && c(x, y) !== '#'
  xr.forEach((r, y) => [...r].forEach((ch, x) => { if (ch !== '#' && 'S*K'.indexOf(ch) < 0 && D.filter(([dx, dy]) => och(x + dx, y + dy)).length === 1) o.boshiBerk++ }))
  const ut = (x, y, k, ed) => { const ch = c(x, y); return ch !== undefined && ch !== '#' && (ch !== 'E' || (!ed && k)) }
  const bfs = (ed) => { const seen = new Map([[S + ',0', 0]]), q = [[...S, 0]]; for (let i = 0; i < q.length; i++) { const [x, y, k] = q[i], d = seen.get(x + ',' + y + ',' + k); if (x === Y[0] && y === Y[1]) return d; for (const [dx, dy] of D) { const nx = x + dx, ny = y + dy; if (!ut(nx, ny, k, ed)) continue; const nk = k || c(nx, ny) === 'K' ? 1 : 0, kk = nx + ',' + ny + ',' + nk; if (!seen.has(kk)) { seen.set(kk, d + 1); q.push([nx, ny, nk]) } } } return null }
  o.yol = bfs(false); o.eshikTosadi = E ? bfs(true) === null : false
  o.kalitYol = false; if (K) { const s = new Set([S.join()]), q = [S]; for (let i = 0; i < q.length; i++) { const [x, y] = q[i]; if (x === K[0] && y === K[1]) o.kalitYol = true; for (const [dx, dy] of D) { const nx = x + dx, ny = y + dy; if (ut(nx, ny, 0, true) && !s.has(nx + ',' + ny)) { s.add(nx + ',' + ny); q.push([nx, ny]) } } } }
  // hamma eng qisqa yo'l (uzunligi o.yol): to'liq qidiruv; har biri — strelkalar qatori
  o.yollar = []
  if (o.yol != null) {
    const dfs = (x, y, k, yo) => { if (yo.length > o.yol) return; if (x === Y[0] && y === Y[1]) { if (yo.length === o.yol) o.yollar.push(yo); return } const qol = o.yol - yo.length; if (Math.abs(x - Y[0]) + Math.abs(y - Y[1]) > qol) return; for (const [dx, dy, s] of D) { const nx = x + dx, ny = y + dy; if (ut(nx, ny, k, false)) dfs(nx, ny, k || c(nx, ny) === 'K' ? 1 : 0, yo + s) } }
    dfs(S[0], S[1], 0, '')
    const bur = (s) => [...s].filter((ch, i) => i && ch !== s[i - 1]).length
    o.burilish = Math.min(...o.yollar.map(bur))
    const qayt = (s) => { let [x, y] = S; const kor = new Set([x + ',' + y]); for (const ch of s) { const [dx, dy] = D.find((d) => d[2] === ch); x += dx; y += dy; if (kor.has(x + ',' + y)) return true; kor.add(x + ',' + y) } return false }
    o.qaytish = !!(E && K && o.eshikTosadi) && o.yollar.every(qayt)
  } else { o.burilish = null; o.qaytish = false }
  return o
}
console.log('— 1. Mustaqil o‘lchov: manba jadvali')
const SIM = {}
for (const id in JAD) { const o = (SIM[id] = olch(LB[id])); for (const k in JAD[id]) tek(id + ': ' + k + ' = ' + JAD[id][k], o[k] === JAD[id][k], String(o[k])) }
const KER = { 1: { devor: 6 }, 2: { yol: 14 }, 3: { burilish: 5 }, Y: { boshiBerk: 2 }, K1: { eshik: true }, K2: { eshik: true, qaytish: true }, KY: { eshik: true, yol: 20 } }
const bajar = (o, k, xar) => o.yol != null && (!k.devor || o.devor >= k.devor) && (!k.yol || o.yol >= k.yol) && (!k.burilish || o.burilish >= k.burilish) && (!k.boshiBerk || o.boshiBerk >= k.boshiBerk) && (!k.eshik || (/E/.test(m(xar)) && /K/.test(m(xar)) && o.eshikTosadi && o.kalitYol)) && (!k.qaytish || o.qaytish)
for (const [n, id, kel] of [['1', 'N1', '2'], ['2', 'N2', '3'], ['3', 'N3', 'Y'], ['Y', 'NY', null], ['K1', 'NK1', 'K2'], ['K2', 'NK2', 'KY'], ['KY', 'NKY', null]]) tek('namuna ' + id + ' o‘z pog‘onasini bajaradi' + (kel ? ', keyingisini — yo‘q' : ''), bajar(SIM[id], KER[n], LB[id]) && (!kel || !bajar(SIM[id], KER[kel], LB[id])))
for (const id of ['D1', 'U2', 'NK1', 'NKY', 'Z']) tek(id + ': eng qisqa yo‘l bilan qoida «yo‘q» bermaydi (yo‘llar: ' + SIM[id].yollar.length + ')', SIM[id].yollar.length > 0)
const sol = (id) => SIM[id].yollar[0]
tek('to‘liq o‘yin: D1 → U2 — 26, D1 → NK1 — 30, D1 → NKY — 36 bosish', sol('D1').length + sol('U2').length === 26 && sol('D1').length + sol('NK1').length === 30 && sol('D1').length + sol('NKY').length === 36)

// ---------- 2. Haqiqiy ekranlar ----------
console.log('— 2. 10-darsning haqiqiy ekranlari (demo-010)')
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }), xato = []
const p = await (await b.newContext({ viewport: { width: 1440, height: 810 } })).newPage()
p.on('pageerror', (e) => xato.push(e.message)); p.on('console', (mm) => { if (mm.type() === 'error' && !/Failed to load resource/.test(mm.text())) xato.push(mm.text()) })
await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'momiq') })
await p.goto(U + '?rol=bola&xona=lab2-sinov'); await p.waitForTimeout(900)
await p.evaluate(() => { bolaKeyingi = () => {}; window.__ijroAsl = ijro; ijro = (d, f, op) => window.__ijroAsl(d, f, { ...(op || {}), kut: 40 }) })
// dvigatel o'lchovi = mustaqil o'lchov
for (const id in JAD) {
  const e = await p.evaluate((x) => labOlchov(x), m(LB[id])), s = SIM[id]
  const f = ['devor', 'yol', 'burilish', 'boshiBerk', 'eshikTosadi', 'kalitYol', 'qaytish'].filter((k) => e[k] !== s[k])
  tek(id + ': dvigatel o‘lchovi mustaqil hisob bilan bir xil', !f.length, f.map((k) => k + ' ' + e[k] + '≠' + s[k]).join(', '))
}
const och = (id, bola = id[0] === 'B') => p.evaluate(([id, bola]) => { const il = document.getElementById('ilova'); il.innerHTML = bola ? '<div id="bol">' + ekran(id, null, true) + '</div>' : '<div id="ust">' + ekran(id) + '</div>'; studiyaTayyorla(il.firstChild) }, [id, bola]).then(() => p.waitForTimeout(700))
const tinch = () => p.waitForFunction(() => !document.querySelector('#ilova .ekran').dataset.yuryapti, null, { timeout: 20000 })
const KEY = { '→': 'ArrowRight', '←': 'ArrowLeft', '↑': 'ArrowUp', '↓': 'ArrowDown', ' ': 'Space' }
const bos = async (s) => { for (const c of s) { await p.keyboard.press(KEY[c]); await p.waitForTimeout(40); await tinch() } await p.waitForTimeout(300) }
const boshla = async () => { await p.click((await p.$('#ilova .hn .ishga')) ? '#ilova .hn .ishga' : '#ilova .hn .asos'); await p.waitForTimeout(400) }
const korin = () => p.evaluate(() => { const ek = document.querySelector('#ilova .ekran'), mu = ek.querySelector('.dv-muam'); return { muam: mu ? (mu.className.match(/m-(\w+)/) || [])[1] + ':' + mu.textContent.trim() : '', ishora: (ek.querySelector('.hn .hint') || {}).textContent || '', konfeti: !!ek.querySelector('.oyna .konfeti'), olchov: (ek.querySelector('.olchov') || {}).textContent || '', daraja: (ek.querySelector('.daraja-yz') || {}).textContent || '', xarita: (ek.querySelector('.katak') || {}).dataset?.xarita || '', oyin: !!ek.dataset.oyin, chek: [...ek.querySelectorAll('.pl .chek .ch-r')].map((r) => (r.classList.contains('ok') ? '✓' : '·')).join(''), tugma: ((ek.querySelector('.hn .ishga') || ek.querySelector('.hn .asos')) || {}).textContent || '' } })
// katakni HAQIQIY bosish: maydon SVG dagi katak markazi (x, y — Y tepaga)
const katak = async (x, y) => { const pt = await p.evaluate(([x, y]) => { const k = document.querySelector('#ilova .katak.maydon'), svg = k.querySelector('svg.kt'), H = katakXarita(k.dataset.xarita).length, pnt = svg.createSVGPoint(); pnt.x = x * KT + 50; pnt.y = (H - 1 - y) * KT + 50; const r = pnt.matrixTransform(svg.getScreenCTM()); return [r.x, r.y] }, [x, y]); await p.mouse.click(pt[0], pt[1]); await p.waitForTimeout(120) }
const asbob = async (a) => { await p.click(`#ilova .pl .asb[data-t="${a}"]`); await p.waitForTimeout(100) }
// labirintni maqsadga keltirish — farq qilgan har katak asbob bilan bosiladi (avval devorlar, keyin kalit, eshik, yulduz)
const yasa = async (id) => {
  const maq = m(LB[id]).split('|'), H = maq.length
  const hoz = () => p.evaluate(() => document.querySelector('#ilova .katak').dataset.xarita.split('|'))
  let h = await hoz(); await asbob('devor')
  for (let q = 0; q < H; q++) for (let x = 0; x < 7; x++) { if ((maq[q][x] === '#') !== (h[q][x] === '#')) await katak(x, H - 1 - q) }
  for (const [a, ch] of [['kalit', 'K'], ['eshik', 'E'], ['yulduz', '*']]) { h = await hoz(); const t = maq.join('').indexOf(ch); if (t >= 0) { const tx = t % 7, tq = Math.floor(t / 7); if (h[tq][tx] !== ch) { await asbob(a); await katak(tx, H - 1 - tq) } } else { const e = h.join('').indexOf(ch); if (e >= 0) { await asbob(a); await katak(e % 7, H - 1 - Math.floor(e / 7)) } } }
  await asbob('devor')
}
// 7-qadam (ustoz): BOSH → U1 (10 devor), (5, 4) — yo'l yo'q, qayta — bor; start; «Sinab ko‘rish»
await och('P6', false); let r = await korin()
tek('7: BOSH, «Devor: 0 · Yo‘l: 10 qadam», «Daraja: 2 / 2», tugma «▶ Sinab ko‘rish»', r.olchov === 'Devor: 0 · Yo‘l: 10 qadam' && r.daraja === 'Daraja: 2 / 2' && r.tugma === '▶ Sinab ko‘rish', JSON.stringify(r))
await yasa('U1'); r = await korin(); tek('7: kataklarni bosib U1 yasaldi — «Devor: 10 · Yo‘l: 10 qadam»', r.xarita === m(LB.U1) && r.olchov === 'Devor: 10 · Yo‘l: 10 qadam', JSON.stringify(r))
await katak(5, 4); r = await korin(); tek('7: (5, 4) — «Devor: 11 · Yo‘l yo‘q», Kamvoy «Yo‘l yo‘q!»', r.olchov === 'Devor: 11 · Yo‘l yo‘q' && r.muam === 'kamvoy:Yo‘l yo‘q!' && r.ishora === 'Yulduzga yo‘l yo‘q. Qaysi devorni olib tashlaysiz?', JSON.stringify(r))
await boshla(); r = await korin(); tek('7: yo‘l yo‘q — «Sinab ko‘rish» boshlanmaydi', !r.oyin && r.muam === 'kamvoy:Yo‘l yo‘q!', JSON.stringify(r))
await katak(5, 4); r = await korin(); tek('7: yana bosildi — devor ketdi, «Yo‘l: 10 qadam», muammocha ketdi', r.olchov === 'Devor: 10 · Yo‘l: 10 qadam' && !r.muam, JSON.stringify(r))
await katak(0, 0); r = await korin(); tek('start bosildi — «Start — (0, 0). Unga hech narsa qo‘yilmaydi», labirint o‘zgarmadi', r.ishora === 'Start — (0, 0). Unga hech narsa qo‘yilmaydi' && r.xarita === m(LB.U1), r.ishora)
await boshla(); await bos(sol('U1')); r = await korin(); tek('7: «Sinab ko‘rish» — o‘ynadi, «Siz yutdingiz!»', r.konfeti && r.ishora === 'Siz yutdingiz!', JSON.stringify(r))
// 10-qadam (ustoz): U1 — eshik (3, 4) keraksiz; (5, 4) — kalit qani; kalit (0, 2) — U2
await och('P7', false); await asbob('eshik'); await katak(3, 4); r = await korin()
tek('10: eshik (3, 4) — Ortiqvoy «Eshik keraksiz!»', r.muam === 'ortiqvoy:Eshik keraksiz!' && r.ishora === 'Yulduzga eshikdan o‘tmay ham boriladi. Eshik yo‘lni to‘ssin', JSON.stringify(r))
await katak(5, 4); r = await korin(); tek('10: eshik (5, 4) ga ko‘chdi — Kamvoy «Kalit qani?», «Kalit — · Eshik ✓ · Yo‘l yo‘q»', r.muam === 'kamvoy:Kalit qani?' && r.olchov === 'Kalit — · Eshik ✓ · Yo‘l yo‘q' && !/E/.test(r.xarita.split('|')[0].slice(0, 4)), JSON.stringify(r))
await asbob('kalit'); await katak(0, 2); r = await korin(); tek('10: kalit (0, 2) — U2, «Kalit ✓ · Eshik ✓ · Yo‘l: 10 qadam»', r.xarita === m(LB.U2) && r.olchov === 'Kalit ✓ · Eshik ✓ · Yo‘l: 10 qadam' && !r.muam, JSON.stringify(r))
await boshla(); await bos(sol('U2')); r = await korin(); tek('10: «Sinab ko‘rish» — kalit, eshik, yutdi', r.konfeti && r.ishora === 'Siz yutdingiz!', JSON.stringify(r))
// 8-, 11-qadam (bola): pog'onalar — namunalar bosib yasaladi, o'zi o'ynab yutadi; labirint pog'onadan pog'onaga o'tadi
const POG = [['B1A', 'N1', 'Devor: 8 / 6 · Yo‘l: 10 qadam'], ['B1B', 'N2', 'Yo‘l: 16 / 14 qadam'], ['B1C', 'N3', 'Burilish: 6 / 5'], ['B1Y', 'NY', 'Boshi berk yo‘l: 3 / 2'], ['B2A', 'NK1', 'Kalit ✓ · Eshik ✓'], ['B2B', 'NK2', 'Borib qaytish: bor'], ['B2Y', 'NKY', 'Yo‘l: 20 / 20 qadam']]
let oldingi = 'BOSH'
for (const [id, nm, ol] of POG) {
  await och(id); r = await korin()
  tek(id + ': labirint oldingi pog‘onadan (' + oldingi + ')', r.xarita === m(LB[oldingi]), r.xarita)
  if (id === 'B1B') { await boshla(); await bos(sol('N1')); r = await korin(); tek('B1B: shart bajarilmagan holda yutdi — Kamvoy «Oz qoldi!», «Yo‘l: 10 qadam. Kerak: kamida 14»', r.muam === 'kamvoy:Oz qoldi!' && r.ishora === 'Yo‘l: 10 qadam. Kerak: kamida 14', JSON.stringify(r)) }
  await yasa(nm); r = await korin()
  tek(id + ': ' + nm + ' yasaldi — «' + ol + '», «Labirint tayyor. Endi o‘zingiz o‘ynab ko‘ring…»', r.xarita === m(LB[nm]) && r.olchov === ol && r.ishora === 'Labirint tayyor. Endi o‘zingiz o‘ynab ko‘ring — «Sinab ko‘rish»', JSON.stringify(r))
  await boshla(); await bos(sol(nm)); r = await korin()
  tek(id + ': o‘zi o‘ynab yutdi — «Labirint tayyor!»', r.konfeti && r.ishora === 'Labirint tayyor!', JSON.stringify(r))
  oldingi = nm
}
r = await p.evaluate(() => [localStorage.getItem('jr-labirint-daraja2'), qPog]); tek('2-daraja saqlandi (NKY), pog‘ona 7', r[0] === m(LB.NKY) && r[1] === 7, JSON.stringify(r))
await p.evaluate((x) => localStorage.setItem('jr-labirint-daraja2', x), m(LB.NK1))
// 14-qadam (ustoz): D1 → U2, «2-daraja!», ro'yxat
await och('P8', false); r = await korin(); tek('14: «Daraja: 1 / 2», ro‘yxat ✓✓··· (U2 — ustozniki, bola 2-darajasi NK1 ✓)', r.daraja === 'Daraja: 1 / 2' && r.chek.length === 5, JSON.stringify(r))
await boshla(); await bos(sol('D1').slice(0, -1)); await p.keyboard.press(KEY[sol('D1').slice(-1)]); await p.waitForTimeout(700); r = await p.evaluate(() => ({ d: (document.querySelector('#ilova .daraja-otdi') || {}).textContent || '', x: document.querySelector('#ilova .katak').dataset.xarita }))
tek('14: 1-daraja yutildi — «2-daraja!»', r.d === '2-daraja!', JSON.stringify(r))
await p.waitForTimeout(1700); r = await korin(); tek('14: 2-daraja — U2, «Daraja: 2 / 2», o‘yin davom etadi', r.xarita === m(LB.U2) && r.daraja === 'Daraja: 2 / 2' && r.oyin, JSON.stringify(r))
await bos(sol('U2')); r = await korin(); tek('14: ikkinchi daraja ham yutildi — «Siz yutdingiz!», «Ikki daraja yutildi» ✓', r.konfeti && r.ishora === 'Siz yutdingiz!' && r.chek[3] === '✓', JSON.stringify(r))
// 15-qadam (bola): D1 → NK1; ro'yxat to'rt band; ★ — adashmasdan
await p.evaluate(() => localStorage.removeItem(K + 'chek'))
await och('B3A'); r = await korin(); tek('15 · 1: «To‘rt strelka», «Qoida», «2-daraja: kalit va eshik» ✓ bo‘lib keldi', r.chek === '✓✓✓··', r.chek)
await boshla(); await bos(sol('D1')); await p.waitForTimeout(1700); await bos(sol('NK1')); r = await korin()
tek('15 · 1: ikkala daraja yutildi — «O‘yiningiz tayyor!»', r.konfeti && r.ishora === 'O‘yiningiz tayyor!' && r.chek === '✓✓✓✓·', JSON.stringify(r))
await och('B3Y'); await boshla(); await bos('↑'); r = await korin(); tek('15 · ★: devor tomonga — «Devor tomonga bosildi. Qaytadan — «▶ Boshlash»»', r.ishora === 'Devor tomonga bosildi. Qaytadan — «▶ Boshlash»', JSON.stringify(r))
await bos(sol('D1')); await p.waitForTimeout(1700); await bos(sol('NK1')); r = await korin(); tek('15 · ★: «yo‘q» bilan yutdi — Kamvoy «Oz qoldi!»', r.muam === 'kamvoy:Oz qoldi!', JSON.stringify(r))
await boshla(); await boshla(); await bos(sol('D1')); await p.waitForTimeout(1700); await bos(sol('NK1')); r = await korin(); tek('15 · ★: adashmasdan — yutdi', r.konfeti && r.ishora === 'Siz yutdingiz!', JSON.stringify(r))
// 16-qadam: do'st o'ynaydi
await och('BD'); r = await korin(); tek('16: «▶ Do‘stingiz o‘ynaydi», dastur va asboblar yo‘q, «Daraja: 1 / 2»', r.tugma === '▶ Do‘stingiz o‘ynaydi' && !(await p.$('#ilova .jr-bl')) && !(await p.$('#ilova .asb')) && r.daraja === 'Daraja: 1 / 2', JSON.stringify(r))
await p.click('#ilova .hn .so-t'); await p.waitForTimeout(400); await bos('↑' + sol('D1')); await p.waitForTimeout(1700); await bos(sol('NK1')); r = await korin()
const dn = await p.evaluate(() => { const d = document.querySelector('#ilova .dost-n'); return d && !d.hidden ? d.querySelector('b').textContent : '' })
tek('16: do‘st ikkala darajani yutdi — «Do‘stingiz o‘ynadi: 2 / 2 daraja · 1 marta devor oldida to‘xtadi»', dn === 'Do‘stingiz o‘ynadi: 2 / 2 daraja · 1 marta devor oldida to‘xtadi', dn)
tek('16: 2-darajada do‘stining yo‘li — oltin iz', (await p.$$('#ilova .katak .kt-il')).length >= sol('NK1').length - 1)
// 17-qadam: natija
await och('B5'); await p.waitForTimeout(400)
r = await p.evaluate(() => { const ek = document.querySelector('#ilova .ekran'), son = (k) => (ek.querySelector('.sn-t[data-k="' + k + '"] b') || {}).textContent; return { chek: [...ek.querySelectorAll('.chek-y .ch-r')].map((x) => (x.classList.contains('ok') ? '✓' : '·')).join(''), saq: !ek.querySelector('.saqlandi').hidden, dost: (ek.querySelector('.dost-n b') || {}).textContent, devor: son('ta devor qo‘ydi'), yol: son('qadam — labirintingiz yo‘li'), xarita: ek.querySelector('.katak').dataset.xarita } })
tek('17: ro‘yxat besh band ✓, «O‘yiningiz saqlandi…», do‘st natijasi', r.chek === '✓✓✓✓✓' && r.saq && /2 \/ 2 daraja/.test(r.dost || ''), JSON.stringify(r))
tek('17: natija — oxirgi yasalgan labirint (NKY): ' + SIM.NKY.devor + ' devor, ' + SIM.NKY.yol + ' qadam', r.devor === String(SIM.NKY.devor) && r.yol === String(SIM.NKY.yol), JSON.stringify(r))
// huk
await och('P2', false); await p.click('#ilova .hn .so-t'); await p.waitForTimeout(300); await tinch(); r = await korin(); tek('2: «O‘ynab ko‘rsat» — Coddy D1 ni yutdi', r.konfeti, JSON.stringify(r))
await och('P2S', false)
for (let i = 0; i < 3; i++) { await p.waitForFunction((n) => document.querySelectorAll('#ilova .jk .jn').length >= n && !document.querySelector('#ilova .ekran').dataset.yuryapti, i + 1, { timeout: 60000 }); if (i < 2) { await p.click('#ilova .hn .asos'); await p.waitForTimeout(400) } }
r = await p.evaluate(() => [...document.querySelectorAll('#ilova .jk .jn')].map((x) => x.textContent).join(' | '))
tek('3: A «✕ boshqaruv va qoida yo‘q» · B «✕ labirint baribir bitta» · C «✓ ikki labirint, dastur o‘sha»', r === '✕ boshqaruv va qoida yo‘q | ✕ labirint baribir bitta | ✓ ikki labirint, dastur o‘sha', r)
r = await korin(); tek('3: C oxirida — Z, «Daraja: 2 / 2»', r.xarita === m(LB.Z) && r.daraja === 'Daraja: 2 / 2', JSON.stringify(r))
tek('konsolda xato yo‘q', !xato.length, xato.slice(0, 3).join(' | '))
await b.close()
console.log(`\n${ok} / ${jami}`)
process.exit(ok === jami ? 0 : 1)
