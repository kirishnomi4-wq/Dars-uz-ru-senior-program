// 8-dars «Shart» — to'liq jonli dars sinovi (20.11). Manba: new-junior/manba/008-shart.md (v1, tavsiya bo'yicha).
// Ustoz va ikki o'quvchi, lokal sinf serveri. 18 qadam: huk (ikki labirint — A, B, C), yangi so'z «shart», if bloki, egizak labirint (✓ / ✕),
// To'siqvoyning ikki gapi va «N-labirintda yetmadi», tayyor xatoli dasturlar, erkin sayr, 16-qadam (A·1), natija sonlari, yakunlash.
// Ishlatish (lokal server 5340 yoniq, demo-008 yig'ilgan): node new-junior/sinov/demo/008-toliq-dars.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-008.html', X = 'd8-' + Date.now()
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }), xato = []
const oyna = async (n, w, h) => { const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage(); p.on('pageerror', (e) => xato.push(n + ': ' + e.message)); p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) xato.push(n + ' console: ' + m.text()) }); return p }
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
const BLOK = { r: 'move right', l: 'move left', u: 'move up', d: 'move down' }
const oila = async (p, f) => { await p.click(R(p) + ' .rg .rd.f-' + f); await p.waitForTimeout(100) }
const menyu = async (p, n, v) => { await p.locator(R(p) + ' .jr-bl .mb').nth(n).locator('.blocklyDropdownField').first().click(); await p.waitForTimeout(150); await p.locator('.blocklyDropDownDiv .blocklyMenuItem').filter({ hasText: new RegExp('^\\s*' + v + '\\s*$') }).first().click(); await p.waitForTimeout(150) }
// javon orqali: repeat N (tanlanadi) → ichiga bloklar → repeat ni yana bosib tanlovni bekor qilish
const takror = async (p, n, ichki) => {
  const k = (await p.$$(R(p) + ' .jr-bl .mb')).length
  await oila(p, 'b'); await p.locator(R(p) + ' .pl .mbw:not(.yopiq) .mb', { hasText: 'repeat' }).first().click(); await p.waitForTimeout(200)
  await menyu(p, k, n); await oila(p, 'h')
  for (const t of ichki) { await p.locator(R(p) + ' .pl .mbw:not(.yopiq) .mb', { hasText: BLOK[t] }).first().click(); await p.waitForTimeout(120) }
  await p.locator(R(p) + ' .jr-bl .mb').nth(k).click({ position: { x: 14, y: 12 } }); await p.waitForTimeout(250)
}
// tez yo'l (dvigatel funksiyasi bilan — javon yo'li takror() va takror.mjs da sinalgan): 'p5[r] p3[u]'
const blq = (d) => d.map((b) => (Array.isArray(b) ? (b[0] === 'p' ? { t: 'p', m: String(b[1]), ichki: blq(b[2]) } : { t: 'a', m: b[1], ichki: blq(b[2]) }) : { t: b }))
const A = (yon, ...ich) => ['a', yon, ich], RR = (n, ...ich) => ['p', n, ich]
const qur = (p, d) => p.evaluate(({ r, d }) => { const ek = document.querySelector(r + ' .ekran'); blQur(ek, d); sanoq(ek) }, { r: R(p), d: blq(d) })
const egizY = (p) => p.evaluate((r) => [...document.querySelectorAll(r + ' .katak[data-egiz] .egiz-n')].sort((a, c) => a.textContent.localeCompare(c.textContent)).map((x) => x.textContent + (x.classList.contains('ok') ? '✓' : x.classList.contains('yoq') ? '✕' : '')).join(' '), R(p))
const tuzilish = (p) => p.evaluate((r) => { const ws = BL_WS.get(document.querySelector(r + ' .ekran')); return blRoyxat(ws).map((b) => b.type === 'repeat' ? 'p' + b.getFieldValue('N') + '[' + blZanjir(b.getInputTargetBlock('DO')).map((c) => BL_TURI[c.type]).join('') + ']' : BL_TURI[b.type]).join(' ') }, R(p))
const ishga = async (p) => { await p.click(R(p) + (p === u ? ' .hn .ishga' : ' .hn .asos')); await p.waitForTimeout(250); await gacha(p, (r) => { const e = document.querySelector(r + ' .ekran'); return e && !e.dataset.yuryapti }, R(p), 60000); await p.waitForTimeout(150) }
const yech = async (p, e, s, keyin) => { await ekrangacha(p, e); if (s) await qur(p, s); await ishga(p); const g = await hint(p); return { g, o: keyin ? await ekrangacha(p, keyin, 5000) : true } }

// ---------- 1
await a.goto(U + '?rol=varaq'); await a.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'jele'); localStorage.setItem('demo-qism', 'Bulut') })
await l.goto(U + '?rol=varaq'); await l.evaluate(() => localStorage.clear())
await u.goto(`${U}?rol=ustoz&yangi=1&xona=${X}`); await a.goto(`${U}?rol=bola&xona=${X}`); await l.goto(`${U}?rol=bola&xona=${X}`)
await l.fill('#ei', 'Lola'); await l.click('#ef button'); await kut(1500)
await l.locator('#bol .tq-o').nth(4).click(); await ekrangacha(l, 'B0')
await gacha(u, () => /Kirdi: 2/.test(document.querySelector('#ust .hn .hint')?.textContent))
tek('1 · «Kirdi: 2»; «Bugun qahramon devorga urilmaydi!»; «O‘tgan darsda» — animatsiya', (await hint(u)) === 'Kirdi: 2' && (await matn(u, '#ust .sar')) === 'Bugun qahramon devorga urilmaydi!' && (await matn(u, '#ust .otd')).includes('Kostyumlar navbat bilan almashadi'))
for (const p of [a, l]) await p.click('#bol .asos'); await kut(400)
// ---------- 2–5
await keyingi(); await ekrangacha(a, 'P2N'); await ekrangacha(l, 'P2N')
await a.locator('#bol .jk').nth(0).click(); await l.locator('#bol .jk').nth(2).click(); await kut(1200)
await gacha(u, () => /2 \/ 2/.test(document.querySelector('#ust .hn .hint')?.textContent))
tek('2 · «Javob berdi: 2 / 2»; ikki labirint', (await hint(u)) === 'Javob berdi: 2 / 2' && (await u.$$('#ust .katak[data-egiz]')).length === 2)
await keyingi()
const karta = () => u.evaluate(() => [...document.querySelectorAll('#ust .jk .jn')].map((x) => x.textContent).join(' | '))
for (let k = 1; k <= 3; k++) { if (k > 1) await keyingi(); await gacha(u, (n) => document.querySelectorAll('#ust .jk .jn').length >= n && !document.querySelector('#ust .ekran').dataset.yuryapti, k, 40000) }
tek('3 · uch sinov: «✕ 2-labirintda yetmadi | ✕ devorga urildi | ✓ ikkalasida yetdi»', (await karta()) === '✕ 2-labirintda yetmadi | ✕ devorga urildi | ✓ ikkalasida yetdi', await karta())
await keyingi(); tek('4 · javob «Yo‘l bo‘lsa — yuradi»', (await matn(u, '#ust .sar')) === 'Yo‘l bo‘lsa — yuradi')
await keyingi(); for (let k = 0; k < 3; k++) { await u.click('#ust .hn .asos'); await kut(150) }
tek('5 · «Shart nima?» — uch qator yondi', (await u.$$('#ust .xyl .xq.on')).length === 3 && (await id(u)) === 'P3')
// ---------- 6–8: devorgacha
await keyingi(); await keyingi()
tek('7 · P6: javonda Shart oilasi; dastur bo‘sh «0 / 3 ta blok»', (await id(u)) === 'P6' && (await u.$$('#ust .rg .rd.f-a')).length === 1 && (await matn(u, '#ust .dsn')) === '0 / 3 ta blok', await matn(u, '#ust .dsn'))
await qur(u, [RR(6, A('left', 'l'))]); await ishga(u)
tek('7 · repeat 6 [if ← [←]] — «Ikkalasida yetdi!», 1 ✓ 2 ✓', (await hint(u)) === 'Ikkalasida yetdi!' && (await egizY(u)) === '1✓ 2✓', (await hint(u)) + ' ' + (await egizY(u)))
await keyingi(); await ekrangacha(a, 'B1A')
tek('8 · Aziz B1A: ikki labirint, «0 / 3 ta blok», ishora «Ikkala labirintda ham yetsin — dastur bitta»', (await a.$$('#bol .katak[data-egiz]')).length === 2 && (await matn(a, '#bol .dsn')) === '0 / 3 ta blok' && (await hint(a)) === 'Ikkala labirintda ham yetsin — dastur bitta')
let r = await yech(a, 'B1A', [RR(2, 'd')]); tek('8 · repeat 2 [↓] — «2-labirintda yulduzgacha yetmadi…», 1 ✓ 2 ✕', (await muam(a)) === 'kamvoy:Oz qoldi!' && r.g === '2-labirintda yulduzgacha yetmadi. repeat soni va shart tomonini tekshiring' && (await egizY(a)) === '1✓ 2✕', r.g + ' ' + (await egizY(a)))
r = await yech(a, 'B1A', [RR(5, 'd')]); tek('8 · repeat 5 [↓] — To‘siqvoy «1-labirint: bu blok yo‘lni tekshirmay yurdi…»', (await muam(a)) === 'tosiqvoy:Devor!' && r.g === '1-labirint: bu blok yo‘lni tekshirmay yurdi. Yurishdan oldin tekshiring', r.g)
await a.click('#bol .hn .mas'); await kut(300); tek('8 · «Maslahat»', (await hint(a)) === 'Yo‘l qancha — bilmaymiz. Har qadamdan oldin pastni tekshiring', await hint(a))
r = await yech(a, 'B1A', [RR(5, A('down', 'd'))], 'B1B'); tek('8 · repeat 5 [if ↓ [↓]] — «Ikkalasida yetdi!» → B1B', r.g === 'Ikkalasida yetdi!' && r.o, r.g)
r = await yech(a, 'B1B', [RR(5, A('up', 'u'))], 'B1C'); tek('8 · B1B → B1C', r.o, r.g)
r = await yech(a, 'B1C', [RR(4, A('right', 'r')), RR(2, A('up', 'u'))], 'B1Y'); tek('8 · B1C → B1Y', r.o, r.g)
r = await yech(a, 'B1Y', [RR(3, A('down', 'd')), RR(5, A('right', 'r')), RR(3, A('up', 'u'))], 'BK'); tek('8 · B1Y uch tomon → BK', r.o, r.g)
await ekrangacha(l, 'B1A'); r = await yech(l, 'B1A', [RR(5, A('down', 'd'))], 'B1B'); tek('8 · Lola 1-pog‘ona', r.o)
// ---------- 9–11: ikki shart
await keyingi(); await keyingi()
tek('10 · P7: tayyor repeat 6 [if → [→]] «3 / 5 ta blok»', (await id(u)) === 'P7' && (await matn(u, '#ust .dsn')) === '3 / 5 ta blok', await matn(u, '#ust .dsn'))
await ishga(u); tek('10 · bitta shart — «1-labirintda yulduzgacha yetmadi…»', (await hint(u)) === '1-labirintda yulduzgacha yetmadi. repeat soni va shart tomonini tekshiring', await hint(u))
await qur(u, [RR(6, A('right', 'r'), A('up', 'u'))]); await ishga(u); tek('10 · ikki shart — «Ikkalasida yetdi!»', (await hint(u)) === 'Ikkalasida yetdi!', await hint(u))
await keyingi(); await ekrangacha(a, 'B2A')
r = await yech(a, 'B2A', [RR(6, A('right', 'r'), A('down', 'd'))], 'B2B'); tek('11 · B2A pastga zinapoya → B2B', r.o, r.g)
r = await yech(a, 'B2B', [RR(6, A('left', 'l'), A('up', 'u'))], 'B2C'); tek('11 · B2B → B2C', r.o, r.g)
r = await yech(a, 'B2C', [RR(6, A('left', 'l'), A('down', 'd'))]); tek('11 · B2C repeat 6 — «2-labirintda yulduzgacha yetmadi…»', r.g === '2-labirintda yulduzgacha yetmadi. repeat soni va shart tomonini tekshiring', r.g)
r = await yech(a, 'B2C', [RR(7, A('left', 'l'), A('down', 'd'))], 'B2Y'); tek('11 · B2C repeat 7 → B2Y', r.o, r.g)
r = await yech(a, 'B2Y', [RR(4, A('right', 'r'), A('up', 'u')), RR(4, A('right', 'r'), A('down', 'd'))], 'BK'); tek('11 · B2Y tog‘ → BK', r.o, r.g)
await ekrangacha(l, 'B2A'); r = await yech(l, 'B2A', [RR(6, A('right', 'r'), A('down', 'd'))], 'B2B'); tek('11 · Lola 1-pog‘ona', r.o)
// ---------- 12–15: xatoni topamiz
await keyingi(); tek('12 · xulosa «Shart»', (await matn(u, '#ust .sar')) === 'Shart')
await keyingi(); await keyingi()
await ishga(u); tek('14 · tayyor repeat 2 [if ← [←]] — «2-labirintda yulduzgacha yetmadi…»', (await hint(u)) === '2-labirintda yulduzgacha yetmadi. repeat soni va shart tomonini tekshiring', await hint(u))
await qur(u, [RR(5, A('left', 'l'))]); await ishga(u); tek('14 · son 5 — «Xatoni tuzatdingiz!»', (await hint(u)) === 'Xatoni tuzatdingiz!', await hint(u))
await keyingi(); await ekrangacha(a, 'B3A')
r = await yech(a, 'B3A'); tek('15 · B3A tayyor — «1-labirintda yulduzgacha yetmadi…» (qimirlamadi)', r.g === '1-labirintda yulduzgacha yetmadi. repeat soni va shart tomonini tekshiring', r.g)
r = await yech(a, 'B3A', [RR(7, A('right', 'r'))], 'B3B'); tek('15 · B3A tuzatildi → B3B', r.g === 'Xatoni tuzatdingiz!' && r.o, r.g)
r = await yech(a, 'B3B'); tek('15 · B3B tayyor — To‘siqvoy «1-labirint: bu blok yo‘lni tekshirmay yurdi…»', (await muam(a)) === 'tosiqvoy:Devor!' && r.g === '1-labirint: bu blok yo‘lni tekshirmay yurdi. Yurishdan oldin tekshiring', r.g)
r = await yech(a, 'B3B', [RR(8, A('right', 'r'), A('up', 'u'))], 'B3C'); tek('15 · B3B tuzatildi → B3C', r.o, r.g)
r = await yech(a, 'B3C'); tek('15 · B3C tayyor — «1-labirint: shart bir tomonni tekshirdi, blok boshqa tomonga yurdi»', r.g === '1-labirint: shart bir tomonni tekshirdi, blok boshqa tomonga yurdi', r.g)
r = await yech(a, 'B3C', [RR(8, A('down', 'd'), A('right', 'r'))], 'B3Y'); tek('15 · B3C tuzatildi → B3Y', r.o, r.g)
r = await yech(a, 'B3Y', [RR(5, A('right', 'r'))]); tek('15 · ★ bitta if — «Ikki if qo‘ying — har xil tomonga»', r.g === 'Ikki if qo‘ying — har xil tomonga', r.g)
r = await yech(a, 'B3Y', [RR(10, A('right', 'r'), A('up', 'u'))], 'BK'); tek('15 · ★ sayr — «Sayringiz tayyor!» → BK', r.g === 'Sayringiz tayyor!' && r.o, r.g)
await ekrangacha(l, 'B3A'); r = await yech(l, 'B3A', [RR(7, A('right', 'r'))], 'B3B'); tek('15 · Lola 1-pog‘ona', r.o)
// ---------- 16: A·1
await keyingi(); await kut(1500); await ekrangacha(a, 'B3Y'); await ekrangacha(l, 'B3A')
tek('16 · ustoz P11 (Sayr bog‘i); Aziz — B3Y, Lola — B3A o‘z dasturi bilan; «Dasturingizni ustozga o‘qib bering»', (await id(u)) === 'P11' && (await id(a)) === 'B3Y' && (await id(l)) === 'B3A' && (await matn(l, '#bol .dsn')) === '3 / 3 ta blok' && (await hint(l)) === 'Dasturingizni ustozga o‘qib bering', [await id(a), await id(l), await matn(l, '#bol .dsn'), await hint(l)].join(' | '))
await qur(u, [RR(8, A('right', 'r'), A('up', 'u'))]); await ishga(u); tek('16 · ustoz bolaning dasturini bog‘da yurgizdi — «Sayringiz tayyor!»', (await hint(u)) === 'Sayringiz tayyor!', await hint(u))
// ---------- 17–18
await keyingi(); await ekrangacha(a, 'B5'); await ekrangacha(l, 'B5')
const son = (p) => p.evaluate((r) => ['ta shart qo‘ydi', 'ta labirintdan o‘tdi', 'ta xato tuzatdi'].map((k) => document.querySelector(r + ' .sn-t[data-k="' + k + '"] b').textContent).join(','), R(p))
// Aziz: shart 1+1+2+3 + 2+2+2+4 + 1+2+2 + 2 = 24; labirint 11 × 2 = 22 (sayr sanalmaydi); xato 3. Lola: 1+2+1 = 4; 6; 1
tek('17 · Aziz: 24, 22, 3', (await son(a)) === '24,22,3', await son(a))
tek('17 · Lola: 4, 6, 1', (await son(l)) === '4,6,1', await son(l))
tek('17 · yakun «Qahramon devor oldida to‘xtaydi!», keyingi dars «9 · Labirint o‘yini»', (await matn(u, '#ust .sar')) === 'Qahramon devor oldida to‘xtaydi!' && (await matn(u, '#ust [data-z="keyingi dars"]')).includes('9 · Labirint o‘yini'))
await keyingi(); await kut(1200); tek('18 · Sinfimiz bugun: 28, 28, 4', (await son(u)) === '28,28,4', await son(u))
await u.click('#ust .hn .asos'); await kut(2500)
tek('18 · «Darsni yakunlash» — hammada «Dars tugadi»', (await matn(u, '#ust .tugadi-k')).includes('Dars tugadi!') && (await hint(a)).includes('Ko‘rishguncha') && (await hint(l)).includes('Ko‘rishguncha'))
tek('konsolda xato yo‘q', !xato.length, xato.slice(0, 4).join(' | '))
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()
process.exit(ok === jami ? 0 : 1)
