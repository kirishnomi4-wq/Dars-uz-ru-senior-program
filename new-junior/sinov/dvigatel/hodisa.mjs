// Hodisa sinovi (4-dars, 20.11): manba 004-hodisalar «Topshiriqlar» jadvalidagi har topshiriq 4-darsning HAQIQIY ekranlarida (demo-004.html):
// dasturchalar Blockly'ga qo'shiladi (javon bilan bir xil yo'l — blQosh), «▶ Boshlash» bosiladi va klaviatura HAQIQIY bosiladi (playwright keyboard).
// Natija shu fayldagi mustaqil simulyatsiya bilan solishtiriladi: qahramon joyi, olmalar, yashirin yulduz, yutish, ★ shartlari, muammochalar.
// Yana: ustoz ekranida o'yin paytida → qadam almashtirmaydi; huk — uch karta (A, B yulduzni ko'chiradi, C — o'yin); dasturchalar ustunda ustma-ust tushmaydi.
// Ishlatish (lokal server 5340 yoniq, demo-004 yig'ilgan):  node new-junior/sinov/dvigatel/hodisa.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-004.html', W = 7, H = 5
const KEY = { '→': 'ArrowRight', '←': 'ArrowLeft', '↑': 'ArrowUp', '↓': 'ArrowDown', '_': ' ' }, NOM = { '→': 'right', '←': 'left', '↑': 'up', '↓': 'down', '_': 'space' }
const D = { right: [1, 0], left: [-1, 0], up: [0, 1], down: [0, -1] }
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }), xato = []
const p = await (await b.newContext({ viewport: { width: 1440, height: 810 } })).newPage()
p.on('pageerror', (e) => xato.push(e.message)); p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) xato.push(m.text()) })
let ok = 0, jami = 0
const tek = (nom, shart, iz = '') => { jami++; if (shart) ok++; console.log((shart ? '✓ ' : '✗ ') + nom + (shart || !iz ? '' : '  — ' + iz)) }
await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'momiq') })
await p.goto(U + '?rol=bola&xona=hodisa-sinov'); await p.waitForTimeout(900)
await p.evaluate(() => { bolaKeyingi = () => {} })
const och = (id) => p.evaluate((id) => { const il = document.getElementById('ilova'), bola = id[0] === 'B'; il.innerHTML = bola ? '<div id="bol">' + ekran(id, null, true) + '</div>' : '<div id="ust">' + ekran(id) + '</div>'; studiyaTayyorla(il.firstChild); il.querySelectorAll('.dv-muam,.konfeti').forEach((x) => x.remove()) }, id)
// dasturchalar: [['→', 'r', 'r'], ['_', 'x0,0'], ['_', 's:Men keldim!']] — birinchisi tugma, qolganlari bloklar
const tuz = (ds) => p.evaluate((ds) => { const ek = document.querySelector('#ilova .ekran'), ws = BL_WS.get(ek); ws.clear(); for (const [k, ...bl] of ds) { blQosh(ek, 'k', k); for (const x of bl) { if (x[0] === 'x') blQosh(ek, 'x', x.slice(1)); else if (x[0] === 's') blQosh(ek, 's', x.slice(2)); else blQosh(ek, x) } } sanoq(ek) }, ds.map(([k, ...bl]) => [NOM[k], ...bl]))
const boshla = async () => { await p.click('#ilova .hn .ishga, #ilova .hn .asos:not(.k-solo)'); await p.waitForTimeout(400) }
const bos = async (s) => { for (const c of s) { await p.keyboard.press(KEY[c]); await p.waitForFunction(() => !document.querySelector('#ilova .ekran').dataset.yuryapti, null, { timeout: 8000, polling: 30 }); await p.waitForTimeout(60) } await p.waitForTimeout(450) }
const korin = () => p.evaluate(() => {
  const ek = document.querySelector('#ilova .ekran'), k = ek.querySelector('.katak.maydon'), xr = k.dataset.xarita.split('|'), g = k.querySelector('.kt-q')
  const m = g.style.transform.match(/-?[\d.]+/g).map(Number), mu = ek.querySelector('.dv-muam')
  return { joy: [Math.round((m[0] - 10) / 100), xr.length - 1 - Math.round((m[1] + 14) / 100)], oyin: ek.dataset.oyin || '', yozuv: (ek.querySelector('.oyin-yz') || {}).textContent || '', tugma: (ek.querySelector('.hn .ishga, .hn .asos') || {}).textContent.trim(),
    muam: mu ? (mu.className.match(/m-(\w+)/) || [])[1] + ':' + mu.textContent.trim() : '', ishora: (ek.querySelector('.hn .hint') || {}).textContent || '', konfeti: !!ek.querySelector('.oyna .konfeti'),
    yulduzOchiq: !!k.querySelector('.kt-yul.topildi'), olindi: k.querySelectorAll('.kt-olma.olindi').length, dsn: (ek.querySelector('.dsn') || {}).textContent || '' }
})
// mustaqil simulyatsiya: dasturchalar va bosilgan tugmalar → joy, olmalar
function sim(start, ds, bosish, olma = []) {
  let [x, y] = start; const yol = [[x, y]]
  for (const c of bosish) for (const [k, ...bl] of ds.filter((d) => d[0] === c)) for (const t of bl) {
    if (t[0] === 'x') { [x, y] = t.slice(1).split(',').map(Number); yol.push([x, y]); continue }
    const d = { r: D.right, l: D.left, u: D.up, d: D.down }[t]; if (!d) continue
    const nx = x + d[0], ny = y + d[1]; if (nx < 0 || ny < 0 || nx >= W || ny >= H) break
    x = nx; y = ny; yol.push([x, y])
  }
  return { joy: [x, y], olindi: olma.filter(([a, c]) => yol.some(([q, w]) => q === a && w === c)).length }
}
const T4 = [['→', 'r'], ['←', 'l'], ['↑', 'u'], ['↓', 'd']]

// 1) dasturchasiz «Boshlash»
await och('B1A'); await boshla()
let r = await korin(); tek('B1A hodisa blokisiz «Boshlash» — Bo‘shvoy «Men nimani kutaman?», o‘yin boshlanmadi', r.muam === 'boshvoy:Men nimani kutaman?' && !r.oyin && r.ishora === 'Avval hodisa blokini qo‘ying: when … key pressed', JSON.stringify(r))
// 2) bitta dasturcha: noto'g'ri tugma, keyin to'g'ri
await tuz([['→', 'r']]); r = await korin(); tek('B1A dasturcha qo‘shildi — «1 ta dasturcha»', r.dsn === '1 ta dasturcha', r.dsn)
await boshla(); r = await korin(); tek('B1A «▶ Boshlash» — o‘yin: «O‘yin: strelkalarni bosing», tugma «■ To‘xtatish»', r.oyin === '1' && r.yozuv === 'O‘yin: strelkalarni bosing' && r.tugma === '■ To‘xtatish', JSON.stringify(r))
await bos('←'); r = await korin(); tek('B1A ← (dasturchasi yo‘q) — Bo‘shvoy, ishora tugma bilan, qahramon joyida', r.muam === 'boshvoy:Bu tugma uchun dasturcha yo‘q-ku…' && r.ishora === '← tugmasi uchun when ← key pressed bloki kerak' && r.joy.join() === '0,0', JSON.stringify(r))
await bos('→→→'); r = await korin(); tek('B1A → ×3 — (3, 0), o‘yin davom etadi', r.joy.join() === '3,0' && r.oyin === '1' && !r.muam, JSON.stringify(r))
await bos('→'); r = await korin(); tek('B1A → (4-chi) — yulduzda: «Yetib bordi!», konfeti, o‘yin to‘xtadi, tugma «Boshlash»', r.joy.join() === '4,0' && !r.oyin && r.konfeti && r.ishora === 'Yetib bordi!' && /Boshlash/.test(r.tugma), JSON.stringify(r))
// 3) hodisa ostida blok yo'q — Kamvoy
await och('B1A'); await tuz([['→']]); await boshla(); await bos('→'); r = await korin()
tek('B1A hodisa ostida blok yo‘q — Kamvoy', r.muam === 'kamvoy:Tugma bosildi, lekin men nima qilay?' && r.ishora === 'Hodisa blokining ostiga move blokini ulang', JSON.stringify(r))
// 4) chet — o'yin to'xtamaydi, muammocha yo'q
await och('B1A'); await tuz([['←', 'l'], ['→', 'r']]); await boshla(); await bos('←←'); r = await korin()
tek('B1A chetda ← — joyida, muammochasiz, o‘yin davom etadi', r.joy.join() === '0,0' && !r.muam && r.oyin === '1', JSON.stringify(r))
await p.click('#ilova .hn .asos'); r = await korin(); tek('B1A «■ To‘xtatish» — o‘yin to‘xtadi; strelka endi qahramonni yurgizmaydi', !r.oyin && /Boshlash/.test(r.tugma))
await p.keyboard.press('ArrowRight'); await p.waitForTimeout(400); r = await korin(); tek('… → bosildi — qahramon joyida', r.joy.join() === '0,0', r.joy.join())
// 5) manba topshiriqlari (simulyatsiya bilan)
const ISH = [
  ['B1B', [5, 0], [['←', 'l']], '←←←', [2, 0], [], 'yetdi'],
  ['B1C', [0, 0], [['→', 'r'], ['↑', 'u']], '→→→↑↑', [3, 2], [], 'yetdi'],
  ['B1Y', [0, 0], [['→', 'r'], ['↑', 'u']], '→→→→→→↑↑↑↑', [6, 4], [], 'shart'],
  ['B1Y', [0, 0], [['→', 'r', 'r'], ['↑', 'u']], '→→→↑↑↑↑', [6, 4], [], 'yetdi'],
  ['B2A', [0, 0], T4, '→→→→↑↑↑↑', [4, 4], [], 'yetdi'],
  ['B2B', [0, 0], T4, '→→→→→', [5, 0], [[2, 3]], 'olmasiz'],
  ['B2B', [0, 0], T4, '↑↑↑→→↓↓↓→→→', [5, 0], [[2, 3]], 'yetdi'],
  ['B2C', [3, 2], T4, '↑↑←←→→→→↓↓↓↓←←', [3, 0], [[1, 4], [5, 4]], 'yetdi'],
  ['B2Y', [0, 0], [...T4, ['_', 'x0,0']], '→→→→→→↑↑↑↑', [6, 4], [], 'shart'],
  ['B2Y', [0, 0], [...T4, ['_', 'x0,0']], '→→_→→→→→→↑↑↑↑', [6, 4], [], 'yetdi'],
  ['B3A', [0, 0], T4, '↑↑→↑↑→→→←←←←', [0, 4], [[1, 2], [4, 4], [6, 2]], 'yashirin'],
  // 4·11 A: yulduz chiqqach har uch bosishda qochadi — B3A (0, 4) → (3, 1); B3B (3, 1) → (0, 2) → (5, 0)
  ['B3A', [0, 0], T4, '↑↑→↑↑→→→→→↓↓←←←←←←↑↑', [0, 4], [[1, 2], [4, 4], [6, 2]], 'qochdi'],
  ['B3A', [0, 0], T4, '↑↑→↑↑→→→→→↓↓←←←↓', [3, 1], [[1, 2], [4, 4], [6, 2]], 'yetdi'],
  ['B3B', [0, 0], T4, '→→↑↑↑→→→↓↑↑→←←←←←←↓↓↓→→→→→↓', [5, 0], [[0, 4], [2, 0], [3, 3], [5, 2], [6, 4]], 'yetdi'],
  ['B3Y', [0, 0], [...T4, ['_', 's:Salom!']], '↑↑→→→→→↑→↑←←←←←←→→→→→→↓↓↓↓_', [6, 0], [[2, 2], [5, 3], [1, 4]], 'shart'],
  ['B3Y', [0, 0], [...T4, ['_', 's:Men keldim!']], '_↑↑→→→→→↑→↑←←←←←←→→→→→→↓↓↓↓', [6, 0], [[2, 2], [5, 3], [1, 4]], 'yetdi'],
]
for (const [id, start, ds, bosish, yul, olma, man] of ISH) {
  await och(id); await tuz(ds); await boshla(); await bos(bosish)
  const s = sim(start, ds, bosish, olma), r = await korin(), farq = []
  if (r.joy.join() !== s.joy.join()) farq.push('joy ' + r.joy + ' ≠ ' + s.joy)
  if (r.olindi !== s.olindi) farq.push('olma ' + r.olindi + ' ≠ ' + s.olindi)
  if (olma.length && !r.yozuv.includes('Olma: ' + s.olindi + ' / ' + olma.length) && r.oyin) farq.push('yozuv «' + r.yozuv + '»')
  const yetdi = s.joy.join() === yul.join()
  if (man === 'yetdi' && (!yetdi || r.oyin || !r.konfeti || r.muam)) farq.push('yutmadi: ' + JSON.stringify(r))
  if (man === 'shart' && (r.muam.indexOf('kamvoy:Oz qoldi!') < 0 && r.muam.indexOf('kamvoy:Hech narsa demadi…') < 0 || !r.oyin)) farq.push('★ sharti ishlamadi: ' + JSON.stringify(r))
  if (man === 'olmasiz' && (r.muam !== 'kamvoy:Olma qoldi-ku!' || r.ishora !== 'Avval olmani oling — u (2, 3) da')) farq.push('olmasiz: ' + JSON.stringify(r))
  if (man === 'qochdi' && (!r.oyin || r.konfeti || !r.yulduzOchiq)) farq.push('yulduz qochmadi: ' + JSON.stringify(r))
  if (man === 'yashirin' && (r.yulduzOchiq || r.muam || !r.oyin)) farq.push('yashirin yulduz: ' + JSON.stringify(r))
  tek((id + ' ' + bosish).padEnd(38) + ' → ' + man + (s.olindi ? ' (olma ' + s.olindi + ')' : ''), !farq.length, farq.join('; '))
}
// ogohlantirishlar (o'yin baribir boshlanadi): hodisasiz blok; bitta tugmaga ikki dasturcha
await och('B1A'); await tuz([['→', 'r']]); await p.evaluate(() => { const ek = document.querySelector('#ilova .ekran'), ws = BL_WS.get(ek); blQosh(ek, 'u'); const b = blZanjir(blOxirgi(ws)).pop(); b.unplug(false); b.moveTo(new Blockly.utils.Coordinate(0, 9999)); blTartib(ws) })
await boshla(); r = await korin(); tek('hodisasiz blok — «Bu bloklar hech qachon ishlamaydi…», o‘yin boshlandi', r.ishora === 'Bu bloklar hech qachon ishlamaydi — tepasiga hodisa bloki qo‘ying' && r.oyin === '1', JSON.stringify(r))
await och('B1A'); await tuz([['→', 'r'], ['→', 'r']]); await boshla(); r = await korin()
tek('bitta tugmaga ikki dasturcha — ishora; → bir bosishda ikki katak', r.ishora === '→ uchun ikkita dasturcha bor — ikkalasi ham ishlaydi' && r.oyin === '1', JSON.stringify(r))
await bos('→'); r = await korin(); tek('… → — ikkala dasturcha ishladi: (2, 0)', r.joy.join() === '2,0', r.joy.join())
// yashirin yulduz: uch olma olingach ochiladi (B3A)
await och('B3A'); await tuz(T4); await boshla(); await bos('↑↑→↑↑→→→')
let y1 = await korin(); await bos('→→↓↓'); let y2 = await korin()
tek('B3A yulduz 2 olmada yashirin, 3-chisidan keyin ochildi; yozuv «Olma: 3 / 3»', !y1.yulduzOchiq && y2.yulduzOchiq && y2.yozuv.includes('Olma: 3 / 3'), JSON.stringify([y1.yozuv, y2.yozuv, y2.yulduzOchiq]))
// dasturchalar ustunda ustma-ust tushmaydi, hodisasiz blok xira
await och('B2A'); await tuz(T4); await p.evaluate(() => { const ek = document.querySelector('#ilova .ekran'); blQosh(ek, 'r'); sanoq(ek) }); await p.waitForTimeout(300)
const joy = await p.evaluate(() => { const ek = document.querySelector('#ilova .ekran'), ws = BL_WS.get(ek); const t = blTepalar(ws).map((b) => { const r = b.getSvgRoot().getBoundingClientRect(); return [r.top, r.bottom] }); return { t, xira: ek.querySelectorAll('.jr-bl .bl-xira').length, dsn: ek.querySelector('.dsn').textContent } })
tek('to‘rt dasturcha ostma-ost, ustma-ust tushmaydi; «4 ta dasturcha»', joy.t.length === 4 && joy.t.every((q, i) => !i || q[0] >= joy.t[i - 1][1] - 1) && joy.dsn === '4 ta dasturcha', JSON.stringify(joy))
// ustoz: o'yin paytida → qadam almashtirmaydi; huk
await p.goto(U + '?rol=ustoz&yangi=1&xona=hodisa-u'); await p.waitForTimeout(800)
await p.evaluate(() => ot(QADAM.findIndex((q) => q[1] === 'P7'))); await p.waitForTimeout(600)
await p.click('#ust .hn .ishga'); await p.waitForTimeout(300)
for (const c of '↑↑↑→→→→→') { await p.keyboard.press(KEY[c]); await p.waitForFunction(() => !document.querySelector('#ilova .ekran').dataset.yuryapti, null, { timeout: 8000, polling: 30 }); await p.waitForTimeout(60) }
await p.waitForTimeout(500)
const u7 = await p.evaluate(() => [QADAM[qadam][1], document.querySelector('#ust .hn .hint').textContent, !!document.querySelector('#ust .konfeti')])
tek('ustoz P7: strelkalar o‘yinda — qadam almashmadi, Coddy yulduzda', u7[0] === 'P7' && u7[1] === 'Yetib bordi!' && u7[2], JSON.stringify(u7))
await p.keyboard.press('ArrowRight'); await p.waitForTimeout(600)
tek('o‘yin tugagach → yana qadam almashtiradi', await p.evaluate(() => QADAM[qadam][1]) === 'P5G')
await p.evaluate(() => ot(QADAM.findIndex((q) => q[1] === 'P2S'))); await p.waitForTimeout(400)
const huk = []
for (let k = 1; k <= 3; k++) {
  if (k > 1) await p.click('#ust .hn .asos')
  if (k === 3) { await p.waitForFunction(() => document.querySelector('#ust .ekran').dataset.oyin === 'huk', null, { timeout: 10000 }); for (const c of '↑↑↑↑→') { await p.keyboard.press(KEY[c]); await p.waitForTimeout(260) } }
  await p.waitForFunction((n) => document.querySelectorAll('#ust .jk .jn').length >= n && !document.querySelector('#ust .ekran').dataset.yuryapti, k, { timeout: 20000, polling: 100 })
  await p.waitForTimeout(400)
  huk.push(await p.evaluate(() => [[...document.querySelectorAll('#ust .jk .jn')].map((x) => x.textContent).join(' | '), document.querySelector('#ust .katak').dataset.xarita.split('|').map((q, i, a) => q.indexOf('*') >= 0 ? q.indexOf('*') + ',' + (a.length - 1 - i) : '').join('')]))
}
tek('huk: A (2, 3) ✕, B (5, 1) ✕, C (1, 4) — strelkalar bilan ✓', JSON.stringify(huk) === JSON.stringify([['✕ yulduz boshqa joyda', '2,3'], ['✕ yulduz boshqa joyda | ✕ yana o‘sha yo‘l', '5,1'], ['✕ yulduz boshqa joyda | ✕ yana o‘sha yo‘l | ✓ yetib bordi', '1,4']]), JSON.stringify(huk))
tek('konsolda xato yo‘q', !xato.length, xato.slice(0, 3).join(' | '))
await b.close()
console.log('\n' + ok + ' / ' + jami + (ok === jami ? ' — HAMMASI TO‘G‘RI' : ' — XATO BOR'))
process.exit(ok === jami ? 0 : 1)
