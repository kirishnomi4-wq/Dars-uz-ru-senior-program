// Katak sahnasi sinovi (dvigatel 5a, 19.11): 2-dars manbasidagi 10 xarita va 22 dastur — haqiqiy studiyada (Blockly + ijrochi + sahna) yurgiziladi,
// natija shu fayldagi MUSTAQIL simulyatsiya bilan solishtiriladi (dvigatel kodidan foydalanmaydi): qayerda to'xtadi, qaysi blokda urildi, kalit olindimi.
// Yana: ekrandagi holat — qahramon o'sha katakda, oltin iz soni, urilgan blok sariq qoladi, muammocha va ishora gapi, konfeti.
// 5b-2 (19.11): sinov 2-darsning HAQIQIY ekranlarida yuradi (demo-002.html): har xarita o'zi turgan ekranda (EK) — ekran qayta chiziladi,
// labirinti manbadagi xarita bilan bir xilmi tekshiriladi, keyin dastur Blockly'ga qo'shilib ishga tushiriladi (ustoz ekrani — #ust, bola ekrani — #bol).
// Ishlatish (lokal server 5340 yoniq, demo yig'ilgan):  node new-junior/sinov/dvigatel/katak.mjs [--surat <papka>]
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-002.html'
// har xarita qaysi ekranda (manba 002: H — 10-qadam, N — 7, P1…PY — 8, KN — 14, K1…KY — 15)
const EK = { H: 'P7', N: 'P6', P1: 'B2', P2: 'B2B', P3: 'B2C', PY: 'B2Y', KN: 'P8K', K1: 'B4A', K2: 'B4B', KY: 'B4Y' }
const SURAT = process.argv.includes('--surat') ? process.argv[process.argv.indexOf('--surat') + 1] : ''
const X = { // manba/002-ketma-ketlik.md «Labirintlar» jadvali (tepadan pastga)
  H: '##..*|##.##|S..##', N: '#..*|S.##', P1: '...*|.###|S###', P2: 'S.##|#.##|#..*', P3: '###.*|#...#|S.###', PY: '####.*|#....#|#.####|S.####',
  KN: '..E*|SK##', K1: '...E*|.####|SK###', K2: 'S..E*|.####|K####', KY: '...E*|.####|S.K##',
}
const B = { '→': 'r', '←': 'l', '↑': 'u', '↓': 'd' }
const ISH = [ // [xarita, dastur, manbadagi kutilgan natija (simulyatsiya bilan ham solishtiriladi)]
  ['H', '→→→→↑↑', 'urildi@3'], ['H', '↑↑→→→→', 'urildi@1'], ['H', '→→↑↑→→', 'yetdi'], ['H', '→→↑→↑→', 'urildi@4'],
  ['N', '→↑→→', 'yetdi'], ['N', '←', 'urildi@1'],
  ['P1', '↑↑→→→', 'yetdi'], ['P1', '↑→↑→→', 'urildi@2'], ['P1', '↑↑→→', 'kam'],
  ['P2', '→↓↓→→', 'yetdi'], ['P2', '→↓→↓→', 'urildi@3'],
  ['P3', '→↑→→↑→', 'yetdi'], ['P3', '↑→→→↑→', 'urildi@1'],
  ['PY', '→↑↑→→→↑→', 'yetdi'], ['PY', '↑→↑→→↑→→', 'urildi@1'], ['PY', '→↑↑→→↑→→', 'urildi@6'],
  ['KN', '↑→→→', 'eshik@3'], ['KN', '→↑→→', 'yetdi'],
  ['K1', '→←↑↑→→→→', 'yetdi'], ['K1', '↑↑→→→→', 'eshik@5'], ['K2', '↓↓↑↑→→→→', 'yetdi'], ['KY', '→→←←↑↑→→→→', 'yetdi'],
]
// mustaqil simulyatsiya
function sim(xarita, dastur) {
  const xr = xarita.split('|'); let x = 0, y = 0, kalit = false, iz = 0
  xr.forEach((r, j) => { const i = r.indexOf('S'); if (i >= 0) { x = i; y = j } })
  const d = { r: [1, 0], l: [-1, 0], u: [0, -1], d: [0, 1] }, bl = [...dastur].map((c) => B[c])
  for (let i = 0; i < bl.length; i++) {
    const nx = x + d[bl[i]][0], ny = y + d[bl[i]][1], c = (xr[ny] || '')[nx] || '#'
    if (c === '#') return { tur: 'urildi', blok: i + 1, x, y, kalit, iz }
    if (c === 'E' && !kalit) return { tur: 'eshik', blok: i + 1, x, y, kalit, iz }
    x = nx; y = ny; iz++; if (c === 'K') kalit = true
  }
  return { tur: xr[y][x] === '*' ? 'yetdi' : 'kam', blok: 0, x, y, kalit, iz }
}
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }), xato = []
const p = await (await b.newContext({ viewport: { width: 1440, height: 810 } })).newPage()
p.on('pageerror', (e) => xato.push(e.message)); p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) xato.push(m.text()) })
p.on('response', (r) => { if (r.status() >= 400 && !/favicon\.ico$/.test(r.url())) xato.push(r.status() + ' ' + r.url()) }) // favicon.ico — lokal serverda yo'q (LMS sinovlarida ham shunday)
let ok = 0, jami = 0
const tek = (nom, shart, iz = '') => { jami++; if (shart) ok++; console.log((shart ? '✓ ' : '✗ ') + nom + (shart || !iz ? '' : '  — ' + iz)) }
await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'momiq') })
await p.goto(U + '?rol=bola&xona=katak-sinov'); await p.waitForTimeout(900)
// bola muvaffaqiyatdan keyin keyingi ekranga o'tib ketmasin
await p.evaluate(() => { bolaKeyingi = () => {} })
await p.waitForTimeout(700)
const holat = (id, xarita, dastur, kut) => p.evaluate(async ({ id, xarita, dastur, kut }) => {
  const il = document.getElementById('ilova'), bola = id[0] === 'B'
  il.innerHTML = bola ? '<div id="bol">' + ekran(id, null, true) + '</div>' : '<div id="ust">' + ekran(id) + '</div>'; studiyaTayyorla(il.firstChild)
  const ek = il.querySelector('.ekran'), o = ek.querySelector('.oyna'), xaritaTeng = o.querySelector('.katak').dataset.xarita === xarita
  ek.querySelectorAll('.dv-muam,.konfeti').forEach((x) => x.remove())
  const ws = BL_WS.get(ek); ws.clear(); sanoq(ek)
  for (const t of dastur) blQosh(ek, t)
  sanoq(ek)
  window.__kut = kut
  if (!window.__ijroAsl) { window.__ijroAsl = ijro; ijro = (d, f, op) => window.__ijroAsl(d, f, { ...(op || {}), kut: window.__kut }) }
  const asl = SAHNA.katak.baho; let h0 = null; SAHNA.katak.baho = (h, ...a) => { h0 = h; return asl(h, ...a) }
  await ishgaTushir(ek); SAHNA.katak.baho = asl
  await new Promise((r) => setTimeout(r, 650))
  const bl = blBloklar(ek), u = bl.findIndex((x) => x.classList.contains('urildi'))
  const g = o.querySelector('.kt-q'), m = o.querySelector('.dv-muam')
  return {
    x: h0.x, y: h0.y, kalit: h0.kalit, tur: SAHNA.katak.baho(h0).tur, blok: u + 1, urildiSoni: bl.filter((x) => x.classList.contains('urildi')).length,
    joyTogri: g.style.transform.replace(/\s/g, '') === katakJoy(h0.x, h0.y), iz: o.querySelectorAll('.kt-il').length, izKatak: o.querySelectorAll('.kt-c.iz').length,
    kalitKorinadi: o.querySelector('.katak').classList.contains('kalitli'), eshikOchiq: o.querySelectorAll('.kt-eshik.ochiq').length,
    muam: m ? (m.className.match(/m-(\w+)/) || [])[1] : '', muamGap: m ? m.textContent.trim() : '', ishora: (ek.querySelector('.hn .hint') || {}).textContent || '',
    konfeti: !!o.querySelector('.konfeti'), xaritaTeng,
  }
}, { id, xarita, dastur, kut })
const GAP = { urildi: ['tosiqvoy', 'Devor!', 'Qahramon shu blokda to‘xtadi. Bu yerda qaysi tomonga yurish kerak?'], eshik: ['kamvoy', 'Kalit qani?', 'Eshik yopiq. Avval kalitni oling'], kam: ['kamvoy', 'Oz qoldi!', 'Oz qoldi! Yana blok qo‘shing'] }
for (const [n, prog, man] of ISH) {
  const s = sim(X[n], prog), kutilgan = s.tur + (s.blok ? '@' + s.blok : '')
  const r = await holat(EK[n], X[n], [...prog].map((c) => B[c]), 110)
  const ism = (EK[n] + ' ' + n + ' ' + prog)
  const bor = r.tur + (r.blok ? '@' + r.blok : '')
  const farq = []
  if (!r.xaritaTeng) farq.push('ekrandagi labirint manbadagi xarita emas')
  if (kutilgan !== man) farq.push('simulyatsiya ' + kutilgan + ' ≠ manba ' + man)
  if (bor !== kutilgan) farq.push('studiya ' + bor + ' ≠ ' + kutilgan)
  if (r.x !== s.x || r.y !== s.y) farq.push('joy ' + r.x + ',' + r.y + ' ≠ ' + s.x + ',' + s.y)
  if (r.kalit !== s.kalit || r.kalitKorinadi !== s.kalit) farq.push('kalit ' + r.kalit + '/' + r.kalitKorinadi + ' ≠ ' + s.kalit)
  if (!r.joyTogri) farq.push('qahramon ekranda boshqa joyda')
  if (r.iz !== s.iz) farq.push('iz ' + r.iz + ' ≠ ' + s.iz)
  if (r.urildiSoni !== (s.blok ? 1 : 0)) farq.push('sariq blok ' + r.urildiSoni)
  if (s.tur === 'yetdi' && (!r.konfeti || r.muam)) farq.push('konfeti yo‘q yoki muammocha chiqdi')
  if (GAP[s.tur] && (r.muam !== GAP[s.tur][0] || r.muamGap !== GAP[s.tur][1] || r.ishora !== GAP[s.tur][2])) farq.push('muammocha/ishora: ' + r.muam + ' «' + r.muamGap + '» · «' + r.ishora + '»')
  tek(ism.padEnd(23) + ' → ' + bor + (s.kalit ? ' (kalit)' : ''), !farq.length, farq.join('; '))
}
// urilgan blok belgisi: dastur o'zgarsa ketadi
const ketdi = await p.evaluate(() => { const ek = document.querySelector('#ilova .ekran'); blQosh(ek, 'r'); sanoq(ek); return blBloklar(ek).filter((x) => x.classList.contains('urildi')).length })
tek('sariq belgi dastur o‘zgarganda ketadi', ketdi === 0, ketdi + ' ta qoldi')
// suratlar (oddiy tezlikda): boshlanish · C yetdi · xato dastur urildi · kalitsiz eshik · kalit bilan chiqdi
if (SURAT) {
  const { mkdirSync } = await import('node:fs'); mkdirSync(SURAT, { recursive: true })
  for (const [nom, n, prog] of [['1-bosh', 'H', ''], ['2-yetdi', 'H', '→→↑↑→→'], ['3-urildi', 'H', '→→↑→↑→'], ['4-eshik', 'KN', '↑→→→'], ['5-kalit', 'K1', '→←↑↑→→→→']]) {
    if (prog) await holat(EK[n], X[n], [...prog].map((c) => B[c]), 700)
    else await p.evaluate((id) => { const il = document.getElementById('ilova'), bola = id[0] === 'B'; il.innerHTML = bola ? '<div id="bol">' + ekran(id, null, true) + '</div>' : '<div id="ust">' + ekran(id) + '</div>'; studiyaTayyorla(il.firstChild); const ek = il.querySelector('.ekran'), ws = BL_WS.get(ek); if (ws) ws.clear(); sanoq(ek); ishora(ek, '') }, EK[n])
    await p.waitForTimeout(prog ? 300 : 500)
    await p.screenshot({ path: SURAT + '/' + nom + '.png' })
  }
}
tek('konsolda xato yo‘q', !xato.length, xato.slice(0, 3).join(' | '))
await b.close()
console.log('\n' + ok + ' / ' + jami + (ok === jami ? ' — HAMMASI TO‘G‘RI' : ' — XATO BOR'))
process.exit(ok === jami ? 0 : 1)
