// Takrorlash sinovi (5-dars, 20.11): manba 005-takrorlash «Topshiriqlar» jadvalidagi har yechim va xato varianti 5-darsning HAQIQIY ekranlarida
// (demo-005.html) yuriladi va shu fayldagi MUSTAQIL simulyatsiya bilan solishtiriladi (dvigatel kodidan foydalanmaydi).
// Yana: javon orqali haqiqiy bosish — repeat qo'shilsa tanlanadi, keyingi bloklar ichiga tushadi, yana bosilsa — tashqariga; tanlangan repeat ga yangi
// repeat ichma-ich tushmaydi; topshiriq chegarasi («N / M ta blok», to'lsa Ortiqvoy «Joy qolmadi!»); ichi bo'sh repeat; ijro paytida sanoq (1…N);
// huk kartalari; 14-qadam — juftliklar va qisqa dasturga almashish.
// Ishlatish (lokal server 5340 yoniq, demo-005 yig'ilgan):  node new-junior/sinov/dvigatel/takror.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-005.html', W = 7, H = 5
const D = { r: [1, 0], l: [-1, 0], u: [0, 1], d: [0, -1] }
// dastur yozuvi: 'p5[r]' — repeat 5 ichida move right; 'p3[ru]' — ichida ikki blok; oddiy harflar — move
const pars = (s) => { const r = []; for (const m of s.matchAll(/p(\d+)\[([rlud]+)\]|[rlud]/g)) r.push(m[1] ? { t: 'p', m: m[1], ichki: [...m[2]].map((t) => ({ t })) } : { t: m[0] }); return r }
const ochil = (d) => d.flatMap((x) => (x.t === 'p' ? Array.from({ length: +x.m }, () => x.ichki.map((y) => y.t)).flat() : [x.t]))
function sim(start, d) { let [x, y] = start; const yol = [[x, y]]; for (const t of ochil(d)) { const nx = x + D[t][0], ny = y + D[t][1]; if (nx < 0 || ny < 0 || nx >= W || ny >= H) return { x, y, yol, chet: true }; x = nx; y = ny; yol.push([x, y]) } return { x, y, yol, chet: false } }
const Y = (p) => '(' + p[0] + ', ' + p[1] + ')'
const teng = (a, b) => a[0] === b[0] && a[1] === b[1]
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }), xato = []
const p = await (await b.newContext({ viewport: { width: 1440, height: 810 } })).newPage()
p.on('pageerror', (e) => xato.push(e.message)); p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) xato.push(m.text()) })
let ok = 0, jami = 0
const tek = (nom, shart, iz = '') => { jami++; if (shart) ok++; console.log((shart ? '✓ ' : '✗ ') + nom + (shart || !iz ? '' : '  — ' + iz)) }
await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'momiq') })
await p.goto(U + '?rol=bola&xona=takror-sinov'); await p.waitForTimeout(900)
await p.evaluate(() => { bolaKeyingi = () => {}; window.__ijroAsl = ijro; window.__sanoq = []; const asl = blSanoq; blSanoq = (el, i) => { window.__sanoq.push(i); asl(el, i) }; ijro = (d, f, op) => window.__ijroAsl(d, f, { ...(op || {}), kut: 90 }) })
const och = (id) => p.evaluate((id) => { const il = document.getElementById('ilova'), bola = id[0] === 'B'; il.innerHTML = bola ? '<div id="bol">' + ekran(id, null, true) + '</div>' : '<div id="ust">' + ekran(id) + '</div>'; studiyaTayyorla(il.firstChild); il.querySelectorAll('.dv-muam,.konfeti').forEach((x) => x.remove()) }, id)
const qur = (d) => p.evaluate((d) => { const ek = document.querySelector('#ilova .ekran'); blQur(ek, d); sanoq(ek) }, d)
const ishga = async () => { await p.evaluate(() => { window.__sanoq = []; return ishgaTushir(document.querySelector('#ilova .ekran')) }); await p.waitForTimeout(500) }
const korin = () => p.evaluate(() => {
  const ek = document.querySelector('#ilova .ekran'), k = ek.querySelector('.katak.maydon'), xr = k.dataset.xarita.split('|'), g = k.querySelector('.kt-q'), m = g.style.transform.match(/-?[\d.]+/g).map(Number), mu = ek.querySelector('.dv-muam')
  return { joy: [Math.round((m[0] - 10) / 100), xr.length - 1 - Math.round((m[1] + 14) / 100)], muam: mu ? (mu.className.match(/m-(\w+)/) || [])[1] + ':' + mu.textContent.trim() : '', ishora: (ek.querySelector('.hn .hint') || {}).textContent || '',
    konfeti: !!ek.querySelector('.oyna .konfeti'), olindi: k.querySelectorAll('.kt-olma.olindi').length, dsn: (ek.querySelector('.dsn') || {}).textContent || '', sanoq: window.__sanoq.slice() }
})
// tuzilish: [[tur, son, ichidagilar]…] (Blockly'dan)
const tuzilish = () => p.evaluate(() => { const ek = document.querySelector('#ilova .ekran'), ws = BL_WS.get(ek); return blRoyxat(ws).map((b) => b.type === 'repeat' ? 'p' + b.getFieldValue('N') + '[' + blZanjir(b.getInputTargetBlock('DO')).map((c) => BL_TURI[c.type]).join('') + ']' : BL_TURI[b.type]).join(' ') })
const javon = async (f, nom) => { await p.click('#ilova .rg .rd.f-' + f); await p.waitForTimeout(100); await p.locator('#ilova .pl .mbw:not(.yopiq) .mb', { hasText: nom }).first().click(); await p.waitForTimeout(150) }
const menyu = async (n, v) => { await p.locator('#ilova .jr-bl .mb').nth(n).locator('.blocklyDropdownField').first().click(); await p.waitForTimeout(150); await p.locator('.blocklyDropDownDiv .blocklyMenuItem').filter({ hasText: new RegExp('^\\s*' + v + '\\s*$') }).first().click(); await p.waitForTimeout(150) }

// 1) javon orqali: repeat tanlanadi, ichiga, tashqariga; ichma-ich yo'q; chegara
await och('B1C')
await javon('b', 'repeat'); let r = await korin()
tek('javondan repeat — dasturga tushdi va tanlandi (ishora)', (await tuzilish()) === 'p2[]' && (await p.$$('#ilova .jr-bl .bl-tanlangan')).length === 1 && r.ishora === 'Endi bosgan bloklaringiz repeat ichiga tushadi. Tashqariga — repeat ni yana bosing', r.ishora)
await menyu(0, '5'); await javon('h', 'move right')
tek('son ro‘yxatdan 5; move right — repeat ichiga tushdi; «2 / 4 ta blok»', (await tuzilish()) === 'p5[r]' && (await korin()).dsn === '2 / 4 ta blok', (await tuzilish()) + ' ' + (await korin()).dsn)
await javon('b', 'repeat'); tek('tanlangan repeat ga yangi repeat — ichma-ich emas, tashqarida', (await tuzilish()) === 'p5[r] p2[]', await tuzilish())
await javon('h', 'move up'); tek('yangi repeat tanlangan — move up uning ichiga', (await tuzilish()) === 'p5[r] p2[u]', await tuzilish())
await javon('h', 'move up'); r = await korin()
tek('chegara 4: 5-blok qo‘shilmadi — Ortiqvoy «Joy qolmadi!», ishora chegara bilan', (await tuzilish()) === 'p5[r] p2[u]' && r.muam === 'ortiqvoy:Joy qolmadi!' && r.ishora === 'Dasturga 4 ta blok sig‘adi. Takrorlanadigan bloklarni repeat ichiga qo‘ying', JSON.stringify(r))
await p.locator('#ilova .jr-bl .mb').nth(2).click({ position: { x: 14, y: 12 } }); await p.waitForTimeout(300)
await qur([{ t: 'p', m: '3' }]); await ishga(); r = await korin()
tek('ichi bo‘sh repeat — Bo‘shvoy «Ichi bo‘sh-ku…»', r.muam === 'boshvoy:Ichi bo‘sh-ku…' && r.ishora === 'repeat ichiga blok qo‘ying', JSON.stringify(r))
// 2) yechimlar va xatolar (simulyatsiya bilan)
const T = { // id: [start, yulduz | null, olmalar]
  B1A: [[0, 0], [5, 0], [[1, 0], [2, 0], [3, 0], [4, 0]]], B1B: [[3, 4], [3, 0], [[3, 3], [3, 2], [3, 1]]], B1C: [[0, 0], [5, 3], [[5, 0]]], B1Y: [[0, 0], [2, 2], [[5, 0], [5, 2]]],
}
const ISH1 = [
  ['B1A', 'p5[r]', 'yetdi'], ['B1A', 'p6[r]', 'otibKetdi'], ['B1A', 'p4[r]', 'boshqa'], ['B1B', 'p4[d]', 'yetdi'], ['B1B', 'u', 'chet'],
  ['B1C', 'p5[r] p3[u]', 'yetdi'], ['B1C', 'p3[u] p5[r]', 'olmasiz'], ['B1Y', 'p5[r] p2[u] p3[l]', 'yetdi'],
]
const GAP = {
  otibKetdi: () => ['ortiqvoy:Ko‘payib ketdi!', 'Qahramon yulduzdan o‘tib ketdi — repeat sonini kamaytiring'],
  boshqa: (j) => ['kamvoy:Yulduz bu yerda emas!', 'Qahramon ' + Y(j) + ' da. Kataklarni sanang — repeat sonini tekshiring'],
  olmasiz: (j, o) => ['kamvoy:Olma qoldi-ku!', 'Avval olmaga boring — u ' + Y(o) + ' da'],
  chet: () => ['kamvoy:Maydon tugadi!', 'Qahramon shu blokda to‘xtadi. Son va yo‘nalishni tekshiring'],
}
for (const [id, ds, man] of ISH1) {
  await och(id); const d = pars(ds); await qur(d); await ishga()
  const [start, yul, olma] = T[id], s = sim(start, d), r = await korin(), farq = []
  const qoldi = olma.filter((o) => !s.yol.some((q) => teng(q, o)))
  const kut = s.chet ? 'chet' : qoldi.length ? 'olmasiz' : teng([s.x, s.y], yul) ? 'yetdi' : s.yol.some((q) => teng(q, yul)) ? 'otibKetdi' : 'boshqa'
  if (kut !== man) farq.push('simulyatsiya ' + kut + ' ≠ manba ' + man)
  if (!teng(r.joy, [s.x, s.y])) farq.push('joy ' + Y(r.joy) + ' ≠ ' + Y([s.x, s.y]))
  if (kut === 'yetdi' && (!r.konfeti || r.muam || r.ishora !== 'Yetib bordi!')) farq.push('yetmadi: ' + JSON.stringify(r))
  if (GAP[kut]) { const g = GAP[kut]([s.x, s.y], qoldi[0]); if (r.muam !== g[0] || r.ishora !== g[1]) farq.push(r.muam + ' «' + r.ishora + '»') }
  const p5 = d.find((x) => x.t === 'p'); if (p5 && !s.chet && r.sanoq.slice(0, +p5.m).join() !== Array.from({ length: +p5.m }, (_, i) => i + 1).join()) farq.push('sanoq ' + r.sanoq.join(','))
  tek((id + ' ' + ds).padEnd(26) + ' → ' + man, !farq.length, farq.join('; '))
}
// rasm topshiriqlari: kulrang kataklar ekrandan o'qiladi va simulyatsiya qilingan rasm bilan solishtiriladi
const RASM = [
  ['B2A', [0, 0], 'p3[r] p3[u] p3[l] p3[d]', 'p3[r] p3[u] p3[l] p3[d]', 'rasmTayyor'], ['B2A', [0, 0], 'p3[r] p3[u] p3[l] p3[d]', 'p3[u] p3[r] p3[d] p3[l]', 'rasmTayyor'],
  ['B2A', [0, 0], 'p3[r] p3[u] p3[l] p3[d]', 'p4[r]', 'rasmChiqdi'], ['B2A', [0, 0], 'p3[r] p3[u] p3[l] p3[d]', 'p3[r] p3[u]', 'rasmKam'],
  ['B2B', [2, 4], 'p3[r] p3[d] p3[l] p3[u]', 'p3[r] p3[d] p3[l] p3[u]', 'rasmTayyor'], ['B2C', [0, 0], 'p3[r] p4[u] p3[l] p4[d]', 'p3[r] p4[u] p3[l] p4[d]', 'rasmTayyor'],
  ['B2Y', [3, 0], 'p4[u] p2[r] p4[d] p2[l] p2[u] p2[r]', 'p4[u] p2[r] p4[d] p2[l] p2[u] p2[r]', 'rasmTayyor'],
  ['B3A', [1, 4], 'drdrdrdr', 'p4[dr]', 'rasmTayyor'], ['B3A', [1, 4], 'drdrdrdr', 'p4[rd]', 'rasmChiqdi'], ['B3B', [2, 0], 'urdrurdr', 'p2[urdr]', 'rasmTayyor'], ['B3C', [1, 0], 'rururdrd', 'p2[ru] p2[rd]', 'rasmTayyor'],
]
for (const [id, start, rasmD, ds, man] of RASM) {
  await och(id); const d = pars(ds); await qur(d); await ishga()
  const ekR = (await p.evaluate(() => { const k = document.querySelector('#ilova .katak.maydon'), n = k.dataset.xarita.split('|').length; return [...k.querySelectorAll('.kt-c.md-rasm')].map((c) => { const [x, q] = c.dataset.k.split(',').map(Number); return x + ',' + (n - 1 - q) }) })).sort()
  const rasm = [...new Set(sim(start, pars(rasmD)).yol.map(String))].sort(), s = sim(start, d), otdi = s.yol.map(String), farq = []
  if (ekR.join(' ') !== rasm.join(' ')) farq.push('ekrandagi kulrang rasm manbadagi rasm emas')
  // qolgan kataklardan qahramonga eng yaqini (teng bo'lsa — tepadan, chapdan)
  const qoldi = rasm.filter((k) => otdi.indexOf(k) < 0).map((k) => k.split(',').map(Number)).sort((a, c) => (Math.abs(a[0] - s.x) + Math.abs(a[1] - s.y)) - (Math.abs(c[0] - s.x) + Math.abs(c[1] - s.y)) || c[1] - a[1] || a[0] - c[0])
  const chiq = otdi.find((k) => rasm.indexOf(k) < 0), kam = qoldi.length ? qoldi[0].join(',') : null, kut = chiq ? 'rasmChiqdi' : kam ? 'rasmKam' : 'rasmTayyor'
  if (kut !== man) farq.push('simulyatsiya ' + kut + ' ≠ manba ' + man)
  const r = await korin(), xy = (k) => '(' + k.split(',').join(', ') + ')'
  const g = { rasmTayyor: ['', id[1] === '3' ? 'Qisqartirdingiz!' : 'Rasm tayyor!'], rasmChiqdi: ['ortiqvoy:Rasmdan chiqdi!', 'Qahramon ' + (chiq && xy(chiq)) + ' ga chiqdi — u kulrang emas. Son va yo‘nalishni tekshiring'], rasmKam: ['kamvoy:Oz qoldi!', 'Kulrang katak qoldi — ' + (kam && xy(kam)) + '. repeat sonini tekshiring'] }[kut]
  if (r.muam !== g[0] || r.ishora !== g[1] || (kut === 'rasmTayyor') !== r.konfeti) farq.push(r.muam + ' «' + r.ishora + '» konfeti ' + r.konfeti)
  tek((id + ' ' + ds).padEnd(30) + ' → ' + man, !farq.length, farq.join('; '))
}
// erkin rasm (15 · ★)
await och('B3Y'); await qur(pars('p3[rru]')); await ishga(); r = await korin(); tek('B3Y p3[rru] — «Rasmingiz tayyor!»', r.ishora === 'Rasmingiz tayyor!' && r.konfeti && !r.muam && r.joy.join() === '6,3', JSON.stringify(r))
await och('B3Y'); await qur(pars('p3[r]')); await ishga(); r = await korin(); tek('B3Y p3[r] — ichida bitta blok: Kamvoy «Oz qoldi!»', r.muam === 'kamvoy:Oz qoldi!' && r.ishora === 'repeat ichiga kamida ikkita blok qo‘ying', JSON.stringify(r))
// huk (ustoz ekrani) va 14-qadam (qisqartirish)
await p.goto(U + '?rol=ustoz&yangi=1&xona=takror-u'); await p.waitForTimeout(800)
await p.evaluate(() => { const asl = ijro; ijro = (d, f, op) => asl(d, f, { ...(op || {}), kut: 90 }); ot(QADAM.findIndex((q) => q[1] === 'P2S')) })
const huk = []
for (let k = 1; k <= 3; k++) {
  if (k > 1) await p.click('#ust .hn .asos')
  await p.waitForFunction((n) => document.querySelectorAll('#ust .jk .jn').length >= n && !document.querySelector('#ust .ekran').dataset.yuryapti, k, { timeout: 20000, polling: 100 }); await p.waitForTimeout(500)
  huk.push(await p.evaluate(() => { const ek = document.querySelector('#ust .ekran'); return [[...ek.querySelectorAll('.jk .jn')].map((x) => x.textContent).join(' | '), ek.querySelector('.kt-yr text').textContent, ek.querySelectorAll('.kt-olma.olindi').length].join(' # ') }))
}
tek('huk: A (3, 0) 3 olma ✕ · B (6, 0) 0 olma ✕ · C (6, 0) 5 olma ✓', JSON.stringify(huk) === JSON.stringify(['✕ sig‘madi # (3, 0) # 3', '✕ sig‘madi | ✕ olmalar qoldi # (6, 0) # 0', '✕ sig‘madi | ✕ olmalar qoldi | ✓ 2 ta blok # (6, 0) # 5']), JSON.stringify(huk))
await p.evaluate(() => ot(QADAM.findIndex((q) => q[1] === 'P8'))); await p.waitForTimeout(600)
const tz = () => p.evaluate(() => { const ws = BL_WS.get(document.querySelector('#ust .ekran')); return blRoyxat(ws).map((b) => b.type === 'repeat' ? 'p' + b.getFieldValue('N') + '[' + blZanjir(b.getInputTargetBlock('DO')).map((c) => BL_TURI[c.type]).join('') + ']' : BL_TURI[b.type]).join(' ') })
const hint = () => p.$eval('#ust .hn .hint', (e) => e.textContent)
await p.click('#ust .hn .ishga'); await p.waitForFunction(() => !document.querySelector('#ust .ekran').dataset.yuryapti, null, { timeout: 15000 }); await p.waitForTimeout(400)
tek('14 · uzun dastur (6 blok) — «Rasm tayyor!»', (await tz()) === 'r u r u r u' && (await hint()) === 'Rasm tayyor!', await hint())
await p.click('#ust .hn .asos'); await p.waitForTimeout(250)
tek('14 · «Keyingi» — juftliklar hoshiyalandi: «Bir xil ikki blok — 3 marta»', (await hint()) === 'Bir xil ikki blok — 3 marta' && (await p.$$('#ust .jr-bl .bl-juft')).length === 6, await hint())
await p.click('#ust .hn .asos'); await p.waitForTimeout(400)
tek('14 · «Keyingi» — dastur repeat 3 [→ ↑] ga almashdi, «Rasm o‘sha — bloklar kam»', (await tz()) === 'p3[ru]' && (await hint()) === 'Rasm o‘sha — bloklar kam', (await tz()) + ' ' + (await hint()))
await p.click('#ust .hn .ishga'); await p.waitForFunction(() => !document.querySelector('#ust .ekran').dataset.yuryapti, null, { timeout: 15000 }); await p.waitForTimeout(400)
tek('14 · qisqa dastur ham — «Rasm tayyor!»', (await hint()) === 'Rasm tayyor!', await hint())
await p.click('#ust .hn .asos'); await p.waitForTimeout(500)
tek('14 · uchinchi «Keyingi» — keyingi qadam', await p.evaluate(() => QADAM[qadam][1]) === 'P5B')
tek('konsolda xato yo‘q', !xato.length, xato.slice(0, 3).join(' | '))
await b.close()
console.log('\n' + ok + ' / ' + jami + (ok === jami ? ' — HAMMASI TO‘G‘RI' : ' — XATO BOR'))
process.exit(ok === jami ? 0 : 1)
