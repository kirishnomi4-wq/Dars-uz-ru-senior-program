// 11-dars «O‘zgaruvchi: ball» — to'liq jonli dars sinovi (21.11). Manba: new-junior/manba/011-ozgaruvchi-ball.md (v1, tavsiya bo'yicha).
// Ustoz va ikki o'quvchi — alohida brauzer oynalari, lokal sinf serveri orqali. 18 qadam: huk (uch karta o'zi o'ynaladi), javob, yangi so'z (birma-bir),
// ustoz javondan HAQIQIY bosib dasturcha tuzadi va o'ynaydi (ball 3, keyin 6, set bilan 3), bolalar pog'onalarda ball sanaydi (dastur pog'onadan pog'onaga),
// 2-bekat «ball: 5» bilan ochiladi, ★ erkin, 3-bekat oldindan aytish (birinchi urinish), doskalar sanog'i, 16-qadam (A·1), natija sonlari, yakunlash.
// Ishlatish (lokal server 5340 yoniq, demo-011 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/demo/011-toliq-dars.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-011.html', X = 'd11-' + Date.now()
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
const ball = (p) => matn(p, R(p) + ' .oyna .ball-k b, ' + R(p) + ' .oyna .bsh-k b')
const tinch = (p) => gacha(p, (r) => !document.querySelector(r + ' .ekran')?.dataset.yuryapti, R(p), 30000)
const KEY = { '→': 'ArrowRight', '←': 'ArrowLeft', '↑': 'ArrowUp', '↓': 'ArrowDown' }
const bos = async (p, s) => { for (const c of s) { await p.keyboard.press(KEY[c]); await p.waitForTimeout(40); await tinch(p) } await p.waitForTimeout(350) }
const boshla = async (p) => { await p.click(R(p) + (p === u ? ' .hn .ishga' : ' .hn .asos')); await p.waitForTimeout(400); await tinch(p) }
const pogSon = () => u.evaluate(() => [document.querySelector('#ust .tugatdi b').textContent.replace(/\s/g, ''), ...Array.from(document.querySelectorAll('#ust .pg-k .pg-s b')).map((x) => x.textContent)].join(' '))
const jav = async (p, f, t) => { await p.click(R(p) + ' .rg .rd.f-' + f); await p.waitForTimeout(120); await p.click(R(p) + ` .pl .mbw:not(.yopiq) .mb[data-tur="${t}"]`); await p.waitForTimeout(300) }
// dastur — dvigatel funksiyasi bilan (javon yo'li ustoz qadamlarida haqiqiy bosish bilan sinaladi): { S: set, O: olma, G: oltin olma }
const D = (d) => [...(d.S != null ? [['f'], ['z', String(d.S)]] : []), ...(d.O != null ? [['q', 'apple'], ['c', String(d.O)]] : []), ...(d.G != null ? [['q', 'gold'], ['c', String(d.G)]] : [])]
const dastur = (p, d) => p.evaluate(({ r, x }) => { const ek = document.querySelector(r + ' .ekran'), ws = BL_WS.get(ek); ws.clear(); for (const [t, m] of x) blQosh(ek, t, m); sanoq(ek) }, { r: R(p), x: D(d) }).then(() => p.waitForTimeout(250))
const tuzilish = (p) => p.evaluate((r) => blDasturchalar(document.querySelector(r + ' .ekran')).map((x) => (x.tur === 'when_start' ? '▶' : x.olma === 'gold' ? 'OO' : 'O') + '[' + x.bloklar.map((el) => (blokTuri(el) === 'z' ? '=' : '+') + blokSon(el)).join(',') + ']').join(' '), R(p))
// manba «Topshiriqlar» — eng qisqa yo'llar (sinov/dvigatel/ozgaruvchi.mjs mustaqil hisobda tekshirilgan)
const man = (a, c) => Math.abs(a[0] - c[0]) + Math.abs(a[1] - c[1])
function yol(s, nuq, y) { let eng = null, uz = Infinity; const perm = (q, j, d, t) => { if (d >= uz) return; if (!q.length) { const k = d + man(j, y); if (k < uz) { uz = k; eng = t } return } q.forEach((n, i) => perm(q.filter((_, k) => k !== i), n, d + man(j, n), [...t, n])) }; perm(nuq, s, 0, []); let [x, c] = s, r = ''; for (const [a, e] of [...eng, y]) { while (x < a) { r += '→'; x++ } while (x > a) { r += '←'; x-- } while (c < e) { r += '↑'; c++ } while (c > e) { r += '↓'; c-- } } return r }
const M = {
  P6: [[0, 0], [[2, 0], [3, 2], [5, 2]], [5, 0]], B1A: [[0, 0], [[0, 2], [3, 1], [4, 0]], [6, 0]], B1B: [[0, 0], [[2, 1], [3, 4], [5, 2], [6, 0]], [0, 3]],
  B1C: [[6, 4], [[3, 2], [0, 0], [5, 0]], [3, 4]], B1Y: [[3, 0], [[0, 0], [0, 3], [5, 2], [6, 4], [3, 4]], [2, 1]], B2A: [[0, 0], [[1, 3], [3, 1], [5, 2], [6, 0]], [4, 4]],
  B2B: [[6, 0], [[4, 0], [2, 2], [0, 1]], [3, 4]], B2C: [[0, 0], [[3, 0], [5, 3], [2, 4]], [6, 0]], B2Y: [[0, 0], [[2, 1], [5, 2], [4, 4], [0, 3]], [6, 0]],
}
const Y = Object.fromEntries(Object.entries(M).map(([k, [s, n, y]]) => [k, yol(s, n, y)]))
// pog'ona: dastur → «▶ Boshlash» → yo'l → natija va keyingi ekran
const pog = async (p, e, d, keyin) => { await ekrangacha(p, e); await kut(400); if (d) await dastur(p, d); await boshla(p); await bos(p, Y[e]); const g = await hint(p), bl = await ball(p); return { g, bl, o: await ekrangacha(p, keyin, 6000) } }
const bash = async (p, e, son, keyin) => { await ekrangacha(p, e); await kut(400); await p.click(`#bol .bsh-q .sk[data-v="${son}"]`); await p.click('#bol .hn .asos'); await kut(300); await tinch(p); const g = await hint(p), m = await muam(p); return { g, m, o: keyin ? await ekrangacha(p, keyin, 6000) : false } }

// ---------- 1
await a.goto(U + '?rol=varaq'); await a.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'jele'); localStorage.setItem('demo-qism', 'Bulut') })
await l.goto(U + '?rol=varaq'); await l.evaluate(() => localStorage.clear())
await u.goto(`${U}?rol=ustoz&yangi=1&xona=${X}`); await a.goto(`${U}?rol=bola&xona=${X}`); await l.goto(`${U}?rol=bola&xona=${X}`)
await l.fill('#ei', 'Lola'); await l.click('#ef button'); await kut(1500)
tek('1 · Aziz: B0; Lola: avval BQ', (await id(a)) === 'B0' && (await id(l)) === 'BQ')
await l.locator('#bol .tq-o').nth(4).click(); await ekrangacha(l, 'B0')
await gacha(u, () => /Kirdi: 2/.test(document.querySelector('#ust .hn .hint')?.textContent))
tek('1 · ustoz: «Kirdi: 2»; «Bugun o‘yinda ball sanaymiz!»; «O‘tgan darsda» — daraja', (await hint(u)) === 'Kirdi: 2' && (await matn(u, '#ust .sar')) === 'Bugun o‘yinda ball sanaymiz!' && (await matn(u, '#ust .otd')).includes('Daraja'), await matn(u, '#ust .sar'))
for (const p of [a, l]) await p.click('#bol .asos'); await kut(400)

// ---------- 2–4
await keyingi(); await ekrangacha(a, 'P2N'); await ekrangacha(l, 'P2N')
await a.locator('#bol .jk').nth(2).click(); await l.locator('#bol .jk').nth(0).click(); await kut(1200)
await gacha(u, () => /2 \/ 2/.test(document.querySelector('#ust .hn .hint')?.textContent)); tek('2 · «Javob berdi: 2 / 2»', (await hint(u)) === 'Javob berdi: 2 / 2')
await keyingi()
const karta = () => u.evaluate(() => [...document.querySelectorAll('#ust .jk .jn')].map((x) => x.textContent).join(' | '))
await gacha(u, () => document.querySelectorAll('#ust .jk .jn').length >= 1 && !document.querySelector('#ust .ekran').dataset.yuryapti, null, 30000)
tek('3 · A o‘zi boshlandi: «✕ doim 1»; bolada «Ustoz yo‘llarni sinayapti»', (await karta()) === '✕ doim 1' && (await matn(a, '#bol .qarang')).includes('Ustoz yo‘llarni sinayapti'), await karta())
await keyingi(); await gacha(u, () => document.querySelectorAll('#ust .jk .jn').length >= 2 && !document.querySelector('#ust .ekran').dataset.yuryapti, null, 30000)
tek('3 · B: «✕ birdan 3»', (await karta()).endsWith('✕ birdan 3'), await karta())
await keyingi(); await gacha(u, () => document.querySelectorAll('#ust .jk .jn').length >= 3 && !document.querySelector('#ust .ekran').dataset.yuryapti, null, 30000)
tek('3 · C: «✓ ball: 3», sahnada «ball: 3»', (await karta()).endsWith('✓ ball: 3') && (await ball(u)) === '3', await karta())
await keyingi(); tek('4 · javob «Kompyuter sonni eslab qoladi»: A, B xira; «ball: 3»', (await id(u)) === 'P2C' && (await u.$$('#ust .jk.n-yoq')).length === 2 && (await ball(u)) === '3')

// ---------- 5–6
await keyingi(); for (let k = 0; k < 3; k++) { await u.click('#ust .hn .asos'); await kut(250) }
tek('5 · «O‘zgaruvchi nima?» — uch bo‘lak yondi, qutida 3', (await u.$$('#ust .xyl p.on')).length === 3 && (await u.evaluate(() => document.querySelector('#ust .qt .q3').classList.contains('on') && document.querySelector('#ust .qt .q1').classList.contains('on'))) && (await id(u)) === 'P3')
await keyingi(); tek('6 · reja', (await id(u)) === 'P4')

// ---------- 7: ustoz change bloki (javondan haqiqiy bosish)
await keyingi(); await kut(500)
tek('7 · P6: dastur bo‘sh, «Boshqaruv» qatori, «ball: 0»; bolada «Ustoz ball sanashni ko‘rsatyapti»', (await matn(u, '#ust .dsn')).startsWith('0 ta dasturcha') && (await u.$$('#ust .dst .bq-q')).length === 1 && (await ball(u)) === '0' && (await matn(a, '#bol .qarang')).includes('Ustoz ball sanashni'))
await jav(u, 'e', 'q'); await jav(u, 'o', 'c')
tek('7 · javondan: O[+1]', (await tuzilish(u)) === 'O[+1]', await tuzilish(u))
await boshla(u); await bos(u, Y.P6); tek('7 · →→→↑↑→→↓↓ — «ball: 3», «Siz yutdingiz!»', (await ball(u)) === '3' && (await hint(u)) === 'Siz yutdingiz!', await ball(u))

// ---------- 8: ball (1–4)
await keyingi(); await ekrangacha(a, 'B1A'); await ekrangacha(l, 'B1A'); await kut(600)
tek('8 · Aziz B1A: «ball: 0», dastur bo‘sh, javonda set yopiq', (await ball(a)) === '0' && (await tuzilish(a)) === '' && (await a.$$('#bol .pl .mbw.yopiq')).length === 1)
await boshla(a); await bos(a, Y.B1A); tek('8 · dasturchasiz yutdi — ball 0: Kamvoy «Ball kam!», «Ball 0 — 3 bo‘lishi kerak. Har olma necha ball?»', (await muam(a)) === 'kamvoy:Ball kam!' && (await hint(a)) === 'Ball 0 — 3 bo‘lishi kerak. Har olma necha ball?', await hint(a))
await a.click('#bol .hn .mas'); await kut(300); tek('8 · «Maslahat» — manbadagi gap', (await hint(a)) === 'Qaysi hodisa bloki olmaga tekkanda ishlaydi?')
let r = await pog(a, 'B1A', { O: 1 }, 'B1B'); tek('8 · Aziz 1-pog‘ona: O[+1] — ball 3 → B1B', r.bl === '3' && r.o, JSON.stringify(r))
tek('8 · B1B o‘sha dastur bilan (O[+1]), «ball: 0»', (await tuzilish(a)) === 'O[+1]' && (await ball(a)) === '0', await tuzilish(a))
r = await pog(a, 'B1B', null, 'B1B'); tek('8 · O[+1] qoldi — ball 4: Kamvoy «Ball kam!»', r.bl === '4' && (await muam(a)) === 'kamvoy:Ball kam!', JSON.stringify(r))
r = await pog(a, 'B1B', { O: 2 }, 'B1C'); tek('8 · O[+2] — ball 8 (qayta o‘yin 0 dan) → B1C', r.bl === '8' && r.o, JSON.stringify(r))
r = await pog(a, 'B1C', { O: 1, G: 5 }, 'B1Y'); tek('8 · 3-pog‘ona: O[+1] OO[+5] — 7 → B1Y', r.bl === '7' && r.o, JSON.stringify(r))
r = await pog(a, 'B1Y', { O: 2, G: 10 }, 'BK'); tek('8 · ★: O[+2] OO[+10] — 18 → BK', r.bl === '18' && r.o, JSON.stringify(r))
r = await pog(l, 'B1A', { O: 1 }, 'B1B'); tek('8 · Lola 1-pog‘ona', r.o, JSON.stringify(r))
await gacha(u, () => document.querySelectorAll('#ust .pg-k .pg-s b')[0]?.textContent === '2')
tek('8 · doska: «1 / 2»; zinapoya 2 · 1 · 1 · 1', (await pogSon()) === '1/2 2 1 1 1', await pogSon())

// ---------- 9–10: ustoz set bloki
await keyingi(); await keyingi(); await kut(500)
tek('10 · P7: tayyor O[+1], «ball: 0»', (await tuzilish(u)) === 'O[+1]' && (await ball(u)) === '0', await tuzilish(u))
await boshla(u); await bos(u, Y.P6); tek('10 · 1-o‘yin — ball 3', (await ball(u)) === '3')
await boshla(u); tek('10 · qayta «▶ Boshlash» — ball 3 turibdi', (await ball(u)) === '3')
await bos(u, Y.P6); tek('10 · 2-o‘yin — ball 6, «Olma 3 ta — ball 6»', (await ball(u)) === '6' && (await matn(u, '#ust .ball-iz')) === 'Olma 3 ta — ball 6', await matn(u, '#ust .ball-iz'))
await jav(u, 'e', 'f'); await jav(u, 'o', 'z')
tek('10 · javondan: ▶[=0] O[+1]', (await tuzilish(u)) === '▶[=0] O[+1]' || (await tuzilish(u)) === 'O[+1] ▶[=0]', await tuzilish(u))
await boshla(u); tek('10 · «▶ Boshlash» — «ball: 0»', (await ball(u)) === '0'); await bos(u, Y.P6); tek('10 · set bilan — ball 3', (await ball(u)) === '3' && (await hint(u)) === 'Siz yutdingiz!')

// ---------- 11: noldan (5–8)
await keyingi(); await ekrangacha(a, 'B2A'); await ekrangacha(l, 'B2A'); await kut(500)
tek('11 · Aziz B2A: «ball: 5», «O‘tgan o‘yindan qolgan ball»; dastur 8-qadamdan (O[+2] OO[+10])', (await ball(a)) === '5' && (await matn(a, '#bol .ball-qy')) === 'O‘tgan o‘yindan qolgan ball' && (await tuzilish(a)) === 'O[+2] OO[+10]', await tuzilish(a))
r = await pog(a, 'B2A', { S: 0, O: 1 }, 'B2B'); tek('11 · Aziz 1-pog‘ona: ▶[0] O[+1] — 4 → B2B', r.bl === '4' && r.o, JSON.stringify(r))
r = await pog(a, 'B2B', { S: 10, O: 1 }, 'B2C'); tek('11 · 2-pog‘ona: ▶[10] — 13 → B2C', r.bl === '13' && r.o, JSON.stringify(r))
r = await pog(a, 'B2C', { S: 3, O: 2, G: 4 }, 'B2Y'); tek('11 · 3-pog‘ona: 11 → B2Y', r.bl === '11' && r.o, JSON.stringify(r))
r = await pog(a, 'B2Y', { S: 5, O: 3, G: 10 }, 'BK'); tek('11 · ★ o‘z o‘yini: 31, «O‘yiningiz tayyor!» → BK', r.bl === '31' && r.g === 'O‘yiningiz tayyor!' && r.o, JSON.stringify(r))
r = await pog(l, 'B2A', null, 'B2A'); tek('11 · Lola: set yo‘q (O[+1]) — 9: Ortiqvoy «Ball ko‘p!», «Ball 9 — 4 bo‘lishi kerak. O‘yin boshida ball 5 edi»', r.bl === '9' && (await muam(l)) === 'ortiqvoy:Ball ko‘p!' && r.g === 'Ball 9 — 4 bo‘lishi kerak. O‘yin boshida ball 5 edi', JSON.stringify(r))
r = await pog(l, 'B2A', { S: 0, O: 1 }, 'B2B'); tek('11 · Lola: set ball to 0 — 4 → B2B', r.bl === '4' && r.o, JSON.stringify(r))
await gacha(u, () => document.querySelectorAll('#ust .pg-k .pg-s b')[0]?.textContent === '2')
tek('11 · doska: «1 / 2»; zinapoya 2 · 1 · 1 · 1', (await pogSon()) === '1/2 2 1 1 1', await pogSon())

// ---------- 12–14
await keyingi(); tek('12 · xulosa «O‘zgaruvchi»', (await matn(u, '#ust .sar')) === 'O‘zgaruvchi')
await keyingi(); await keyingi(); await kut(500)
tek('14 · P8: «ball: ?», kartalar 2 3 4 5 6 7, bolada «Ustoz dasturni o‘qiyapti»', (await ball(u)) === '?' && (await u.$$eval('#ust .bsh-q .sk', (x) => x.map((e) => e.dataset.v).join(' '))) === '2 3 4 5 6 7' && (await matn(a, '#bol .qarang')).includes('Ustoz dasturni o‘qiyapti'))
for (let k = 0; k < 4; k++) { await u.click('#ust .hn .asos'); await kut(150) }
tek('14 · «Keyingi» to‘rt marta — «ball: 0», «ball: 2», «ball: 4», «ball: 5»; qadam almashmadi', (await u.$$eval('#ust .jr-bl .bl-son', (x) => x.map((e) => e.textContent).join(','))) === 'ball: 0,ball: 2,ball: 4,ball: 5' && (await id(u)) === 'P8')
await u.click('#ust .bsh-q .sk[data-v="5"]'); await u.click('#ust .hn .ishga'); await kut(300); await tinch(u)
tek('14 · 5 kartasi, «▶ Tekshirish» — «Oldindan aytdingiz!»', (await hint(u)) === 'Oldindan aytdingiz!' && (await ball(u)) === '5')

// ---------- 15: oldindan aytish (9–12)
await keyingi(); await ekrangacha(a, 'B3A'); await ekrangacha(l, 'B3A'); await kut(600)
tek('15 · Aziz B3A: javon yopiq, dastur tayyor, «▶ Tekshirish» xira', (await a.$$('#bol .pl .mbw:not(.yopiq)')).length === 0 && (await a.$eval('#bol .hn .asos', (e) => e.classList.contains('tug-xira'))) && (await tuzilish(a)) === '▶[=3,+1,+5]', await tuzilish(a))
r = await bash(a, 'B3A', 5, null); tek('15 · Aziz 5 — Kamvoy «Boshqa son!», «Ball 9 bo‘ldi. …»', r.m === 'kamvoy:Boshqa son!' && r.g === 'Ball 9 bo‘ldi. Dasturni qaytadan o‘qing: har blokdan keyin ball nechchi?', JSON.stringify(r))
r = await bash(a, 'B3A', 9, 'B3B'); tek('15 · Aziz 9 — «Oldindan aytdingiz!» → B3B', r.g === 'Oldindan aytdingiz!' && r.o, JSON.stringify(r))
r = await bash(a, 'B3B', 6, 'B3C'); tek('15 · 2-pog‘ona: 6 → B3C', r.o, JSON.stringify(r))
r = await bash(a, 'B3C', 2, 'B3Y'); tek('15 · 3-pog‘ona (ikki set): 2 → B3Y', r.o, JSON.stringify(r))
r = await bash(a, 'B3Y', 14, 'BK'); tek('15 · ★: 14 → BK', r.o, JSON.stringify(r))
r = await bash(l, 'B3A', 9, 'B3B'); tek('15 · Lola 1-pog‘ona birinchi urinishda', r.o, JSON.stringify(r))
r = await bash(l, 'B3B', 6, 'B3C'); tek('15 · Lola 2-pog‘ona', r.o, JSON.stringify(r))
await gacha(u, () => document.querySelectorAll('#ust .pg-k .pg-s b')[1]?.textContent === '2')
tek('15 · doska: «Uch marta oldindan aytdi 1 / 2»; zinapoya 2 · 2 · 1 · 1', (await pogSon()) === '1/2 2 2 1 1', await pogSon())

// ---------- 16: o'qib berish (A·1)
await keyingi(); await kut(1200)
tek('16 · ustoz P11: faqat «Boshqaruv», «ball: 0»', (await id(u)) === 'P11' && (await tuzilish(u)) === '' && (await ball(u)) === '0')
tek('16 · Aziz: oxirgi yechgan pog‘onasi — B3Y, 14 kartasi tanlangan, «Dasturingizni ustozga o‘qib bering»', (await id(a)) === 'B3Y' && (await a.$$('#bol .bsh-q .sk.tan[data-v="14"]')).length === 1 && (await hint(a)) === 'Dasturingizni ustozga o‘qib bering', await id(a))
tek('16 · Lola: B3B, 6 kartasi', (await id(l)) === 'B3B' && (await l.$$('#bol .bsh-q .sk.tan[data-v="6"]')).length === 1, await id(l))
await jav(u, 'e', 'f'); await jav(u, 'o', 'z'); await jav(u, 'e', 'q'); await jav(u, 'o', 'c')
await boshla(u); await bos(u, Y.P6); tek('16 · ustoz bola o‘qigan dastur bilan o‘ynadi — ball 3', (await ball(u)) === '3' && (await hint(u)) === 'Siz yutdingiz!', await tuzilish(u))

// ---------- 17–18
await keyingi(); await ekrangacha(a, 'B5'); await ekrangacha(l, 'B5'); await kut(700)
const son = (p, kk) => p.evaluate(({ r, kk }) => kk.map((k) => (document.querySelector(r + ' .sn-t[data-k="' + k + '"] b') || {}).textContent).join(','), { r: R(p), kk })
const BOLA = ['ta olma terdi', 'eng katta ball', 'marta oldindan aytdi'], SINF = ['ta olma terdi', 'marta oldindan aytdi']
// Aziz: olmalar 3 + 4 + 3 + 5 (1-bekat) + 4 + 3 + 3 + 4 (2-bekat) = 29; eng katta ball 31; birinchi urinishda — B3B, B3C, B3Y (B3A — ikkinchisida) = 3
// Lola: 3 + 4 = 7; eng katta 4; B3A, B3B — 2
tek('17 · Aziz: 29 ta olma, eng katta ball 31, 3 marta oldindan aytdi; kapsula «ball: 31»', (await son(a, BOLA)) === '29,31,3' && (await ball(a)) === '31', await son(a, BOLA))
tek('17 · Lola: 7, 4, 2', (await son(l, BOLA)) === '7,4,2', await son(l, BOLA))
tek('17 · yakun: «Siz ball sanadingiz!», keyingi dars «12 · Jon va qadam»', (await matn(u, '#ust .sar')) === 'Siz ball sanadingiz!' && (await matn(u, '#ust [data-z="keyingi dars"]')).includes('12 · Jon va qadam'))
await keyingi(); await kut(1200)
tek('18 · Sinfimiz bugun: 36 ta olma terdi, 5 marta oldindan aytdi', (await son(u, SINF)) === '36,5', await son(u, SINF))
await u.click('#ust .hn .asos'); await kut(2500)
tek('18 · «Darsni yakunlash» — hammada «Dars tugadi»', (await matn(u, '#ust .tugadi-k')).includes('Dars tugadi!') && (await hint(a)).includes('Ko‘rishguncha'))
tek('konsolda xato yo‘q', !xato.length, xato.slice(0, 4).join(' | '))
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()
process.exit(ok === jami ? 0 : 1)
