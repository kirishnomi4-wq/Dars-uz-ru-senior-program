import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
// Tasodifiy son sinovi (13-dars, 21.11): manba 013 «Topshiriqlar» jadvalidagi har da'vo — MUSTAQIL simulyatorda (dvigatel kodisiz).
// Dastur — olma dasturi: go(X, Y) ro'yxati (X/Y — son yoki [a, b] — random a to b), R3[…] — takrorlash. Random sonlarining HAMMA qiymati sanab chiqiladi:
// har olma qayerlarga tushishi mumkin; shartlar — maydondan chiqmaydi, faqat savatlarga, har savatga tushish mumkin, random bor, olma soni, guruh (★).
// Uch ishga tushirishda kamida 2 xil joy chiqish ehtimoli — aniq hisob (manbadagi 2000 urug'li natija bilan ±2 % ichida).
// 2-qism — o'sha jadvallar 13-darsning HAQIQIY ekranlarida (demo-013: random bloki, son katagi, olma tushishi, muammochalar, «Sinov: N / 3», o'yin).
// Ishlatish (lokal server 5340 yoniq, demo-013 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/dvigatel/tasodif.mjs
let ok = 0, jami = 0
const tek = (nom, shart, iz = '') => { jami++; if (shart) ok++; console.log((shart ? '✓ ' : '✗ ') + nom + (shart || !iz ? '' : '  — ' + iz)) }
const DARAXT = [[1, 1], [4, 3], [6, 1]], GUL = [[0, 4], [2, 3], [5, 4], [6, 3]], BEZAK = [...DARAXT, ...GUL]
const K = (p) => p[0] + ',' + p[1], ichida = ([x, y]) => x >= 0 && y >= 0 && x <= 6 && y <= 4
const qator = (y, a, b) => Array.from({ length: b - a + 1 }, (_, i) => [a + i, y])
const ustun = (x, a, b) => Array.from({ length: b - a + 1 }, (_, i) => [x, a + i])
const tort = (x1, x2, y1, y2) => { const r = []; for (let y = y1; y <= y2; y++) for (let x = x1; x <= x2; x++) r.push([x, y]); return r }
const qiym = (s) => (Array.isArray(s) ? Array.from({ length: s[1] - s[0] + 1 }, (_, i) => s[0] + i) : [s])
// dastur → olmalar ro'yxati: har olma — mumkin bo'lgan kataklar to'plami (X va Y random'lari mustaqil)
function olmalar(d) { const r = []; for (const g of d) { if (g.R) { for (let i = 0; i < g.R; i++) r.push(...olmalar(g.d)) } else { const kat = []; for (const x of qiym(g[0])) for (const y of qiym(g[1])) kat.push([x, y]); r.push({ kat, rnd: Array.isArray(g[0]) || Array.isArray(g[1]), g }) } } return r }
// baho: savat — kataklar ro'yxati yoki guruhlar [[…], […]] (★: i-olma i-guruhga); olmaSoni; erkin — savatsiz (daraxt/gulga tushmasin)
function baho(d, { savat, olmaSoni = 1, erkin = false }) {
  const o = olmalar(d)
  if (!o.some((x) => x.rnd)) return 'randomYoq'
  if (o.length < olmaSoni) return 'kam'
  if (o.length > olmaSoni) return 'kop'
  for (const x of o) if (x.kat.some((k) => !ichida(k))) return 'chet'
  if (erkin) { for (const x of o) if (x.kat.some((k) => BEZAK.some((b) => K(b) === K(k)))) return 'bezak'; return new Set(o.flatMap((x) => x.kat.map(K))).size >= 2 ? 'tayyor' : 'randomYoq' }
  const guruh = Array.isArray(savat[0][0]) ? savat : null
  for (let i = 0; i < o.length; i++) { const s = guruh ? guruh[i] : savat; if (o[i].kat.some((k) => !s.some((v) => K(v) === K(k)))) return guruh && o[i].kat.every((k) => guruh.flat().some((v) => K(v) === K(k))) ? 'boshqaGuruh' : 'savatYoq' }
  const tushadi = new Set(o.flatMap((x) => x.kat.map(K)))
  if ((guruh ? guruh.flat() : savat).some((v) => !tushadi.has(K(v)))) return 'boshSavat'
  return 'tayyor'
}
// uch ishga tushirishda kamida 2 xil joy (birinchi olma bo'yicha — bitta olmali topshiriq; ko'p olmali — butun tushish ro'yxati bo'yicha)
function ikkiXil(d) { const o = olmalar(d), natija = new Map(); const yur = (i, kalit, p) => { if (i === o.length) { natija.set(kalit, (natija.get(kalit) || 0) + p); return } const n = o[i].kat.length; o[i].kat.forEach((k) => yur(i + 1, kalit + '|' + K(k), p / n)) }; yur(0, '', 1); let bir = 0; for (const p of natija.values()) bir += p ** 3; return 1 - bir }
const T = {
  P6: { savat: qator(0, 1, 5), q: [6, 2], d: [[[1, 5], 0]] },
  B1A: { savat: qator(2, 0, 6), q: [3, 0], d: [[[0, 6], 2]], foiz: 98.5, xato: [[[[[1, 10], 2]], 'chet'], [[[[1, 6], 2]], 'boshSavat'], [[[3, 2]], 'randomYoq'], [[[[0, 6], 0]], 'savatYoq']] },
  B1B: { savat: qator(0, 2, 4), q: [0, 2], d: [[[2, 4], 0]], foiz: 88.1, xato: [[[[[0, 6], 0]], 'savatYoq'], [[[[2, 5], 0]], 'savatYoq'], [[[[3, 4], 0]], 'boshSavat']] },
  B1C: { savat: ustun(3, 0, 4), q: [5, 2], d: [[3, [0, 4]]], foiz: 96.5, xato: [[[[[0, 4], 3]], 'savatYoq'], [[[3, [0, 6]]], 'chet']] },
  B1Y: { savat: [qator(4, 1, 3), qator(0, 5, 6)], q: [3, 2], d: [[[1, 3], 4], [[5, 6], 0]], olmaSoni: 2, foiz: 96.6, xato: [[[[[5, 6], 0], [[1, 3], 4]], 'boshqaGuruh'], [[[[1, 3], 4]], 'kam'], [[[[0, 3], 4], [[5, 6], 0]], 'savatYoq']] },
  P7: { savat: tort(3, 5, 1, 2), q: [1, 0], d: [[[3, 5], [1, 2]]], xato: [[[[[3, 5], 1]], 'boshSavat']] },
  B2A: { savat: tort(0, 1, 2, 3), q: [3, 2], d: [[[0, 1], [2, 3]]], foiz: 93.0, xato: [[[[[0, 1], 2]], 'boshSavat'], [[[[2, 3], [0, 1]]], 'savatYoq']] },
  B2B: { savat: tort(2, 4, 0, 1), q: [0, 2], d: [[[2, 4], [0, 1]]], foiz: 96.6, xato: [[[[[2, 4], [0, 2]]], 'savatYoq'], [[[[1, 4], [0, 1]]], 'savatYoq']] },
  B2C: { savat: tort(2, 5, 0, 2), q: [0, 0], d: [[[2, 5], [0, 2]]], foiz: 99.2, xato: [[[[[2, 6], [0, 2]]], 'savatYoq'], [[[[2, 5], [0, 3]]], 'savatYoq']] },
  B2Y: { savat: tort(3, 5, 0, 1), q: [1, 2], d: [{ R: 3, d: [[[3, 5], [0, 1]]] }], olmaSoni: 3, foiz: 100, xato: [[[[[3, 5], [0, 1]]], 'kam'], [[{ R: 2, d: [[[3, 5], [0, 1]]] }], 'kam']] },
  P8: { savat: qator(0, 0, 6), q: [3, 2], d: [[[0, 6], 0]] },
  B3A: { savat: tort(3, 5, 0, 2), q: [4, 4], d: [[[3, 5], [0, 2]]], xato: [[[[4, 1]], 'randomYoq']] },
  B3B: { savat: qator(4, 1, 4), q: [3, 2], d: [[[1, 4], 4]], xato: [[[[[0, 4], 4]], 'savatYoq']] },
  B3C: { savat: ustun(0, 0, 3), q: [3, 0], d: [[0, [0, 3]]], xato: [[[[0, [0, 4]]], 'savatYoq']] },
}
console.log('— 1. Savatlar, qahramon, yechim tushishlari bezak kataklarida emas')
for (const id in T) {
  const t = T[id], sav = Array.isArray(t.savat[0][0]) ? t.savat.flat() : t.savat, bez = (k) => BEZAK.some((b) => K(b) === K(k))
  tek(id + ': savatlar va qahramon bezakda emas, maydon ichida', !sav.some(bez) && !bez(t.q) && sav.every(ichida) && ichida(t.q) && !sav.some((s) => K(s) === K(t.q)))
  tek(id + ': yechim — tayyor', baho(t.d, { savat: t.savat, olmaSoni: t.olmaSoni }) === 'tayyor', baho(t.d, { savat: t.savat, olmaSoni: t.olmaSoni }))
  for (const [d, kut] of t.xato || []) { const b = baho(d, { savat: t.savat, olmaSoni: t.olmaSoni }); tek(`${id}: xato varianti — ${kut}`, b === kut, b + ' ' + JSON.stringify(d)) }
  if (t.foiz != null) { const f = ikkiXil(t.d) * 100; tek(`${id}: uch ishga tushirishda 2 xil joy ≈ ${t.foiz}% (aniq: ${f.toFixed(1)}%)`, Math.abs(f - t.foiz) <= 2) }
}
console.log('— 2. 15 · ★ «O‘z o‘yiningiz» (savatsiz)')
for (const [d, kut] of [[[[[0, 6], 2]], 'tayyor'], [[[[2, 5], [0, 2]]], 'tayyor'], [[[3, [0, 4]]], 'tayyor'], [[[[0, 6], [0, 4]]], 'bezak'], [[[[0, 6], [0, 2]]], 'bezak'], [[[2, 2]], 'randomYoq']]) { const b = baho(d, { erkin: true }); tek('★: ' + JSON.stringify(d) + ' — ' + kut, b === kut, b) }
console.log('— 3. Huk va «Javoblar takrorlanmaydi»')
const yech = Object.entries(T).filter(([k]) => k !== 'P8').map(([, t]) => JSON.stringify(t.d))
tek('har pog‘ona va ustoz ekranining yechimi boshqa (P8 — huk C bilan bir xil, ikkalasi ustozniki)', new Set(yech).size === yech.length)
tek('huk C: tanlov 4 · 1 · 6 va 2 · 5 · 0 — hammasi 0 dan 6 gacha, ikki o‘yin har xil', [4, 1, 6, 2, 5, 0].every((x) => x >= 0 && x <= 6) && '4,1,6' !== '2,5,0')
tek('huk: ikki o‘yin aynan bir xil chiqish ehtimoli ≈ 1 / 343', Math.abs((1 / 7) ** 3 - 1 / 343) < 1e-12)
tek('7-qadam: javondagi random 1 to 10 — X da 7…10 maydondan tashqarida (4 / 10)', qiym([1, 10]).filter((x) => x > 6).length === 4)

// ---------- 4. Haqiqiy ekranlar ----------
console.log('— 4. 13-darsning haqiqiy ekranlari (demo-013)')
const U = 'http://localhost:5340/demo-013.html'
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }), xato = []
const p = await (await b.newContext({ viewport: { width: 1440, height: 810 } })).newPage()
p.on('pageerror', (e) => xato.push(e.message)); p.on('console', (mm) => { if (mm.type() === 'error' && !/Failed to load resource/.test(mm.text())) xato.push(mm.text()) })
await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'momiq') })
await p.goto(U + '?rol=bola&xona=tas-sinov'); await p.waitForTimeout(900)
// tasodif urug'li (qayta tekshiriladigan): Math.random — LCG
await p.evaluate(() => { bolaKeyingi = () => {}; window.__ijroAsl = ijro; ijro = (d, f, op) => window.__ijroAsl(d, f, { ...(op || {}), kut: 30 }); let u = 7; Math.random = () => { u = (u * 1103515245 + 12345) % 2147483648; return u / 2147483648 } })
const och = (id, bola = id[0] === 'B') => p.evaluate(([id, bola]) => { const il = document.getElementById('ilova'); il.innerHTML = bola ? '<div id="bol">' + ekran(id, null, true) + '</div>' : '<div id="ust">' + ekran(id) + '</div>'; studiyaTayyorla(il.firstChild) }, [id, bola]).then(() => p.waitForTimeout(500))
const tinch = () => p.waitForFunction(() => !document.querySelector('#ilova .ekran').dataset.yuryapti, null, { timeout: 20000 })
const tugma = () => p.evaluate(() => (document.querySelector('#ilova .hn .ishga') ? '#ilova .hn .ishga' : '#ilova .hn .asos'))
const ishga = async (n = 1) => { for (let i = 0; i < n; i++) { await p.click(await tugma()); await p.waitForTimeout(250); await tinch(); await p.waitForTimeout(150) } }
const korin = () => p.evaluate(() => { const ek = document.querySelector('#ilova .ekran'), mu = ek.querySelector('.dv-muam'); return { muam: mu ? (mu.className.match(/m-(\w+)/) || [])[1] + ':' + mu.textContent.trim() : '', ishora: (ek.querySelector('.hn .hint') || {}).textContent || '', konfeti: !!ek.querySelector('.konfeti'), sinov: (ek.querySelector('.sinov-n') || {}).textContent || '', dsn: (ek.querySelector('.dsn') || {}).textContent || '', tushdi: [...ek.querySelectorAll('.kt-olma.tushdi')].length, oyin: !!ek.dataset.oyin, yz: (ek.querySelector('.oyin-yz') || {}).textContent || '' } })
// dastur: [['y', 'r0-6,2'] | ['p', n, [...]]] — bitta zanjir
const dastur = (d) => p.evaluate((d) => {
  const ek = document.querySelector('#ilova .ekran'), ws = BL_WS.get(ek); ws.clear()
  const zanjir = (ota, q, ichki) => { let o = null; for (const [t, m, ich] of q) { const x = t === 'p' ? blYangi(ws, 'p', String(m)) : blYangi(ws, t, m); if (o) o.nextConnection.connect(x.previousConnection); else if (ichki) ota.getInput('DO').connection.connect(x.previousConnection); else x.moveTo(new Blockly.utils.Coordinate(0, 0)); if (ich) zanjir(x, ich, true); o = x } }
  zanjir(null, d, false); ws.getAllBlocks(false).forEach(blBelgila); blMasshtab(ek, ws); sanoq(ek)
}, d).then(() => p.waitForTimeout(250))
const G = (x, y) => ['y', (Array.isArray(x) ? 'r' + x.join('-') : x) + ',' + (Array.isArray(y) ? 'r' + y.join('-') : y)]
const DS = (d) => d.map((g) => (g.R ? ['p', g.R, DS(g.d)] : G(g[0], g[1])))
let r
// 7-qadam (ustoz): javondan go to, X katagida «random» (ro'yxatdan), tanlov «8» — maydondan tashqari; 1 to 5 — 4, 2, 5
await och('P6', false); r = await korin(); tek('7: dastur bo‘sh, «0 / 2 ta blok», «Sinov: 0 / 3»', r.dsn === '0 / 2 ta blok' && r.sinov === 'Sinov: 0 / 3', JSON.stringify(r))
await p.click('#ilova .pl .mb[data-tur="y"]'); await p.waitForTimeout(300)
await p.locator('#ilova .jr-bl .blocklyDropdownField').first().click(); await p.waitForTimeout(250)
const menyu = await p.evaluate(() => [...document.querySelectorAll('.blocklyDropDownDiv .blocklyMenuItem')].map((x) => x.textContent.trim()).join(' '))
tek('7: X ro‘yxati — 0…6, oxirida «random»', menyu === '0 1 2 3 4 5 6 random', menyu)
await p.locator('.blocklyDropDownDiv .blocklyMenuItem').filter({ hasText: 'random' }).click(); await p.waitForTimeout(400); r = await korin()
tek('7: go to x: (random 1 to 10) y: 0 — «2 / 2 ta blok»', r.dsn === '2 / 2 ta blok' && await p.evaluate(() => blGoSpec(BL_WS.get(document.querySelector('#ilova .ekran')).getBlocksByType('go_to_r', false)[0]) === 'r1-10,0'), r.dsn)
await ishga(); r = await korin(); tek('7: «8» — Kamvoy «Maydon tugadi!», «random 8 ni tanladi. Maydonda X — 0 dan 6 gacha»', r.muam === 'kamvoy:Maydon tugadi!' && r.ishora === 'random 8 ni tanladi. Maydonda X — 0 dan 6 gacha', JSON.stringify(r))
await p.evaluate(() => { const ws = BL_WS.get(document.querySelector('#ilova .ekran')), x = ws.getBlocksByType('random_n', false)[0]; x.setFieldValue('5', 'B') })
await ishga(); r = await korin(); tek('7: 1 to 5 — «4», (4, 0) savatga, «Sinov: 1 / 3»', r.sinov === 'Sinov: 1 / 3' && r.ishora === 'Yana ishga tushiring — olma qayerga tushadi?' && !r.muam, JSON.stringify(r))
await ishga(2); r = await korin(); tek('7: yana ikki marta — 2, 5: «Har safar boshqa joy!», konfeti', r.sinov === 'Sinov: 3 / 3' && r.konfeti && r.ishora === 'Har safar boshqa joy!', JSON.stringify(r))
tek('7: oldingi tushgan joylar — xira belgi (2 ta)', await p.evaluate(() => document.querySelectorAll('#ilova .kt-olma.iz-olma').length === 2))
// 1–2-bekat pog'onalari: yechim — uch ishga tushirishda (urug'li tasodif) tayyor; xato variantlari — o'sha muammocha
const KUT = { chet: 'Savat yo‘q-ku!', savatYoq: 'Savat yo‘q-ku!', boshSavat: 'Bu savat bo‘sh qoladi!', randomYoq: 'Yana o‘sha joy!', kam: 'Oz qoldi!', kop: 'Ko‘payib ketdi!', boshqaGuruh: 'Savat yo‘q-ku!' }
for (const id of ['B1A', 'B1B', 'B1C', 'B1Y', 'B2A', 'B2B', 'B2C', 'B2Y']) {
  const t = T[id]
  await och(id)
  for (const [d, kut] of t.xato || []) {
    await dastur(DS(d)); await ishga(); r = await korin()
    const ok1 = kut === 'chet' ? ['kamvoy:Maydon tugadi!', 'ortiqvoy:Savat yo‘q-ku!'].includes(r.muam) : kut === 'savatYoq' || kut === 'boshqaGuruh' ? r.muam === 'ortiqvoy:Savat yo‘q-ku!' : r.muam.endsWith(KUT[kut])
    tek(`${id}: xato ${JSON.stringify(d)} — ${KUT[kut]}`, ok1 && !r.konfeti, JSON.stringify(r))
  }
  await dastur(DS(t.d)); let n = 0; do { await ishga(); n++; r = await korin() } while (!r.konfeti && n < 9)
  tek(`${id}: yechim ${JSON.stringify(t.d)} — ${n} ta ishga tushirishda «Har safar boshqa joy!»`, r.konfeti && r.ishora === 'Har safar boshqa joy!' && !r.muam && n >= 3, JSON.stringify(r))
}
tek('B1A: ochilganda dastur bo‘sh — bo‘sh dastur «Ishga tushir»: Bo‘shvoy', await (async () => { await och('B1A'); await ishga(); const q = await korin(); return q.muam === 'boshvoy:Bu yerda hech narsa yo‘q-ku…' && q.ishora === 'Avval blokni bosing — u dasturga qo‘shiladi' })())
// javondan random — go to ning bo'sh katagiga (X, keyin Y)
await och('B2A'); await p.click('#ilova .pl .mb[data-tur="y"]'); await p.waitForTimeout(300); await p.click('#ilova .rg .rd.f-o'); await p.waitForTimeout(150)
await p.click('#ilova .pl .mb[data-tur="m"]'); await p.waitForTimeout(300); await p.click('#ilova .pl .mb[data-tur="m"]'); await p.waitForTimeout(300)
tek('javondan random ikki marta — X ga, keyin Y ga: «3 / 3 ta blok»', (await korin()).dsn === '3 / 3 ta blok' && await p.evaluate(() => blGoSpec(BL_WS.get(document.querySelector('#ilova .ekran')).getBlocksByType('go_to_r', false)[0]) === 'r1-10,r1-10'))
await p.click('#ilova .pl .mb[data-tur="m"]'); await p.waitForTimeout(300); r = await korin()
tek('uchinchi random — joy yo‘q: blok qo‘shilmadi', r.dsn === '3 / 3 ta blok', JSON.stringify(r))
// 10-qadam (ustoz): tayyor go(R3-5, 1) — «4», Kamvoy «Bu savat bo‘sh qoladi!»; Y ga random 1 to 2 — tayyor
await och('P7', false); await ishga(); r = await korin()
tek('10: tayyor go(R3-5, 1) — Kamvoy «Bu savat bo‘sh qoladi!», «(3, 2) dagi savatga olma tushmaydi…»', r.muam === 'kamvoy:Bu savat bo‘sh qoladi!' && r.ishora === '(3, 2) dagi savatga olma tushmaydi. random sonlarini tekshiring', JSON.stringify(r))
await p.locator('#ilova .jr-bl .blocklyDropdownField').last().click(); await p.waitForTimeout(250); await p.locator('.blocklyDropDownDiv .blocklyMenuItem').filter({ hasText: 'random' }).click(); await p.waitForTimeout(300)
await p.evaluate(() => { const ws = BL_WS.get(document.querySelector('#ilova .ekran')), r = ws.getBlocksByType('random_n', false).find((x) => x.getFieldValue('A') === '1'); r.setFieldValue('2', 'B') })
await ishga(3); r = await korin(); tek('10: Y ga random 1 to 2 — uch marta: «Har safar boshqa joy!»', r.konfeti && r.sinov === 'Sinov: 3 / 3', JSON.stringify(r))
// 14-qadam (ustoz): o'yin — olma dasturi, strelkalar, «Olma: N / 5»
await och('P8', false); await dastur([G([0, 6], 0)]); await p.click('#ilova .hn .ishga'); await p.waitForTimeout(400); await tinch(); r = await korin()
tek('14: «▶ Boshlash» — «O‘yin: strelkalarni bosing · Olma: 0 / 5», olma (5, 0) ga', r.oyin && r.yz === 'O‘yin: strelkalarni bosing · Olma: 0 / 5' && r.tushdi === 1, JSON.stringify(r))
const KEY = { '→': 'ArrowRight', '←': 'ArrowLeft', '↑': 'ArrowUp', '↓': 'ArrowDown' }
const bos = async (s) => { for (const c of s) { await p.keyboard.press(KEY[c]); await p.waitForTimeout(40); await tinch() } await p.waitForTimeout(250) }
await bos('↓↓→→'); r = await korin(); tek('14: ↓ ↓ → → — Coddy olmani oldi: «Olma: 1 / 5», yangi olma tushdi', r.yz.endsWith('1 / 5') && r.tushdi === 1, JSON.stringify(r))
// 15-qadam o'yin pog'onalari: tekshiruv «▶ Boshlash» da; 5 olma — yutdi
const terib = async () => { for (let i = 0; i < 12; i++) { const s = await p.evaluate(() => { const o = OYIN.get(document.querySelector('#ilova .ekran')); if (!o || !o.olma) return ''; const h = o.h, y = katakXarita(h.k.dataset.xarita).length - 1 - h.y; let q = ''; for (let x = h.x; x < o.olma[0]; x++) q += '→'; for (let x = h.x; x > o.olma[0]; x--) q += '←'; for (let k = y; k < o.olma[1]; k++) q += '↑'; for (let k = y; k > o.olma[1]; k--) q += '↓'; return q }); if (!s) break; await bos(s) } return korin() }
await och('B3A'); await p.click('#ilova .hn .asos'); await p.waitForTimeout(400); r = await korin()
tek('B3A: tayyor go(4, 1) — Kamvoy «Yana o‘sha joy!», o‘yin boshlanmadi', r.muam === 'kamvoy:Yana o‘sha joy!' && !r.oyin, JSON.stringify(r))
await dastur([G([3, 5], [0, 2]), G(4, 1)]); await p.click('#ilova .hn .asos'); await p.waitForTimeout(400); r = await korin()
tek('B3A: ikki go to — Ortiqvoy «Ko‘payib ketdi!», «O‘yinda bitta olma: dasturda bitta go to bo‘lsin»', r.muam === 'ortiqvoy:Ko‘payib ketdi!' && r.ishora === 'O‘yinda bitta olma: dasturda bitta go to bo‘lsin' && !r.oyin, JSON.stringify(r))
await dastur([G([3, 5], [0, 2])]); await p.click('#ilova .hn .asos'); await p.waitForTimeout(400); await tinch(); r = await terib()
tek('B3A: go(R3-5, R0-2) — 5 ta olma terildi, «Siz yutdingiz!»', r.konfeti && r.ishora === 'Siz yutdingiz!' && r.yz === '', JSON.stringify(r))
for (const [id, d] of [['B3B', [G([1, 4], 4)]], ['B3C', [G(0, [0, 3])]]]) { await och(id); await dastur(d); await p.click('#ilova .hn .asos'); await p.waitForTimeout(400); await tinch(); r = await terib(); tek(id + ': yechim — 5 olma, yutdi', r.konfeti, JSON.stringify(r)) }
await och('B3B'); await dastur([G([0, 4], 4)]); await p.click('#ilova .hn .asos'); await p.waitForTimeout(300); r = await korin(); tek('B3B: R0-4 — (0, 4) gul: Ortiqvoy «Savat yo‘q-ku!»', r.muam === 'ortiqvoy:Savat yo‘q-ku!' && !r.oyin, JSON.stringify(r))
// ★ «O‘z o‘yiningiz»
await och('B3Y'); await dastur([G([0, 6], [0, 4])]); await p.click('#ilova .hn .asos'); await p.waitForTimeout(300); r = await korin()
tek('B3Y: go(R0-6, R0-4) — Kamvoy «Gulga tushadi!» yoki «Daraxtga tushadi!»', /^kamvoy:(Gulga|Daraxtga) tushadi!$/.test(r.muam) && !r.oyin, JSON.stringify(r))
await dastur([G([2, 5], [0, 2])]); await p.click('#ilova .hn .asos'); await p.waitForTimeout(400); await tinch(); r = await terib(); tek('B3Y: go(R2-5, R0-2) — «O‘yiningiz tayyor!»', r.konfeti && r.ishora === 'O‘yiningiz tayyor!', JSON.stringify(r))
tek('natija: random, tushirdi, terdi', await p.evaluate(() => { const j = blokJami(); return j.R >= 13 && j.T >= 24 && j.o === 20 }), await p.evaluate(() => JSON.stringify(blokJami())))
// huk (3-qadam)
await och('P2S', false); await p.waitForTimeout(400)
const kN = (i) => p.evaluate((i) => { const k = document.querySelectorAll('#ilova .jk')[i]; return [(k.querySelector('.jn') || {}).textContent || '', k.querySelector('.ho-q').textContent] }, i)
const kutJ = (n) => p.waitForFunction((n) => document.querySelectorAll('#ilova .jk .jn').length >= n && !document.querySelector('#ilova .ekran').dataset.yuryapti, n, { timeout: 30000 })
await kutJ(1); tek('3: A — «1-o‘yin: 5 · 5 · 5», «2-o‘yin: 5 · 5 · 5», «✕ ikki o‘yin bir xil»', JSON.stringify(await kN(0)) === JSON.stringify(['✕ ikki o‘yin bir xil', '1-o‘yin: 5 · 5 · 52-o‘yin: 5 · 5 · 5']), JSON.stringify(await kN(0)))
await p.click('#ilova .hn .asos'); await kutJ(2); tek('3: B — 1 · 5 · 3 ikki marta, «✕ yana bir xil»', (await kN(1))[0] === '✕ yana bir xil' && (await kN(1))[1] === '1-o‘yin: 1 · 5 · 32-o‘yin: 1 · 5 · 3', JSON.stringify(await kN(1)))
await p.click('#ilova .hn .asos'); await kutJ(3); tek('3: C — 4 · 1 · 6 va 2 · 5 · 0, «✓ har o‘yin boshqacha»', (await kN(2))[0] === '✓ har o‘yin boshqacha' && (await kN(2))[1] === '1-o‘yin: 4 · 1 · 62-o‘yin: 2 · 5 · 0', JSON.stringify(await kN(2)))
tek('sahifada xato yo‘q', !xato.length, xato.join(' | '))
await b.close()
console.log(`\n${ok} / ${jami}`)
process.exit(ok === jami ? 0 : 1)
