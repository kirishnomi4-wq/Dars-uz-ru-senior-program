// 6-dars «Amaliyot» — to'liq jonli dars sinovi (20.11). Manba: new-junior/manba/006-amaliyot.md (v1.1).
// Ustoz va ikki o'quvchi — alohida oynalar, lokal sinf serveri, alohida xona. Aziz — qahramoni oldingi darslardan; Lola — yangi (BQ).
// 18 qadam: huk (A — ikkita repeat sig'maydi, B — go to, C — go to + repeat), eslaymiz (birma-bir), qoida (birma-bir), uch bekat (yo'l, rasm, hammasi birga),
// kechiktirilgan «Maslahat», chegara, 10-qadam (tayyor rasm), 14-qadam (tayyor dastur — olma qoladi, ikki repeat joyi almashadi), 15 · 3 tayyor dastur,
// ★ sharti (go to ham, repeat ham), doskalar, «Yordam so'radi», 16-qadamda bola oxirgi yechgan pog'onasi (A·1), natija sonlari, yakunlash.
// Ishlatish (lokal server 5340 yoniq, demo-006 yig'ilgan): node new-junior/sinov/demo/006-toliq-dars.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-006.html', X = 'd6-' + Date.now()
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
const qur = (p, s) => p.evaluate(({ r, s }) => { const d = [...s.matchAll(/p(\d+)\[([rlud]+)\]|g(\d),(\d)|[rlud]/g)].map((m) => (m[1] ? { t: 'p', m: m[1], ichki: [...m[2]].map((t) => ({ t })) } : m[3] ? { t: 'x', m: m[3] + ',' + m[4] } : { t: m[0] })); const ek = document.querySelector(r + ' .ekran'); blQur(ek, d); sanoq(ek) }, { r: R(p), s })
const tuzilish = (p) => p.evaluate((r) => { const ws = BL_WS.get(document.querySelector(r + ' .ekran')); return blRoyxat(ws).map((b) => b.type === 'repeat' ? 'p' + b.getFieldValue('N') + '[' + blZanjir(b.getInputTargetBlock('DO')).map((c) => BL_TURI[c.type]).join('') + ']' : BL_TURI[b.type]).join(' ') }, R(p))
const ishga = async (p) => { await p.click(R(p) + (p === u ? ' .hn .ishga' : ' .hn .asos')); await p.waitForTimeout(250); await gacha(p, (r) => { const e = document.querySelector(r + ' .ekran'); return e && !e.dataset.yuryapti }, R(p), 30000); await p.waitForTimeout(150) }
const yech = async (p, e, s, keyin) => { await ekrangacha(p, e); if (s) await qur(p, s); await ishga(p); const g = await hint(p); return { g, o: keyin ? await ekrangacha(p, keyin, 5000) : true } }

// ---------- 1
await a.goto(U + '?rol=varaq'); await a.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'jele'); localStorage.setItem('demo-qism', 'Bulut') })
await l.goto(U + '?rol=varaq'); await l.evaluate(() => localStorage.clear())
await u.goto(`${U}?rol=ustoz&yangi=1&xona=${X}`); await a.goto(`${U}?rol=bola&xona=${X}`); await l.goto(`${U}?rol=bola&xona=${X}`)
await l.fill('#ei', 'Lola'); await l.click('#ef button'); await kut(1500)
tek('1 · Aziz B0; Lola avval BQ', (await id(a)) === 'B0' && (await id(l)) === 'BQ')
await l.locator('#bol .tq-o').nth(4).click(); await ekrangacha(l, 'B0')
await gacha(u, () => /Kirdi: 2/.test(document.querySelector('#ust .hn .hint')?.textContent))
tek('1 · ustoz: «Kirdi: 2»; «Bugun hammasini o‘zingiz tuzasiz!»; «O‘tgan darsda» — takrorlash', (await hint(u)) === 'Kirdi: 2' && (await matn(u, '#ust .sar')) === 'Bugun hammasini o‘zingiz tuzasiz!' && (await matn(u, '#ust .otd')).includes('Bir ishni ko‘p marta bajarish'))
for (const p of [a, l]) await p.click('#bol .asos'); await kut(400)
// ---------- 2–4
await keyingi(); await ekrangacha(a, 'P2N'); await ekrangacha(l, 'P2N')
await a.locator('#bol .jk').nth(0).click(); await l.locator('#bol .jk').nth(2).click(); await kut(1200)
await gacha(u, () => /2 \/ 2/.test(document.querySelector('#ust .hn .hint')?.textContent))
tek('2 · «Javob berdi: 2 / 2»; savol «Qaysi bloklar bilan yetamiz?»', (await hint(u)) === 'Javob berdi: 2 / 2' && (await matn(u, '#ust .sar')) === 'Qaysi bloklar bilan yetamiz?')
await keyingi()
const karta = () => u.evaluate(() => [...document.querySelectorAll('#ust .jk .jn')].map((x) => x.textContent).join(' | '))
for (let k = 1; k <= 3; k++) { if (k > 1) await keyingi(); await gacha(u, (n) => document.querySelectorAll('#ust .jk .jn').length >= n && !document.querySelector('#ust .ekran').dataset.yuryapti, k, 25000) }
tek('3 · uch sinov: «✕ sig‘madi: 4 ta blok | ✕ olmalar qoldi | ✓ 3 ta blok»; C da 4 olma', (await karta()) === '✕ sig‘madi: 4 ta blok | ✕ olmalar qoldi | ✓ 3 ta blok' && (await u.$$('#ust .kt-olma.olindi')).length === 4, await karta())
await keyingi(); tek('4 · javob «Bloklar birga ishlaydi»', (await matn(u, '#ust .sar')) === 'Bloklar birga ishlaydi')
// ---------- 5–7
await keyingi(); for (let k = 0; k < 3; k++) { await u.click('#ust .hn .asos'); await kut(150) }
tek('5 · «Uch blok — uch ish» — uch qator yondi, qadam o‘sha', (await u.$$('#ust .xyl .xq.on')).length === 3 && (await id(u)) === 'P3' && (await matn(u, '#ust .sar')) === 'Uch blok — uch ish')
await keyingi(); await keyingi(); for (let k = 0; k < 3; k++) { await u.click('#ust .hn .asos'); await kut(150) }
tek('7 · «Bugun — o‘zingiz» — uch qoida yondi, qadam o‘sha', (await u.$$('#ust .xyl .xq.on')).length === 3 && (await id(u)) === 'P6' && (await matn(u, '#ust .sar')) === 'Bugun — o‘zingiz')
// ---------- 8: yo'l
await keyingi(); await ekrangacha(a, 'B1A')
tek('8 · Aziz B1A: «0 / 4 ta blok», «Maslahat» qulf bilan, ishora «Qaysi blok kerak — o‘zingiz tanlang»', (await matn(a, '#bol .dsn')) === '0 / 4 ta blok' && (await a.$$('#bol .hn .mas.qulf')).length === 1 && (await hint(a)) === 'Qaysi blok kerak — o‘zingiz tanlang')
await a.click('#bol .hn .mas'); await kut(300); tek('8 · qulfli «Maslahat» — «Avval bir marta ishga tushiring»', (await hint(a)) === 'Avval bir marta ishga tushiring', await hint(a))
await qur(a, 'rruu'); await ishga(a); tek('8 · Aziz → → ↑ ↑ — Kamvoy «Olma qoldi-ku!»', (await muam(a)) === 'kamvoy:Olma qoldi-ku!' && (await hint(a)) === 'Avval olmaga boring — u (0, 2) da', await hint(a))
await a.click('#bol .hn .mas'); await kut(300); tek('8 · «Maslahat» ochildi — «Olma yo‘lda — avval olmaga boring»', (await hint(a)) === 'Olma yo‘lda — avval olmaga boring' && !(await a.$$('#bol .hn .mas.qulf')).length, await hint(a))
await gacha(u, () => /Yordam so‘radi: 1/.test(document.querySelector('#ust .hn .hint')?.textContent)); tek('8 · ustoz «Yordam so‘radi: 1»', (await hint(u)).startsWith('Yordam so‘radi: 1'))
let r = await yech(a, 'B1A', 'uurr', 'B1B'); tek('8 · ↑ ↑ → → — «Yetib bordi!» → B1B', r.g === 'Yetib bordi!' && r.o, r.g)
r = await yech(a, 'B1B', 'g6,4', 'B1C'); tek('8 · B1B go to (6, 4) → B1C', r.o, r.g)
r = await yech(a, 'B1C', 'g2,4 r r', 'B1Y'); tek('8 · B1C go to (2, 4) → → → B1Y', r.o, r.g)
r = await yech(a, 'B1Y', 'g3,0 g2,4 g6,2'); tek('8 · B1Y tartib boshqa — Ortiqvoy «Ko‘payib ketdi!»', (await muam(a)) === 'ortiqvoy:Ko‘payib ketdi!' && r.g === 'Qahramon yulduzdan o‘tib ketdi — oxirgi blokni tekshiring', r.g)
r = await yech(a, 'B1Y', 'g3,0 g6,2 g2,4', 'BK'); tek('8 · B1Y uch go to → BK', r.o, r.g)
await ekrangacha(l, 'B1A'); r = await yech(l, 'B1A', 'uurr', 'B1B'); tek('8 · Lola 1-pog‘ona', r.o)
await gacha(u, () => /1\/2/.test(document.querySelector('#ust .tugatdi b')?.textContent.replace(/\s/g, '')))
tek('8 · doska «Uch pog‘onani tugatdi 1 / 2»', (await matn(u, '#ust .tugatdi b')).replace(/\s/g, '') === '1/2', await matn(u, '#ust .tugatdi b'))
// ---------- 9–11: rasm
await keyingi(); tek('9 · reja: 2-bekat «Rasm»', (await id(u)) === 'P4B')
await keyingi(); await ishga(u); tek('10 · ustoz tayyor ↑ ↑ → → ni ishga tushirdi — «Rasm tayyor!»', (await hint(u)) === 'Rasm tayyor!', await hint(u))
await keyingi(); await ekrangacha(a, 'B2A')
r = await yech(a, 'B2A', 'p5[r]'); tek('11 · Aziz repeat 5 — «Kulrang katak qoldi — (6, 2). Son va yo‘nalishni tekshiring»', (await muam(a)) === 'kamvoy:Oz qoldi!' && r.g === 'Kulrang katak qoldi — (6, 2). Son va yo‘nalishni tekshiring', r.g)
r = await yech(a, 'B2A', 'p6[r]', 'B2B'); tek('11 · repeat 6 — «Rasm tayyor!» → B2B', r.g === 'Rasm tayyor!' && r.o, r.g)
r = await yech(a, 'B2B', 'p3[r] p2[u] p3[l] p2[d]', 'B2C'); tek('11 · B2B eshik → B2C', r.o, r.g)
tek('11 · B2C sarlavha ostida uzun dastur', (await matn(a, '#bol .iz')) === '4 ta blok bilan chizing. Uzun dastur: ↑ → → ↑ → →' || (await a.evaluate(() => document.querySelector('#bol .ekran').textContent.includes('4 ta blok bilan chizing. Uzun dastur: ↑ → → ↑ → →'))))
r = await yech(a, 'B2C', 'p2[urr]', 'B2Y'); tek('11 · B2C — «Qisqartirdingiz!» → B2Y', r.g === 'Qisqartirdingiz!' && r.o, r.g)
r = await yech(a, 'B2Y', 'p2[uurddr]', 'BK'); tek('11 · B2Y to‘lqin → BK', r.o, r.g)
await ekrangacha(l, 'B2A'); r = await yech(l, 'B2A', 'p6[r]', 'B2B'); tek('11 · Lola 1-pog‘ona', r.o)
// ---------- 12–15: hammasi birga
await keyingi(); tek('12 · xulosa «Har ishga — o‘z bloki»', (await matn(u, '#ust .sar')) === 'Har ishga — o‘z bloki')
await keyingi(); await keyingi()
await ishga(u); tek('14 · tayyor dastur — Kamvoy «Olma qoldi-ku!»', (await muam(u)) === 'kamvoy:Olma qoldi-ku!', await muam(u))
await u.locator('#ust .jr-bl .mb').nth(2).click({ position: { x: 14, y: 12 } }); await kut(350); await u.locator('#ust .jr-bl .mb').nth(0).click({ position: { x: 14, y: 12 } }); await kut(450)
tek('14 · repeat 3 ni, keyin repeat 2 ni bosdi — joyi almashdi', (await tuzilish(u)) === 'p3[r] p2[u]', await tuzilish(u))
await ishga(u); tek('14 · olma, yulduz — «Yetib bordi!»', (await hint(u)) === 'Yetib bordi!' && (await u.$$('#ust .kt-olma.olindi')).length === 1, await hint(u))
await keyingi(); await ekrangacha(a, 'B3A')
r = await yech(a, 'B3A', 'g3,1 p3[u]', 'B3B'); tek('15 · Aziz B3A go to + repeat → B3B', r.o, r.g)
r = await yech(a, 'B3B', 'p3[r] p2[u] p3[l]'); tek('15 · B3B go to siz — «Rasmdan chiqdi!», (3, 1)', (await muam(a)) === 'ortiqvoy:Rasmdan chiqdi!' && r.g === 'Qahramon (3, 1) ga chiqdi — u kulrang emas. Kerak bo‘lsa — sakrang', r.g)
r = await yech(a, 'B3B', 'p3[r] g0,2 p3[r]', 'B3C'); tek('15 · B3B sakrab — «Rasm tayyor!» → B3C', r.g === 'Rasm tayyor!' && r.o, r.g)
tek('15 · B3C: tayyor dastur «3 / 3 ta blok»', (await matn(a, '#bol .dsn')) === '3 / 3 ta blok', await matn(a, '#bol .dsn'))
await ishga(a); tek('15 · tayyor dastur — Kamvoy «Maydon tugadi!», «Bloklar tartibini tekshiring»', (await muam(a)) === 'kamvoy:Maydon tugadi!' && (await hint(a)) === 'Qahramon shu blokda to‘xtadi. Bloklar tartibini tekshiring', await hint(a))
await a.locator('#bol .jr-bl .mb').nth(2).click({ position: { x: 14, y: 12 } }); await kut(350); await a.locator('#bol .jr-bl .mb').nth(0).click({ position: { x: 14, y: 12 } }); await kut(450)
tek('15 · bola go to ni, keyin repeat ni bosdi — joyi almashdi', (await tuzilish(a)) === 'x p3[d]', await tuzilish(a))
r = await yech(a, 'B3C', '', 'B3Y'); tek('15 · tuzatilgan dastur — «Yetib bordi!» → B3Y', r.g === 'Yetib bordi!' && r.o, r.g)
r = await yech(a, 'B3Y', 'p3[r]'); tek('15 · ★ go to siz — Kamvoy «Oz qoldi!», «Dasturda go to ham, repeat ham bo‘lsin»', (await muam(a)) === 'kamvoy:Oz qoldi!' && r.g === 'Dasturda go to ham, repeat ham bo‘lsin', r.g)
r = await yech(a, 'B3Y', 'p2[rru] g5,0 p3[u]', 'BK'); tek('15 · ★ o‘z rasmi — «Rasmingiz tayyor!» → BK', r.g === 'Rasmingiz tayyor!' && r.o, r.g)
await ekrangacha(l, 'B3A'); r = await yech(l, 'B3A', 'g3,1 p3[u]', 'B3B'); tek('15 · Lola 1-pog‘ona', r.o)
// ---------- 16: bola oxirgi yechgan pog'onasi (A·1)
await keyingi(); await kut(1500); await ekrangacha(a, 'B3Y'); await ekrangacha(l, 'B3A')
tek('16 · ustoz P11; Aziz — o‘z ★ rasmi (B3Y, 7 / 12), Lola — B3A (3 / 3); «Dasturingizni ustozga o‘qib bering»', (await id(u)) === 'P11' && (await id(a)) === 'B3Y' && (await matn(a, '#bol .dsn')) === '7 / 12 ta blok' && (await id(l)) === 'B3A' && (await matn(l, '#bol .dsn')) === '3 / 3 ta blok' && (await hint(l)) === 'Dasturingizni ustozga o‘qib bering', [await id(a), await matn(a, '#bol .dsn'), await id(l), await matn(l, '#bol .dsn'), await hint(l)].join(' | '))
await qur(u, 'p2[rru] g5,0 p3[u]'); await ishga(u); tek('16 · ustoz o‘qilgan dasturni qo‘ydi — «Rasm tayyor!», (5, 3)', (await hint(u)) === 'Rasm tayyor!' && (await matn(u, '#ust .kt-yr text')) === '(5, 3)', await hint(u))
// ---------- 17–18
await keyingi(); await ekrangacha(a, 'B5'); await ekrangacha(l, 'B5')
const son = (p) => p.evaluate((r) => ['pog‘ona bajardi', 'ta go to qo‘ydi', 'ta repeat qo‘ydi'].map((k) => document.querySelector(r + ' .sn-t[data-k="' + k + '"] b').textContent).join(','), R(p))
// Aziz: 12 pog'ona; go to 0+1+1+3 + 0 + 1+1+1+1 = 9; repeat 0 + 1+4+1+1 + 1+2+1+2 = 13. Lola: 3 pog'ona; go to 1 (B3A); repeat 1 (B2A) + 1 (B3A) = 2
tek('17 · Aziz: 12 pog‘ona, 9 go to, 13 repeat', (await son(a)) === '12,9,13', await son(a))
tek('17 · Aziz yakunida ★ rasmi: qahramon (5, 3) da, sakrash izi bilan', (await matn(a, '#bol .kt-yr text')) === '(5, 3)' && (await a.$$('#bol .kt-il.kt-gl')).length > 0, await matn(a, '#bol .kt-yr text'))
tek('17 · Lola: 3, 1, 2', (await son(l)) === '3,1,2', await son(l))
tek('17 · yakun «Siz o‘zingiz tuzdingiz!», keyingi dars «7 · Kostyum va tovush»', (await matn(u, '#ust .sar')) === 'Siz o‘zingiz tuzdingiz!' && (await matn(u, '#ust [data-z="keyingi dars"]')).includes('7 · Kostyum va tovush'))
await keyingi(); await kut(1200); tek('18 · Sinfimiz bugun: 15, 10, 15', (await son(u)) === '15,10,15', await son(u))
await u.click('#ust .hn .asos'); await kut(2500)
tek('18 · «Darsni yakunlash» — hammada «Dars tugadi»', (await matn(u, '#ust .tugadi-k')).includes('Dars tugadi!') && (await hint(a)).includes('Ko‘rishguncha') && (await hint(l)).includes('Ko‘rishguncha'))
tek('konsolda xato yo‘q', !xato.length, xato.slice(0, 4).join(' | '))
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()
process.exit(ok === jami ? 0 : 1)
