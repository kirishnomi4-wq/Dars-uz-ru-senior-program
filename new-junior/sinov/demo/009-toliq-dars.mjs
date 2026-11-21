// 9-dars «Labirint o‘yini 1» — to'liq jonli dars sinovi (20.11). Manba: new-junior/manba/009-labirint-oyini-1.md (v1.1, tavsiya bo'yicha).
// Ustoz va ikki o'quvchi — alohida brauzer oynalari, lokal sinf serveri orqali (/__sinf), alohida xona. Aziz — qahramoni oldingi darslardan; Lola — yangi (BQ).
// 18 qadam: huk («O‘ynab ko‘rsat», uch karta o'zi o'ynaladi), javob o'yini (dasturi ko'rinmaydi), yangi so'z (birma-bir), ustoz dasturchalarni javon orqali
// tuzadi va if ni HAQIQIY bosishlar bilan qo'yadi (hodisa blokini tanlash, ✕, tomon ro'yxatdan), o'yinlar haqiqiy klaviatura bilan, urilganda o'yin to'xtaydi,
// dastur pog'onadan pog'onaga (if ichidagilari bilan), pog'ona shartlari, chek-list, doskalar sanog'i, 16-qadam (A·1), natija sonlari, yakunlash.
// Ishlatish (lokal server 5340 yoniq, demo-009 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/demo/009-toliq-dars.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-009.html', X = 'd9-' + Date.now()
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
const joy = (p) => matn(p, R(p) + ' .kt-yr text')
const tinch = (p) => gacha(p, (r) => !document.querySelector(r + ' .ekran')?.dataset.yuryapti, R(p), 20000)
const KEY = { '→': 'ArrowRight', '←': 'ArrowLeft', '↑': 'ArrowUp', '↓': 'ArrowDown', '_': ' ' }, TUG = { '→': '→', '←': '←', '↑': '↑', '↓': '↓', '_': 'space' }
const BLOK = { r: 'move right', l: 'move left', u: 'move up', d: 'move down' }, YT = { '→': 'r', '←': 'l', '↑': 'u', '↓': 'd' }
const oila = async (p, f) => { await p.click(R(p) + ' .rg .rd.f-' + f); await p.waitForTimeout(120) }
const menyu = async (p, loc, v) => { await loc.locator('.blocklyDropdownField').first().click(); await p.waitForTimeout(150); await p.locator('.blocklyDropDownDiv .blocklyMenuItem').filter({ hasText: new RegExp('^\\s*' + v + '\\s*$') }).first().click(); await p.waitForTimeout(200) }
const jav = (p, nom) => p.locator(R(p) + ' .pl .mbw:not(.yopiq) .mb', { hasText: nom }).first().click().then(() => p.waitForTimeout(200))
// dasturcha javon orqali: hodisa bloki (tugma ro'yxatdan), ostiga o'sha tomonga move
const dasturcha = async (p, s) => {
  await oila(p, 'e'); const n = (await p.$$(R(p) + ' .jr-bl .mb[data-tur="k"]')).length
  await jav(p, 'when'); await p.waitForTimeout(450) /* qayta joylash (studiya.js labJoyKuzat, 0,12 s) tugasin */; if (s !== '→') await menyu(p, p.locator(R(p) + ' .jr-bl .mb[data-tur="k"]').nth(n), TUG[s])
  await oila(p, 'h'); await jav(p, BLOK[YT[s]])
}
// tez yo'l (dvigatel funksiyasi bilan — javon yo'li dasturcha() va labirint.mjs da sinalgan): { '→': qoida?, … }
const QOIDA = { '→': 1, '←': 1, '↑': 1, '↓': 1 }
const qur = (p, d, qosh = {}) => p.evaluate(({ r, d, qosh }) => { const T = { '→': 'right', '←': 'left', '↑': 'up', '↓': 'down' }, M = { '→': 'r', '←': 'l', '↑': 'u', '↓': 'd' }; DARS.oyinlar.__t = Object.entries(d).map(([s, q]) => [T[s], q ? [{ t: 'a', yon: T[s], ichki: [{ t: M[s] }, ...(qosh[s] || [])] }] : [{ t: M[s] }]]).concat(qosh._ ? [['space', qosh._]] : []); labQur(document.querySelector(r + ' .ekran'), '__t') }, { r: R(p), d, qosh })
const tuzilish = (p) => p.evaluate((r) => { const ws = BL_WS.get(document.querySelector(r + ' .ekran')), y = { right: '→', left: '←', up: '↑', down: '↓', space: '_' }, t = { move_right: '→', move_left: '←', move_up: '↑', move_down: '↓' }; const z = (b) => (b.type === 'if_path' ? 'if' + y[b.getFieldValue('YON')] + '[' + blZanjir(b.getInputTargetBlock('DO')).map(z).join(' ') + ']' : t[b.type] || b.type); return ws.getTopBlocks(false).map((h) => 'W' + y[h.getFieldValue('KEY')] + '[' + blZanjir(h).slice(1).map(z).join(' ') + ']').join(' ') }, R(p))
const boshla = async (p) => { await p.click(R(p) + (p === u ? ' .hn .ishga' : ' .hn .asos')); await p.waitForTimeout(350) }
const bos = async (p, s) => { for (const c of s) { await p.keyboard.press(KEY[c]); await p.waitForTimeout(40); await tinch(p) } await p.waitForTimeout(350) }
const oyna9 = async (p, e, s, keyin) => { await ekrangacha(p, e); await boshla(p); await bos(p, s); const g = await hint(p); return { g, o: keyin ? await ekrangacha(p, keyin, 5000) : true } }
const chek = (p) => p.evaluate((r) => [...document.querySelectorAll(r + ' .pl .chek .ch-r')].map((x) => (x.classList.contains('ok') ? '✓' : '·')).join(''), R(p))
const pogSon = () => u.evaluate(() => [document.querySelector('#ust .tugatdi b').textContent.replace(/\s/g, ''), ...Array.from(document.querySelectorAll('#ust .pg-k .pg-s b')).map((x) => x.textContent)].join(' '))
// manba yechimlari
const Y = { N: '→→↑↑→→→', B1: '→→→→→', B2: '→→↑→↑↑↑→', B3: '→↑↑→→↓↓→→', BY: '→→→→→↑↑←←←←↑↑→→→→→↓', Q1: '→↑↑→→↑↑→→→', Q2: '→→→→↑↑←←←←↑↑', Q3B: '→↑↑←↑↑↑↓↓→→↑↑→→↓↓→→↑↑', QY: '↑↑→↑↑→→↓↓→→↓→', K1: '→→↑↑→→→→', D1: '→↑↑↑↓↓↓→→↑↑→→→↑↑' }

// ---------- 1: kirish
await a.goto(U + '?rol=varaq'); await a.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'jele'); localStorage.setItem('demo-qism', 'Bulut') })
await l.goto(U + '?rol=varaq'); await l.evaluate(() => localStorage.clear())
await u.goto(`${U}?rol=ustoz&yangi=1&xona=${X}`); await a.goto(`${U}?rol=bola&xona=${X}`); await l.goto(`${U}?rol=bola&xona=${X}`)
await l.fill('#ei', 'Lola'); await l.click('#ef button'); await kut(1500)
tek('1 · Aziz: B0; Lola: avval BQ', (await id(a)) === 'B0' && (await id(l)) === 'BQ')
await l.locator('#bol .tq-o').nth(4).click(); await ekrangacha(l, 'B0')
await gacha(u, () => /Kirdi: 2/.test(document.querySelector('#ust .hn .hint')?.textContent))
tek('1 · ustoz: «Kirdi: 2»; «Bugun labirint o‘yini yasaymiz!», «O‘tgan darsda» — shart', (await hint(u)) === 'Kirdi: 2' && (await matn(u, '#ust .sar')) === 'Bugun labirint o‘yini yasaymiz!' && (await matn(u, '#ust .otd')).includes('Ha bo‘lsa, ichidagisi bajariladi'), await matn(u, '#ust .sar'))
for (const p of [a, l]) await p.click('#bol .asos'); await kut(400)
tek('1 · «Tayyorman» → «Ustoz ekraniga qarang»', (await id(a)) === 'BK' && (await id(l)) === 'BK')

// ---------- 2–4: huk
await keyingi(); await ekrangacha(a, 'P2N'); await ekrangacha(l, 'P2N')
tek('2 · bolalarda uchta karta, jonli darsda «O‘ynab ko‘rsat» yo‘q', (await a.$$('#bol .jk')).length === 3 && (await matn(a, '#bol .jk.c3 q')) === 'Yurishdan oldin tekshirsin' && !(await a.$('#bol .so-t')))
await u.click('#ust .hn .so-t'); await kut(300); await tinch(u); await kut(300)
tek('2 · ustoz «O‘ynab ko‘rsat» — 7-bosishda Coddy (4, 2) da urildi, To‘siqvoy «Devor!»', (await muam(u)) === 'tosiqvoy:Devor!' && (await joy(u)) === '(4, 2)', (await muam(u)) + ' ' + (await joy(u)))
await a.locator('#bol .jk').nth(0).click(); await l.locator('#bol .jk').nth(2).click(); await kut(1200)
await gacha(u, () => /2 \/ 2/.test(document.querySelector('#ust .hn .hint')?.textContent))
tek('2 · ustoz: «Javob berdi: 2 / 2»', (await hint(u)) === 'Javob berdi: 2 / 2')
await keyingi()
const karta = () => u.evaluate(() => [...document.querySelectorAll('#ust .jk .jn')].map((x) => x.textContent).join(' | '))
await gacha(u, () => document.querySelectorAll('#ust .jk .jn').length >= 1 && !document.querySelector('#ust .ekran').dataset.yuryapti, null, 30000)
tek('3 · A o‘zi: devorlar kam — «✕ baribir urildi»; bolada «Ustoz o‘yinlarni sinayapti»', (await karta()) === '✕ baribir urildi' && (await matn(a, '#bol .qarang')).includes('Ustoz o‘yinlarni sinayapti'), await karta())
await keyingi(); await gacha(u, () => document.querySelectorAll('#ust .jk .jn').length >= 2 && !document.querySelector('#ust .ekran').dataset.yuryapti, null, 30000)
tek('3 · B: «✕ ↑ kerak joyda yurmadi»', (await karta()).endsWith('✕ ↑ kerak joyda yurmadi'), await karta())
await keyingi(); await gacha(u, () => document.querySelectorAll('#ust .jk .jn').length >= 3 && !document.querySelector('#ust .ekran').dataset.yuryapti, null, 30000)
tek('3 · C: «✓ adashsa ham yutdi», konfeti', (await karta()).endsWith('✓ adashsa ham yutdi') && (await u.$$('#ust .konfeti')).length > 0, await karta())
await keyingi(); tek('4 · javob «Yo‘l bo‘lsa — yuradi»: A, B xira, C oltin', (await id(u)) === 'P2C' && (await u.$$('#ust .jk.n-yoq')).length === 2 && (await matn(u, '#ust .sar')) === 'Yo‘l bo‘lsa — yuradi')
await u.click('#ust .hn .so-t'); await kut(300); await bos(u, '↑')
tek('4 · «▶ Boshlash», startda ↑ — Coddy turdi, o‘yin davom etadi', (await joy(u)) === '(0, 0)' && (await matn(u, '#ust .oyin-yz')) === 'O‘yin: strelkalarni bosing')
await bos(u, '→↑→→↑→→↑↑→'); tek('4 · keyin yutdi — «Siz yutdingiz!»', (await hint(u)) === 'Siz yutdingiz!')

// ---------- 5: yangi so'z
await keyingi()
const yondi = () => u.evaluate(() => document.querySelectorAll('#ust .xyl .xq.on').length)
tek('5 · «Qoida nima?», hammasi o‘chiq', (await matn(u, '#ust .sar')) === 'Qoida nima?' && (await yondi()) === 0)
for (let k = 0; k < 3; k++) { await u.click('#ust .hn .asos'); await kut(200) }
tek('5 · uch bosish — uch qator yondi, Coddy (1, 0) ga sakradi; qadam o‘sha', (await yondi()) === 3 && (await joy(u)) === '(1, 0)' && (await id(u)) === 'P3', (await yondi()) + ' ' + (await joy(u)))
await keyingi(); tek('6 · reja', (await id(u)) === 'P4')

// ---------- 7: ko'ramiz — labirintda strelkalar
await keyingi()
tek('7 · P6: dastur bo‘sh, javonda to‘rt oila; bolada «Ustoz boshqaruvni ko‘rsatyapti»', (await tuzilish(u)) === '' && (await u.$$('#ust .rg .rd')).length === 4 && (await matn(a, '#bol .qarang')).includes('Ustoz boshqaruvni'))
await dasturcha(u, '→'); await dasturcha(u, '↑')
tek('7 · javondan: W→[→] W↑[↑], «2 ta dasturcha», «4 / 16 ta blok»', (await tuzilish(u)) === 'W→[→] W↑[↑]' && (await matn(u, '#ust .dsn')) === '2 ta dasturcha\n4 / 16 ta blok', (await tuzilish(u)) + ' ' + (await matn(u, '#ust .dsn')))
await boshla(u); await bos(u, '↑')
tek('7 · startda ↑ — urildi: To‘siqvoy, «O‘yin to‘xtadi. Qaytadan — «▶ Boshlash»», o‘yin to‘xtadi', (await muam(u)) === 'tosiqvoy:Devor!' && (await hint(u)) === 'O‘yin to‘xtadi. Qaytadan — «▶ Boshlash»' && !(await u.$('#ust .oyin-yz')))
await boshla(u); await bos(u, Y.N); tek('7 · qayta — → → ↑ ↑ → → → — «Siz yutdingiz!»; qadam o‘sha', (await hint(u)) === 'Siz yutdingiz!' && (await id(u)) === 'P6')

// ---------- 8: boshqaruv (1–4)
await keyingi()
tek('8 · Aziz va Lola B1A, «0 ta dasturcha»', (await ekrangacha(a, 'B1A')) && (await ekrangacha(l, 'B1A')) && (await matn(a, '#bol .dsn')).startsWith('0 ta dasturcha'))
await boshla(a); tek('8 · dasturchasiz «Boshlash» — Bo‘shvoy «Men nimani kutaman?»', (await muam(a)) === 'boshvoy:Men nimani kutaman?')
await a.click('#bol .hn .mas'); await kut(300); tek('8 · «Maslahat» — manbadagi gap', (await hint(a)) === 'Yulduz qaysi tomonda? O‘sha strelkaga dasturcha tuzing')
await gacha(u, () => /Yordam so‘radi: 1/.test(document.querySelector('#ust .hn .hint')?.textContent)); tek('8 · ustoz: «Yordam so‘radi: 1»', (await hint(u)).startsWith('Yordam so‘radi: 1'))
await dasturcha(a, '→'); let r = await oyna9(a, 'B1A', Y.B1, 'B1B'); tek('8 · Aziz 1-pog‘ona: → ×5 — «Siz yutdingiz!» → B1B', r.g === 'Siz yutdingiz!' && r.o, r.g)
tek('8 · B1B oldingi dastur bilan ochildi (W→[→])', (await tuzilish(a)) === 'W→[→]', await tuzilish(a))
await boshla(a); await bos(a, '→→↑'); tek('8 · ↑ ning dasturchasi yo‘q — Bo‘shvoy «Bu tugma uchun dasturcha yo‘q-ku…»', (await muam(a)) === 'boshvoy:Bu tugma uchun dasturcha yo‘q-ku…')
await a.click('#bol .hn .asos'); await dasturcha(a, '↑'); r = await oyna9(a, 'B1B', Y.B2, 'B1C'); tek('8 · 2-pog‘ona: + ↑ → B1C', r.o, r.g)
await dasturcha(a, '↓'); r = await oyna9(a, 'B1C', Y.B3, 'B1Y'); tek('8 · 3-pog‘ona: + ↓ → B1Y', r.o, r.g)
await dasturcha(a, '←'); r = await oyna9(a, 'B1Y', Y.BY, 'BK'); tek('8 · ★: + ← , 19 bosish → BK «Hamma pog‘onalarni bajardingiz!»', r.o && (await matn(a, '#bol .qarang')).includes('Hamma pog‘onalarni bajardingiz!'), r.g)
await dasturcha(l, '→'); r = await oyna9(l, 'B1A', Y.B1, 'B1B'); tek('8 · Lola 1-pog‘ona', r.o)
await gacha(u, () => document.querySelectorAll('#ust .pg-k .pg-s b')[0]?.textContent === '2')
tek('8 · doska: «1 / 2»; zinapoya 2 · 1 · 1 · 1', (await pogSon()) === '1/2 2 1 1 1', await pogSon())

// ---------- 9–10: ko'ramiz — qoida (ustoz if ni haqiqiy bosishlar bilan qo'yadi)
await keyingi(); tek('9 · reja: 1-bekat ✓', (await id(u)) === 'P4B' && (await u.$$('#ust .tp-st.otdi')).length === 1)
await keyingi()
tek('10 · P7: tayyor W→[→] W↑[↑]; bolada «Ustoz qoida qo‘shyapti»', (await tuzilish(u)) === 'W→[→] W↑[↑]' && (await matn(a, '#bol .qarang')).includes('Ustoz qoida qo‘shyapti'), await tuzilish(u))
await boshla(u); await bos(u, '→↑↑→')
tek('10 · →↑↑→ — urildi, «Bu blok yo‘lni tekshirmay yurdi. Yurishdan oldin tekshiring»', (await muam(u)) === 'tosiqvoy:Devor!' && (await hint(u)) === 'Bu blok yo‘lni tekshirmay yurdi. Yurishdan oldin tekshiring', await hint(u))
const blk = (p, tur, n) => p.locator(R(p) + ` .jr-bl .mb[data-tur="${tur}"]`).nth(n)
// blokni tugmasi bo'yicha topish (Blockly o'chirish/tanlashdan keyin SVG tartibini o'zgartiradi — tartib raqami ishonchsiz): hodisa bloki va uning dasturchasidagi blok
const bid = async (p, tugma, tur) => { const i = await p.evaluate(({ r, tugma, tur }) => { const ws = BL_WS.get(document.querySelector(r + ' .ekran')), h = ws.getTopBlocks(false).find((x) => x.getFieldValue('KEY') === tugma); if (!tur) return h.id; const all = h.getDescendants(false); const x = all.find((c) => c.type === tur); return x && x.id }, { r: R(p), tugma, tur }); return p.locator(R(p) + ` .jr-bl [data-id="${i}"]`).first() }
await (await bid(u, 'right', 'move_right')).click({ position: { x: 12, y: 8 } }); await kut(200); await u.click('#ust .jr-bl .bl-x'); await kut(300)
await (await bid(u, 'right')).click({ position: { x: 14, y: 22 } }); await kut(200); await oila(u, 'a'); await jav(u, 'if path'); await oila(u, 'h'); await jav(u, 'move right')
tek('10 · move right ✕, hodisa bloki tanlandi, javondan if — dasturcha oxiriga, move — if ichiga', (await tuzilish(u)) === 'W→[if→[→]] W↑[↑]', await tuzilish(u))
await (await bid(u, 'right', 'if_path')).click({ position: { x: 12, y: 8 } }); await kut(250) /* if ni yana bosib — tanlov olinadi */; await (await bid(u, 'up', 'move_up')).click({ position: { x: 12, y: 8 } }); await kut(200); await u.click('#ust .jr-bl .bl-x'); await kut(300)
await (await bid(u, 'up')).click({ position: { x: 14, y: 22 } }); await kut(200); await oila(u, 'a'); await jav(u, 'if path'); await oila(u, 'h'); await jav(u, 'move up'); await kut(450); await menyu(u, await bid(u, 'up', 'if_path'), '↑')
tek('10 · ↑ dasturchasida ham: if path ↑ (ro‘yxatdan), ichida move up — «6 / 16 ta blok»', (await tuzilish(u)) === 'W→[if→[→]] W↑[if↑[↑]]' && (await matn(u, '#ust .dsn')).endsWith('6 / 16 ta blok'), (await tuzilish(u)) + ' ' + (await matn(u, '#ust .dsn')))
await boshla(u); await bos(u, '→↑↑→'); tek('10 · →↑↑→ — «yo‘q», Coddy devor oldida turdi, o‘yin davom etadi', (await joy(u)) === '(1, 2)' && !!(await u.$('#ust .oyin-yz')) && !(await muam(u)))
await bos(u, '↑→→→→→'); tek('10 · ↑ → → → → → — «Siz yutdingiz!»', (await hint(u)) === 'Siz yutdingiz!')

// ---------- 11: qoida (5–8)
await keyingi(); await ekrangacha(a, 'B2A')
tek('11 · Aziz B2A — 8-qadamdagi to‘rt dasturcha bilan', (await tuzilish(a)) === 'W→[→] W↑[↑] W↓[↓] W←[←]', await tuzilish(a))
await qur(a, QOIDA); await boshla(a); await bos(a, Y.Q1)
tek('11 · qoida bilan, lekin «yo‘q»siz yutdi — Kamvoy «Oz qoldi!», «Ataylab devor tomonga bosing — keyin yuting»', (await muam(a)) === 'kamvoy:Oz qoldi!' && (await hint(a)) === 'Ataylab devor tomonga bosing — keyin yuting', await hint(a))
await a.click('#bol .hn .asos'); r = await oyna9(a, 'B2A', '↑' + Y.Q1, 'B2B'); tek('11 · startda ↑ («yo‘q»), keyin yutdi → B2B', r.g === 'Siz yutdingiz!' && r.o, r.g)
tek('11 · B2B qoidali dastur bilan ochildi', (await tuzilish(a)) === 'W→[if→[→]] W←[if←[←]] W↑[if↑[↑]] W↓[if↓[↓]]', await tuzilish(a))
r = await oyna9(a, 'B2B', Y.Q2, 'B2C'); tek('11 · ilon yo‘l → B2C', r.o, r.g)
r = await oyna9(a, 'B2C', Y.Q3B, 'B2Y'); tek('11 · boshi berk yo‘lga kirib qaytdi (21 bosish) → B2Y', r.o, r.g)
await qur(a, QOIDA, { '↑': [{ t: 'n', m: 'qadam' }] }); r = await oyna9(a, 'B2Y', '↓' + Y.QY, 'BK'); tek('11 · ★ ↑ ning if ichida play sound — yutdi → BK', r.o, r.g)
await qur(l, QOIDA); r = await oyna9(l, 'B2A', '↑' + Y.Q1, 'B2B'); tek('11 · Lola 1-pog‘ona', r.o, r.g)
await gacha(u, () => /1\/2/.test(document.querySelector('#ust .tugatdi b')?.textContent.replace(/\s/g, '')) && document.querySelectorAll('#ust .pg-k .pg-s b')[0]?.textContent === '2')
tek('11 · doska: «1 / 2»; zinapoya 2 · 1 · 1 · 1', (await pogSon()) === '1/2 2 1 1 1', await pogSon())

// ---------- 12–14
await keyingi(); tek('12 · xulosa «Qoida»', (await matn(u, '#ust .sar')) === 'Qoida')
await keyingi(); tek('13 · reja: 1, 2 ✓', (await u.$$('#ust .tp-st.otdi')).length === 2)
await keyingi(); tek('14 · P8: to‘rt strelka qoida bilan; ro‘yxat «To‘rt strelka» ✓, «Qoida» ✓', (await chek(u)) === '✓✓··', await chek(u))
await boshla(u); await bos(u, '→→↑↑↑→')
tek('14 · kalitsiz eshik — «yo‘q», Kamvoy «Kalit qani?», Coddy eshik oldida', (await muam(u)) === 'kamvoy:Kalit qani?' && (await joy(u)) === '(2, 3)', (await muam(u)) + ' ' + (await joy(u)))
await bos(u, '←→→→→→'); tek('14 · ← kalit, keyin yutdi; ro‘yxat to‘rtala ✓', (await hint(u)) === 'Siz yutdingiz!' && (await chek(u)) === '✓✓✓✓', await chek(u))

// ---------- 15: labirint o'yini (9–11)
await keyingi(); await ekrangacha(a, 'B3A'); await kut(500)
tek('15 · Aziz B3A: ro‘yxat — «To‘rt strelka» va «Qoida» 2-bekatdan ✓ bo‘lib keldi', (await chek(a)) === '✓✓··', await chek(a))
r = await oyna9(a, 'B3A', Y.K1, 'B3B'); tek('15 · kalit va eshik → B3B', r.o, r.g)
await kut(400); tek('15 · B3B: ro‘yxat to‘rtala ✓ (kalit va yulduz — 1-pog‘onada)', (await chek(a)) === '✓✓✓✓', await chek(a))
r = await oyna9(a, 'B3B', Y.D1, 'B3Y'); tek('15 · labirint o‘yini — «O‘yiningiz tayyor!» → B3Y', r.g === 'O‘yiningiz tayyor!' && r.o, r.g)
await qur(a, QOIDA, { _: [{ t: 'x', m: '0,0' }] }); r = await oyna9(a, 'B3Y', '→↑↑↑_→→→↑↑→→→↑↑', 'BK'); tek('15 · ★ space — go to x: 0 y: 0: startga (kalit qo‘lda), yutdi → BK', r.o, r.g)
r = await oyna9(l, 'B3A', Y.K1, 'B3B'); tek('15 · Lola 1-pog‘ona (dastur 11-qadamdan)', r.o, r.g)
await gacha(u, () => /1\/2/.test(document.querySelector('#ust .tugatdi b')?.textContent.replace(/\s/g, '')))
tek('15 · doska: «O‘yini tayyor 1 / 2»; zinapoya 2 · 1 · 1', (await pogSon()) === '1/2 2 1 1', await pogSon())

// ---------- 16
await keyingi(); await kut(2000); await ekrangacha(a, 'B3Y'); await ekrangacha(l, 'B3A')
tek('16 · ustoz P11 (D1, to‘rt shartsiz dasturcha); Aziz — B3Y, Lola — B3A; «Qoidangizni ustozga o‘qib bering»', (await id(u)) === 'P11' && (await tuzilish(u)) === 'W→[→] W←[←] W↑[↑] W↓[↓]' && (await id(a)) === 'B3Y' && (await id(l)) === 'B3A' && (await matn(l, '#bol .hn .hint')) === 'Qoidangizni ustozga o‘qib bering', [await id(a), await id(l), await tuzilish(u)].join(' '))
tek('16 · bolaning qoidasi o‘z dasturi bilan ochildi', (await tuzilish(l)) === 'W→[if→[→]] W←[if←[←]] W↑[if↑[↑]] W↓[if↓[↓]]', await tuzilish(l))

// ---------- 17–18
await keyingi(); await ekrangacha(a, 'B5'); await ekrangacha(l, 'B5'); await kut(600)
const son = (p) => p.evaluate((r) => ['marta tugma bosdi', 'marta devor oldida to‘xtadi', 'labirint yutdi'].map((k) => document.querySelector(r + ' .sn-t[data-k="' + k + '"] b').textContent).join(','), R(p))
// faqat yutilgan o'yinlar (bosishlar sinovdagi qatorlardan sanaldi): Aziz B1 5 + B2 8 + B3 9 + BY 19 + ↑Q1 1+10 + Q2 12 + Q3 21 + ↓QY 1+13 + K1 8 + D1 16 + ★ 15 = 138,
// «yo'q» 1 (B2A) + 1 (B2C) + 1 (B2Y) = 3, 11 labirint; Lola 5 + 11 + 8 = 24, 1, 3; sinf 162, 4, 14
const qb = (p) => p.evaluate(() => Object.entries(qBlok).map(([k, x]) => k + ':' + x.t + '/' + (x.Y || 0)).join(' '))
tek('17 · Aziz: 138 marta tugma bosdi, 3 marta devor oldida to‘xtadi, 11 labirint yutdi', (await son(a)) === '138,3,11', (await son(a)) + ' — ' + (await qb(a)))
tek('17 · Lola: 24, 1, 3', (await son(l)) === '24,1,3', (await son(l)) + ' — ' + (await qb(l)))
tek('17 · Aziz: ro‘yxat ✓✓✓✓ va «O‘yiningiz saqlandi — keyingi darsda davom etamiz.»', (await a.$$eval('#bol .chek-y .ch-r.ok', (x) => x.length)) === 4 && !(await a.$eval('#bol .saqlandi', (e) => e.hidden)))
tek('17 · yakun: «Siz labirint o‘yini yasadingiz!», keyingi dars «10 · Labirint o‘yini 2»', (await matn(u, '#ust .sar')) === 'Siz labirint o‘yini yasadingiz!' && (await matn(u, '#ust [data-z="keyingi dars"]')).includes('10 · Labirint o‘yini 2'))
await keyingi(); await kut(1200)
tek('18 · Sinfimiz bugun: 162, 4, 14', (await son(u)) === '162,4,14', await son(u))
await u.click('#ust .hn .asos'); await kut(2500)
tek('18 · «Darsni yakunlash» — hammada «Dars tugadi»', (await matn(u, '#ust .tugadi-k')).includes('Dars tugadi!') && (await hint(a)).includes('Ko‘rishguncha') && (await hint(l)).includes('Ko‘rishguncha'))
tek('konsolda xato yo‘q', !xato.length, xato.slice(0, 4).join(' | '))
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()
process.exit(ok === jami ? 0 : 1)
