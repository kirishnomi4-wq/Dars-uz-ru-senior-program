// Labirint o'yini sinovi (9-dars, 20.11): manba 009 «Labirintlar» va «Topshiriqlar» jadvalidagi har da'vo — avval shu fayldagi MUSTAQIL
// simulyatorda (dvigatel kodidan foydalanmaydi): eng qisqa yechim (BFS, kalit va eshik bilan), zarur strelkalar, yechimlar har xil, huk ketma-ketliklari;
// keyin 9-darsning HAQIQIY ekranlarida (demo-009.html): Blockly dasturchalari, «▶ Boshlash», klaviatura haqiqiy bosiladi — natija simulyator bilan solishtiriladi.
// Yana: if ni dasturchaga qo'yish (javon orqali), muammocha va ishora gaplari, pog'ona shartlari, chek-list, dastur pog'onadan pog'onaga, chegara 16, natija.
// Ishlatish (lokal server 5340 yoniq, demo-009 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/dvigatel/labirint.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-009.html'
const m = (s) => s.replace(/·/g, '.').replace(/★/g, '*')
// manba «Labirintlar» jadvali (mustaqil nusxa, manbadagi belgilar bilan)
const LB = {
  H: '###···★|#···#·#|#·#···#|#···#·#|S·#···#', HA: '###···★|#·····#|#·····#|#·····#|S·#···#', N: '#######|#######|##···★#|##·####|S··####',
  B1: '··#####|·#····#|·#·##·#|·######|S····★#', B2: '····★##|·##·###|·##·#··|·#··#·#|S··##··', B3: '#·#####|#·#####|#···###|#·#·###|S·#··★#',
  BY: '#······|#·####★|#·····#|#####·#|S·····#', R: '#######|#·····★|#·#####|#···###|S·#####', Q1: '###···★|###·###|#···###|#·#####|S·#####',
  Q2: '★######|·######|·····##|####·##|S····##', Q3: '·#···#★|·#·#·#·|···#···|#·##·#·|S·#···#', QY: '#···#··|#·#·#·#|··#···#|·####·★|S····##',
  KN: '#######|#K·E··★|##·####|##·####|S··####', K1: '#######|##·####|##··E·★|##·####|S·K####', D1: '##···#★|#K#·##·|#·#··E·|#·#·###|S···###',
}
// manba: [eng qisqa yechim, zarur strelkalar]
const JAD = {
  H: ['→↑→→↑→→↑↑→', '→↑'], HA: ['→↑→→→→↑↑↑→', '→↑'], N: ['→→↑↑→→→', '→↑'], B1: ['→→→→→', '→'], B2: ['→→↑→↑↑↑→', '→↑'], B3: ['→↑↑→→↓↓→→', '→↑↓'],
  BY: ['→→→→→↑↑←←←←↑↑→→→→→↓', '→←↑↓'], R: ['→↑↑↑→→→→→', '→↑'], Q1: ['→↑↑→→↑↑→→→', '→↑'], Q2: ['→→→→↑↑←←←←↑↑', '→←↑'], Q3: ['→↑↑→↑↑→→↓↓→→↑↑', '→↑↓'],
  QY: ['↑↑→↑↑→→↓↓→→↓→', '→↑↓'], KN: ['→→↑↑↑←→→→→→', '→←↑'], K1: ['→→↑↑→→→→', '→↑'], D1: ['→↑↑↑↓↓↓→→↑↑→→→↑↑', '→↑↓'],
}
const SD = { '→': [1, 0], '←': [-1, 0], '↑': [0, -1], '↓': [0, 1] }, YON = { '→': 'right', '←': 'left', '↑': 'up', '↓': 'down' }, BELGI = { right: '→', left: '←', up: '↑', down: '↓', space: 'space' }
let ok = 0, jami = 0
const tek = (nom, shart, iz = '') => { jami++; if (shart) ok++; console.log((shart ? '✓ ' : '✗ ') + nom + (shart || !iz ? '' : '  — ' + iz)) }
// ---------- mustaqil simulyator ----------
const xarita = (id) => m(LB[id]).split('|')
const topB = (xr, b) => { for (let y = 0; y < xr.length; y++) { const i = xr[y].indexOf(b); if (i >= 0) return [i, y] } return null }
const myY = (xr, q) => xr.length - 1 - q
// eng qisqa yechim uzunligi — holat (x, y, kalit), eshik kalit bilan ochiq; strelkalar ro'yxati bilan cheklash mumkin
function bfs(id, strelka = '→←↑↓') {
  const xr = xarita(id), s = topB(xr, 'S'), yl = topB(xr, '*'), kor = new Set([s + ',0']), nav = [[s[0], s[1], 0, 0]]
  while (nav.length) {
    const [x, y, k, n] = nav.shift()
    if (x === yl[0] && y === yl[1]) return n
    for (const c of strelka) { const [dx, dy] = SD[c], nx = x + dx, ny = y + dy, ch = (xr[ny] || '')[nx]; if (ch === undefined || ch === '#' || (ch === 'E' && !k)) continue; const nk = k || ch === 'K' ? 1 : 0, kk = nx + ',' + ny + ',' + nk; if (!kor.has(kk)) { kor.add(kk); nav.push([nx, ny, nk, n + 1]) } }
  }
  return -1
}
// o'yin: dastur { tugma: [tugunlar] } — 'r' 'l' 'u' 'd' move, ['a', yon, [...]] shart, ['x', x, y] go to, 'n' tovush. Har bosishda dasturcha;
// shartsiz move devorga / chetga / kalitsiz eshikka — urildi, o'yin to'xtaydi; bosishdan keyin yulduzda — yutdi
const TD = { r: [1, 0], l: [-1, 0], u: [0, -1], d: [0, 1] }, YD = { right: [1, 0], left: [-1, 0], up: [0, -1], down: [0, 1] }
function oyna(id, dastur, bosish) {
  const xr = xarita(id), yl = topB(xr, '*'); let [x, y] = topB(xr, 'S'), kalit = false, eshik = false, yoq = 0, urildi = 0, n = 0, yutdi = 0, tovush = 0, tovushTurib = 0
  const devor = (a, b) => { const c = (xr[b] || '')[a]; return c === undefined || c === '#' || (c === 'E' && !kalit) }
  for (const c of bosish) {
    n++; let yurdi = 0, chal = 0
    const bajar = (tt) => { for (const t of tt) { if (urildi) return; if (Array.isArray(t) && t[0] === 'a') { const [dx, dy] = YD[t[1]]; if (devor(x + dx, y + dy)) { yoq++; continue } bajar(t[2]); continue } if (Array.isArray(t) && t[0] === 'x') { const nx = t[1], ny = xr.length - 1 - t[2]; if (devor(nx, ny)) { urildi = n; return } x = nx; y = ny; continue } if (t === 'n') { chal++; continue } const [dx, dy] = TD[t], nx = x + dx, ny = y + dy; if (devor(nx, ny)) { urildi = n; return } if (xr[ny][nx] === 'E') eshik = true; x = nx; y = ny; yurdi++; if (xr[y][x] === 'K') kalit = true } }
    bajar(dastur[c === ' ' ? 'space' : YON[c]] || [])
    tovush += chal; if (chal && !yurdi) tovushTurib++
    if (urildi) break
    if (x === yl[0] && y === yl[1]) { yutdi = n; break }
  }
  return { joy: [x, myY(xr, y)], urildi, yutdi, yoq, kalit, eshik, n, tovush, tovushTurib }
}
const SHARTSIZ = { right: ['r'], left: ['l'], up: ['u'], down: ['d'] }, TEPASIZ = { right: ['r'], left: ['l'], down: ['d'] }
const QOIDA = { right: [['a', 'right', ['r']]], left: [['a', 'left', ['l']]], up: [['a', 'up', ['u']]], down: [['a', 'down', ['d']]] }
const AVTO = '→↑→→↑→↑→↑↑→'
console.log('— 1. Mustaqil simulyator: manba jadvali')
for (const id in JAD) {
  const [yech, zarur] = JAD[id], xr = xarita(id)
  tek(id + ': xarita 7 × 5, start (0, 0)', xr.length === 5 && xr.every((q) => q.length === 7) && topB(xr, 'S')[0] === 0 && topB(xr, 'S')[1] === 4)
  tek(id + ': eng qisqa yechim ' + yech.length + ' qadam (BFS)', bfs(id) === yech.length, 'BFS ' + bfs(id))
  const s1 = oyna(id, SHARTSIZ, yech), s2 = oyna(id, QOIDA, yech)
  tek(id + ': manbadagi yechim shartsiz ham, qoida bilan ham urilmay yutadi', s1.yutdi === yech.length && !s1.urildi && s2.yutdi === yech.length && !s2.yoq, JSON.stringify([s1, s2]))
  const z = [...'→←↑↓'].filter((c) => bfs(id, [...'→←↑↓'].filter((d) => d !== c).join('')) < 0).join('')
  tek(id + ': zarur strelkalar ' + zarur, [...z].sort().join('') === [...zarur].sort().join(''), z)
}
const yechimlar = Object.keys(JAD).filter((id) => id !== 'HA').map((id) => JAD[id][0])
tek('eng qisqa yechimlarning hech qaysi ikkitasi bir xil emas', new Set(yechimlar).size === yechimlar.length)
tek('1-bekat: B2 faqat → bilan yechilmaydi', bfs('B2', '→') < 0)
tek('1-bekat: B3 → ↑ bilan yechilmaydi', bfs('B3', '→↑') < 0)
tek('1-bekat: BY → ↑ ↓ bilan yechilmaydi', bfs('BY', '→↑↓') < 0)
// kalitli labirintlar: eshik yulduzga yagona yo'lni to'sadi (eshik devor bo'lsa — yetib bo'lmaydi), kalitga eshiksiz yetiladi
const yetadi = (xr, s, t) => { const kor = new Set([s.join()]), nav = [s]; while (nav.length) { const [x, y] = nav.shift(); if (x === t[0] && y === t[1]) return true; for (const [dx, dy] of Object.values(SD)) { const nx = x + dx, ny = y + dy, c = (xr[ny] || '')[nx]; if (c === undefined || c === '#' || c === 'E' || kor.has(nx + ',' + ny)) continue; kor.add(nx + ',' + ny); nav.push([nx, ny]) } } return false }
for (const id of ['KN', 'K1', 'D1']) {
  const xr = xarita(id), s = topB(xr, 'S')
  tek(id + ': eshik yulduzga yagona yo‘lni to‘sadi', !yetadi(xr, s, topB(xr, '*')))
  tek(id + ': kalitga eshiksiz yetiladi', yetadi(xr, s, topB(xr, 'K')))
}
// huk (manba «Topshiriqlar» 2–4-qator)
let h = oyna('H', SHARTSIZ, AVTO); tek('huk: H shartsiz — 7-bosishda (4, 2) da urildi', h.urildi === 7 && h.joy.join() === '4,2', JSON.stringify(h))
h = oyna('HA', SHARTSIZ, AVTO); tek('huk A: HA — 10-bosishda (5, 4) da chetga urildi', h.urildi === 10 && h.joy.join() === '5,4', JSON.stringify(h))
h = oyna('H', TEPASIZ, AVTO); tek('huk B: ↑ siz — 3-bosishda (1, 0) da urildi', h.urildi === 3 && h.joy.join() === '1,0', JSON.stringify(h))
h = oyna('H', QOIDA, AVTO); tek('huk C: qoida — 7-bosishda «yo‘q», 11-bosishda yutdi', h.yutdi === 11 && h.yoq === 1, JSON.stringify(h))
h = oyna('H', QOIDA, '↑→↑→→↑→→↑↑→'); tek('4-qadam: startda ↑ «yo‘q», keyin yutdi (11 bosish)', h.yutdi === 11 && h.yoq === 1, JSON.stringify(h))
h = oyna('N', { right: ['r'], up: ['u'] }, '↑'); tek('7-qadam: startda ↑ — urildi', h.urildi === 1, JSON.stringify(h))
h = oyna('R', { right: ['r'], up: ['u'] }, '→↑↑→'); tek('10-qadam: shartsiz →↑↑→ — 4-bosishda (1, 2) da urildi', h.urildi === 4 && h.joy.join() === '1,2', JSON.stringify(h))
h = oyna('R', { right: QOIDA.right, up: QOIDA.up }, '→↑↑→↑→→→→→'); tek('10-qadam: qoida bilan 10 bosish, 1 «yo‘q», yutdi', h.yutdi === 10 && h.yoq === 1, JSON.stringify(h))
h = oyna('Q1', { ...QOIDA, up: [['a', 'right', ['u']]] }, '→↑↑'); tek('11 · 1 xato varianti: ↑ da if path → — (1, 0) da qoladi', h.joy.join() === '1,0' && h.yoq === 2, JSON.stringify(h))
h = oyna('Q3', QOIDA, '→↑↑←↑↑↑↓↓→→↑↑→→↓↓→→↑↑'); tek('11 · 3 boshi berk yo‘l: 21 bosish, 1 «yo‘q», yutdi', h.yutdi === 21 && h.yoq === 1, JSON.stringify(h))
h = oyna('QY', { ...QOIDA, up: [['a', 'up', ['u', 'n']]] }, '↑↑→↑↑→→↓↓→→↓→'); tek('11 · ★: tovush if ichida — yurganda chalindi, turganda jim', h.yutdi === 13 && h.tovush === 4 && !h.tovushTurib, JSON.stringify(h))
h = oyna('KN', QOIDA, '→→↑↑↑→←→→→→→'); tek('14-qadam: kalitsiz eshik «yo‘q», ← kalit, yutdi (12 bosish, 1 «yo‘q»)', h.yutdi === 12 && h.yoq === 1 && h.kalit && h.eshik, JSON.stringify(h))
h = oyna('D1', { ...QOIDA, space: [['x', 0, 0]] }, '→↑↑↑ →→→↑↑→→→↑↑'); tek('15 · ★: kalit, space — startga (kalit qo‘lda), 15 bosishda yutdi', h.yutdi === 15 && h.kalit, JSON.stringify(h))

// ---------- 2. Haqiqiy ekranlar ----------
console.log('— 2. 9-darsning haqiqiy ekranlari (demo-009)')
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }), xato = []
const p = await (await b.newContext({ viewport: { width: 1440, height: 810 } })).newPage()
p.on('pageerror', (e) => xato.push(e.message)); p.on('console', (mm) => { if (mm.type() === 'error' && !/Failed to load resource/.test(mm.text())) xato.push(mm.text()) })
await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'momiq') })
await p.goto(U + '?rol=bola&xona=lab-sinov'); await p.waitForTimeout(900)
await p.evaluate(() => { bolaKeyingi = () => {}; window.__ijroAsl = ijro; ijro = (d, f, op) => window.__ijroAsl(d, f, { ...(op || {}), kut: 40 }) })
const och = (id, bola = id[0] === 'B') => p.evaluate(([id, bola]) => { const il = document.getElementById('ilova'); il.innerHTML = bola ? '<div id="bol">' + ekran(id, null, true) + '</div>' : '<div id="ust">' + ekran(id) + '</div>'; studiyaTayyorla(il.firstChild) }, [id, bola]).then(() => p.waitForTimeout(350))
const blq = (d) => Object.entries(d).map(([tugma, tt]) => [tugma, tt.map(function z(t) { return Array.isArray(t) ? (t[0] === 'a' ? { t: 'a', yon: t[1], ichki: t[2].map(z) } : { t: 'x', m: t[1] + ',' + t[2] }) : { t, m: t === 'n' ? 'qadam' : undefined } })])
const qur = (d) => p.evaluate((d) => { DARS.oyinlar.__s = d; labQur(document.querySelector('#ilova .ekran'), '__s') }, blq(d)).then(() => p.waitForTimeout(200))
const tinch = () => p.waitForFunction(() => !document.querySelector('#ilova .ekran').dataset.yuryapti, null, { timeout: 15000 })
const boshla = async () => { await p.click((await p.$('#ilova .hn .ishga')) ? '#ilova .hn .ishga' : '#ilova .hn .asos'); await p.waitForTimeout(300) } // ustozda «▶ Boshlash» — .ishga, bolada — asosiy tugma
const KEY = { '→': 'ArrowRight', '←': 'ArrowLeft', '↑': 'ArrowUp', '↓': 'ArrowDown', ' ': 'Space' }
const bos = async (s) => { for (const c of s) { await p.keyboard.press(KEY[c]); await p.waitForTimeout(30); await tinch() } await p.waitForTimeout(250) }
const korin = () => p.evaluate(() => { const ek = document.querySelector('#ilova .ekran'), mu = ek.querySelector('.dv-muam'), o = OYIN.get(ek); return { muam: mu ? (mu.className.match(/m-(\w+)/) || [])[1] + ':' + mu.textContent.trim() : '', ishora: (ek.querySelector('.hn .hint') || {}).textContent || '', konfeti: !!ek.querySelector('.oyna .konfeti'), joy: ((ek.querySelector('.kt-yr text') || {}).textContent || ''), oyin: !!ek.dataset.oyin, yoq: o ? o.h.yoqSoni || 0 : null, urildi: !!ek.querySelector('.jr-bl .mb.urildi'), dsn: (ek.querySelector('.dsn') || {}).textContent || '', chek: [...ek.querySelectorAll('.pl .chek .ch-r')].map((r) => (r.classList.contains('ok') ? '✓' : '·')).join(''), xarita: (ek.querySelector('.katak') || {}).dataset?.xarita || '' } })
const tuzilish = () => p.evaluate(() => { const ws = BL_WS.get(document.querySelector('#ilova .ekran')), y = { right: '→', left: '←', up: '↑', down: '↓', space: 'space' }, t = { move_right: '→', move_left: '←', move_up: '↑', move_down: '↓' }; const z = (b) => (b.type === 'if_path' ? 'if' + y[b.getFieldValue('YON')] + '[' + blZanjir(b.getInputTargetBlock('DO')).map(z).join(' ') + ']' : t[b.type] || b.type); return blTepalar(ws).map((h) => 'W' + y[h.getFieldValue('KEY')] + '[' + blZanjir(h).slice(1).map(z).join(' ') + ']').join(' ') })
const javon = async (f, nom) => { await p.click('#ilova .rg .rd.f-' + f); await p.waitForTimeout(100); await p.locator('#ilova .pl .mbw:not(.yopiq) .mb', { hasText: nom }).first().click(); await p.waitForTimeout(250) }
const pos = (r) => r.joy.replace(/[() ]/g, '')

// 2a) har ekrandagi labirint — manbadagi xarita
const EKR = { P1: 'H', P2: 'H', P2S: 'H', P2C: 'H', P6: 'N', B1A: 'B1', B1B: 'B2', B1C: 'B3', B1Y: 'BY', P7: 'R', B2A: 'Q1', B2B: 'Q2', B2C: 'Q3', B2Y: 'QY', P9: 'Q3', P8: 'KN', B3A: 'K1', B3B: 'D1', B3Y: 'D1', P11: 'D1', B5: 'D1' }
for (const id in EKR) { await och(id); const r = await korin(); tek(id + ': labirint — manbadagi ' + EKR[id], r.xarita === m(LB[EKR[id]]), r.xarita) }

// 2b) jadvaldagi har yechim haqiqiy ekranda: shartsiz (1-bekat) va qoida bilan — joy, yutdi, «yo'q» soni simulyator bilan
const YECH = [['B1A', 'B1', SHARTSIZ], ['B1B', 'B2', SHARTSIZ], ['B1C', 'B3', SHARTSIZ], ['B1Y', 'BY', SHARTSIZ], ['B2A', 'Q1', QOIDA, '↑' + JAD.Q1[0]], ['B2B', 'Q2', QOIDA], ['B2C', 'Q3', QOIDA, '→↑↑←↑↑↑↓↓→→↑↑→→↓↓→→↑↑'], ['B3A', 'K1', QOIDA], ['B3B', 'D1', QOIDA]]
for (const [id, lb, d, s0] of YECH) {
  const s = s0 || JAD[lb][0], sim = oyna(lb, d, s)
  await p.evaluate(() => localStorage.removeItem('jr-labirint-oyini'))
  await och(id); await qur(d); await boshla(); await bos(s); const r = await korin()
  tek(id + ' (' + lb + '): ' + s.length + ' bosish — yutdi, joy (' + sim.joy + ')', r.konfeti && !r.oyin && pos(r) === sim.joy.join(','), JSON.stringify(r))
}
// 2c) urilish — o'yin to'xtaydi; To'siqvoy gaplari (1-bekat, 2-bekatdan, if ichida boshqa tomon)
await och('P6'); await qur({ right: ['r'], up: ['u'] }); await boshla(); await bos('↑'); let r = await korin()
tek('7-qadam: startda ↑ — urildi, o‘yin to‘xtadi, «O‘yin to‘xtadi…», blok «urildi»', r.muam === 'tosiqvoy:Devor!' && !r.oyin && r.urildi && r.ishora === 'O‘yin to‘xtadi. Qaytadan — «▶ Boshlash»', JSON.stringify(r))
await bos('→'); r = await korin(); tek('o‘yin to‘xtagach strelka ishlamaydi (qahramon (0, 0) da)', pos(r) === '0,0', JSON.stringify(r))
await boshla(); r = await korin(); tek('«▶ Boshlash» — qaytadan, «urildi» belgisi ketdi', r.oyin && !r.urildi && !r.muam, JSON.stringify(r))
await bos(JAD.N[0]); r = await korin(); tek('7-qadam: keyin → → ↑ ↑ → → → — yutdi', r.konfeti && r.ishora === 'Siz yutdingiz!', JSON.stringify(r))
await och('P7'); r = await tuzilish(); tek('10-qadam (jonli): tayyor W→[→] W↑[↑]', r === 'W→[→] W↑[↑]', r)
await boshla(); await bos('→↑↑→'); r = await korin(); h = oyna('R', { right: ['r'], up: ['u'] }, '→↑↑→')
tek('10-qadam: shartsiz →↑↑→ — (1, 2) da urildi; 2-bekat gapi', r.muam === 'tosiqvoy:Devor!' && pos(r) === h.joy.join(',') && r.ishora === 'Bu blok yo‘lni tekshirmay yurdi. Yurishdan oldin tekshiring', JSON.stringify(r))
await och('B2A'); await qur({ ...QOIDA, up: [['a', 'up', ['r']]] }); await boshla(); await bos('→↑'); r = await korin()
tek('if ichida boshqa tomon: «Shart bir tomonni tekshirdi, blok boshqa tomonga yurdi»', r.muam === 'tosiqvoy:Devor!' && r.ishora === 'Shart bir tomonni tekshirdi, blok boshqa tomonga yurdi', JSON.stringify(r))
// 2d) o'yin davom etadi: «yo'q», kalitsiz eshik, ishoralar
await och('B2A'); await qur(QOIDA); await boshla(); await bos('↑'); r = await korin()
tek('qoida: startda ↑ — «yo‘q», qahramon turdi, o‘yin davom etadi', r.oyin && pos(r) === '0,0' && r.yoq === 1 && !r.muam, JSON.stringify(r))
await och('B2A'); await qur({ ...QOIDA, up: [['a', 'right', ['u']]] }); await boshla(); await bos('→↑'); r = await korin()
tek('shart tomoni boshqa, qimirlamadi — «↑ bosildi — shart → tomonni tekshirdi»', r.oyin && pos(r) === '1,0' && r.ishora === '↑ bosildi — shart → tomonni tekshirdi', JSON.stringify(r))
await och('B1C'); await qur({ ...SHARTSIZ, up: ['r'] }); await boshla(); await bos('↑'); r = await korin()
tek('strelka va move mos emas — «↑ bosildi — qahramon o‘ngga yurdi. Dasturchani tekshiring»', r.ishora === '↑ bosildi — qahramon o‘ngga yurdi. Dasturchani tekshiring', JSON.stringify(r))
await och('B2B'); await qur({ ...QOIDA, down: ['d'] }); await boshla(); await bos('→'); r = await korin()
tek('2-bekat: qoidasiz strelka ↓ bosilmagan — ishora yo‘q', r.ishora === '', JSON.stringify(r))
await och('B2B'); await qur({ right: QOIDA.right, up: QOIDA.up, down: QOIDA.down }); await boshla(); await bos('→→→→↑↑←'); r = await korin()
tek('Q2: ← dasturchasi yo‘q — Bo‘shvoy, qahramon (4, 2) da', r.muam === 'boshvoy:Bu tugma uchun dasturcha yo‘q-ku…' && pos(r) === '4,2', JSON.stringify(r))
await och('P8', false); await boshla(); await bos('→→↑↑↑→'); r = await korin()
tek('14-qadam: kalitsiz eshik — «yo‘q», Kamvoy «Kalit qani?», o‘yin davom etadi', r.muam === 'kamvoy:Kalit qani?' && r.oyin && pos(r) === '2,3', JSON.stringify(r))
await bos('←→→→→→'); r = await korin(); tek('14-qadam: ← kalit, → → → → → — yutdi; ro‘yxatda to‘rtala ✓ (ustoz)', r.konfeti && r.chek === '✓✓✓✓', JSON.stringify(r))
await och('B3B'); await qur(SHARTSIZ); await boshla(); await bos('→→→↑↑→→'); r = await korin()
tek('shartsiz move kalitsiz eshikka — Kamvoy «Kalit qani?», o‘yin to‘xtadi', r.muam === 'kamvoy:Kalit qani?' && !r.oyin, JSON.stringify(r))
// 2e) pog'ona shartlari
await och('B2A'); await qur(QOIDA); await boshla(); await bos(JAD.Q1[0]); r = await korin()
tek('11 · 1: «yo‘q»siz yutsa — Kamvoy «Oz qoldi!», «Ataylab devor tomonga bosing — keyin yuting»', r.muam === 'kamvoy:Oz qoldi!' && r.ishora === 'Ataylab devor tomonga bosing — keyin yuting' && r.oyin, JSON.stringify(r))
await och('B2A'); await qur({ ...QOIDA, down: ['d'] }); await boshla(); await bos('↑' + JAD.Q1[0]); r = await korin()
tek('11 · 1: bitta strelka qoidasiz — «↓ dasturchasi yo‘lni tekshirmaydi»', r.muam === 'kamvoy:Oz qoldi!' && r.ishora === '↓ dasturchasi yo‘lni tekshirmaydi', JSON.stringify(r))
await och('B2Y'); await qur({ ...QOIDA, up: [['a', 'up', ['u']], 'n'] }); await boshla(); await bos('→↑'); r = await korin()
tek('11 · ★: tovush if dan tashqarida, turganda chalindi — Kamvoy «Men yurmadim-ku!»', r.muam === 'kamvoy:Men yurmadim-ku!' && r.oyin, JSON.stringify(r))
await och('B2Y'); await qur(QOIDA); await boshla(); await bos(JAD.QY[0]); r = await korin()
tek('11 · ★: tovushsiz yutdi — «Qahramon yurganda tovush chalinsin»', r.muam === 'kamvoy:Oz qoldi!' && r.ishora === 'Qahramon yurganda tovush chalinsin', JSON.stringify(r))
await och('B2Y'); await qur({ ...QOIDA, up: [['a', 'up', ['u', 'n']]] }); await boshla(); await bos('↓' + JAD.QY[0]); r = await korin()
tek('11 · ★: tovush if ichida — yutdi', r.konfeti && !r.oyin, JSON.stringify(r))
await och('B3Y'); await qur({ ...QOIDA, space: [['x', 3, 2]] }); await boshla(); await bos('→ '); r = await korin()
tek('15 · ★: go to (3, 2) — Kamvoy «Bu start emas!», «Qahramon (3, 2) ga bordi. Start — (0, 0)»', r.muam === 'kamvoy:Bu start emas!' && r.ishora === 'Qahramon (3, 2) ga bordi. Start — (0, 0)', JSON.stringify(r))
await och('B3Y'); await qur({ ...QOIDA, space: [['x', 0, 0]] }); await boshla(); await bos(JAD.D1[0]); r = await korin()
tek('15 · ★: startga qaytmay yutdi — «Bitta tugma qahramonni startga qaytarsin»', r.muam === 'kamvoy:Oz qoldi!' && r.ishora === 'Bitta tugma qahramonni startga qaytarsin', JSON.stringify(r))
await och('B3Y'); await qur({ ...QOIDA, space: [['x', 0, 0]] }); await boshla(); await bos('→↑↑↑ →→→↑↑→→→↑↑'); r = await korin(); h = oyna('D1', { ...QOIDA, space: [['x', 0, 0]] }, '→↑↑↑ →→→↑↑→→→↑↑')
tek('15 · ★: kalit, space — startga (kalit qo‘lda), 15 bosishda yutdi', r.konfeti && h.yutdi === 15, JSON.stringify(r))
// 2f) chek-list — bola: dars bo'yi to'planadi; 15 · 2 — to'liq bo'lmasa «Siz yutdingiz! Ro‘yxatda bo‘sh band bor…»
await p.evaluate(() => { localStorage.removeItem(K + 'chek'); localStorage.removeItem(K + 'labdastur') }); await och('B3B'); r = await korin(); tek('15 · 2: ro‘yxat bo‘sh — «O‘yiningizda:» to‘rt band', r.chek === '····', r.chek)
await qur({ right: QOIDA.right, up: QOIDA.up, down: QOIDA.down }); await boshla(); await bos(JAD.D1[0]); r = await korin()
tek('15 · 2: ← yo‘q, «yo‘q» bo‘lmadi — yutdi, lekin «Ro‘yxatda bo‘sh band bor: To‘rt strelka, Qoida»', r.konfeti && r.ishora === 'Siz yutdingiz! Ro‘yxatda bo‘sh band bor: To‘rt strelka, Qoida' && r.chek === '··✓✓', JSON.stringify(r))
await qur(QOIDA); await boshla(); await bos('←' + JAD.D1[0]); r = await korin()
tek('15 · 2: to‘rtala ✓ — «O‘yiningiz tayyor!»', r.konfeti && r.ishora === 'O‘yiningiz tayyor!' && r.chek === '✓✓✓✓', JSON.stringify(r))
r = await p.evaluate(() => !!localStorage.getItem('jr-labirint-oyini')); tek('15 · 2: o‘yin 10-dars uchun saqlandi', r)
await och('B5'); r = await p.evaluate(() => { const ek = document.querySelector('#ilova .ekran'); return { chek: [...ek.querySelectorAll('.chek-y .ch-r')].map((x) => (x.classList.contains('ok') ? '✓' : '·')).join(''), saq: !ek.querySelector('.saqlandi').hidden } })
tek('17-qadam: natijada ro‘yxat ✓✓✓✓ va «O‘yiningiz saqlandi…»', r.chek === '✓✓✓✓' && r.saq, JSON.stringify(r))
await p.evaluate(() => localStorage.removeItem('jr-labirint-oyini')); await och('B5'); r = await p.evaluate(() => document.querySelector('#ilova .saqlandi').hidden)
tek('17-qadam: saqlanmagan bo‘lsa «saqlandi» gapi yo‘q', r)
// 2g) javon orqali: hodisa blokini tanlab, if — dasturcha oxiriga va tanlanadi; move — if ichiga; tomonni almashtirish
await och('B2A'); await p.evaluate(() => { const ek = document.querySelector('#ilova .ekran'); BL_WS.get(ek).clear(); sanoq(ek) })
await javon('e', 'when'); await javon('h', 'move right'); r = await tuzilish(); tek('javon: when → , move right — W→[→]', r === 'W→[→]', r)
await javon('e', 'when'); r = await tuzilish(); tek('javon: yana when — yangi dasturcha', r === 'W→[→] W→[]', r)
await p.evaluate(() => { const ek = document.querySelector('#ilova .ekran'), ws = BL_WS.get(ek); const h = blTepalar(ws)[0]; blTanla(ek, h) })
await javon('a', 'if path'); r = await tuzilish(); tek('tanlangan 1-dasturcha + if — o‘sha dasturcha oxiriga, if tanlandi', r === 'W→[→ if→[]] W→[]' && (await p.evaluate(() => blTanlov(document.querySelector('#ilova .ekran')).type)) === 'if_path', r)
await javon('h', 'move right'); r = await tuzilish(); tek('if tanlangan + move right — if ichiga', r === 'W→[→ if→[→]] W→[]', r)
await p.evaluate(() => { const ek = document.querySelector('#ilova .ekran'), ws = BL_WS.get(ek); blTanla(ek, blTepalar(ws)[1]) }); await javon('h', 'move up'); r = await tuzilish()
tek('tanlangan 2-dasturcha + move — o‘sha dasturchaga (oxirgi emas, tanlangan)', r === 'W→[→ if→[→]] W→[↑]', r)
r = await korin(); tek('tasma: «2 ta dasturcha» / «6 / 16 ta blok» (ikki qatorda)', r.dsn === '2 ta dasturcha\n6 / 16 ta blok', JSON.stringify(r.dsn))
// 2h) chegara 16, ichi bo'sh if, dastur keyingi pog'onaga (if ichidagilari bilan)
await qur({ ...QOIDA, space: [['a', 'up', ['u', 'r', 'l', 'd']]] }); await javon('h', 'move up'); r = await korin()
tek('16 ta blok — Ortiqvoy «Joy qolmadi!», «Dasturga 16 ta blok sig‘adi»', r.muam === 'ortiqvoy:Joy qolmadi!' && r.ishora === 'Dasturga 16 ta blok sig‘adi', JSON.stringify(r))
await qur({ right: [['a', 'right', []]] }); await boshla(); r = await korin(); tek('ichi bo‘sh if — Bo‘shvoy «Ichi bo‘sh-ku…», o‘yin boshlanmadi', r.muam === 'boshvoy:Ichi bo‘sh-ku…' && !r.oyin, JSON.stringify(r))
await och('B2A'); await qur(QOIDA); await boshla(); await bos('↑' + JAD.Q1[0]); await och('B2B'); r = await tuzilish()
tek('dastur keyingi pog‘onaga if ichidagilari bilan o‘tdi', r === 'W→[if→[→]] W←[if←[←]] W↑[if↑[↑]] W↓[if↓[↓]]', r)
r = await p.evaluate(() => blokJami()); tek('natija: «t» bosishlar, «Y» devor oldida, «L» labirint yozildi', r && r.t > 0 && r.Y > 0 && r.L > 0, JSON.stringify(r))
// 2i) huk: «O‘ynab ko‘rsat» (P2), uch karta (P2S), javob o'yini (P2C)
await och('P2', false); await p.click('#ilova .hn .so-t'); await tinch(); await p.waitForTimeout(300); r = await korin()
tek('2-qadam: «O‘ynab ko‘rsat» — 11 bosishdan 7-sida (4, 2) da urildi, To‘siqvoy', r.muam === 'tosiqvoy:Devor!' && pos(r) === '4,2', JSON.stringify(r))
await och('P2S', false); for (let i = 0; i < 3; i++) { await p.waitForTimeout(900); await tinch(); if (i < 2) await p.click('#ilova .hn .asos'); await p.waitForTimeout(400); await tinch() }
await p.waitForTimeout(500); r = await p.evaluate(() => [...document.querySelectorAll('#ilova .jk')].map((k) => (k.classList.contains('n-ok') ? '✓' : k.classList.contains('n-yoq') ? '✕' : '·') + (k.querySelector('.jn') || {}).textContent))
tek('3-qadam: uch karta — ✕ baribir urildi · ✕ ↑ kerak joyda yurmadi · ✓ adashsa ham yutdi', r.join('|') === '✕✕ baribir urildi|✕✕ ↑ kerak joyda yurmadi|✓✓ adashsa ham yutdi', r.join('|'))
await och('P2C', false); await p.click('#ilova .hn .so-t'); await p.waitForTimeout(300); await bos('↑'); r = await korin()
tek('4-qadam: qoida o‘yini — startda ↑ «yo‘q», turdi, o‘yin davom etadi', pos(r) === '0,0' && r.oyin && !r.muam, JSON.stringify(r))
await bos('→↑→→↑→→↑↑→'); r = await korin(); tek('4-qadam: yutdi', r.konfeti && r.ishora === 'Siz yutdingiz!', JSON.stringify(r))
tek('konsolda xato yo‘q', !xato.length, xato.slice(0, 3).join(' | '))
await b.close()
console.log(`\n${ok} / ${jami}`)
process.exit(ok === jami ? 0 : 1)
