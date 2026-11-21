// 3-dars «X va Y» — to'liq jonli dars sinovi (20.11). Manba: new-junior/manba/003-koordinata.md (v1.1).
// Ustoz va ikki o'quvchi — alohida brauzer oynalari (alohida saqlov), lokal sinf serveri orqali (/__sinf), alohida xona.
//   «Aziz» — qahramoni oldingi darslardan (jele, kurs bo'yi saqlanadi, 94-qaror); «Lola» — yangi bola: ism yozib kiradi va qahramon tanlaydi (BQ).
// 18 qadamning hammasi: huk (uch xat), birma-bir yonadigan bo'laklar (5, 7-qadam), katakni bosish (1-bekat), go to — sonlar Blockly ro'yxatidan
// haqiqiy bosish bilan tanlanadi (10, 11, 16-qadam), oldindan aytish — bayroqcha (14, 15-qadam), doskalar sanog'i, «Yordam so'radi»,
// sahifa yangilansa davom, 16-qadamda bola ekrani o'zgarmaydi, bolaning va sinfning natijasi (sonlar manbadagi yechimlardan hisoblangan), yakunlash.
// Ishlatish (lokal server 5340 yoniq, demo-003 yig'ilgan): node new-junior/sinov/demo/003-toliq-dars.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-003.html', X = 'd3-' + Date.now()
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
const BLOK = { r: 'move right', l: 'move left', u: 'move up', d: 'move down', x: 'go to' }
const R = (p) => (p === u ? '#ust' : '#bol')
const hint = (p) => matn(p, R(p) + ' .hn .hint')
const muam = (p) => p.evaluate((r) => { const m = document.querySelector(r + ' .dv-muam'); return m ? (m.className.match(/m-(\w+)/) || [])[1] + ':' + m.textContent.trim() : '' }, R(p))
// dastur: «x42 x13 r u» kabi — go to manzili bilan; Blockly'dan o'qiladi
const dastur = (p) => p.evaluate((r) => blBloklar(document.querySelector(r + ' .ekran')).map((mb) => blokTuri(mb) === 'x' ? 'x' + blokXY(mb).join('') : blokTuri(mb)).join(' '), R(p))
// javondan blok qo'shish; go to bo'lsa — X va Y sonlari Blockly ro'yxatidan HAQIQIY bosish bilan tanlanadi
const sonTanla = async (p, n, i, v) => {
  await p.locator(R(p) + ' .jr-bl .mb').nth(n).locator('.blocklyDropdownField').nth(i).click(); await p.waitForTimeout(150)
  await p.locator('.blocklyDropDownDiv .blocklyMenuItem').filter({ hasText: new RegExp('^\\s*' + v + '\\s*$') }).first().click(); await p.waitForTimeout(150)
}
const qosh = async (p, ...bl) => { for (const t of bl) { const n = (await p.$$(R(p) + ' .jr-bl .mb')).length; await p.locator(R(p) + ' .pl .mbw:not(.yopiq) .mb', { hasText: BLOK[t[0]] }).first().click(); await p.waitForTimeout(120); if (t[0] === 'x') { await sonTanla(p, n, 0, t[1]); await sonTanla(p, n, 1, t[2]) } } }
const ishga = async (p) => { await p.click(R(p) + (p === u ? ' .hn .ishga' : ' .hn .asos')); await p.waitForTimeout(250); await gacha(p, (r) => { const e = document.querySelector(r + ' .ekran'); return e && !e.dataset.yuryapti }, R(p), 20000); await p.waitForTimeout(150) }
const bos = async (p, n) => { await p.locator(R(p) + ' .jr-bl .mb').nth(n).click({ position: { x: 18, y: 14 } }); await p.waitForTimeout(350) }
// maydon katagini bosish (x, y), Y tepaga
const katak = async (p, x, y) => { const c = await p.evaluate(({ r, x, y }) => { const k = document.querySelector(r + ' .katak.maydon'), n = k.dataset.xarita.split('|').length, e = k.querySelector('.kt-c[data-k="' + x + ',' + (n - 1 - y) + '"]').getBoundingClientRect(); return [e.left + e.width / 2, e.top + e.height / 2] }, { r: R(p), x, y }); await p.mouse.click(c[0], c[1]); await p.waitForTimeout(300) }
// pog'ona: katakni bosing — oxirgi katakdan keyin keyingi ekranga o'tadi
const top = async (p, e, kat, keyin) => { await ekrangacha(p, e); for (const [x, y] of kat) await katak(p, x, y); const g = await hint(p); return { g, o: await ekrangacha(p, keyin, 5000) } }
const yech = async (p, e, bl, keyin) => { await ekrangacha(p, e); await qosh(p, ...bl); await ishga(p); const g = await hint(p); return { g, o: keyin ? await ekrangacha(p, keyin, 5000) : true } }
// oldindan ayting: bayroqcha → «Tekshirish»
const ayt = async (p, e, [x, y], keyin) => { await ekrangacha(p, e); await katak(p, x, y); await ishga(p); const g = await hint(p); return { g, o: keyin ? await ekrangacha(p, keyin, 5000) : true } }

// ---------- 1: kirish
await a.goto(U + '?rol=varaq'); await a.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'jele'); localStorage.setItem('demo-qism', 'Bulut') })
await l.goto(U + '?rol=varaq'); await l.evaluate(() => localStorage.clear())
await u.goto(`${U}?rol=ustoz&yangi=1&xona=${X}`); await a.goto(`${U}?rol=bola&xona=${X}`); await l.goto(`${U}?rol=bola&xona=${X}`)
await l.fill('#ei', 'Lola'); await l.click('#ef button'); await kut(1500)
tek('1 · Aziz: B0, qahramoni oldingi darsdan', (await id(a)) === 'B0')
tek('1 · Lola (qahramoni yo‘q): avval BQ', (await id(l)) === 'BQ')
await l.locator('#bol .tq-o').nth(4).click(); await ekrangacha(l, 'B0')
await gacha(u, () => /Kirdi: 2/.test(document.querySelector('#ust .hn .hint')?.textContent))
tek('1 · ustoz: «Kirdi: 2»; sarlavha va «O‘tgan darsda»', (await hint(u)) === 'Kirdi: 2' && (await matn(u, '#ust .sar')) === 'Bugun katakning manzilini bilib olamiz!' && (await matn(u, '#ust .otd')).includes('Buyruqlar tartibi'), await hint(u))
tek('1 · maydon: Coddy (0, 0), yorliq «(0, 0)», o‘qlar 0–6 va 0–4', (await matn(u, '#ust .kt-yr text')) === '(0, 0)' && (await u.$$('#ust .md-nx')).length === 7 && (await u.$$('#ust .md-ny')).length === 5)
for (const p of [a, l]) await p.click('#bol .asos'); await kut(400)
tek('1 · «Tayyorman» → «Ustoz ekraniga qarang»', (await id(a)) === 'BK' && (await id(l)) === 'BK')

// ---------- 2–4: huk — uch xat
await keyingi(); await ekrangacha(a, 'P2N'); await ekrangacha(l, 'P2N')
tek('2 · bolalarda uchta xat kartasi', (await a.$$('#bol .jk')).length === 3 && (await matn(a, '#bol .jk.c3 q')) === 'Yulduz: o‘ngga 4, tepaga 2')
await a.locator('#bol .jk').nth(0).click(); await l.locator('#bol .jk').nth(2).click(); await kut(1200)
await gacha(u, () => /2 \/ 2/.test(document.querySelector('#ust .hn .hint')?.textContent))
tek('2 · ustoz: «Javob berdi: 2 / 2», A da 1, C da 1', (await hint(u)) === 'Javob berdi: 2 / 2' && (await matn(u, '#ust .jk.c1 .jr-s')) === '1' && (await matn(u, '#ust .jk.c3 .jr-s')) === '1')
await keyingi()
const karta = () => u.evaluate(() => [[...document.querySelectorAll('#ust .jk .jn')].map((x) => x.textContent).join(' | '), document.querySelectorAll('#ust .kt-c.yonk').length, !!document.querySelector('#ust .kt-yul.topildi')].join(' # '))
await gacha(u, () => document.querySelectorAll('#ust .jk .jn').length >= 1 && !document.querySelector('#ust .ekran').dataset.yuryapti, null, 20000)
tek('3 · A o‘zi sinaldi: 3 ta katak yondi, «✕ 3 ta katak»; bolada «Ustoz xatlarni sinayapti»', (await karta()) === '✕ 3 ta katak # 3 # false' && (await matn(a, '#bol .qarang')).includes('Ustoz xatlarni sinayapti'), await karta())
await keyingi(); await gacha(u, () => document.querySelectorAll('#ust .jk .jn').length >= 2 && !document.querySelector('#ust .ekran').dataset.yuryapti, null, 20000)
tek('3 · B: pastki qatordagi 7 ta katak', (await karta()) === '✕ 3 ta katak | ✕ 7 ta katak # 7 # false', await karta())
await keyingi(); await gacha(u, () => document.querySelectorAll('#ust .jk .jn').length >= 3 && !document.querySelector('#ust .ekran').dataset.yuryapti, null, 20000)
tek('3 · C: Coddy o‘ngga 4, tepaga 2 — yulduz ochildi, konfeti, «(4, 2)»', (await karta()) === '✕ 3 ta katak | ✕ 7 ta katak | ✓ bitta katak # 0 # true' && (await u.$$('#ust .konfeti')).length > 0 && (await matn(u, '#ust .kt-yr text')) === '(4, 2)', await karta())
await keyingi()
tek('4 · Javob «Ikki son — bitta katak»: A, B xira, C oltin', (await id(u)) === 'P2C' && (await u.$$('#ust .jk.n-yoq')).length === 2 && (await u.$$('#ust .jk.n-ok')).length === 1 && (await matn(u, '#ust .sar')) === 'Ikki son — bitta katak')

// ---------- 5: yangi so'z — uch bo'lak birma-bir
await keyingi()
const yondi = () => u.evaluate(() => [document.querySelectorAll('#ust .xyl p.on').length, document.querySelectorAll('#ust .md-nx.on').length, document.querySelectorAll('#ust .md-ny.on').length, document.querySelectorAll('#ust .md-kes.on').length].join(','))
tek('5 · «Koordinata nima?», hammasi o‘chiq; bolada «Yangi so‘z: koordinata»', (await matn(u, '#ust .sar')) === 'Koordinata nima?' && (await yondi()) === '0,0,0,0' && (await matn(a, '#bol .qarang')).includes('Yangi so‘z: koordinata'))
await u.click('#ust .hn .asos'); await kut(150); tek('5 · 1-bosish: X qatori (0–6)', (await yondi()) === '1,7,0,0', await yondi())
await u.click('#ust .hn .asos'); await kut(150); tek('5 · 2-bosish: Y ustuni (0–4)', (await yondi()) === '2,7,5,0', await yondi())
await u.click('#ust .hn .asos'); await kut(150); tek('5 · 3-bosish: (4, 2) katagi; qadam o‘sha', (await yondi()) === '3,7,5,1' && (await id(u)) === 'P3', await yondi())
await keyingi(); tek('5 · 4-bosish → reja', (await id(u)) === 'P4' && (await matn(u, '#ust .hn .asos')) === 'Boshladik ›')

// ---------- 7: Coddy qayerda — birma-bir
await keyingi()
const yon7 = () => u.evaluate(() => [[...document.querySelectorAll('#ust .xyl p.on')].map((x) => x.firstChild.textContent).join('/'), document.querySelector('#ust .md-nx[data-x="3"]').classList.contains('on'), document.querySelector('#ust .md-ny[data-y="1"]').classList.contains('on'), document.querySelector('#ust .kt-yr').classList.contains('on')].join(' '))
tek('7 · «Coddy qayerda?», yorliq hali yo‘q', (await matn(u, '#ust .sar')) === 'Coddy qayerda?' && (await yon7()) === ' false false false', await yon7())
for (let k = 0; k < 3; k++) { await u.click('#ust .hn .asos'); await kut(150) }
tek('7 · uch bosish: X = 3 (3 oltin), Y = 1 (1 oltin), yorliq «(3, 1)»', (await yon7()) === 'X = 3/Y = 1/Manzil — (3, 1) true true true' && (await matn(u, '#ust .kt-yr text')) === '(3, 1)', await yon7())

// ---------- 8: katakni bosing (1–4)
await keyingi()
tek('8 · Aziz va Lola B1A (o‘z qahramoni maydonda)', (await ekrangacha(a, 'B1A')) && (await ekrangacha(l, 'B1A')) && (await matn(a, '#bol .sar')) === '(3, 0) katakni toping')
await katak(a, 0, 3); await kut(300)
tek('8 · Aziz (0, 3) ni bosdi — Kamvoy «Bu — (0, 3)», qahramon o‘sha katakda', (await muam(a)) === 'kamvoy:Bu — (0, 3)' && (await hint(a)) === 'Avval X — o‘ngga sanang, keyin Y — tepaga' && (await matn(a, '#bol .kt-yr text')) === '(0, 3)', (await muam(a)) + ' ' + (await hint(a)))
await a.click('#bol .hn .mas'); await kut(300)
tek('8 · «Maslahat» — manbadagi gap', (await hint(a)) === 'Birinchi son — X: chap chetdan o‘ngga sanang. Ikkinchisi — Y: pastdan tepaga')
await gacha(u, () => /Yordam so‘radi: 1/.test(document.querySelector('#ust .hn .hint')?.textContent))
tek('8 · ustoz: «Yordam so‘radi: 1»', (await hint(u)).startsWith('Yordam so‘radi: 1'), await hint(u))
let r = await top(a, 'B1A', [[3, 0]], 'B1B'); tek('8 · Aziz (3, 0) — «Topdingiz!» → B1B', r.g === 'Topdingiz!' && r.o, r.g)
r = await top(a, 'B1B', [[0, 2]], 'B1C'); tek('8 · (0, 2) → B1C', r.o)
r = await top(a, 'B1C', [[4, 3]], 'B1Y'); tek('8 · (4, 3) daraxt katagi → B1Y', r.o)
await ekrangacha(a, 'B1Y'); await katak(a, 2, 4); tek('8 · ★ (2, 4) — «Endi (4, 2)»', (await hint(a)) === 'Endi (4, 2)', await hint(a))
r = await top(a, 'B1Y', [[4, 2]], 'BK'); tek('8 · ★ (4, 2) → BK «Hamma pog‘onalarni bajardingiz!»', r.o && (await matn(a, '#bol .qarang')).includes('Hamma pog‘onalarni bajardingiz!'))
r = await top(l, 'B1A', [[3, 0]], 'B1B'); tek('8 · Lola 1-pog‘ona', r.o)
const pogSon = () => u.evaluate(() => [document.querySelector('#ust .tugatdi b').textContent.replace(/\s/g, ''), ...Array.from(document.querySelectorAll('#ust .pg-k .pg-s b')).map((x) => x.textContent)].join(' '))
await gacha(u, () => document.querySelectorAll('#ust .pg-k .pg-s b')[0]?.textContent === '2')
tek('8 · doska: «Uch katakni topdi 1 / 2»; zinapoya 2 · 1 · 1 · 1', (await pogSon()) === '1/2 2 1 1 1', await pogSon())

// ---------- 9–10: 2-bekat, go to
await keyingi(); tek('9 · reja: 1-bekat ✓, «2 · Manzilga boramiz»', (await id(u)) === 'P4B' && (await u.$$('#ust .tp-st.otdi')).length === 1)
await keyingi()
tek('10 · P7: dastur bo‘sh, javonda go to va to‘rt move', (await dastur(u)) === '' && (await u.$$('#ust .pl .mbw:not(.yopiq) .mb')).length === 5 && (await matn(a, '#bol .qarang')).includes('Ustoz go to blokini ko‘rsatyapti'))
await qosh(u, ['x', 4, 2])
tek('10 · go to qo‘shildi, sonlar ro‘yxatdan tanlandi: go to x: 4 y: 2', (await dastur(u)) === 'x42', await dastur(u))
await ishga(u)
tek('10 · Coddy bir sakrashda (4, 2) ga — «Yetib bordi!», konfeti, punktir iz', (await hint(u)) === 'Yetib bordi!' && (await matn(u, '#ust .kt-yr text')) === '(4, 2)' && (await u.$$('#ust .kt-il.kt-gl')).length === 1 && (await u.$$('#ust .konfeti')).length > 0)
await qosh(u, ['x', 1, 3]); await bos(u, 1); await bos(u, 0)
tek('10 · go to x: 1 y: 3 qo‘shilib, joyi almashtirildi — avval olma', (await dastur(u)) === 'x13 x42', await dastur(u))
await ishga(u)
tek('10 · ikki sakrash: olma olindi, yulduzda', (await hint(u)) === 'Yetib bordi!' && (await u.$$('#ust .kt-olma.olindi')).length === 1 && (await u.$$('#ust .kt-il.kt-gl')).length === 2)

// ---------- 11: manzilga boramiz (5–8)
await keyingi()
tek('11 · Aziz B2A: yulduz yashirin, sarlavha «Yulduz (5, 3) da»', (await ekrangacha(a, 'B2A')) && (await matn(a, '#bol .sar')) === 'Yulduz (5, 3) da' && (await a.$$('#bol .kt-yul.yashirin')).length === 1)
await qosh(a, ['x', 3, 5 > 4 ? 4 : 5]); await ishga(a)
tek('11 · Aziz go to x: 3 y: 4 — Kamvoy «Yulduz bu yerda emas!», haqiqiy manzil', (await muam(a)) === 'kamvoy:Yulduz bu yerda emas!' && (await hint(a)) === 'Qahramon (3, 4) da. Sonlarni tekshiring: avval X, keyin Y', (await muam(a)) + ' ' + (await hint(a)))
await sonTanla(a, 0, 0, 5); await sonTanla(a, 0, 1, 3)
r = await yech(a, 'B2A', [], 'B2B'); tek('11 · sonlar tuzatildi (5, 3) — yulduz ochildi, «Yetib bordi!» → B2B', r.g === 'Yetib bordi!' && r.o, r.g)
await qosh(a, ['x', 6, 4]); await ishga(a)
tek('11 · B2B: olmasiz — Kamvoy «Olma qoldi-ku!», «u (2, 1) da»', (await muam(a)) === 'kamvoy:Olma qoldi-ku!' && (await hint(a)) === 'Avval olmaga boring — u (2, 1) da', await hint(a))
await a.evaluate(() => { const ek = document.querySelector('#bol .ekran'); BL_WS.get(ek).clear(); sanoq(ek) })
r = await yech(a, 'B2B', [['x', 2, 1], ['x', 6, 4]], 'B2C'); tek('11 · olma, keyin yulduz → B2C', r.g === 'Yetib bordi!' && r.o, r.g)
r = await yech(a, 'B2C', [['x', 1, 3], ['x', 5, 1], ['x', 3, 4]], 'B2Y'); tek('11 · uch manzil → B2Y', r.o)
await qosh(a, ['x', 2, 4], ['x', 2, 4]); await ishga(a)
tek('11 · ★: ikkita bir xil manzil — «Yana bitta manzil qo‘shing»', (await hint(a)) === 'Yana bitta manzil qo‘shing' && (await muam(a)) === 'kamvoy:Oz qoldi!', await hint(a))
r = await yech(a, 'B2Y', [['x', 4, 0], ['x', 6, 4]], 'BK'); tek('11 · ★ o‘z yo‘li (4 ta go to, 3 xil) — «Yo‘lingiz tayyor!» → BK', r.g === 'Yo‘lingiz tayyor!' && r.o, r.g)
r = await yech(l, 'B2A', [['x', 5, 3]], 'B2B'); tek('11 · Lola 1-pog‘ona', r.o)
await gacha(u, () => /1\/2/.test(document.querySelector('#ust .tugatdi b')?.textContent.replace(/\s/g, '')))
tek('11 · doska: «Uch pog‘onani tugatdi 1 / 2»; zinapoya 2 · 1 · 1 · 1', (await pogSon()) === '1/2 2 1 1 1', await pogSon())

// ---------- 12–14: xulosa, 3-bekat, oldindan aytish
await keyingi(); tek('12 · xulosa «Koordinata»', (await matn(u, '#ust .sar')) === 'Koordinata')
await keyingi(); tek('13 · reja: 1, 2 ✓', (await u.$$('#ust .tp-st.otdi')).length === 2)
await keyingi()
const sq = () => u.evaluate(() => [...document.querySelectorAll('#ust .sq.on')].map((x) => x.textContent).join(' '))
tek('14 · P8: tayyor dastur → → ↑, javon yopiq, «▶ Tekshirish» xira', (await u.$$('#ust .dst .mb')).length === 3 && (await u.$$('#ust .pl .mbw:not(.yopiq)')).length === 0 && (await matn(u, '#ust .hn .ishga')) === '▶ Tekshirish' && await u.$eval('#ust .hn .ishga', (e) => e.classList.contains('kut')))
for (let k = 0; k < 3; k++) { await u.click('#ust .hn .asos'); await kut(150) }
tek('14 · «Keyingi» ×3: X: 2 · X: 3 · Y: 2, qadam o‘sha', (await sq()) === 'X: 2 X: 3 Y: 2' && (await id(u)) === 'P8', await sq())
r = await ayt(u, 'P8', [3, 2]); tek('14 · bayroqcha (3, 2) → «Oldindan aytdingiz!»', r.g === 'Oldindan aytdingiz!' && (await matn(u, '#ust .kt-yr text')) === '(3, 2)', r.g)

// ---------- 15: oldindan aytamiz (9–12)
await keyingi()
tek('15 · Aziz B3A — tayyor dastur, bayroqchasiz «Tekshirish» xira', (await ekrangacha(a, 'B3A')) && await a.$eval('#bol .hn .asos', (e) => e.classList.contains('kut')))
await ayt(a, 'B3A', [3, 2])
tek('15 · bayroqcha (3, 2) — Kamvoy «Boshqa katak!», qahramon (4, 2) da', (await muam(a)) === 'kamvoy:Boshqa katak!' && (await hint(a)) === 'Qahramon (4, 2) da to‘xtadi. Dasturni qaytadan sanang: X qancha, Y qancha', await hint(a))
r = await ayt(a, 'B3A', [4, 2], 'B3B'); tek('15 · bayroqcha ko‘chirildi (4, 2) → «Oldindan aytdingiz!» → B3B', r.g === 'Oldindan aytdingiz!' && r.o, r.g)
r = await ayt(a, 'B3B', [4, 1], 'B3C'); tek('15 · (4, 1) → B3C', r.o)
r = await ayt(a, 'B3C', [5, 1], 'B3Y'); tek('15 · go to bilan (5, 1) → B3Y', r.o)
r = await ayt(a, 'B3Y', [2, 2], 'BK'); tek('15 · ★ ikki go to (2, 2) → BK', r.o)
await ekrangacha(l, 'B2B'); await l.reload(); await kut(1500)
tek('15 · Lola sahifani yangiladi — 15-qadam ekraniga qaytdi (B3A)', await ekrangacha(l, 'B3A'))
r = await ayt(l, 'B3A', [4, 2], 'B3B'); tek('15 · Lola 1-pog‘ona', r.o)
await gacha(u, () => /1\/2/.test(document.querySelector('#ust .tugatdi b')?.textContent.replace(/\s/g, '')) && document.querySelectorAll('#ust .pg-k .pg-s b')[0]?.textContent === '2')
tek('15 · doska: «Uch marta oldindan aytdi 1 / 2»; zinapoya 2 · 1 · 1 · 1', (await pogSon()) === '1/2 2 1 1 1', await pogSon())

// ---------- 16: o'qib berish — bola ekrani o'zgarmaydi
await katak(l, 1, 1)
await keyingi(); await kut(2500)
// A·1: bola noutbukida oxirgi yechgan pog'onasi — Lola B3A (bayroqchasi (4, 2) da), Aziz ★ (B3Y, bayroqchasi (2, 2) da)
await ekrangacha(l, 'B3A'); await ekrangacha(a, 'B3Y')
tek('16 · ustoz P11; Lola — B3A bayroqchasi (4, 2) bilan, Aziz — B3Y bayroqchasi (2, 2) bilan; «Dasturingizni ustozga o‘qib bering»', (await id(u)) === 'P11' && (await id(l)) === 'B3A' && (await l.$$('#bol .md-bq.b-bola')).length === 1 && (await l.evaluate(() => document.querySelector('#bol .ekran').dataset.bayroq)) === '4,2' && (await id(a)) === 'B3Y' && (await a.evaluate(() => document.querySelector('#bol .ekran').dataset.bayroq)) === '2,2' && (await hint(l)) === 'Dasturingizni ustozga o‘qib bering', [await id(l), await id(a), await hint(l)].join(' | '))
await qosh(u, ['x', 2, 4], ['x', 5, 1]); await ishga(u)
tek('16 · ustoz o‘qilgan manzillarni qo‘ydi — Coddy sakradi, «Yo‘lingiz tayyor!»', (await hint(u)) === 'Yo‘lingiz tayyor!' && (await matn(u, '#ust .kt-yr text')) === '(5, 1)', await hint(u))

// ---------- 17–18: natija
await keyingi(); await ekrangacha(a, 'B5'); await ekrangacha(l, 'B5')
const son = (p) => p.evaluate((r) => ['katak topdi', 'manzilga bordi', 'marta oldindan aytdi'].map((k) => document.querySelector(r + ' .sn-t[data-k="' + k + '"] b').textContent).join(','), R(p))
// Aziz: katak 1+1+1+2 = 5; go to 1+2+3+4 = 10 (★ da 4 ta blok); oldindan 4. Lola: 1 · 1 · 1
tek('17 · Aziz natijasi: 5 katak, 10 manzil, 4 marta', (await son(a)) === '5,10,4', await son(a))
tek('17 · Aziz yakunida ★ yo‘li: 4 ta punktir, qahramon (6, 4) da', (await a.$$('#bol .kt-il.kt-gl')).length === 4 && (await matn(a, '#bol .kt-yr text')) === '(6, 4)')
tek('17 · Lola natijasi: 1, 1, 1; yo‘li yo‘q', (await son(l)) === '1,1,1' && (await l.$$('#bol .kt-il.kt-gl')).length === 0, await son(l))
tek('17 · yakun: «Siz manzilni bilasiz!», keyingi dars «4 · Hodisalar»', (await matn(u, '#ust .sar')) === 'Siz manzilni bilasiz!' && (await matn(u, '#ust [data-z="keyingi dars"]')).includes('4 · Hodisalar'))
await keyingi(); await kut(1200)
tek('18 · Sinfimiz bugun: 6, 11, 5 (ikki bola yig‘indisi)', (await son(u)) === '6,11,5', await son(u))
await u.click('#ust .hn .asos'); await kut(2500)
tek('18 · «Darsni yakunlash» — ustozda «Dars tugadi!», bolalarda «Dars tugadi. Ko‘rishguncha!»', (await matn(u, '#ust .tugadi-k')).includes('Dars tugadi!') && (await hint(a)).includes('Ko‘rishguncha') && (await hint(l)).includes('Ko‘rishguncha'))
tek('konsolda xato yo‘q', !xato.length, xato.slice(0, 4).join(' | '))
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()
process.exit(ok === jami ? 0 : 1)
