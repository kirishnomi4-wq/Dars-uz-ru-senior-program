// Maydon sinovi (3-dars, 20.11): manba 003-koordinata «Topshiriqlar va tekshiruv natijasi» jadvalidagi har topshiriq 3-darsning HAQIQIY ekranlarida
// (demo-003.html) yuriladi va shu fayldagi MUSTAQIL simulyatsiya bilan solishtiriladi (dvigatel kodidan foydalanmaydi):
//   katakni bosing (1-bekat) — haqiqiy sichqoncha bosishi bilan: to'g'ri katak / boshqa katak (Kamvoy, pufakda o'sha katakning manzili), ★ da ikki manzil;
//   go to va move dasturlari (2-bekat, 10-qadam) — Blockly'ga qo'shilib ishga tushiriladi: qayerda to'xtadi, olmalar, yashirin yulduz, chet, erkin yo'l, bo'sh;
//   oldindan ayting (3-bekat, 14-qadam) — bayroqcha haqiqiy bosish bilan qo'yiladi, «Tekshirish»: to'g'ri / boshqa katak;
//   huk (3-qadam) — uch xat: A 3 ta katak, B 7 ta katak yonadi, C — qahramon (4, 2) ga yuradi, yulduz ochiladi.
// Ekranda yana: qahramon o'sha katakda, yorliq «(x, y)», muammocha va ishora gapi (qahramonning haqiqiy manzili bilan), konfeti.
// Ishlatish (lokal server 5340 yoniq, demo yig'ilgan):  node new-junior/sinov/dvigatel/maydon.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-003.html', W = 7, H = 5
const B = { '→': 'r', '←': 'l', '↑': 'u', '↓': 'd' }
// dastur yozuvi: «→→↑» yoki «g(4,2)» aralash; [t, 'x,y']
const dastur = (s) => { const r = []; for (const m of s.matchAll(/g\((\d),(\d)\)|[→←↑↓]/g)) r.push(m[1] != null ? ['x', m[1] + ',' + m[2]] : [B[m[0]]]); return r }
// mustaqil simulyatsiya: (x, y), Y tepaga; chetdan chiqsa — to'xtaydi
function sim(start, d) {
  let [x, y] = start; const yol = [[x, y]], go = []
  const D = { r: [1, 0], l: [-1, 0], u: [0, 1], d: [0, -1] }
  for (let i = 0; i < d.length; i++) {
    const [t, m] = d[i]
    if (t === 'x') { [x, y] = m.split(',').map(Number); go.push([x, y]) } else { const nx = x + D[t][0], ny = y + D[t][1]; if (nx < 0 || ny < 0 || nx >= W || ny >= H) return { x, y, yol, go, chet: i + 1 }; x = nx; y = ny }
    yol.push([x, y])
  }
  return { x, y, yol, go, chet: 0 }
}
const teng = (a, b) => a[0] === b[0] && a[1] === b[1]
const Y = (p) => '(' + p[0] + ', ' + p[1] + ')'
// [ekran, start, dastur, yulduz, olmalar, erkinYol, manbadagi kutilgan natija]
const DST = [
  ['P7', [0, 0], 'g(4,2)', [4, 2], [[1, 3]], 0, 'yetdi'], ['P7', [0, 0], 'g(1,3)g(4,2)', [4, 2], [[1, 3]], 0, 'yetdi+olma'],
  ['B2A', [0, 0], 'g(5,3)', [5, 3], [], 0, 'yetdi'], ['B2A', [0, 0], 'g(3,4)', [5, 3], [], 0, 'boshqa'], ['B2A', [0, 0], '→→→→→↑↑↑', [5, 3], [], 0, 'yetdi'], ['B2A', [0, 0], '←', [5, 3], [], 0, 'chet'],
  ['B2B', [0, 0], 'g(2,1)g(6,4)', [6, 4], [[2, 1]], 0, 'yetdi'], ['B2B', [0, 0], 'g(6,4)', [6, 4], [[2, 1]], 0, 'olmasiz'], ['B2B', [0, 0], 'g(6,4)g(2,1)', [6, 4], [[2, 1]], 0, 'boshqa'],
  ['B2C', [0, 0], 'g(1,3)g(5,1)g(3,4)', [3, 4], [[1, 3], [5, 1]], 0, 'yetdi'], ['B2C', [0, 0], 'g(1,3)g(3,4)', [3, 4], [[1, 3], [5, 1]], 0, 'olmasiz'],
  ['B2Y', [0, 0], 'g(2,4)g(4,0)g(6,4)', null, [], 3, 'tayyor'], ['B2Y', [0, 0], 'g(2,4)g(2,4)g(4,0)', null, [], 3, 'kamManzil'],
  ['P11', [0, 0], 'g(2,4)g(5,1)', null, [], 1, 'tayyor'],
]
const GAP = {
  boshqa: (j) => ['kamvoy', 'Yulduz bu yerda emas!', 'Qahramon ' + Y(j) + ' da. Sonlarni tekshiring: avval X, keyin Y'],
  olmasiz: (j, o) => ['kamvoy', 'Olma qoldi-ku!', 'Avval olmaga boring — u ' + Y(o) + ' da'],
  chet: () => ['kamvoy', 'Maydon tugadi!', 'Qahramon shu blokda to‘xtadi. Boshqa tomonga yuring'],
  kamManzil: () => ['kamvoy', 'Oz qoldi!', 'Yana bitta manzil qo‘shing'],
  boshqaKatak: (j) => ['kamvoy', 'Boshqa katak!', 'Qahramon ' + Y(j) + ' da to‘xtadi. Dasturni qaytadan sanang: X qancha, Y qancha'],
}
// oldindan ayting: [ekran, start, dastur, manbadagi javob]
const BASH = [['P8', [1, 1], '→→↑', [3, 2]], ['B3A', [1, 1], '→→↑→', [4, 2]], ['B3B', [0, 0], '↑↑→→→↓→', [4, 1]], ['B3C', [0, 0], 'g(2,3)→↓→↓→', [5, 1]], ['B3Y', [0, 0], 'g(5,4)←←←↓g(1,0)↑↑→', [2, 2]]]
// katakni bosing: [ekran, kataklar ketma-ket]
const KAT = [['B1A', [[3, 0]]], ['B1B', [[0, 2]]], ['B1C', [[4, 3]]], ['B1Y', [[2, 4], [4, 2]]]]

const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }), xato = []
const p = await (await b.newContext({ viewport: { width: 1440, height: 810 } })).newPage()
p.on('pageerror', (e) => xato.push(e.message)); p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) xato.push(m.text()) })
p.on('response', (r) => { if (r.status() >= 400 && !/favicon\.ico$/.test(r.url())) xato.push(r.status() + ' ' + r.url()) })
let ok = 0, jami = 0
const tek = (nom, shart, iz = '') => { jami++; if (shart) ok++; console.log((shart ? '✓ ' : '✗ ') + nom + (shart || !iz ? '' : '  — ' + iz)) }
await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'momiq') })
await p.goto(U + '?rol=bola&xona=maydon-sinov'); await p.waitForTimeout(900)
await p.evaluate(() => { bolaKeyingi = () => {}; window.__ijroAsl = ijro; ijro = (d, f, op) => window.__ijroAsl(d, f, { ...(op || {}), kut: 90 }) })
const och = (id) => p.evaluate((id) => {
  const il = document.getElementById('ilova'), bola = id[0] === 'B'
  il.innerHTML = bola ? '<div id="bol">' + ekran(id, null, true) + '</div>' : '<div id="ust">' + ekran(id) + '</div>'; studiyaTayyorla(il.firstChild)
  il.querySelectorAll('.dv-muam,.konfeti').forEach((x) => x.remove())
}, id)
// ekrandagi holat: qahramon joyi (transform → katak), yorliq, muammocha, ishora, konfeti, olmalar, yulduz
const korin = () => p.evaluate(() => {
  const ek = document.querySelector('#ilova .ekran'), k = ek.querySelector('.katak.maydon'), xr = k.dataset.xarita.split('|'), g = k.querySelector('.kt-q')
  const m = g.style.transform.match(/-?[\d.]+/g).map(Number), x = Math.round((m[0] - 10) / 100), q = Math.round((m[1] + 14) / 100)
  const mu = ek.querySelector('.dv-muam')
  return { joy: [x, xr.length - 1 - q], yorliq: (k.querySelector('.kt-yr text') || {}).textContent || '', muam: mu ? (mu.className.match(/m-(\w+)/) || [])[1] : '', muamGap: mu ? mu.textContent.trim() : '',
    ishora: (ek.querySelector('.hn .hint') || {}).textContent || '', konfeti: !!ek.querySelector('.oyna .konfeti'), olindi: k.querySelectorAll('.kt-olma.olindi').length, olma: k.querySelectorAll('.kt-olma').length,
    yulduzOchiq: !!k.querySelector('.kt-yul.yashirin.topildi'), yulduzYashirin: !!k.querySelector('.kt-yul.yashirin'), goIz: k.querySelectorAll('.kt-il.kt-gl').length, bayroq: ek.dataset.bayroq || '',
    yonk: k.querySelectorAll('.kt-c.yonk').length, topildi: k.querySelectorAll('.md-top').length }
})
const kutBo = () => p.waitForFunction(() => { const ek = document.querySelector('#ilova .ekran'); return ek && !ek.dataset.yuryapti }, null, { timeout: 15000, polling: 50 }).then(() => p.waitForTimeout(500))
// maydon katagini haqiqiy sichqoncha bilan bosish (katak markazi)
const katakBos = async ([x, y]) => {
  const r = await p.evaluate(([x, y]) => { const k = document.querySelector('#ilova .katak.maydon'), xr = k.dataset.xarita.split('|'), c = k.querySelector('.kt-c[data-k="' + x + ',' + (xr.length - 1 - y) + '"]').getBoundingClientRect(); return [c.left + c.width / 2, c.top + c.height / 2] }, [x, y])
  await p.mouse.click(r[0] + 18, r[1] + 22); await p.waitForTimeout(250)
}

// 1) katakni bosing
for (const [id, kat] of KAT) {
  await och(id)
  // avval boshqa katak: X va Y almashgan (bir xil bo'lsa — qo'shni)
  const yan = kat[0][0] === kat[0][1] || kat[0][1] > 4 || kat[0][0] > 4 ? [(kat[0][0] + 1) % W, kat[0][1]] : [kat[0][1], kat[0][0]]
  await katakBos(yan); await p.waitForTimeout(400)
  let r = await korin()
  tek(id + ' boshqa katak ' + Y(yan), r.muam === 'kamvoy' && r.muamGap === 'Bu — ' + Y(yan) && r.ishora === 'Avval X — o‘ngga sanang, keyin Y — tepaga' && teng(r.joy, yan) && r.yorliq === Y(yan) && !r.topildi, JSON.stringify(r))
  for (let i = 0; i < kat.length; i++) {
    await katakBos(kat[i]); await p.waitForTimeout(300); r = await korin()
    const oxiri = i === kat.length - 1
    tek(id + ' topdi ' + Y(kat[i]) + (oxiri ? '' : ' → «Endi ' + Y(kat[i + 1]) + '»'), !r.muam && r.konfeti && teng(r.joy, kat[i]) && r.topildi === i + 1 && r.ishora === (oxiri ? 'Topdingiz!' : 'Endi ' + Y(kat[i + 1])), JSON.stringify(r))
  }
}
// 2) dasturlar
for (const [id, start, ds, yul, olma, erkin, man] of DST) {
  await och(id)
  const d = dastur(ds), s = sim(start, d)
  const qoldi = olma.filter((o) => !s.yol.some((q) => teng(q, o)))
  const kut = s.chet ? 'chet' : erkin ? (new Set(s.go.map(String)).size >= erkin ? 'tayyor' : 'kamManzil') : (qoldi.length && id !== 'P7') ? 'olmasiz' : yul && teng([s.x, s.y], yul) ? 'yetdi' : 'boshqa'
  await p.evaluate((d) => { const ek = document.querySelector('#ilova .ekran'), ws = BL_WS.get(ek); ws.clear(); sanoq(ek); for (const [t, m] of d) blQosh(ek, t, m); sanoq(ek) }, d)
  await p.evaluate(() => ishgaTushir(document.querySelector('#ilova .ekran'))); await kutBo()
  const r = await korin(), farq = []
  if (kut !== man.split('+')[0]) farq.push('simulyatsiya ' + kut + ' ≠ manba ' + man)
  if (!teng(r.joy, [s.x, s.y])) farq.push('joy ' + Y(r.joy) + ' ≠ ' + Y([s.x, s.y]))
  if (r.yorliq !== Y([s.x, s.y])) farq.push('yorliq ' + r.yorliq)
  if (r.goIz !== s.go.length) farq.push('go to izi ' + r.goIz + ' ≠ ' + s.go.length)
  const olindi = olma.length - qoldi.length; if (r.olindi !== olindi) farq.push('olindi ' + r.olindi + ' ≠ ' + olindi)
  if (yul && r.yulduzYashirin && r.yulduzOchiq !== s.yol.some((q) => teng(q, yul))) farq.push('yashirin yulduz ochildimi: ' + r.yulduzOchiq)
  const ok2 = kut === 'yetdi' || kut === 'tayyor'
  if (ok2 && (!r.konfeti || r.muam)) farq.push('konfeti yo‘q yoki muammocha chiqdi')
  if (ok2 && r.ishora !== (kut === 'tayyor' ? 'Yo‘lingiz tayyor!' : 'Yetib bordi!')) farq.push('ishora «' + r.ishora + '»')
  if (GAP[kut]) { const g = GAP[kut]([s.x, s.y], qoldi[0]); if (r.muam !== g[0] || r.muamGap !== g[1] || r.ishora !== g[2]) farq.push('muammocha/ishora: ' + r.muam + ' «' + r.muamGap + '» · «' + r.ishora + '»') }
  tek((id + ' ' + ds).padEnd(30) + ' → ' + kut + (olindi ? ' (olma ' + olindi + ')' : ''), !farq.length, farq.join('; '))
}
// bo'sh dastur — Bo'shvoy
await och('B2A'); await p.evaluate(() => { const ek = document.querySelector('#ilova .ekran'); BL_WS.get(ek).clear(); sanoq(ek); return ishgaTushir(ek) }); await p.waitForTimeout(300)
{ const r = await korin(); tek('B2A bo‘sh dastur → Bo‘shvoy', r.muam === 'boshvoy' && r.ishora === 'Avval blokni bosing — u dasturga qo‘shiladi', JSON.stringify(r)) }
// 3) oldindan ayting
for (const [id, start, ds, man] of BASH) {
  const s = sim(start, dastur(ds)), yan = [man[0] === 6 ? 5 : man[0] + 1, man[1]]
  tek(id + ' simulyatsiya = manba ' + Y(man), teng([s.x, s.y], man), Y([s.x, s.y]))
  await och(id)
  // bayroqchasiz «Tekshirish» — xira, ishga tushmaydi
  const tug = id[0] === 'P' ? '#ilova .hn .ishga' : '#ilova .hn .asos'
  const xira = await p.evaluate((t) => document.querySelector(t).classList.contains('kut'), tug)
  await p.click(tug); await p.waitForTimeout(250)
  let r = await korin()
  tek(id + ' bayroqchasiz: tugma xira, «Avval bayroqchani qo‘ying»', xira && r.ishora === 'Avval bayroqchani qo‘ying' && teng(r.joy, start), JSON.stringify(r))
  // dastur bloklari o'zgarmaydi (bosilsa ham)
  const n0 = await p.evaluate(() => document.querySelectorAll('#ilova .dst .mb').length)
  await p.click('#ilova .dst .mb'); const n1 = await p.evaluate(() => document.querySelectorAll('#ilova .dst .mb').length)
  // noto'g'ri bayroqcha
  await katakBos(yan); r = await korin()
  const ochildi = await p.evaluate((t) => !document.querySelector(t).classList.contains('kut'), tug)
  await p.click(tug); await kutBo(); r = await korin()
  const g = GAP.boshqaKatak(man)
  tek(id + ' bayroqcha ' + Y(yan) + ' → Boshqa katak', n0 === n1 && ochildi && r.bayroq === yan.join(',') && teng(r.joy, man) && r.muam === g[0] && r.muamGap === g[1] && r.ishora === g[2], JSON.stringify(r) + ' bloklar ' + n0 + '/' + n1)
  // to'g'ri bayroqcha
  await katakBos(man); await p.click(tug); await kutBo(); r = await korin()
  tek(id + ' bayroqcha ' + Y(man) + ' → Oldindan aytdingiz!', r.bayroq === man.join(',') && teng(r.joy, man) && !r.muam && r.konfeti && r.ishora === 'Oldindan aytdingiz!', JSON.stringify(r))
}
// ustoz ekranida (P8) «Keyingi» — avval uchta sanoq yozuvi birma-bir, keyin keyingi qadam
await p.goto(U + '?rol=ustoz&yangi=1'); await p.waitForTimeout(800)
await p.evaluate(() => { ot(QADAM.findIndex((q) => q[1] === 'P8')) }); await p.waitForTimeout(500)
const sq = []
for (let i = 0; i < 4; i++) { await p.click('#ilova .hn .asos'); await p.waitForTimeout(200); sq.push(await p.evaluate(() => [QADAM[qadam][1], [...document.querySelectorAll('#ilova .sq.on')].map((x) => x.textContent).join(' ')])) }
tek('P8 ustoz «Keyingi»: X: 2 → X: 3 → Y: 2, keyin keyingi qadam', JSON.stringify(sq) === JSON.stringify([['P8', 'X: 2'], ['P8', 'X: 2 X: 3'], ['P8', 'X: 2 X: 3 Y: 2'], ['P5B', '']]), JSON.stringify(sq))
// 4) huk — uch xat (ustoz ekrani, A o'zi boshlanadi)
await p.evaluate(() => { ot(QADAM.findIndex((q) => q[1] === 'P2S')) })
const huk = []
for (let k = 1; k <= 3; k++) {
  if (k > 1) await p.click('#ilova .hn .asos')
  await p.waitForFunction((n) => document.querySelectorAll('#ilova .jk .jn').length >= n && !document.querySelector('#ilova .ekran').dataset.yuryapti, k, { timeout: 20000, polling: 100 })
  await p.waitForTimeout(500)
  huk.push(await p.evaluate(() => { const k = document.querySelector('#ilova .katak'); return [[...document.querySelectorAll('#ilova .jk .jn')].map((x) => x.textContent).join(' | '), k.querySelectorAll('.kt-c.yonk').length, !!k.querySelector('.kt-yul.topildi')] }))
}
tek('huk: A 3 katak, B 7 katak, C yulduz (4, 2)', JSON.stringify(huk) === JSON.stringify([['✕ 3 ta katak', 3, false], ['✕ 3 ta katak | ✕ 7 ta katak', 7, false], ['✕ 3 ta katak | ✕ 7 ta katak | ✓ bitta katak', 0, true]]), JSON.stringify(huk))
tek('konsolda xato yo‘q', !xato.length, xato.slice(0, 3).join(' | '))
await b.close()
console.log('\n' + ok + ' / ' + jami + (ok === jami ? ' — HAMMASI TO‘G‘RI' : ' — XATO BOR'))
process.exit(ok === jami ? 0 : 1)
