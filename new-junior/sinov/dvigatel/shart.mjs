// Shart sinovi (8-dars, 20.11): manba 008 «Topshiriqlar» jadvalidagi har yechim va xato varianti 8-darsning HAQIQIY ekranlarida (demo-008.html,
// ikki labirint) yuriladi va shu fayldagi MUSTAQIL labirint simulyatori bilan solishtiriladi (dvigatel kodidan foydalanmaydi).
// Yana: javon orqali haqiqiy bosish (repeat → if ichiga → move if ichiga; tanlangan if + if — keyin), ichi bo'sh if, egizak yorliqlari ✓/✕, huk, erkin sayr.
// Ishlatish (lokal server 5340 yoniq, demo-008 yig'ilgan):  node new-junior/sinov/dvigatel/shart.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-008.html'
const m = (s) => s.replace(/·/g, '.').replace(/★/g, '*')
const LB = { // manba «Labirintlar» jadvali (mustaqil nusxa)
  B1A: ['#S#|#·#|#★#|###|###|###', '#S#|#·#|#·#|#·#|#·#|#★#'], B1B: ['###|###|#★#|#·#|#·#|#S#', '#★#|#·#|#·#|#·#|#·#|#S#'],
  B1C: ['#######|##★####|##·####|S··####', '#######|#######|####★##|S····##'], B1Y: ['S#★####|·#·####|···####|#######', 'S####★#|·####·#|·####·#|······#'],
  B2A: ['S··##|##·##|##··★|#####', 'S·#####|#··####|##··###|###···★'], B2B: ['★·###|#··##|##··#|###·S', '★·#####|#····##|####··S'],
  B2C: ['###·S|#···#|#·###|★·###', '######S|###····|★···###'], B2Y: ['#######|##···##|#··#··#|S·###·★', '##···##|#··#·##|··##··#|S####·★'],
  B3A: ['#######|S···★##|#######', '#######|S·····★|#######'], B3B: ['###★#|##··#|#··##|S·###', '####★#|###··#|###·##|S···##'],
  B3C: ['S####|··###|#···#|###·★', 'S··####|##····#|#####·★'], SAYR: ['·#···#·|···#···|·#·S·#·|···#···|·#···#·'],
}
const D = { r: [1, 0], l: [-1, 0], u: [0, -1], d: [0, 1], right: [1, 0], left: [-1, 0], up: [0, -1], down: [0, 1] }
const DN = { right: 'r', left: 'l', up: 'u', down: 'd' }
// dastur: ['p', n, [...]] — takrorlash; ['a', yon, [...]] — shart; 'r' — move
function yur(x, dastur) {
  const xr = m(x).split('|'), top = (b) => { for (let y = 0; y < xr.length; y++) { const i = xr[y].indexOf(b); if (i >= 0) return [i, y] } return null }
  let [px, py] = top('S'); const yul = top('*'); let urildi = null, qadam = 0
  const devor = (x2, y2) => (xr[y2] || '')[x2] === undefined || xr[y2][x2] === '#'
  const bajar = (d, ota) => { for (const b of d) { if (urildi) return; if (Array.isArray(b) && b[0] === 'p') { for (let i = 0; i < b[1] && !urildi; i++) bajar(b[2], ota) } else if (Array.isArray(b)) { const [dx, dy] = D[b[1]]; if (!devor(px + dx, py + dy)) bajar(b[2], b[1]) } else { const [dx, dy] = D[b]; if (devor(px + dx, py + dy)) { urildi = { ota }; return } px += dx; py += dy; qadam++ } } }
  bajar(dastur, null)
  return { urildi, yetdi: !urildi && yul && px === yul[0] && py === yul[1], qadam }
}
const GY = { B3A: 'Xatoni tuzatdingiz!', B3B: 'Xatoni tuzatdingiz!', B3C: 'Xatoni tuzatdingiz!' }
function kut(id, d) {
  for (let n = 1; n <= 2; n++) {
    const r = yur(LB[id][n - 1], d)
    if (r.urildi) return ['tosiqvoy:Devor!', n + '-labirint: ' + (r.urildi.ota ? 'shart bir tomonni tekshirdi, blok boshqa tomonga yurdi' : 'bu blok yo‘lni tekshirmay yurdi. Yurishdan oldin tekshiring'), n]
    if (!r.yetdi) return ['kamvoy:Oz qoldi!', n + '-labirintda yulduzgacha yetmadi. repeat soni va shart tomonini tekshiring', n]
  }
  return ['', GY[id] || 'Ikkalasida yetdi!', 2]
}
const blq = (d) => d.map((b) => (Array.isArray(b) ? (b[0] === 'p' ? { t: 'p', m: String(b[1]), ichki: blq(b[2]) } : { t: 'a', m: b[1], ichki: blq(b[2]) }) : { t: b }))
const yoz = (d) => d.map((b) => (Array.isArray(b) ? (b[0] === 'p' ? 'R' + b[1] + '[' + yoz(b[2]) + ']' : 'if' + { right: '→', left: '←', up: '↑', down: '↓' }[b[1]] + '[' + yoz(b[2]) + ']') : { r: '→', l: '←', u: '↑', d: '↓' }[b])).join(' ')
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }), xato = []
const p = await (await b.newContext({ viewport: { width: 1440, height: 810 } })).newPage()
p.on('pageerror', (e) => xato.push(e.message)); p.on('console', (mm) => { if (mm.type() === 'error' && !/Failed to load resource/.test(mm.text())) xato.push(mm.text()) })
let ok = 0, jami = 0
const tek = (nom, shart, iz = '') => { jami++; if (shart) ok++; console.log((shart ? '✓ ' : '✗ ') + nom + (shart || !iz ? '' : '  — ' + iz)) }
await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'momiq') })
await p.goto(U + '?rol=bola&xona=shart-sinov'); await p.waitForTimeout(900)
await p.evaluate(() => { bolaKeyingi = () => {}; window.__ijroAsl = ijro; ijro = (d, f, op) => window.__ijroAsl(d, f, { ...(op || {}), kut: 60 }); window.KUT0 = KUT })
const och = (id) => p.evaluate((id) => { const il = document.getElementById('ilova'), bola = id[0] === 'B'; il.innerHTML = bola ? '<div id="bol">' + ekran(id, null, true) + '</div>' : '<div id="ust">' + ekran(id) + '</div>'; studiyaTayyorla(il.firstChild); il.querySelectorAll('.dv-muam,.konfeti').forEach((x) => x.remove()) }, id).then(() => p.waitForTimeout(300))
const qur = (d) => p.evaluate((d) => { const ek = document.querySelector('#ilova .ekran'); blQur(ek, d); sanoq(ek) }, blq(d))
const ishga = async () => { await p.evaluate(() => ishgaTushir(document.querySelector('#ilova .ekran'))); await p.waitForFunction(() => !document.querySelector('#ilova .ekran').dataset.yuryapti, null, { timeout: 60000 }); await p.waitForTimeout(250) }
const korin = () => p.evaluate(() => { const ek = document.querySelector('#ilova .ekran'), mu = ek.querySelector('.dv-muam'); return { muam: mu ? (mu.className.match(/m-(\w+)/) || [])[1] + ':' + mu.textContent.trim() : '', ishora: (ek.querySelector('.hn .hint') || {}).textContent || '', konfeti: !!ek.querySelector('.oyna .konfeti'), egiz: [...ek.querySelectorAll('.katak[data-egiz] .egiz-n')].sort((a, c) => a.textContent.localeCompare(c.textContent)).map((x) => x.textContent + (x.classList.contains('ok') ? '✓' : x.classList.contains('yoq') ? '✕' : '')).join(' '), dsn: (ek.querySelector('.dsn') || {}).textContent || '' } })
const tuzilish = () => p.evaluate(() => { const ws = BL_WS.get(document.querySelector('#ilova .ekran')), y = { right: '→', left: '←', up: '↑', down: '↓' }; const z = (b) => (b.type === 'repeat' ? 'R' + b.getFieldValue('N') + '[' + blZanjir(b.getInputTargetBlock('DO')).map(z).join(' ') + ']' : b.type === 'if_path' ? 'if' + y[b.getFieldValue('YON')] + '[' + blZanjir(b.getInputTargetBlock('DO')).map(z).join(' ') + ']' : { move_right: '→', move_left: '←', move_up: '↑', move_down: '↓' }[b.type]); return blRoyxat(ws).map(z).join(' ') })
const javon = async (f, nom) => { await p.click('#ilova .rg .rd.f-' + f); await p.waitForTimeout(100); await p.locator('#ilova .pl .mbw:not(.yopiq) .mb', { hasText: nom }).first().click(); await p.waitForTimeout(200) }
// 1) javon orqali: repeat → if ichiga → move if ichiga; tanlangan if + if — keyin
await och('B2A'); await javon('b', 'repeat'); await javon('a', 'if path'); r0()
async function r0() {}
let r = await tuzilish(); tek('repeat tanlangan + if — if repeat ichiga tushdi va tanlandi', r === 'R2[if→[]]' && (await p.$$('#ilova .jr-bl .bl-tanlangan')).length === 1, r)
await javon('h', 'move right'); r = await tuzilish(); tek('tanlangan if + move right — if ichiga', r === 'R2[if→[→]]', r)
await javon('a', 'if path'); r = await tuzilish(); tek('tanlangan if + yana if — undan keyin, o‘sha darajada', r === 'R2[if→[→] if→[]]', r)
await javon('h', 'move down'); r = await tuzilish(); tek('yangi if tanlangan — move down uning ichiga; «5 / 5 ta blok»', r === 'R2[if→[→] if→[↓]]' && (await korin()).dsn === '5 / 5 ta blok', r + ' ' + (await korin()).dsn)
// 2) ichi bo'sh if
await och('B1A'); await qur([['p', 5, [['a', 'down', []]]]]); await ishga(); r = await korin()
tek('ichi bo‘sh if — Bo‘shvoy «Ichi bo‘sh-ku…», «if ichiga blok qo‘ying — yo‘l bo‘lsa, u bajariladi»', r.muam === 'boshvoy:Ichi bo‘sh-ku…' && r.ishora === 'if ichiga blok qo‘ying — yo‘l bo‘lsa, u bajariladi', JSON.stringify(r))
// 3) yechimlar va xato variantlari (manba jadvali)
const A = (yon, ...ich) => ['a', yon, ich], R = (n, ...ich) => ['p', n, ich]
const ISH = [
  ['B1A', [R(5, A('down', 'd'))]], ['B1A', [R(2, 'd')]], ['B1A', [R(5, 'd')]], ['B1A', [R(5, A('right', 'd'))]],
  ['B1B', [R(5, A('up', 'u'))]], ['B1B', [R(3, 'u')]], ['B1B', [R(4, A('up', 'u'))]],
  ['B1C', [R(4, A('right', 'r')), R(2, A('up', 'u'))]], ['B1C', [R(4, A('right', 'r'), A('up', 'u'))]], ['B1C', [R(4, 'r'), R(2, 'u')]], ['B1C', [R(4, A('right', 'r')), R(2, 'u')]],
  ['B1Y', [R(3, A('down', 'd')), R(5, A('right', 'r')), R(3, A('up', 'u'))]], ['B1Y', [R(2, 'd'), R(2, 'r'), R(2, 'u')]],
  ['B2A', [R(6, A('right', 'r'), A('down', 'd'))]], ['B2A', [R(6, A('down', 'd'), A('right', 'r'))]],
  ['B2B', [R(6, A('left', 'l'), A('up', 'u'))]], ['B2B', [R(5, A('left', 'l'), A('up', 'u'))]],
  ['B2C', [R(7, A('left', 'l'), A('down', 'd'))]], ['B2C', [R(6, A('left', 'l'), A('down', 'd'))]],
  ['B2Y', [R(4, A('right', 'r'), A('up', 'u')), R(4, A('right', 'r'), A('down', 'd'))]],
  ['B3A', null], ['B3A', [R(7, A('right', 'r'))]], ['B3B', null], ['B3B', [R(8, A('right', 'r'), A('up', 'u'))]],
  ['B3C', null], ['B3C', [R(8, A('down', 'd'), A('right', 'r'))]], ['B3C', [R(8, A('down', 'd'), A('down', 'd'))]],
]
const TAY = { B3A: [R(7, A('up', 'r'))], B3B: [R(8, A('right', 'r'), 'u')], B3C: [R(8, A('down', 'd'), A('right', 'd'))] }
for (const [id, d0] of ISH) {
  await och(id); const d = d0 || TAY[id]; if (d0) await qur(d0)
  await ishga(); r = await korin(); const [mu, ish, n] = kut(id, d), yaxshi = !mu
  const eg = n === 2 && yaxshi ? '1✓ 2✓' : n === 1 ? '1✕ 2' : '1✓ 2✕'
  tek((id + (d0 ? '' : ' (tayyor)') + ' ' + yoz(d)).padEnd(52) + ' → ' + (mu || 'yetdi') + ' · ' + ish, r.muam === mu && r.ishora === ish && r.konfeti === yaxshi && r.egiz === eg, JSON.stringify(r))
}
// 4) erkin sayr (15 · ★): kamida ikki if har xil tomonga, 4 qadam
const SAY = [[[R(10, A('right', 'r'), A('up', 'u'))], 'tayyor'], [[R(6, A('right', 'r'), A('left', 'l'))], 'tayyor'], [[R(10, A('up', 'u')), R(10, A('right', 'r'))], 'kamYurdi'], [[R(5, A('right', 'r'))], 'kamShart']]
for (const [d, k] of SAY) {
  await och('B3Y'); await qur(d); await ishga(); r = await korin(); const q = yur(LB.SAYR[0], d)
  const kt = new Set(JSON.stringify(d).match(/"(right|left|up|down)"/g)).size < 2 ? 'kamShart' : q.urildi ? 'urildi' : q.qadam < 4 ? 'kamYurdi' : 'tayyor'
  const ISH2 = { tayyor: ['', 'Sayringiz tayyor!'], kamYurdi: ['kamvoy:Oz qoldi!', 'Qahramon kam yurdi. Boshqa tomonlarni tekshiring'], kamShart: ['kamvoy:Oz qoldi!', 'Ikki if qo‘ying — har xil tomonga'] }[kt]
  tek(('B3Y sayr ' + yoz(d)).padEnd(52) + ' → ' + kt + ' (' + q.qadam + ' qadam)', kt === k && r.muam === ISH2[0] && r.ishora === ISH2[1], JSON.stringify(r))
}
// 5) huk: A — 1 ✓ 2 ✕, B — 1-da urildi, C — ikkalasida
await och('P2S'); await p.waitForFunction(() => document.querySelectorAll('#ilova .jk .jn').length >= 1, null, { timeout: 30000 }).catch(() => {})
for (let n = 2; n <= 3; n++) { await p.waitForFunction(() => !document.querySelector('#ilova .ekran').dataset.yuryapti, null, { timeout: 30000 }); await p.click('#ilova .hn .asos'); await p.waitForFunction((n) => document.querySelectorAll('#ilova .jk .jn').length >= n && !document.querySelector('#ilova .ekran').dataset.yuryapti, n, { timeout: 40000 }).catch(() => {}) }
const huk = await p.evaluate(() => [...document.querySelectorAll('#ilova .jk')].map((x) => (x.classList.contains('n-ok') ? '✓' : '✕') + (x.querySelector('.jn') || {}).textContent).join(' | '))
tek('huk: A ✕ «2-labirintda yetmadi», B ✕ «devorga urildi», C ✓ «ikkalasida yetdi»', huk === '✕✕ 2-labirintda yetmadi | ✕✕ devorga urildi | ✓✓ ikkalasida yetdi', huk)
tek('konsolda xato yo‘q', !xato.length, xato.slice(0, 3).join(' | '))
console.log(`\n${ok} / ${jami} — ${ok === jami ? 'HAMMASI TO‘G‘RI' : 'XATO BOR'}`)
await b.close(); process.exit(ok === jami ? 0 : 1)
