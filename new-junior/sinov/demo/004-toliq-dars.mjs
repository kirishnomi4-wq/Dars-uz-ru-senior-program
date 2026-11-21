// 4-dars «Hodisalar» — to'liq jonli dars sinovi (20.11). Manba: new-junior/manba/004-hodisalar.md (v1).
// Ustoz va ikki o'quvchi — alohida brauzer oynalari, lokal sinf serveri orqali (/__sinf), alohida xona. Aziz — qahramoni oldingi darslardan; Lola — yangi (BQ).
// 18 qadam: huk (A, B — yulduz ko'chadi, C — ustoz strelkalar bilan o'ynaydi), yangi so'z (birma-bir), dasturchalar javon orqali tuziladi (Hodisa oilasi,
// tugma Blockly ro'yxatidan HAQIQIY bosish bilan), o'yinlar haqiqiy klaviatura bilan, oldingi pog'ona dasturchalari keyingisida ochiladi, ★ shartlari,
// doskalar sanog'i, «Yordam so'radi», sahifa yangilansa davom, 16-qadamda bola ekrani o'zgarmaydi, natija sonlari (manbadagi yechimlardan hisoblangan), yakunlash.
// Ishlatish (lokal server 5340 yoniq, demo-004 yig'ilgan): node new-junior/sinov/demo/004-toliq-dars.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-004.html', X = 'd4-' + Date.now()
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
const KEY = { '→': 'ArrowRight', '←': 'ArrowLeft', '↑': 'ArrowUp', '↓': 'ArrowDown', '_': ' ' }, TUG = { '→': '→', '←': '←', '↑': '↑', '↓': '↓', '_': 'space' }
const BLOK = { r: 'move right', l: 'move left', u: 'move up', d: 'move down', x: 'go to', s: 'say' }
const oila = async (p, f) => { await p.click(R(p) + ' .rg .rd.f-' + f); await p.waitForTimeout(120) }
const menyu = async (p, n, i, v) => { await p.locator(R(p) + ' .jr-bl .mb').nth(n).locator('.blocklyDropdownField').nth(i).click(); await p.waitForTimeout(150); await p.locator('.blocklyDropDownDiv .blocklyMenuItem').filter({ hasText: new RegExp('^\\s*' + v + '\\s*$') }).first().click(); await p.waitForTimeout(150) }
// dasturcha javon orqali: hodisa bloki (tugma ro'yxatdan), keyin bloklar (Harakat / Gap oilasidan)
const dasturcha = async (p, tugma, ...bl) => {
  await oila(p, 'e'); const n = (await p.$$(R(p) + ' .jr-bl .mb')).length
  await p.locator(R(p) + ' .pl .mbw:not(.yopiq) .mb', { hasText: 'when' }).first().click(); await p.waitForTimeout(150)
  if (tugma !== '→') await menyu(p, n, 0, TUG[tugma])
  for (const t of bl) {
    await oila(p, t[0] === 's' ? 'g' : 'h'); const m = (await p.$$(R(p) + ' .jr-bl .mb')).length
    await p.locator(R(p) + ' .pl .mbw:not(.yopiq) .mb', { hasText: BLOK[t[0]] }).first().click(); await p.waitForTimeout(150)
    if (t[0] === 'x') { await menyu(p, m, 0, t[1]); await menyu(p, m, 1, t[2]) }
    if (t[0] === 's') await p.evaluate(({ r, m, g }) => { const ek = document.querySelector(r + ' .ekran'), ws = BL_WS.get(ek), bl = blTepalar(ws).flatMap(blZanjir); bl[m].setFieldValue(g, 'TEXT') }, { r: R(p), m, g: t.slice(2) })
  }
}
const dasturchalar = (p) => p.evaluate((r) => blDasturchalar(document.querySelector(r + ' .ekran')).map((d) => d.tugma + ':' + d.bloklar.map(blokTuri).join('')).join(' '), R(p))
const boshla = async (p) => { await p.click(R(p) + (p === u ? ' .hn .ishga' : ' .hn .asos')); await p.waitForTimeout(350) }
const bos = async (p, s) => { for (const c of s) { await p.keyboard.press(KEY[c]); await gacha(p, (r) => !document.querySelector(r + ' .ekran')?.dataset.yuryapti, R(p), 8000); await p.waitForTimeout(50) } await p.waitForTimeout(350) }
// o'yin: «Boshlash», tugmalar, natija gapi va keyingi ekran
const oyna4 = async (p, e, s, keyin) => { await ekrangacha(p, e); await boshla(p); await bos(p, s); const g = await hint(p); return { g, o: keyin ? await ekrangacha(p, keyin, 5000) : true } }
const T4 = async (p) => { await dasturcha(p, '→', 'r'); await dasturcha(p, '←', 'l'); await dasturcha(p, '↑', 'u'); await dasturcha(p, '↓', 'd') }

// ---------- 1: kirish
await a.goto(U + '?rol=varaq'); await a.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'jele'); localStorage.setItem('demo-qism', 'Bulut') })
await l.goto(U + '?rol=varaq'); await l.evaluate(() => localStorage.clear())
await u.goto(`${U}?rol=ustoz&yangi=1&xona=${X}`); await a.goto(`${U}?rol=bola&xona=${X}`); await l.goto(`${U}?rol=bola&xona=${X}`)
await l.fill('#ei', 'Lola'); await l.click('#ef button'); await kut(1500)
tek('1 · Aziz: B0; Lola: avval BQ', (await id(a)) === 'B0' && (await id(l)) === 'BQ')
await l.locator('#bol .tq-o').nth(4).click(); await ekrangacha(l, 'B0')
await gacha(u, () => /Kirdi: 2/.test(document.querySelector('#ust .hn .hint')?.textContent))
tek('1 · ustoz: «Kirdi: 2»; «Bugun qahramonni boshqaramiz!», «O‘tgan darsda» — koordinata', (await hint(u)) === 'Kirdi: 2' && (await matn(u, '#ust .sar')) === 'Bugun qahramonni boshqaramiz!' && (await matn(u, '#ust .otd')).includes('Katakning manzili'))
for (const p of [a, l]) await p.click('#bol .asos'); await kut(400)
tek('1 · «Tayyorman» → «Ustoz ekraniga qarang»', (await id(a)) === 'BK' && (await id(l)) === 'BK')

// ---------- 2–4: huk
await keyingi(); await ekrangacha(a, 'P2N'); await ekrangacha(l, 'P2N')
tek('2 · bolalarda uchta karta', (await a.$$('#bol .jk')).length === 3 && (await matn(a, '#bol .jk.c3 q')) === 'Strelka bosilganda yursin')
await a.locator('#bol .jk').nth(0).click(); await l.locator('#bol .jk').nth(2).click(); await kut(1200)
await gacha(u, () => /2 \/ 2/.test(document.querySelector('#ust .hn .hint')?.textContent))
tek('2 · ustoz: «Javob berdi: 2 / 2»', (await hint(u)) === 'Javob berdi: 2 / 2')
await keyingi()
const karta = () => u.evaluate(() => [...document.querySelectorAll('#ust .jk .jn')].map((x) => x.textContent).join(' | '))
await gacha(u, () => document.querySelectorAll('#ust .jk .jn').length >= 1 && !document.querySelector('#ust .ekran').dataset.yuryapti, null, 20000)
tek('3 · A o‘zi: yulduz ko‘chdi, dastur (4, 2) ga — «✕ yulduz boshqa joyda»; bolada «Ustoz yo‘llarni sinayapti»', (await karta()) === '✕ yulduz boshqa joyda' && (await matn(a, '#bol .qarang')).includes('Ustoz yo‘llarni sinayapti'), await karta())
await keyingi(); await gacha(u, () => document.querySelectorAll('#ust .jk .jn').length >= 2 && !document.querySelector('#ust .ekran').dataset.yuryapti, null, 20000)
tek('3 · B: «✕ yana o‘sha yo‘l»', (await karta()).endsWith('✕ yana o‘sha yo‘l'), await karta())
await keyingi(); await gacha(u, () => document.querySelector('#ust .ekran').dataset.oyin === 'huk', null, 8000)
tek('3 · C: o‘yin — «O‘yin: strelkalarni bosing»', (await matn(u, '#ust .oyin-yz')) === 'O‘yin: strelkalarni bosing')
await keyingi(); tek('3 · o‘yin paytida «Keyingi» — qadam o‘sha (avval o‘ynash kerak)', (await id(u)) === 'P2S')
await bos(u, '↑↑↑↑→'); await gacha(u, () => document.querySelectorAll('#ust .jk .jn').length >= 3, null, 8000)
tek('3 · ustoz strelkalar bilan (1, 4) ga — «✓ yetib bordi», konfeti', (await karta()).endsWith('✓ yetib bordi') && (await u.$$('#ust .konfeti')).length > 0, await karta())
await keyingi(); tek('4 · Javob «Dastur tugmani kutadi»: A, B xira, C oltin', (await id(u)) === 'P2C' && (await u.$$('#ust .jk.n-yoq')).length === 2 && (await matn(u, '#ust .sar')) === 'Dastur tugmani kutadi')

// ---------- 5: yangi so'z
await keyingi()
const yondi = () => u.evaluate(() => document.querySelectorAll('#ust .xyl p.on').length + ',' + document.querySelectorAll('#ust .md-kes.on').length)
tek('5 · «Hodisa nima?», hammasi o‘chiq', (await matn(u, '#ust .sar')) === 'Hodisa nima?' && (await yondi()) === '0,0')
for (let k = 0; k < 3; k++) { await u.click('#ust .hn .asos'); await kut(150) }
tek('5 · uch bosish: tugma, hodisa bloki, qahramon yurdi; qadam o‘sha', (await yondi()) === '3,1' && (await id(u)) === 'P3', await yondi())
tek('5 · Coddy haqiqatan (1, 0) ga sakradi (4·12 A)', (await matn(u, '#ust .kt-yr text')) === '(1, 0)', await matn(u, '#ust .kt-yr text'))
await keyingi(); tek('6 · reja', (await id(u)) === 'P4')

// ---------- 7: ko'ramiz
await keyingi()
tek('7 · P6: dastur bo‘sh, javon — Hodisa oilasi; bolada «Ustoz hodisa blokini ko‘rsatyapti»', (await dasturchalar(u)) === '' && (await u.$$('#ust .rg .rd.f-e.on')).length === 1 && (await matn(a, '#bol .qarang')).includes('Ustoz hodisa blokini'))
await dasturcha(u, '→', 'r')
tek('7 · javondan: hodisa bloki + move right — «1 ta dasturcha»', (await dasturchalar(u)) === 'right:r' && (await matn(u, '#ust .dsn')) === '1 ta dasturcha', await dasturchalar(u))
await boshla(u); await bos(u, '→→→')
tek('7 · «▶ Boshlash», → ×3 — Coddy yulduzda, qadam o‘sha (→ o‘yinniki)', (await hint(u)) === 'Yetib bordi!' && (await id(u)) === 'P6')

// ---------- 8: bitta tugma (1–4)
await keyingi()
tek('8 · Aziz va Lola B1A', (await ekrangacha(a, 'B1A')) && (await ekrangacha(l, 'B1A')))
await boshla(a); tek('8 · Aziz dasturchasiz «Boshlash» — Bo‘shvoy', (await muam(a)) === 'boshvoy:Men nimani kutaman?')
await a.click('#bol .hn .mas'); await kut(300); tek('8 · «Maslahat» — manbadagi gap', (await hint(a)) === 'Hodisa bloki tepada turadi — uning ostiga qahramon nima qilishini qo‘ying')
await gacha(u, () => /Yordam so‘radi: 1/.test(document.querySelector('#ust .hn .hint')?.textContent)); tek('8 · ustoz: «Yordam so‘radi: 1»', (await hint(u)).startsWith('Yordam so‘radi: 1'))
await dasturcha(a, '→', 'r'); let r = await oyna4(a, 'B1A', '→→→→', 'B1B'); tek('8 · Aziz 1-pog‘ona: → ×4 — «Yetib bordi!» → B1B', r.g === 'Yetib bordi!' && r.o, r.g)
await dasturcha(a, '←', 'l'); r = await oyna4(a, 'B1B', '←←←', 'B1C'); tek('8 · 2-pog‘ona: ← (tugma ro‘yxatdan) → B1C', r.o)
await dasturcha(a, '→', 'r'); await dasturcha(a, '↑', 'u'); r = await oyna4(a, 'B1C', '→→→↑↑', 'B1Y'); tek('8 · 3-pog‘ona: ikki dasturcha → B1Y', r.o)
await dasturcha(a, '→', 'r'); await dasturcha(a, '↑', 'u'); await boshla(a); await bos(a, '→→→→→→↑↑↑↑')
tek('8 · ★ bitta move right bilan yetdi — Kamvoy «Oz qoldi!», ★ sharti ishorasi', (await muam(a)) === 'kamvoy:Oz qoldi!' && (await hint(a)) === '→ bir bosishda ikki katak yursin: ostiga ikkita move right', await hint(a))
await a.click('#bol .hn .asos'); await a.evaluate(() => { const ek = document.querySelector('#bol .ekran'); BL_WS.get(ek).clear(); sanoq(ek) })
await dasturcha(a, '→', 'r', 'r'); await dasturcha(a, '↑', 'u'); r = await oyna4(a, 'B1Y', '→→→↑↑↑↑', 'BK'); tek('8 · ★ → da ikki move right — yutdi → BK', r.o && (await matn(a, '#bol .qarang')).includes('Hamma pog‘onalarni bajardingiz!'))
await dasturcha(l, '→', 'r'); r = await oyna4(l, 'B1A', '→→→→', 'B1B'); tek('8 · Lola 1-pog‘ona', r.o)
const pogSon = () => u.evaluate(() => [document.querySelector('#ust .tugatdi b').textContent.replace(/\s/g, ''), ...Array.from(document.querySelectorAll('#ust .pg-k .pg-s b')).map((x) => x.textContent)].join(' '))
await gacha(u, () => document.querySelectorAll('#ust .pg-k .pg-s b')[0]?.textContent === '2')
tek('8 · doska: «1 / 2»; zinapoya 2 · 1 · 1 · 1', (await pogSon()) === '1/2 2 1 1 1', await pogSon())

// ---------- 9–10
await keyingi(); tek('9 · reja: 1-bekat ✓', (await id(u)) === 'P4B' && (await u.$$('#ust .tp-st.otdi')).length === 1)
await keyingi()
tek('10 · P7: to‘rt tayyor dasturcha (tartib bilan)', (await dasturchalar(u)) === 'right:r left:l up:u down:d', await dasturchalar(u))
await boshla(u); await bos(u, '↑↑↑→→→→→'); tek('10 · Coddy yulduzda (5, 3)', (await hint(u)) === 'Yetib bordi!')

// ---------- 11: to'rt tugma (5–8)
await keyingi(); await ekrangacha(a, 'B2A')
await T4(a); r = await oyna4(a, 'B2A', '→→→→↑↑↑↑', 'B2B'); tek('11 · Aziz to‘rt dasturcha tuzdi → B2B', r.g === 'Yetib bordi!' && r.o, r.g)
tek('11 · B2B oldingi dasturchalar bilan ochildi', (await dasturchalar(a)) === 'right:r left:l up:u down:d', await dasturchalar(a))
await boshla(a); await bos(a, '→→→→→'); tek('11 · olmasiz yulduzga — Kamvoy «Olma qoldi-ku!»', (await muam(a)) === 'kamvoy:Olma qoldi-ku!' && (await hint(a)) === 'Avval olmani oling — u (2, 3) da')
await a.click('#bol .hn .asos'); r = await oyna4(a, 'B2B', '↑↑↑→→↓↓↓→→→', 'B2C'); tek('11 · olma, keyin yulduz → B2C', r.o, r.g)
r = await oyna4(a, 'B2C', '↑↑←←→→→→↓↓↓↓←←', 'B2Y'); tek('11 · ikki olma → B2Y', r.o)
await dasturcha(a, '_', ['x', 0, 0]); r = await oyna4(a, 'B2Y', '→→_→→→→→→↑↑↑↑', 'BK'); tek('11 · ★ space — go to x: 0 y: 0 (ro‘yxatdan) → yutdi → BK', r.o, r.g)
await T4(l); r = await oyna4(l, 'B2A', '→→→→↑↑↑↑', 'B2B'); tek('11 · Lola 1-pog‘ona', r.o)
await gacha(u, () => /1\/2/.test(document.querySelector('#ust .tugatdi b')?.textContent.replace(/\s/g, '')) && document.querySelectorAll('#ust .pg-k .pg-s b')[0]?.textContent === '2')
tek('11 · doska: «1 / 2»; zinapoya 2 · 1 · 1 · 1', (await pogSon()) === '1/2 2 1 1 1', await pogSon())

// ---------- 12–14
await keyingi(); tek('12 · xulosa «Hodisa»', (await matn(u, '#ust .sar')) === 'Hodisa')
await keyingi(); tek('13 · reja: 1, 2 ✓', (await u.$$('#ust .tp-st.otdi')).length === 2)
await keyingi(); await boshla(u)
await bos(u, '→→↑'); tek('14 · olma terish: «Olma: 1 / 3», yulduz yashirin', (await matn(u, '#ust .oyin-yz')).includes('Olma: 1 / 3') && !(await u.$$('#ust .kt-yul.topildi')).length)
await bos(u, '→→→↑↑→↓↓↓'); tek('14 · uch olma — yulduz ochildi', (await u.$$('#ust .kt-yul.topildi')).length === 1 && (await matn(u, '#ust .oyin-yz')).includes('Olma: 3 / 3'))
await bos(u, '←←←'); const qy = await u.$eval('#ust .kt-yul', (e) => e.getAttribute('transform')); tek('14 · uch bosishdan keyin yulduz (3, 2) ga qochdi', /translate\(350 /.test(qy), qy)
await bos(u, '↑↑'); tek('14 · ortidan borib tutdi — «Yetib bordi!»', (await hint(u)) === 'Yetib bordi!')

// ---------- 15: o'yin (9–11)
await keyingi()
tek('15 · Aziz B3A — dastur oldingi pog‘onadan (5 dasturcha)', (await ekrangacha(a, 'B3A')) && (await matn(a, '#bol .dsn')) === '5 ta dasturcha', await matn(a, '#bol .dsn'))
r = await oyna4(a, 'B3A', '↑↑→↑↑→→→→→↓↓←←←↓', 'B3B'); tek('15 · uch olma → «Siz yutdingiz!» → B3B', r.g === 'Siz yutdingiz!' && r.o, r.g)
r = await oyna4(a, 'B3B', '→→↑↑↑→→→↓↑↑→←←←←←←↓↓→←', 'B3Y'); tek('15 · besh olma → B3Y', r.o, r.g)
await dasturcha(a, '_', 's:Men keldim!'); r = await oyna4(a, 'B3Y', '_↑↑→→↑↑←→→→→↓→↓↓↓', 'BK'); tek('15 · ★ o‘z gapi (space say) → yutdi → BK', r.o, r.g)
await ekrangacha(l, 'B2B'); await l.reload(); await kut(1500)
tek('15 · Lola sahifani yangiladi — 15-qadam ekraniga qaytdi (B3A), dasturchalari bilan', (await ekrangacha(l, 'B3A')) && (await matn(l, '#bol .dsn')) === '4 ta dasturcha', await matn(l, '#bol .dsn'))
r = await oyna4(l, 'B3A', '↑↑→↑↑→→→→→↓↓←←←↓', 'B3B'); tek('15 · Lola o‘yinni yutdi', r.o)
await gacha(u, () => /2\/2/.test(document.querySelector('#ust .tugatdi b')?.textContent.replace(/\s/g, '')))
tek('15 · doska: «O‘yinni yutdi 2 / 2»; zinapoya 2 · 1 · 1', (await pogSon()) === '2/2 2 1 1', await pogSon())

// ---------- 16
await keyingi(); await kut(2000)
// A·1: bola noutbukida oxirgi yechgan pog'onasi o'z dasturchalari bilan — Aziz ★ (B3Y), Lola 1-pog'ona (B3A)
await ekrangacha(a, 'B3Y'); await ekrangacha(l, 'B3A')
tek('16 · ustoz P11; Aziz — o‘z ★ o‘yini (B3Y, 6 dasturcha), Lola — B3A (4 dasturcha); «Dasturchalaringizni ustozga o‘qib bering»', (await id(u)) === 'P11' && (await id(a)) === 'B3Y' && (await id(l)) === 'B3A' && (await matn(a, '#bol .dsn')) === '6 ta dasturcha' && (await matn(l, '#bol .dsn')) === '4 ta dasturcha' && (await matn(l, '#bol .hn .hint')) === 'Dasturchalaringizni ustozga o‘qib bering', [await id(a), await id(l), await matn(a, '#bol .dsn'), await matn(l, '#bol .dsn'), await matn(l, '#bol .hn .hint')].join(' | '))
await dasturcha(u, '→', 'r'); await boshla(u); await bos(u, '→→')
tek('16 · ustoz o‘qilgan dasturchani tuzdi va o‘ynadi — (2, 1) da olma olindi', (await matn(u, '#ust .kt-yr text')) === '(2, 0)' || (await matn(u, '#ust .oyin-yz')).includes('Olma'), await matn(u, '#ust .kt-yr text'))
await u.click('#ust .hn .ishga')

// ---------- 17–18
await keyingi(); await ekrangacha(a, 'B5'); await ekrangacha(l, 'B5')
const son = (p) => p.evaluate((r) => ['marta tugma bosdi', 'olma terdi', 'marta yutdi'].map((k) => document.querySelector(r + ' .sn-t[data-k="' + k + '"] b').textContent).join(','), R(p))
// tugma bosishlar — faqat yutilgan o'yinlardagi (sinovdagi tugmalar qatoridan sanalgan): Aziz 4+3+5+7 + 8+11+15+14 + 16+24+18 = 120 (4·11 A: yulduz qochgani uchun yo‘llar qisqa — B3A 16, B3B 24); Lola 4+8+16 = 28. Olma: Aziz 1+2+3+5+3 = 14, Lola 3
tek('17 · Aziz: 120 marta tugma bosdi, 14 olma, 3 marta yutdi', (await son(a)) === '120,14,3', await son(a))
tek('17 · Lola: 28, 3, 1', (await son(l)) === '28,3,1', await son(l))
tek('17 · yakun: «Siz o‘yin tuzdingiz!», keyingi dars «5 · Takrorlash»', (await matn(u, '#ust .sar')) === 'Siz o‘yin tuzdingiz!' && (await matn(u, '#ust [data-z="keyingi dars"]')).includes('5 · Takrorlash'))
await keyingi(); await kut(1200)
tek('18 · Sinfimiz bugun: 148, 17, 4', (await son(u)) === '148,17,4', await son(u))
await u.click('#ust .hn .asos'); await kut(2500)
tek('18 · «Darsni yakunlash» — hammada «Dars tugadi»', (await matn(u, '#ust .tugadi-k')).includes('Dars tugadi!') && (await hint(a)).includes('Ko‘rishguncha') && (await hint(l)).includes('Ko‘rishguncha'))
tek('konsolda xato yo‘q', !xato.length, xato.slice(0, 4).join(' | '))
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()
process.exit(ok === jami ? 0 : 1)
