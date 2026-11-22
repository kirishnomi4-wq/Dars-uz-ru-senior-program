// 14-dars «Xatoni topish» — to'liq jonli dars sinovi (21.11). Manba: new-junior/manba/014-xatoni-topish.md v1.1.
// Ustoz va ikki o'quvchi — alohida brauzer oynalari, lokal sinf serveri orqali. 18 qadam: huk (A, B oddiy; C — «Bitta qadam» besh marta),
// muammochalar va qoida (birma-bir), 1-bekat (to'xtagan joy), ustoz «Bitta qadam» + repeat ichida joy almashtirish (10), 2-bekat (rasmdan chiqqan qadam;
// kutish paytida tahrir — qadam bekor), savatlar (xato faqat 3 sinovdan keyin, 14), 3-bekat (ikki labirint, o'yin — har strelka o'z tomoniga, savatlar,
// topishmoq), doskalar sanog'i, 16-qadam (A·1), natija sonlari («Bitta qadam» bosishlari bilan), yakunlash.
// Kutilgan sonlar qo'lda (stsenariydan): Aziz — 12 pog'ona, 9 xato, 5 bosish; Lola — har bekatning 1-pog'onasi: 3 · 3 · 0; sinf — 12 · 5 · 15.
// Ishlatish (lokal server 5340 yoniq, demo-014 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/demo/014-toliq-dars.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-014.html', X = 'd14' + Date.now().toString(36)
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
const keyingi = async () => { await u.click('#ust .hn .asos'); await kut(500) }
const R = (p) => (p === u ? '#ust' : '#bol')
const hint = (p) => matn(p, R(p) + ' .hn .hint')
const muam = (p) => p.evaluate((r) => { const m = document.querySelector(r + ' .dv-muam'); return m ? (m.className.match(/m-(\w+)/) || [])[1] + ':' + m.textContent.trim() : '' }, R(p))
const tinch = (p) => gacha(p, (r) => { const e = document.querySelector(r + ' .ekran'); return e && !e.dataset.yuryapti }, R(p), 30000)
// «Bitta qadam»: bosish → qadam tugaguncha (keyingi bosish kutilmoqda) yoki dastur to'xtaguncha
const qadamB = async (p, n = 1) => { for (let i = 0; i < n; i++) { await p.click(R(p) + ' .hn .bq-t'); await p.waitForTimeout(150); await gacha(p, (r) => { const e = document.querySelector(r + ' .ekran'); return !e.dataset.yuryapti || (e.__bq && e.__bq.kut) }, R(p), 10000) } await p.waitForTimeout(250) }
const ishga = async (p, n = 1) => { for (let i = 0; i < n; i++) { await p.click(R(p) + (p === u ? ' .hn .ishga' : ' .hn .asos')); await p.waitForTimeout(400); await tinch(p) } }
const KEY = { '→': 'ArrowRight', '←': 'ArrowLeft', '↑': 'ArrowUp', '↓': 'ArrowDown' }
const bos = async (p, s) => { for (const c of s) { await p.keyboard.press(KEY[c]); await p.waitForTimeout(40); await tinch(p) } await p.waitForTimeout(350) }
const pogSon = () => u.evaluate(() => [document.querySelector('#ust .tugatdi b').textContent.replace(/\s/g, ''), ...Array.from(document.querySelectorAll('#ust .pg-k .pg-s b')).map((x) => x.textContent)].join(' '))
const URUG = (p) => p.evaluate(() => { let u = 11; Math.random = () => { u = (u * 1103515245 + 12345) % 2147483648; return u / 2147483648 } })
const dastur = (p, d) => p.evaluate(({ r, d }) => {
  const ek = document.querySelector(r + ' .ekran'), ws = BL_WS.get(ek); ws.clear()
  const zanjir = (ota, q, ichki) => { let o = null; for (const [t, m, ich] of q) { const x = blYangi(ws, t, m); if (o) o.nextConnection.connect(x.previousConnection); else if (ichki) ota.getInput('DO').connection.connect(x.previousConnection); else x.moveTo(new Blockly.utils.Coordinate(0, 0)); if (ich) zanjir(x, ich, true); o = x } }
  zanjir(null, d, false); ws.getAllBlocks(false).forEach(blBelgila); blMasshtab(ek, ws); sanoq(ek)
}, { r: R(p), d }).then(() => p.waitForTimeout(300))
// o'yin dasturchalari: har biri hodisa blokidan — [[tugma, [move…]]…]; joylashuv — dvigatelning o'zi (blTartib)
const dch = (p, g) => p.evaluate(({ r, g }) => {
  const ek = document.querySelector(r + ' .ekran'), ws = BL_WS.get(ek); ws.clear()
  g.forEach(([k, ms], i) => { const h = blYangi(ws, 'k', k); h.moveTo(new Blockly.utils.Coordinate(0, i * 90)); let o = h; for (const t of ms) { const x = blYangi(ws, t); o.nextConnection.connect(x.previousConnection); o = x } })
  blTartib(ws); ws.getAllBlocks(false).forEach(blBelgila); blMasshtab(ek, ws); sanoq(ek)
}, { r: R(p), g }).then(() => p.waitForTimeout(400))
// pog'ona: dastur, ishga tushirish (savatlarda — ko'pi 9 marta), keyingi ekran
const pog = async (p, e, d, keyin, { n = 1 } = {}) => { await ekrangacha(p, e); await kut(400); if (d) await dastur(p, d); let k = 0; do { await ishga(p); k++ } while (k < n && (await id(p)) === e); return { g: await hint(p), m: await muam(p), o: await ekrangacha(p, keyin, 6000) } }

// ---------- 1
await a.goto(U + '?rol=varaq'); await a.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'jele'); localStorage.setItem('demo-qism', 'Bulut') })
await l.goto(U + '?rol=varaq'); await l.evaluate(() => localStorage.clear())
await u.goto(`${U}?rol=ustoz&yangi=1&xona=${X}`); await a.goto(`${U}?rol=bola&xona=${X}`); await l.goto(`${U}?rol=bola&xona=${X}`)
for (const p of [a, l]) await URUG(p)
await l.fill('#ei', 'Lola'); await l.click('#ef button'); await kut(1500)
tek('1 · Aziz: B0; Lola: avval BQ', (await id(a)) === 'B0' && (await id(l)) === 'BQ')
await l.locator('#bol .tq-o').nth(4).click(); await ekrangacha(l, 'B0')
await gacha(u, () => /Kirdi: 2/.test(document.querySelector('#ust .hn .hint')?.textContent))
tek('1 · ustoz: «Kirdi: 2»; «Bugun xatolarni topamiz!»; «O‘tgan darsda» — tasodifiy son', (await hint(u)) === 'Kirdi: 2' && (await matn(u, '#ust .sar')) === 'Bugun xatolarni topamiz!' && (await matn(u, '#ust .otd')).includes('Tasodifiy son'), await matn(u, '#ust .sar'))
for (const p of [a, l]) await p.click('#bol .asos'); await kut(400)
// ---------- 2–4
await keyingi(); await ekrangacha(a, 'P2N'); await ekrangacha(l, 'P2N')
await a.locator('#bol .jk').nth(2).click(); await l.locator('#bol .jk').nth(0).click(); await kut(1200)
await gacha(u, () => /2 \/ 2/.test(document.querySelector('#ust .hn .hint')?.textContent)); tek('2 · «Javob berdi: 2 / 2»; Coddy (5, 3) da (xato iz)', (await hint(u)) === 'Javob berdi: 2 / 2' && (await matn(u, '#ust .kt-yr text')) === '(5, 3)', await matn(u, '#ust .kt-yr text'))
const jn = () => u.evaluate(() => Array.from(document.querySelectorAll('#ust .jk')).map((k) => (k.classList.contains('n-ok') ? '+' : k.classList.contains('n-yoq') ? '-' : '') + ((k.querySelector('.jn') || {}).textContent || '')).join(' | '))
const kartagacha = (n) => gacha(u, (n) => document.querySelectorAll('#ust .jk .jn').length >= n && !document.querySelector('#ust .ekran').dataset.yuryapti, n, 40000)
await keyingi(); await kartagacha(1)
tek('3 · A: oxirgi repeat 2 — «✕ xato boshqa joyda»; Coddy (4, 3)', (await jn()).startsWith('-✕ xato boshqa joyda') && (await matn(u, '#ust .kt-yr text')) === '(4, 3)', (await jn()) + ' ' + (await matn(u, '#ust .kt-yr text')))
await keyingi(); await kartagacha(2)
tek('3 · B: birinchi repeat 3 — «✕ rasm battar»', (await jn()).includes('| -✕ rasm battar'), await jn())
await keyingi(); await kartagacha(3)
tek('3 · C: «Bitta qadam» — 5-qadamda (2, 3), «✓ 5-qadamda topildi»', (await jn()).endsWith('| +✓ 5-qadamda topildi') && (await matn(u, '#ust .kt-yr text')) === '(2, 3)', (await jn()) + ' ' + (await matn(u, '#ust .kt-yr text')))
await keyingi(); tek('4 · javob «Qadam-baqadam yuramiz»: A, B xira; Coddy (5, 2)', (await id(u)) === 'P2C' && (await u.$$('#ust .jk.n-yoq')).length === 2 && (await matn(u, '#ust .kt-yr text')) === '(5, 2)')
// ---------- 5–7: birma-bir
await keyingi(); for (let k = 0; k < 4; k++) { await u.click('#ust .hn .asos'); await kut(250) }
tek('5 · «Muammocha — iz»: to‘rt qator yondi', (await matn(u, '#ust .sar')) === 'Muammocha — iz' && (await u.$$('#ust .xyl .xq.on')).length === 4 && (await id(u)) === 'P3')
await keyingi(); tek('6 · reja: «Dars oxirida · topishmoq · Ustoz xatoni izlaydi»', (await id(u)) === 'P4' && (await matn(u, '#ust [data-z="dars oxirida"]')).includes('Ustoz xatoni izlaydi'))
await keyingi(); for (let k = 0; k < 3; k++) { await u.click('#ust .hn .asos'); await kut(250) }
tek('7 · «O‘zingiz topasiz»: uch qator yondi', (await id(u)) === 'P6' && (await u.$$('#ust .xyl .xq.on')).length === 3)
// ---------- 8: to'xtagan joy (1–4)
await keyingi(); await ekrangacha(a, 'B1A'); await ekrangacha(l, 'B1A'); await kut(600)
tek('8 · B1A: «Bitta qadam» — «▶ Ishga tushir» yonida; «Maslahat» qulf; «4 / 5 ta blok»', await a.evaluate(() => { const t = document.querySelector('#bol .hn .bq-t'); return !!t && t.nextElementSibling === document.querySelector('#bol .hn .asos') && !!document.querySelector('#bol .hn .mas.qulf') }) && (await matn(a, '#bol .dsn')) === '4 / 5 ta blok', await matn(a, '#bol .dsn'))
await a.click('#bol .hn .mas'); await kut(300); tek('8 · qulfli «Maslahat» — «Avval bir marta ishga tushiring»', (await hint(a)) === 'Avval bir marta ishga tushiring')
await ishga(a); tek('8 · tayyor dastur: 2-blokda chet — Kamvoy «Maydon tugadi!»', (await muam(a)) === 'kamvoy:Maydon tugadi!' && (await hint(a)) === 'Qahramon shu blokda to‘xtadi. Shu blokni va undan oldingisini o‘qing', await hint(a))
await a.click('#bol .hn .mas'); await kut(300); tek('8 · «Maslahat» ochildi — manbadagi gap', (await hint(a)) === 'Yulduz qaysi tomonda? Blok qahramonni qaysi tomonga yurgizyapti?', await hint(a))
let r = await pog(a, 'B1A', [['p', '4', [['r']]], ['p', '2', [['u']]]], 'B1B'); tek('8 · Aziz 1-pog‘ona: R4[→] R2[↑] → B1B', r.o, JSON.stringify(r))
await ishga(a); tek('8 · B1B: R5[↓] — 4-safarda chet', (await muam(a)) === 'kamvoy:Maydon tugadi!')
r = await pog(a, 'B1B', [['p', '3', [['d']]]], 'B1C'); tek('8 · 2-pog‘ona: R3[↓] → B1C', r.o, JSON.stringify(r))
await ishga(a); tek('8 · B1C: go(5, 2) — Kamvoy «Olma qoldi-ku!» (6, 2)', (await muam(a)) === 'kamvoy:Olma qoldi-ku!' && (await hint(a)) === 'Avval olmaga boring — u (6, 2) da', await hint(a))
r = await pog(a, 'B1C', [['x', '6,2'], ['p', '5', [['l']]]], 'B1Y'); tek('8 · 3-pog‘ona: go(6, 2) R5[←] → B1Y', r.o, JSON.stringify(r))
await dastur(a, [['p', '6', [['l']]], ['p', '3', [['u']]]]); await ishga(a)
tek('8 · ★: bitta xato tuzatildi — yulduzdan o‘tib ketdi (Ortiqvoy)', (await muam(a)) === 'ortiqvoy:Ko‘payib ketdi!' && (await hint(a)) === 'Qahramon yulduzdan o‘tib ketdi. Qaysi blok uni uzoqqa olib bordi?', (await muam(a)) + ' ' + (await hint(a)))
r = await pog(a, 'B1Y', [['p', '6', [['l']]], ['p', '2', [['u']]]], 'BK'); tek('8 · ★ ikki xato tuzatildi → BK', r.o, JSON.stringify(r))
r = await pog(l, 'B1A', [['p', '4', [['r']]], ['p', '2', [['u']]]], 'B1B'); tek('8 · Lola 1-pog‘ona', r.o, JSON.stringify(r))
await gacha(u, () => document.querySelectorAll('#ust .pg-k .pg-s b')[0]?.textContent === '2')
tek('8 · doska: «Uch xatoni tuzatdi 1 / 2»; zinapoya 2 · 1 · 1 · 1', (await pogSon()) === '1/2 2 1 1 1', await pogSon())
// ---------- 9–10: ustoz «Bitta qadam», repeat ichida joy almashtirish
await keyingi(); await keyingi(); await kut(500)
tek('10 · P7: «Bitta qadam» bor, «3 / 3 ta blok»', !!(await u.$('#ust .hn .bq-t')) && (await matn(u, '#ust .dsn')) === '3 / 3 ta blok', await matn(u, '#ust .dsn'))
await ishga(u); tek('10 · ▶ — Ortiqvoy «Rasmdan chiqdi!» (2, 1)', (await muam(u)) === 'ortiqvoy:Rasmdan chiqdi!' && (await hint(u)) === 'Qahramon (2, 1) ga chiqdi — u kulrang emas. Bitta qadam bilan yuring', await hint(u))
await qadamB(u, 1); await tinch(u)
tek('10 · «Bitta qadam» — «1-qadam: qahramon (2, 1) ga chiqdi…», blok belgisi bilan', (await hint(u)) === '1-qadam: qahramon (2, 1) ga chiqdi. Shu blokni va undan oldingisini o‘qing' && (await matn(u, '#ust .hn .bq-t small')) === '1-qadam' && (await u.$$('#ust .urildi')).length >= 1, await hint(u))
// ustoz move right ni, keyin move up ni bosadi (Blockly bosishi — blTanlaBos)
const bosBlok = (p, tur, n = 0) => p.evaluate(({ r, tur, n }) => { const ek = document.querySelector(r + ' .ekran'), ws = BL_WS.get(ek), x = ws.getAllBlocks(true).filter((q) => q.type === tur)[n]; blTanlaBos(ek, ws, x) }, { r: R(p), tur, n }).then(() => p.waitForTimeout(300))
await bosBlok(u, 'move_right'); await bosBlok(u, 'move_up')
tek('10 · ikki blokni bosdi — «Bloklar joyi almashdi» (repeat ichida)', (await hint(u)) === 'Bloklar joyi almashdi' && (await matn(u, '#ust .hn .bq-t small')) === '', await hint(u))
await ishga(u); tek('10 · ▶ — «Rasm tayyor!»', (await hint(u)) === 'Rasm tayyor!', await hint(u))
// ---------- 11: bitta qadam (5–8)
await keyingi(); await ekrangacha(a, 'B2A'); await ekrangacha(l, 'B2A'); await kut(600)
await qadamB(a, 3); await tinch(a)
tek('11 · B2A: 3-qadamda Ortiqvoy «Rasmdan chiqdi!», «3-qadam: qahramon (0, 3)…»', (await muam(a)) === 'ortiqvoy:Rasmdan chiqdi!' && (await hint(a)) === '3-qadam: qahramon (0, 3) ga chiqdi. Shu blokni va undan oldingisini o‘qing', (await muam(a)) + ' ' + (await hint(a)))
r = await pog(a, 'B2A', [['p', '2', [['u']]], ['p', '3', [['r']]]], 'B2B'); tek('11 · Aziz 1-pog‘ona: R2[↑] R3[→] → B2B', r.o, JSON.stringify(r))
await qadamB(a, 2)
const kutish = await a.evaluate(() => { const e = document.querySelector('#bol .ekran'); return { kut: !!(e.__bq && e.__bq.kut), yur: !!e.dataset.yuryapti, n: (document.querySelector('#bol .hn .bq-t small') || {}).textContent } })
tek('11 · B2B: 2 bosish — «2-qadam», bosish kutilmoqda, tahrir ochiq (yuryapti yo‘q)', kutish.kut && !kutish.yur && kutish.n === '2-qadam', JSON.stringify(kutish))
r = await pog(a, 'B2B', [['r'], ['r'], ['d'], ['d'], ['r'], ['r']], 'B2C'); tek('11 · tahrir — qadam bekor; → → ↓ ↓ → → → B2C', r.o, JSON.stringify(r))
r = await pog(a, 'B2C', [['p', '2', [['u']]], ['p', '2', [['r']]], ['p', '2', [['d']]]], 'B2Y'); tek('11 · 3-pog‘ona: R2[↑] R2[→] R2[↓] → B2Y', r.o, JSON.stringify(r))
r = await pog(a, 'B2Y', [['p', '3', [['u']]], ['x', '3,0'], ['p', '4', [['u']]], ['x', '5,0'], ['p', '3', [['u']]]], 'BK'); tek('11 · ★ uch ustun → BK', r.o, JSON.stringify(r))
r = await pog(l, 'B2A', [['p', '2', [['u']]], ['p', '3', [['r']]]], 'B2B'); tek('11 · Lola 1-pog‘ona', r.o, JSON.stringify(r))
await gacha(u, () => document.querySelectorAll('#ust .pg-k .pg-s b')[0]?.textContent === '2')
tek('11 · doska: «1 / 2»; zinapoya 2 · 1 · 1 · 1', (await pogSon()) === '1/2 2 1 1 1', await pogSon())
// ---------- 12–14
await keyingi(); tek('12 · xulosa «Xato — topiladi!»', (await matn(u, '#ust .sar')) === 'Xato — topiladi!', await matn(u, '#ust .sar'))
await keyingi(); await keyingi(); await kut(500)
tek('14 · P8: «Bitta qadam» yo‘q (olma dasturi); «Sinov: 0 / 3»', !(await u.$('#ust .hn .bq-t')) && (await matn(u, '#ust .sinov-n')) === 'Sinov: 0 / 3')
await ishga(u); tek('14 · «4» — savatga, muammochasiz', (await muam(u)) === '' && (await hint(u)) === 'Yana ishga tushiring — olma qayerga tushadi?', (await muam(u)) + ' / ' + (await hint(u)))
await ishga(u); await ishga(u); tek('14 · «7» — Kamvoy «Maydon tugadi!»', (await muam(u)) === 'kamvoy:Maydon tugadi!' && (await hint(u)) === 'random 7 ni tanladi. Maydonda X — 0 dan 6 gacha', await hint(u))
await u.evaluate(() => { const x = BL_WS.get(document.querySelector('#ust .ekran')).getBlocksByType('random_n', false)[0]; x.setFieldValue('6', 'B') }); await kut(300)
await ishga(u, 3); tek('14 · 7 → 6, uch marta — «Har safar boshqa joy!»', (await hint(u)) === 'Har safar boshqa joy!' && (await matn(u, '#ust .sinov-n')) === 'Sinov: 3 / 3', await hint(u))
// ---------- 15: yashirin xato (9–12)
await keyingi(); await ekrangacha(a, 'B3A'); await ekrangacha(l, 'B3A'); await kut(600)
tek('15 · B3A: «Bitta qadam» yo‘q; ishora «Ikkala labirintda ham sinang»', !(await a.$('#bol .hn .bq-t')) && (await hint(a)) === 'Ikkala labirintda ham sinang', await hint(a))
await ishga(a); tek('15 · B3A: 2-labirintda yetmadi — Kamvoy, «2-labirintda … if larni o‘qing»', (await muam(a)) === 'kamvoy:Oz qoldi!' && (await hint(a)) === '2-labirintda yulduzgacha yetmadi. O‘sha joyda if larni o‘qing', (await muam(a)) + ' ' + (await hint(a)))
r = await pog(a, 'B3A', [['p', '6', [['a', 'right', [['r']]], ['a', 'up', [['u']]]]]], 'B3B'); tek('15 · 1-pog‘ona: ikkinchi if ↑ → B3B', r.o, JSON.stringify(r))
tek('15 · B3B: «Maslahat» qulf bilan', !!(await a.$('#bol .hn .mas.qulf')))
await a.click('#bol .hn .asos'); await kut(600)
tek('15 · B3B: «▶ Boshlash» — «Maslahat» qulfi ochildi', !(await a.$('#bol .hn .mas.qulf')))
tek('15 · B3B: «▶ Boshlash» — «ikkita dasturcha» ishorasi yo‘q', (await hint(a)) === 'Har strelkani bosib ko‘ring', await hint(a))
await bos(a, '↓'); tek('15 · B3B: ↓ — Bo‘shvoy, javobsiz ishora', (await muam(a)) === 'boshvoy:Bu tugma uchun dasturcha yo‘q-ku…' && (await hint(a)) === '↓ bosildi — uning dasturchasi yo‘q. Dasturchalarning tugmalarini o‘qing.', await hint(a))
await a.click('#bol .hn .asos'); await kut(400) // ■ To'xtatish
// noto'g'ri tuzatish: birinchi when ↑ ni ↓ ga — yutsa ham qabul qilinmaydi
await dch(a, [['right', ['r']], ['left', ['l']], ['down', ['u']], ['up', ['d']]])
await a.click('#bol .hn .asos'); await kut(500); await bos(a, '↓↓→→↑↑→→→←←↓↓↓↓')
tek('15 · B3B: tugmani almashtirib yutish — Kamvoy «Oz qoldi!»', (await muam(a)) === 'kamvoy:Oz qoldi!' && (await hint(a)) === 'Har strelkani bosib ko‘ring: qaysi biri boshqa tomonga yuryapti?', (await muam(a)) + ' ' + (await hint(a)))
if (await a.$('#bol .hn .asos')) { const t = await matn(a, '#bol .hn .asos'); if (t.includes('To‘xtatish')) { await a.click('#bol .hn .asos'); await kut(400) } }
await dch(a, [['right', ['r']], ['left', ['l']], ['up', ['u']], ['down', ['d']]])
await a.click('#bol .hn .asos'); await kut(500); await bos(a, '↑↑→→↓↓→→→←←↑↑↑↑')
tek('15 · B3B: to‘g‘ri tuzatish — 15 bosish, «Siz yutdingiz!» → B3C', await ekrangacha(a, 'B3C', 6000), (await hint(a)) + ' ' + (await id(a)))
await ishga(a); tek('15 · B3C: 1-urinish — savatga, muammochasiz', (await muam(a)) === '', await muam(a))
await ishga(a, 2); tek('15 · B3C: 3-dan keyin — Kamvoy «Bu savat bo‘sh qoladi!» (0, 2)', (await muam(a)) === 'kamvoy:Bu savat bo‘sh qoladi!' && (await hint(a)) === '(0, 2) dagi savatga olma tushmaydi. random sonlarini tekshiring', await hint(a))
r = await pog(a, 'B3C', [['y', 'r0-5,2']], 'B3Y', { n: 9 }); tek('15 · 3-pog‘ona: R0-5 → B3Y', r.o, JSON.stringify(r))
await ekrangacha(a, 'B3Y'); await kut(600); await dastur(a, [['p', '2', [['u']]], ['p', '4', [['r']]]]); await ishga(a)
tek('15 · ★: ishlaydigan dastur — muammochasiz ishora', (await muam(a)) === '' && (await hint(a)) === 'Dastur ishlayapti! Endi bitta blokni o‘zgartiring — topishmoq bo‘lsin.', await hint(a))
r = await pog(a, 'B3Y', [['p', '2', [['u']]], ['p', '3', [['r']]]], 'BK'); tek('15 · ★ «Topishmoq tayyor!» → BK', r.o, JSON.stringify(r))
r = await pog(l, 'B3A', [['p', '6', [['a', 'right', [['r']]], ['a', 'up', [['u']]]]]], 'B3B'); tek('15 · Lola 1-pog‘ona', r.o, JSON.stringify(r))
await gacha(u, () => document.querySelectorAll('#ust .pg-k .pg-s b')[0]?.textContent === '2')
tek('15 · doska: «1 / 2»; zinapoya 2 · 1 · 1 · 1', (await pogSon()) === '1/2 2 1 1 1', await pogSon())
// ---------- 16
await keyingi(); await kut(1200)
tek('16 · ustoz P11: topishmoq maydoni, dastur bo‘sh, «Bitta qadam» bor', (await id(u)) === 'P11' && (await matn(u, '#ust .dsn')) === '0 / 12 ta blok' && !!(await u.$('#ust .hn .bq-t')), await matn(u, '#ust .dsn'))
tek('16 · Aziz: oxirgi yechgan pog‘onasi — B3Y', (await id(a)) === 'B3Y' && (await hint(a)) === 'Dasturingizni ustozga o‘qib bering', await id(a))
await qadamB(a, 1); tek('16 · Aziz qayta bossa — «Bitta qadam» sanalmaydi (pastda tekshiriladi)', true)
// ---------- 17–18
await keyingi(); await ekrangacha(a, 'B5'); await ekrangacha(l, 'B5'); await kut(700)
const son = (p, kk) => p.evaluate(({ r, kk }) => kk.map((k) => (document.querySelector(r + ' .sn-t[data-k="' + k + '"] b') || {}).textContent).join(','), { r: R(p), kk })
const KK = ['ta xato tuzatdi', 'marta «Bitta qadam» bosdi', 'pog‘ona bajardi']
tek('17 · Aziz: 9 xato, 5 marta «Bitta qadam», 12 pog‘ona', (await son(a, KK)) === '9,5,12', await son(a, KK))
tek('17 · Lola: 3, 0, 3', (await son(l, KK)) === '3,0,3', await son(l, KK))
tek('17 · yakun: «Siz xatolarni topdingiz!», keyingi dars «15 · Xakaton №1»', (await matn(u, '#ust .sar')) === 'Siz xatolarni topdingiz!' && (await matn(u, '#ust [data-z="keyingi dars"]')).includes('15 · Xakaton №1'))
await keyingi(); await kut(1200)
tek('18 · Sinfimiz bugun: 12, 5, 15', (await son(u, KK)) === '12,5,15', await son(u, KK))
await u.click('#ust .hn .asos'); await kut(2500)
tek('18 · «Darsni yakunlash» — hammada «Dars tugadi»', (await matn(u, '#ust .tugadi-k')).includes('Dars tugadi!') && (await hint(a)).includes('Ko‘rishguncha'))
tek('konsolda xato yo‘q', !xato.length, xato.slice(0, 4).join(' | '))
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()
process.exit(ok === jami ? 0 : 1)
