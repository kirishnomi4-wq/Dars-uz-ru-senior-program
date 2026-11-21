// 5-dars «Takrorlash» — to'liq jonli dars sinovi (20.11). Manba: new-junior/manba/005-takrorlash.md (v1).
// Ustoz va ikki o'quvchi — alohida oynalar, lokal sinf serveri (/__sinf), alohida xona. Aziz — qahramoni oldingi darslardan; Lola — yangi (BQ).
// 18 qadam: huk (A — 3 blok sig'adi, B — go to, C — repeat 6), yangi so'z (birma-bir), repeat javon orqali HAQIQIY bosish bilan (tanlanadi, ichiga,
// son Blockly ro'yxatidan), chegara, uzun yo'l / kvadrat (rasm) / qisqartirish pog'onalari, 14-qadam (juftliklar → qisqa dastur), doskalar sanog'i,
// «Yordam so'radi», sahifa yangilansa davom, 16-qadamda bola ekrani o'zgarmaydi, natija sonlari (manbadagi yechimlardan hisoblangan), yakunlash.
// Ishlatish (lokal server 5340 yoniq, demo-005 yig'ilgan): node new-junior/sinov/demo/005-toliq-dars.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-005.html', X = 'd5-' + Date.now()
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
const qur = (p, s) => p.evaluate(({ r, s }) => { const d = [...s.matchAll(/p(\d+)\[([rlud]+)\]|[rlud]/g)].map((m) => (m[1] ? { t: 'p', m: m[1], ichki: [...m[2]].map((t) => ({ t })) } : { t: m[0] })); const ek = document.querySelector(r + ' .ekran'); blQur(ek, d); sanoq(ek) }, { r: R(p), s })
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
tek('1 · ustoz: «Kirdi: 2»; «Bugun bir blok bilan ko‘p yuramiz!»; «O‘tgan darsda» — hodisa', (await hint(u)) === 'Kirdi: 2' && (await matn(u, '#ust .sar')) === 'Bugun bir blok bilan ko‘p yuramiz!' && (await matn(u, '#ust .otd')).includes('Biror narsa sodir bo‘lishi'))
for (const p of [a, l]) await p.click('#bol .asos'); await kut(400)
// ---------- 2–4
await keyingi(); await ekrangacha(a, 'P2N'); await ekrangacha(l, 'P2N')
await a.locator('#bol .jk').nth(1).click(); await l.locator('#bol .jk').nth(2).click(); await kut(1200)
await gacha(u, () => /2 \/ 2/.test(document.querySelector('#ust .hn .hint')?.textContent))
tek('2 · «Javob berdi: 2 / 2»; savol «Uchta blok bilan qanday yetamiz?»', (await hint(u)) === 'Javob berdi: 2 / 2' && (await matn(u, '#ust .sar')) === 'Uchta blok bilan qanday yetamiz?')
await keyingi()
const karta = () => u.evaluate(() => [...document.querySelectorAll('#ust .jk .jn')].map((x) => x.textContent).join(' | '))
for (let k = 1; k <= 3; k++) { if (k > 1) await keyingi(); await gacha(u, (n) => document.querySelectorAll('#ust .jk .jn').length >= n && !document.querySelector('#ust .ekran').dataset.yuryapti, k, 20000) }
tek('3 · uch sinov: «✕ sig‘madi | ✕ olmalar qoldi | ✓ 2 ta blok»; C da 5 olma', (await karta()) === '✕ sig‘madi | ✕ olmalar qoldi | ✓ 2 ta blok' && (await u.$$('#ust .kt-olma.olindi')).length === 5, await karta())
await keyingi(); tek('4 · javob «Bir blok — ko‘p marta»', (await matn(u, '#ust .sar')) === 'Bir blok — ko‘p marta')
// ---------- 5–7
await keyingi(); for (let k = 0; k < 3; k++) { await u.click('#ust .hn .asos'); await kut(150) }
tek('5 · «Takrorlash nima?» — uch bo‘lak yondi, qadam o‘sha', (await u.$$('#ust .xyl .xq.on')).length === 3 && (await id(u)) === 'P3')
await keyingi(); await keyingi()
tek('7 · P6: dastur bo‘sh «0 / 2 ta blok»; javonda Takrorlash oilasi', (await matn(u, '#ust .dsn')) === '0 / 2 ta blok' && (await u.$$('#ust .rg .rd.f-b')).length === 1)
await takror(u, 3, 'u')
tek('7 · javondan repeat (son ro‘yxatdan 3), ichiga move up — repeat 3 [↑], «2 / 2 ta blok»', (await tuzilish(u)) === 'p3[u]' && (await matn(u, '#ust .dsn')) === '2 / 2 ta blok', await tuzilish(u))
await ishga(u); tek('7 · Coddy yulduzda, 2 olma', (await hint(u)) === 'Yetib bordi!' && (await u.$$('#ust .kt-olma.olindi')).length === 2)
// ---------- 8
await keyingi(); await ekrangacha(a, 'B1A')
await takror(a, 4, 'r'); await ishga(a)
tek('8 · Aziz repeat 4 — Kamvoy, haqiqiy manzil (4, 0)', (await muam(a)) === 'kamvoy:Yulduz bu yerda emas!' && (await hint(a)) === 'Qahramon (4, 0) da. Kataklarni sanang — repeat sonini tekshiring', await hint(a))
await a.click('#bol .hn .mas'); await kut(300); tek('8 · «Maslahat»', (await hint(a)) === 'Yulduzgacha nechta katak? Shuncha marta takrorlang')
await gacha(u, () => /Yordam so‘radi: 1/.test(document.querySelector('#ust .hn .hint')?.textContent)); tek('8 · ustoz «Yordam so‘radi: 1»', (await hint(u)).startsWith('Yordam so‘radi: 1'))
await menyu(a, 0, 5); let r = await yech(a, 'B1A', '', 'B1B'); tek('8 · son 5 ga o‘zgartirildi — «Yetib bordi!» → B1B', r.g === 'Yetib bordi!' && r.o, r.g)
r = await yech(a, 'B1B', 'p4[d]', 'B1C'); tek('8 · B1B → B1C', r.o)
r = await yech(a, 'B1C', 'p5[r] p3[u]', 'B1Y'); tek('8 · B1C → B1Y', r.o)
r = await yech(a, 'B1Y', 'p5[r] p2[u] p3[l]', 'BK'); tek('8 · ★ → BK', r.o && (await matn(a, '#bol .qarang')).includes('Hamma pog‘onalarni bajardingiz!'))
r = await yech(l, 'B1A', 'p5[r]', 'B1B'); tek('8 · Lola 1-pog‘ona', r.o)
const pogSon = () => u.evaluate(() => [document.querySelector('#ust .tugatdi b').textContent.replace(/\s/g, ''), ...Array.from(document.querySelectorAll('#ust .pg-k .pg-s b')).map((x) => x.textContent)].join(' '))
await gacha(u, () => document.querySelectorAll('#ust .pg-k .pg-s b')[0]?.textContent === '2'); tek('8 · doska «1 / 2»; 2 · 1 · 1 · 1', (await pogSon()) === '1/2 2 1 1 1', await pogSon())
// ---------- 9–11
await keyingi(); await keyingi()
tek('10 · P7: dasturda ikkita repeat (→, ↑), «4 / 8 ta blok»; kulrang kvadrat', (await tuzilish(u)) === 'p3[r] p3[u]' && (await matn(u, '#ust .dsn')) === '4 / 8 ta blok' && (await u.$$('#ust .kt-c.md-rasm')).length === 12, await tuzilish(u))
await takror(u, 3, 'l'); await takror(u, 3, 'd'); await ishga(u)
tek('10 · ustoz ← va ↓ ni qo‘shdi — «Rasm tayyor!»', (await tuzilish(u)) === 'p3[r] p3[u] p3[l] p3[d]' && (await hint(u)) === 'Rasm tayyor!', await hint(u))
await keyingi(); await ekrangacha(a, 'B2A')
await takror(a, 3, 'r'); await takror(a, 3, 'u'); await takror(a, 3, 'l'); await takror(a, 3, 'd')
r = await yech(a, 'B2A', '', 'B2B'); tek('11 · Aziz javon orqali kvadrat — «Rasm tayyor!» → B2B', r.g === 'Rasm tayyor!' && r.o, r.g)
r = await yech(a, 'B2B', 'p3[r] p3[d] p3[l]', ''); tek('11 · B2B uch tomon — Kamvoy «Oz qoldi!», eng yaqin qolgan katak (2, 2)', (await muam(a)) === 'kamvoy:Oz qoldi!' && r.g === 'Kulrang katak qoldi — (2, 2). repeat sonini tekshiring', r.g)
r = await yech(a, 'B2B', 'p3[r] p3[d] p3[l] p3[u]', 'B2C'); tek('11 · B2B → B2C', r.o)
r = await yech(a, 'B2C', 'p3[r] p4[u] p3[l] p4[d]', 'B2Y'); tek('11 · minora → B2Y', r.o)
r = await yech(a, 'B2Y', 'p4[u] p2[r] p4[d] p2[l] p2[u] p2[r]', 'BK'); tek('11 · deraza (12 blok) → BK', r.o, r.g)
r = await yech(l, 'B2A', 'p3[r] p3[u] p3[l] p3[d]', 'B2B'); tek('11 · Lola kvadrat', r.o)
await gacha(u, () => /1\/2/.test(document.querySelector('#ust .tugatdi b')?.textContent.replace(/\s/g, '')) && document.querySelectorAll('#ust .pg-k .pg-s b')[0]?.textContent === '2')
tek('11 · doska «1 / 2»; 2 · 1 · 1 · 1', (await pogSon()) === '1/2 2 1 1 1', await pogSon())
// ---------- 12–14
await keyingi(); tek('12 · xulosa «Takrorlash»', (await matn(u, '#ust .sar')) === 'Takrorlash')
await keyingi(); await keyingi(); await ishga(u)
tek('14 · uzun dastur — «Rasm tayyor!»', (await hint(u)) === 'Rasm tayyor!')
await u.click('#ust .hn .asos'); await kut(250); await u.click('#ust .hn .asos'); await kut(400); await ishga(u)
tek('14 · juftliklar → repeat 3 [→ ↑] — o‘sha rasm', (await tuzilish(u)) === 'p3[ru]' && (await hint(u)) === 'Rasm tayyor!' && (await id(u)) === 'P8', await tuzilish(u))
// ---------- 15
await keyingi()
tek('15 · Aziz B3A: uzun dastur sarlavha ostida, «0 / 3 ta blok»', (await ekrangacha(a, 'B3A')) && (await matn(a, '#bol .ust .iz')).includes('↓ → ↓ → ↓ → ↓ →') && (await matn(a, '#bol .dsn')) === '0 / 3 ta blok')
r = await yech(a, 'B3A', 'p4[dr]', 'B3B'); tek('15 · repeat 4 [↓ →] — «Qisqartirdingiz!» → B3B', r.g === 'Qisqartirdingiz!' && r.o, r.g)
r = await yech(a, 'B3B', 'p2[urdr]', 'B3C'); tek('15 · toj → B3C', r.o)
r = await yech(a, 'B3C', 'p2[ru] p2[rd]', 'B3Y'); tek('15 · tog‘ → B3Y', r.o)
r = await yech(a, 'B3Y', 'p3[rru]', 'BK'); tek('15 · ★ o‘z rasmi — «Rasmingiz tayyor!» → BK', r.g === 'Rasmingiz tayyor!' && r.o, r.g)
await ekrangacha(l, 'B2B'); await l.reload(); await kut(1500)
tek('15 · Lola sahifani yangiladi — B3A', await ekrangacha(l, 'B3A'))
r = await yech(l, 'B3A', 'p4[dr]', 'B3B'); tek('15 · Lola qisqartirdi', r.o)
await gacha(u, () => /1\/2/.test(document.querySelector('#ust .tugatdi b')?.textContent.replace(/\s/g, '')) && document.querySelectorAll('#ust .pg-k .pg-s b')[0]?.textContent === '2')
tek('15 · doska «1 / 2»; 2 · 1 · 1 · 1', (await pogSon()) === '1/2 2 1 1 1', await pogSon())
// ---------- 16
await keyingi(); await kut(2000)
// A·1: bola noutbukida oxirgi yechgan pog'onasi o'z dasturi bilan — Lola B3A (repeat 4 [↓ →])
await ekrangacha(l, 'B3A')
tek('16 · ustoz P11; Lola — B3A o‘z dasturi bilan (3 / 3 ta blok); «Dasturingizni ustozga o‘qib bering»', (await id(u)) === 'P11' && (await id(l)) === 'B3A' && (await matn(l, '#bol .dsn')) === '3 / 3 ta blok' && (await matn(l, '#bol .hn .hint')) === 'Dasturingizni ustozga o‘qib bering', [await id(l), await matn(l, '#bol .dsn'), await matn(l, '#bol .hn .hint')].join(' | '))
await takror(u, 3, 'rru'); await ishga(u); tek('16 · ustoz o‘qilgan dasturni qo‘ydi — «Rasm tayyor!»', (await hint(u)) === 'Rasm tayyor!' && (await matn(u, '#ust .kt-yr text')) === '(6, 3)', await hint(u))
// ---------- 17–18
await keyingi(); await ekrangacha(a, 'B5'); await ekrangacha(l, 'B5')
const son = (p) => p.evaluate((r) => ['rasm chizdi', 'ta repeat qo‘ydi', 'ta blok tejadi'].map((k) => document.querySelector(r + ' .sn-t[data-k="' + k + '"] b').textContent).join(','), R(p))
// Aziz: rasm 4 + 3 + 1 = 8; repeat 1+1+2+3 + 4+4+4+6 + 1+1+2+1 = 30; tejadi (8−3)+(8−5)+(8−6) = 10. Lola: rasm 2; repeat 1+4+1 = 6; tejadi 5
tek('17 · Aziz: 8 rasm, 30 repeat, 10 blok tejadi', (await son(a)) === '8,30,10', await son(a))
tek('17 · Aziz yakunida ★ rasmi: qahramon (6, 3) da', (await matn(a, '#bol .kt-yr text')) === '(6, 3)' && (await a.$$('#bol .kt-il.kt-gl')).length > 0, await matn(a, '#bol .kt-yr text'))
tek('17 · Lola: 2, 6, 5', (await son(l)) === '2,6,5', await son(l))
tek('17 · yakun «Siz rasm chizdingiz!», keyingi dars «6 · Amaliyot»', (await matn(u, '#ust .sar')) === 'Siz rasm chizdingiz!' && (await matn(u, '#ust [data-z="keyingi dars"]')).includes('6 · Amaliyot'))
await keyingi(); await kut(1200); tek('18 · Sinfimiz bugun: 10, 36, 15', (await son(u)) === '10,36,15', await son(u))
await u.click('#ust .hn .asos'); await kut(2500)
tek('18 · «Darsni yakunlash» — hammada «Dars tugadi»', (await matn(u, '#ust .tugadi-k')).includes('Dars tugadi!') && (await hint(a)).includes('Ko‘rishguncha') && (await hint(l)).includes('Ko‘rishguncha'))
tek('konsolda xato yo‘q', !xato.length, xato.slice(0, 4).join(' | '))
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()
process.exit(ok === jami ? 0 : 1)
