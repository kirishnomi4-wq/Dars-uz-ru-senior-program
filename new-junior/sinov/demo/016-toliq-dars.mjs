// 16-dars «Klonlar» — to'liq jonli dars sinovi (21.11). Manba: new-junior/manba/016-klonlar.md v1.
// Ustoz va ikki o'quvchi — alohida brauzer oynalari, lokal sinf serveri orqali. 18 qadam: huk (A — bitta dushman besh marta, B — beshta dastur,
// C — nusxalar), yangi so'z (birma-bir), ustoz nusxa yasaydi (7: nusxa turib qoladi → when I start as a clone), ko'p nusxa (10: bir ustun → random),
// 1–3-bekat pog'onalari (Aziz — hammasi, Lola — har bekatning 1-pog'onasi), o'yin (14: yerda qoldi → delete this clone; nusxa Coddy'ga tushdi — jon 2),
// o'yinlar dodge-bot bilan (nusxa qahramon ustuniga yaqinlashsa — chetga), doskalar, 16-qadam (A·1), natija sonlari, yakunlash.
// Kutilgan sonlar (stsenariydan): Aziz — 53 nusxa, 4 o'yin, 12 pog'ona; Lola — 11 · 1 · 3; sinf — 64 · 5 · 15.
// Ishlatish (lokal server 5340 yoniq, demo-016 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/demo/016-toliq-dars.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-016.html', X = 'd16' + Date.now().toString(36)
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }), xato = []
const oyna = async (n, w, h) => { const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage(); p.on('pageerror', (e) => xato.push(n + ': ' + e.message)); p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) xato.push(n + ' konsol: ' + m.text()) }); return p }
const u = await oyna('ustoz', 1600, 900), a = await oyna('Aziz', 1440, 810), l = await oyna('Lola', 1440, 810)
let ok = 0, jami = 0
const tek = (nom, shart, iz = '') => { jami++; if (shart) ok++; console.log((shart ? '✓ ' : '✗ ') + nom + (shart || iz === '' ? '' : '  — ' + iz)) }
const kut = (ms) => u.waitForTimeout(ms)
const id = (p) => p.evaluate(() => (document.querySelector('#ilova .ekran') || {}).dataset?.id || '')
const matn = (p, s) => p.$eval(s, (e) => e.textContent.trim()).catch(() => '')
const gacha = async (p, f, arg, ms = 15000) => { try { await p.waitForFunction(f, arg, { timeout: ms }); return true } catch { return false } }
const ekrangacha = (p, e, ms = 8000) => gacha(p, (e) => document.querySelector('#ilova .ekran')?.dataset.id === e, e, ms)
const keyingi = async () => { await u.click('#ust .hn .asos'); await kut(600) }
const R = (p) => (p === u ? '#ust' : '#bol')
const hint = (p) => matn(p, R(p) + ' .hn .hint')
const muam = (p) => p.evaluate((r) => { const m = document.querySelector(r + ' .dv-muam'); return m ? (m.className.match(/m-(\w+)/) || [])[1] + ':' + m.textContent.trim() : '' }, R(p))
const tinch = (p) => gacha(p, (r) => { const e = document.querySelector(r + ' .ekran'); return e && !e.dataset.yuryapti }, R(p), 90000)
const ishga = async (p) => { await p.click(R(p) + (p === u ? ' .hn .ishga' : ' .hn .asos')); await p.waitForTimeout(400); await tinch(p); await p.waitForTimeout(250) }
const son = (p) => matn(p, R(p) + ' .kl-son')
const pogSon = () => u.evaluate(() => [document.querySelector('#ust .tugatdi b').textContent.replace(/\s/g, ''), ...Array.from(document.querySelectorAll('#ust .pg-k .pg-s b')).map((x) => x.textContent)].join(' '))
const URUG = (p, n = 11) => p.evaluate((n) => { let x = n; Math.random = () => { x = (x * 1103515245 + 12345) % 2147483648; return x / 2147483648 } }, n)
const dastur = (p, g) => p.evaluate(({ r, g }) => {
  const ek = document.querySelector(r + ' .ekran'), ws = BL_WS.get(ek); ws.clear()
  const ichiga = (ota, q) => { let o = null; for (const [t, m, ich] of q) { const x = blYangi(ws, t, m); if (o) o.nextConnection.connect(x.previousConnection); else ota.getInput('DO').connection.connect(x.previousConnection); if (ich) ichiga(x, ich); o = x } }
  g.forEach(([h, ...q], i) => { const hb = blYangi(ws, h[0], h[1]); hb.moveTo(new Blockly.utils.Coordinate(0, i * 90)); let o = hb; for (const [t, m, ich] of q) { const x = blYangi(ws, t, m); o.nextConnection.connect(x.previousConnection); if (ich) ichiga(x, ich); o = x } })
  blTartib(ws); ws.getAllBlocks(false).forEach(blBelgila); blMasshtab(ek, ws); sanoq(ek)
}, { r: R(p), g }).then(() => p.waitForTimeout(500))
const ASL = (...q) => [['f'], ...q], NUS = (...q) => [['H'], ...q]
const T4 = ['p', '4', [['d']]], GO = (a2, b2) => ['y', 'r' + a2 + '-' + b2 + ',4'], RC = (n) => ['p', String(n), [['C']]]
const pog = async (p, e, d, keyin) => { await ekrangacha(p, e); await p.waitForTimeout(400); await dastur(p, d); await ishga(p); return { g: await hint(p), m: await muam(p), o: await ekrangacha(p, keyin, 8000) } }
// o'yin: «▶ Boshlash» va dodge-bot (nusxa qahramon ustunida y ≤ 2 yoki yerda — yon tomonga), o'yin tugaguncha
const boshla = (p) => p.click(R(p) + (p === u ? ' .hn .ishga' : ' .hn .asos'))
const oyna2 = async (p, bot = true) => {
  await boshla(p); await p.waitForTimeout(300)
  for (let t = 0; t < 500; t++) {
    const st = await p.evaluate((r) => { const ek = document.querySelector(r + ' .ekran'), s = ek.__klon; if (!ek.dataset.oyin || !s || !s.h) return null; return { x: s.h.x, n: s.nusxa.filter((n) => !n.ochdi).map((n) => [n.x, n.y, !!n.yerda]) } }, R(p))
    if (!st) break
    const xavf = (x) => st.n.some(([a2, c, yer]) => a2 === x && (c <= 2 || yer))
    if (bot && xavf(st.x)) { const yon = [st.x - 1, st.x + 1].filter((x) => x >= 0 && x <= 6 && !xavf(x)); if (yon.length) await p.keyboard.press(yon[0] < st.x ? 'ArrowLeft' : 'ArrowRight') }
    await p.waitForTimeout(110)
  }
  await p.waitForTimeout(400)
}
const oyin = async (p, e, d, keyin) => { await ekrangacha(p, e); await p.waitForTimeout(400); await dastur(p, d); await oyna2(p); return { g: await hint(p), m: await muam(p), o: await ekrangacha(p, keyin, 8000) } }

await a.goto(U + '?rol=varaq'); await a.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'jele'); localStorage.setItem('demo-qism', 'Bulut') })
await l.goto(U + '?rol=varaq'); await l.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Lola'); localStorage.setItem('demo-qah', 'nihol') })
await u.goto(`${U}?rol=ustoz&yangi=1&xona=${X}`); await a.goto(`${U}?rol=bola&xona=${X}`); await l.goto(`${U}?rol=bola&xona=${X}`); await kut(1500)
for (const p of [a, l]) await URUG(p)
// ---------- 1–4
await gacha(u, () => /Kirdi: 2/.test(document.querySelector('#ust .hn .hint')?.textContent))
tek('1 · «Kirdi: 2», «Bugun nusxa yasaymiz!», asl tepada', (await hint(u)) === 'Kirdi: 2' && (await matn(u, '#ust .sar')) === 'Bugun nusxa yasaymiz!' && !!(await u.$('#ust .kt-asl')), await hint(u))
for (const p of [a, l]) await p.click('#bol .asos'); await kut(400)
await keyingi(); await ekrangacha(a, 'P2N'); await a.locator('#bol .jk').nth(2).click(); await l.locator('#bol .jk').nth(1).click(); await kut(1200)
tek('2 · «Javob berdi: 2 / 2»', (await hint(u)) === 'Javob berdi: 2 / 2', await hint(u))
await keyingi()
const jn = (n) => gacha(u, (n) => document.querySelectorAll('#ust .jk .jn').length >= n && !document.querySelector('#ust .ekran').dataset.yuryapti, n, 90000)
await jn(1); tek('3 · A — «✕ bittadan tushadi»', (await matn(u, '#ust .jk.c1 .jn')) === '✕ bittadan tushadi')
await keyingi(); await jn(2); tek('3 · B — «✕ beshta bir xil dastur», beshta dushman yerda', (await matn(u, '#ust .jk.c2 .jn')) === '✕ beshta bir xil dastur' && (await u.$$('#ust .kt-klon')).length === 5)
await keyingi(); await jn(3); tek('3 · C — «✓ bitta dastur, beshta dushman», asl tepada + 5 nusxa', (await matn(u, '#ust .jk.c3 .jn')) === '✓ bitta dastur, beshta dushman' && (await u.$$('#ust .kt-klon')).length === 5 && !!(await u.$('#ust .kt-asl')))
await keyingi(); tek('4 · javob: A, B xira', (await id(u)) === 'P2C' && (await u.$$('#ust .jk.n-yoq')).length === 2)
// ---------- 5–6
await keyingi(); for (let k = 0; k < 3; k++) { await u.click('#ust .hn .asos'); await kut(250) }
tek('5 · «Klon nima?» — uch bo‘lak va ta’rif', (await u.$$('#ust .xs-b.on')).length === 3 && !!(await u.$('#ust .xs-ta.on')))
await keyingi(); tek('6 · reja', (await id(u)) === 'P4')
// ---------- 7: ustoz nusxa yasaydi
await keyingi(); await kut(500)
tek('7 · P7: dastur bo‘sh, «0 / 5 ta blok»; bolada «Ustoz nusxa yasayapti»', (await matn(u, '#ust .dsn')).includes('0 / 5 ta blok') && (await matn(a, '#bol .qarang')).includes('Ustoz nusxa yasayapti'), await matn(u, '#ust .dsn'))
await dastur(u, [ASL(['C'])]); await ishga(u); tek('7 · ▶[C] — nusxa paydo bo‘ldi, Bo‘shvoy «Men nima qilay?»', (await muam(u)) === 'boshvoy:Men nima qilay?' && (await u.$$('#ust .kt-klon')).length === 1, await muam(u))
await dastur(u, [ASL(['C']), NUS(T4)]); await ishga(u); tek('7 · + K[R4[↓]] — «Hammasi tushdi!», «Nusxa: 1 / 1»', (await hint(u)) === 'Hammasi tushdi!' && (await son(u)) === 'Nusxa: 1 / 1', await hint(u))
// ---------- 8: bitta nusxa
await keyingi(); await ekrangacha(a, 'B1A'); await ekrangacha(l, 'B1A'); await kut(600)
await a.click('#bol .hn .asos'); await kut(500); tek('8 · B1A: tayyor nusxa dasturchasi, ▶ yo‘q — «Nusxa qani?»', (await muam(a)) === 'boshvoy:Nusxa qani?', await muam(a))
await a.click('#bol .hn .mas'); await kut(300); tek('8 · «Maslahat» — manbadagi gap', (await hint(a)) === 'Nusxani kim yasaydi? Asl ▶ bosilganda nima qilsin?', await hint(a))
let r = await pog(a, 'B1A', [ASL(['C']), NUS(T4)], 'B1B'); tek('8 · Aziz 1 → B1B', r.o, JSON.stringify(r))
r = await pog(a, 'B1B', [ASL(['C']), NUS(T4)], 'B1C'); tek('8 · 2 → B1C', r.o, JSON.stringify(r))
r = await pog(a, 'B1C', [ASL(['C'], ['C']), NUS(T4)], 'B1Y'); tek('8 · 3 → B1Y', r.o, JSON.stringify(r))
r = await pog(a, 'B1Y', [ASL(['C']), NUS(['x', '1,4'], T4)], 'BK'); tek('8 · ★ → BK', r.o, JSON.stringify(r))
r = await pog(l, 'B1A', [ASL(['C']), NUS(T4)], 'B1B'); tek('8 · Lola 1', r.o, JSON.stringify(r))
await gacha(u, () => document.querySelectorAll('#ust .pg-k .pg-s b')[0]?.textContent === '2')
tek('8 · doska: «1 / 2»; zinapoya 2 · 1 · 1 · 1', (await pogSon()) === '1/2 2 1 1 1', await pogSon())
// ---------- 9–10: ko'p nusxa
await keyingi(); await keyingi(); await kut(500)
await dastur(u, [ASL(RC(5)), NUS(T4)]); await ishga(u); tek('10 · repeat 5 — bir ustundan: «Yana o‘sha joy!»', (await muam(u)) === 'kamvoy:Yana o‘sha joy!' && (await son(u)) === 'Nusxa: 5 / 5', await muam(u))
await dastur(u, [ASL(RC(5)), NUS(GO(0, 6), T4)]); await ishga(u)
const ust = await u.evaluate(() => document.querySelector('#ust .ekran').__klon.nusxa.map((n) => n.x).join(','))
tek('10 · random — 1, 5, 2, 6, 0: «Hammasi tushdi!»', (await hint(u)) === 'Hammasi tushdi!' && ust === '1,5,2,6,0', ust)
// ---------- 11
await keyingi(); await ekrangacha(a, 'B2A'); await kut(500)
r = await pog(a, 'B2A', [ASL(RC(5)), NUS(GO(0, 6), T4)], 'B2B'); tek('11 · Aziz 1 → B2B', r.o, JSON.stringify(r))
r = await pog(a, 'B2B', [ASL(RC(4)), NUS(GO(0, 6), T4)], 'B2C'); tek('11 · 2 → B2C', r.o, JSON.stringify(r))
r = await pog(a, 'B2C', [ASL(RC(5)), NUS(GO(0, 3), T4)], 'B2Y'); tek('11 · 3 → B2Y', r.o, JSON.stringify(r))
r = await pog(a, 'B2Y', [ASL(RC(10)), NUS(GO(0, 6), T4)], 'BK'); tek('11 · ★ o‘nta → BK', r.o, JSON.stringify(r))
r = await pog(l, 'B2A', [ASL(RC(5)), NUS(GO(0, 6), T4)], 'B2B'); tek('11 · Lola 1', r.o, JSON.stringify(r))
await gacha(u, () => document.querySelectorAll('#ust .pg-k .pg-s b')[0]?.textContent === '2')
tek('11 · doska: «1 / 2»; zinapoya 2 · 1 · 1 · 1', (await pogSon()) === '1/2 2 1 1 1', await pogSon())
// ---------- 12–14
await keyingi(); tek('12 · xulosa', (await matn(u, '#ust .sar')) === 'Klon', await matn(u, '#ust .sar'))
await keyingi(); await keyingi(); await kut(500)
tek('14 · P10: tayyor dastur, «jon: 3», «Boshqaruv» qatori', (await matn(u, '#ust .kl-jon b')) === '3' && !!(await u.$('#ust .dst .bq-q')))
await oyna2(u, false); tek('14 · passiv o‘yin: nusxa Coddy’ga tushdi — jon 2; yerda qoldi — Kamvoy', (await matn(u, '#ust .kl-jon b')) === '2' && (await muam(u)) === 'kamvoy:Yerda qolib ketdi!', (await matn(u, '#ust .kl-jon b')) + ' ' + (await muam(u)))
await dastur(u, [ASL(['p', '6', [['C']]]), NUS(GO(0, 6), T4, ['D'])]); await oyna2(u)
tek('14 · delete this clone — «Siz yutdingiz!»', (await hint(u)) === 'Siz yutdingiz!', await hint(u))
// ---------- 15
await keyingi(); await ekrangacha(a, 'B3A'); await ekrangacha(l, 'B3A'); await kut(600)
r = await oyin(a, 'B3A', [ASL(RC(5)), NUS(GO(0, 6), T4, ['D'])], 'B3B'); tek('15 · Aziz 1 → B3B', r.o, JSON.stringify(r))
r = await oyin(a, 'B3B', [ASL(RC(8)), NUS(GO(0, 6), T4, ['D'])], 'B3C'); tek('15 · 2 → B3C', r.o, JSON.stringify(r))
r = await oyin(a, 'B3C', [ASL(RC(6)), NUS(GO(1, 5), T4, ['D'])], 'B3Y'); tek('15 · 3 → B3Y', r.o, JSON.stringify(r))
r = await oyin(a, 'B3Y', [ASL(RC(5)), NUS(GO(2, 5), T4, ['D'])], 'BK'); tek('15 · ★ o‘z o‘yini → BK', r.o, JSON.stringify(r))
r = await oyin(l, 'B3A', [ASL(RC(5)), NUS(GO(0, 6), T4, ['D'])], 'B3B'); tek('15 · Lola 1', r.o, JSON.stringify(r))
await gacha(u, () => document.querySelectorAll('#ust .pg-k .pg-s b')[0]?.textContent === '2')
tek('15 · doska: «1 / 2»; zinapoya 2 · 1 · 1 · 1', (await pogSon()) === '1/2 2 1 1 1', await pogSon())
// ---------- 16–18
await keyingi(); await kut(1200)
tek('16 · Aziz — oxirgi pog‘onasi (B3Y) o‘z dasturi bilan; Lola — B3A', (await id(a)) === 'B3Y' && (await id(l)) === 'B3A', (await id(a)) + ' ' + (await id(l)))
await keyingi(); await ekrangacha(a, 'B5'); await kut(800)
const nat = (p) => p.evaluate(() => ['ta nusxa yasadi', 'ta o‘yin yutdi', 'pog‘ona bajardi'].map((k) => document.querySelector('#bol .sn-t[data-k="' + k + '"] b').textContent).join(','))
tek('17 · Aziz: 53 · 4 · 12', (await nat(a)) === '53,4,12', await nat(a))
tek('17 · Lola: 11 · 1 · 3', (await nat(l)) === '11,1,3', await nat(l))
await keyingi(); await kut(800)
const sinf = await u.evaluate(() => ['ta nusxa yasadi', 'ta o‘yin yutdi', 'pog‘ona bajardi'].map((k) => document.querySelector('#ust .sn-t[data-k="' + k + '"] b').textContent).join(','))
tek('18 · sinf: 64 · 5 · 15', sinf === '64,5,15', sinf)
await u.click('#ust .hn .asos'); await kut(800); tek('18 · «Dars tugadi!»', !!(await u.$('#ust .tugadi-k')))
tek('konsolda xato yo‘q', !xato.length, xato.slice(0, 4).join(' | '))
console.log(`\nNATIJA: ${ok} / ${jami}`); await b.close()
process.exit(ok === jami ? 0 : 1)
