// 13-dars «Tasodifiy son» — to'liq jonli dars sinovi (21.11). Manba: new-junior/manba/013-tasodifiy-son.md (v1, tavsiya bo'yicha).
// Ustoz va ikki o'quvchi — alohida brauzer oynalari, lokal sinf serveri orqali. 18 qadam: huk (ikki o'yin × uch olma), javob, yangi so'z (birma-bir),
// ustoz javondan go to qo'yadi va X katagida «random» tanlaydi (tanlov oldindan: «8», keyin 4, 2, 5), bolalar pog'onalarda olma dasturini tuzadi va uch marta
// sinaydi (urug'li tasodif), 3-bekat o'yini (5 olma), doskalar sanog'i, 16-qadam (A·1), natija sonlari, yakunlash.
// Ishlatish (lokal server 5340 yoniq, demo-013 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/demo/013-toliq-dars.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5360/demo-013.html', X = 'd13-' + Date.now().toString(36)
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
const sinovN = (p) => matn(p, R(p) + ' .sinov-n')
const tinch = (p) => gacha(p, (r) => !document.querySelector(r + ' .ekran')?.dataset.yuryapti, R(p), 30000)
const KEY = { '→': 'ArrowRight', '←': 'ArrowLeft', '↑': 'ArrowUp', '↓': 'ArrowDown' }
const bos = async (p, s) => { for (const c of s) { await p.keyboard.press(KEY[c]); await p.waitForTimeout(40); await tinch(p) } await p.waitForTimeout(350) }
const boshla = async (p) => { await p.click(R(p) + (p === u ? ' .hn .ishga' : ' .hn .asos')); await p.waitForTimeout(400); await tinch(p) }
const pogSon = () => u.evaluate(() => [document.querySelector('#ust .tugatdi b').textContent.replace(/\s/g, ''), ...Array.from(document.querySelectorAll('#ust .pg-k .pg-s b')).map((x) => x.textContent)].join(' '))
const jav = async (p, f, t) => { await p.click(R(p) + ' .rg .rd.f-' + f); await p.waitForTimeout(120); await p.click(R(p) + ` .pl .mbw:not(.yopiq) .mb[data-tur="${t}"]`); await p.waitForTimeout(300) }
const URUG = (p) => p.evaluate(() => { let u = 11; Math.random = () => { u = (u * 1103515245 + 12345) % 2147483648; return u / 2147483648 } })
const dastur = (p, d) => p.evaluate(({ r, d }) => {
  const ek = document.querySelector(r + ' .ekran'), ws = BL_WS.get(ek); ws.clear()
  const zanjir = (ota, q, ichki) => { let o = null; for (const [t, m, ich] of q) { const x = blYangi(ws, t, m); if (o) o.nextConnection.connect(x.previousConnection); else if (ichki) ota.getInput('DO').connection.connect(x.previousConnection); else x.moveTo(new Blockly.utils.Coordinate(0, 0)); if (ich) zanjir(x, ich, true); o = x } }
  zanjir(null, d, false); ws.getAllBlocks(false).forEach(blBelgila); blMasshtab(ek, ws); sanoq(ek)
}, { r: R(p), d }).then(() => p.waitForTimeout(300))
const ishga = async (p, n = 1) => { for (let i = 0; i < n; i++) { await p.click(R(p) + (p === u ? ' .hn .ishga' : ' .hn .asos')); await p.waitForTimeout(400); await tinch(p) } }
// pog'ona: dastur, uch marta (ko'pi 9) — «Har safar boshqa joy!» → keyingi ekran
const pog = async (p, e, d, keyin) => { await ekrangacha(p, e); await kut(400); await dastur(p, d); let n = 0, g = ''; do { await ishga(p); n++; g = await hint(p) } while (g !== 'Har safar boshqa joy!' && n < 9 && (await id(p)) === e); return { g, n, o: await ekrangacha(p, keyin, 6000) } }
// o'yin: olma qayerga tushsa — strelkalar bilan borib oladi, 5 olma
const terib = async (p) => { for (let i = 0; i < 12; i++) { const s = await p.evaluate((r) => { const o = OYIN.get(document.querySelector(r + ' .ekran')); if (!o || !o.olma) return ''; const h = o.h, y = katakXarita(h.k.dataset.xarita).length - 1 - h.y; let q = ''; for (let x = h.x; x < o.olma[0]; x++) q += '→'; for (let x = h.x; x > o.olma[0]; x--) q += '←'; for (let k = y; k < o.olma[1]; k++) q += '↑'; for (let k = y; k > o.olma[1]; k--) q += '↓'; return q }, R(p)); if (!s) break; await bos(p, s) } }
const oyin = async (p, e, d, keyin) => { await ekrangacha(p, e); await kut(400); await dastur(p, d); await boshla(p); await terib(p); const g = await hint(p); return { g, o: await ekrangacha(p, keyin, 6000) } }

// ---------- 1
await a.goto(U + '?rol=varaq'); await a.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'jele'); localStorage.setItem('demo-qism', 'Bulut') })
await l.goto(U + '?rol=varaq'); await l.evaluate(() => localStorage.clear())
await u.goto(`${U}?rol=ustoz&yangi=1&xona=${X}`); await a.goto(`${U}?rol=bola&xona=${X}`); await l.goto(`${U}?rol=bola&xona=${X}`)
for (const p of [a, l]) await URUG(p)
await l.fill('#ei', 'Lola'); await l.click('#ef button'); await kut(1500)
tek('1 · Aziz: B0; Lola: avval BQ', (await id(a)) === 'B0' && (await id(l)) === 'BQ')
await l.locator('#bol .tq-o').nth(4).click(); await ekrangacha(l, 'B0')
await gacha(u, () => /Kirdi: 2/.test(document.querySelector('#ust .hn .hint')?.textContent))
tek('1 · ustoz: «Kirdi: 2»; «Bugun o‘yin har safar boshqacha!»; «O‘tgan darsda» — jon', (await hint(u)) === 'Kirdi: 2' && (await matn(u, '#ust .sar')) === 'Bugun o‘yin har safar boshqacha!' && (await matn(u, '#ust .otd')).includes('Jon'), await matn(u, '#ust .sar'))
for (const p of [a, l]) await p.click('#bol .asos'); await kut(400)
// ---------- 2–4
await keyingi(); await ekrangacha(a, 'P2N'); await ekrangacha(l, 'P2N')
await a.locator('#bol .jk').nth(2).click(); await l.locator('#bol .jk').nth(0).click(); await kut(1200)
await gacha(u, () => /2 \/ 2/.test(document.querySelector('#ust .hn .hint')?.textContent)); tek('2 · «Javob berdi: 2 / 2»; «Olma: 3 / 3»', (await hint(u)) === 'Javob berdi: 2 / 2' && (await matn(u, '#ust .oyin-yz')) === 'Olma: 3 / 3')
await keyingi()
const qator = (i) => u.evaluate((i) => document.querySelectorAll('#ust .jk')[i].querySelector('.ho-q').textContent, i)
await gacha(u, () => document.querySelectorAll('#ust .jk .jn').length >= 1 && !document.querySelector('#ust .ekran').dataset.yuryapti, null, 30000)
tek('3 · A: «1-o‘yin: 5 · 5 · 5», «2-o‘yin: 5 · 5 · 5»', (await qator(0)) === '1-o‘yin: 5 · 5 · 52-o‘yin: 5 · 5 · 5', await qator(0))
await keyingi(); await gacha(u, () => document.querySelectorAll('#ust .jk .jn').length >= 2 && !document.querySelector('#ust .ekran').dataset.yuryapti, null, 30000)
tek('3 · B: 1 · 5 · 3 ikki marta', (await qator(1)) === '1-o‘yin: 1 · 5 · 32-o‘yin: 1 · 5 · 3', await qator(1))
await keyingi(); await gacha(u, () => document.querySelectorAll('#ust .jk .jn').length >= 3 && !document.querySelector('#ust .ekran').dataset.yuryapti, null, 30000)
tek('3 · C: 4 · 1 · 6 va 2 · 5 · 0, «✓ har o‘yin boshqacha»', (await qator(2)) === '1-o‘yin: 4 · 1 · 62-o‘yin: 2 · 5 · 0' && (await u.$$('#ust .jk.n-ok')).length === 1, await qator(2))
await keyingi(); tek('4 · javob «Dastur o‘zi tanlaydi»: A, B xira; olti xira belgi', (await id(u)) === 'P2C' && (await u.$$('#ust .jk.n-yoq')).length === 2 && (await u.$$('#ust .kt-olma.iz-olma')).length === 6)
// ---------- 5–6
await keyingi(); for (let k = 0; k < 3; k++) { await u.click('#ust .hn .asos'); await kut(250) }
tek('5 · «Tasodifiy son nima?» — uch bo‘lak yondi, zar «2»', (await u.$$('#ust .xyl p.on')).length === 3 && (await u.evaluate(() => document.querySelector('#ust .zr .zr-z .q3').classList.contains('on'))) && (await id(u)) === 'P3')
await keyingi(); tek('6 · reja', (await id(u)) === 'P4')
// ---------- 7: ustoz random bloki
await keyingi(); await kut(500)
tek('7 · P6: «0 / 2 ta blok», «Sinov: 0 / 3»; bolada «Ustoz random blokini ko‘rsatyapti»', (await matn(u, '#ust .dsn')) === '0 / 2 ta blok' && (await sinovN(u)) === 'Sinov: 0 / 3' && (await matn(a, '#bol .qarang')).includes('Ustoz random blokini'))
await jav(u, 'h', 'y'); await u.locator('#ust .jr-bl .blocklyDropdownField').first().click(); await kut(250); await u.locator('.blocklyDropDownDiv .blocklyMenuItem').filter({ hasText: 'random' }).click(); await kut(400)
tek('7 · go to x: (random 1 to 10) y: 0 — «2 / 2 ta blok»', (await matn(u, '#ust .dsn')) === '2 / 2 ta blok')
await ishga(u); tek('7 · «8» — Kamvoy «Maydon tugadi!»', (await muam(u)) === 'kamvoy:Maydon tugadi!' && (await hint(u)) === 'random 8 ni tanladi. Maydonda X — 0 dan 6 gacha', await hint(u))
await u.locator('#ust .jr-bl .mb[data-tur="m"] .blocklyDropdownField').nth(1).click(); await kut(250); await u.locator('.blocklyDropDownDiv .blocklyMenuItem').filter({ hasText: /^\s*5\s*$/ }).first().click(); await kut(300)
await ishga(u, 3); tek('7 · 1 to 5 — 4, 2, 5: «Sinov: 3 / 3», «Har safar boshqa joy!»', (await sinovN(u)) === 'Sinov: 3 / 3' && (await hint(u)) === 'Har safar boshqa joy!', await hint(u))
// ---------- 8: bitta son (1–4)
await keyingi(); await ekrangacha(a, 'B1A'); await ekrangacha(l, 'B1A'); await kut(600)
await dastur(a, [['y', 'r1-6,2']]); await ishga(a); tek('8 · R1-6 — Kamvoy «Bu savat bo‘sh qoladi!»', (await muam(a)) === 'kamvoy:Bu savat bo‘sh qoladi!' && (await hint(a)) === '(0, 2) dagi savatga olma tushmaydi. random sonlarini tekshiring', await hint(a))
await a.click('#bol .hn .mas'); await kut(300); tek('8 · «Maslahat» — manbadagi gap', (await hint(a)) === 'Savatlar bitta qatorda — Y bir xil. X qaysi sondan qaysi songacha?')
let r = await pog(a, 'B1A', [['y', 'r0-6,2']], 'B1B'); tek('8 · Aziz 1-pog‘ona: go(R0-6, 2) → B1B', r.o, JSON.stringify(r))
r = await pog(a, 'B1B', [['y', 'r2-4,0']], 'B1C'); tek('8 · 2-pog‘ona → B1C', r.o, JSON.stringify(r))
r = await pog(a, 'B1C', [['y', '3,r0-4']], 'B1Y'); tek('8 · 3-pog‘ona → B1Y', r.o, JSON.stringify(r))
r = await pog(a, 'B1Y', [['y', 'r1-3,4'], ['y', 'r5-6,0']], 'BK'); tek('8 · ★ ikki olma → BK', r.o, JSON.stringify(r))
r = await pog(l, 'B1A', [['y', 'r0-6,2']], 'B1B'); tek('8 · Lola 1-pog‘ona', r.o, JSON.stringify(r))
await gacha(u, () => document.querySelectorAll('#ust .pg-k .pg-s b')[0]?.textContent === '2')
tek('8 · doska: «1 / 2»; zinapoya 2 · 1 · 1 · 1', (await pogSon()) === '1/2 2 1 1 1', await pogSon())
// ---------- 9–10
await keyingi(); await keyingi(); await kut(500)
await ishga(u); tek('10 · tayyor go(R3-5, 1) — Kamvoy «Bu savat bo‘sh qoladi!»', (await muam(u)) === 'kamvoy:Bu savat bo‘sh qoladi!')
await u.locator('#ust .jr-bl .blocklyDropdownField').last().click(); await kut(250); await u.locator('.blocklyDropDownDiv .blocklyMenuItem').filter({ hasText: 'random' }).click(); await kut(300)
await u.locator('#ust .jr-bl .blocklyDropdownField').last().click(); await kut(250); await u.locator('.blocklyDropDownDiv .blocklyMenuItem').filter({ hasText: /^\s*2\s*$/ }).first().click(); await kut(300)
await ishga(u, 3); tek('10 · Y ga random 1 to 2 — «Har safar boshqa joy!»', (await hint(u)) === 'Har safar boshqa joy!' && (await matn(u, '#ust .dsn')) === '3 / 3 ta blok', await hint(u))
// ---------- 11: ikki son (5–8)
await keyingi(); await ekrangacha(a, 'B2A'); await kut(500)
r = await pog(a, 'B2A', [['y', 'r0-1,r2-3']], 'B2B'); tek('11 · Aziz 1-pog‘ona → B2B', r.o, JSON.stringify(r))
r = await pog(a, 'B2B', [['y', 'r2-4,r0-1']], 'B2C'); tek('11 · 2-pog‘ona → B2C', r.o, JSON.stringify(r))
r = await pog(a, 'B2C', [['y', 'r2-5,r0-2']], 'B2Y'); tek('11 · 3-pog‘ona → B2Y', r.o, JSON.stringify(r))
r = await pog(a, 'B2Y', [['p', '3', [['y', 'r3-5,r0-1']]]], 'BK'); tek('11 · ★ olma yomg‘iri → BK', r.o, JSON.stringify(r))
r = await pog(l, 'B2A', [['y', 'r0-1,r2-3']], 'B2B'); tek('11 · Lola 1-pog‘ona', r.o, JSON.stringify(r))
await gacha(u, () => document.querySelectorAll('#ust .pg-k .pg-s b')[0]?.textContent === '2')
tek('11 · doska: «1 / 2»; zinapoya 2 · 1 · 1 · 1', (await pogSon()) === '1/2 2 1 1 1', await pogSon())
// ---------- 12–14
await keyingi(); tek('12 · xulosa «Tasodifiy son»', (await matn(u, '#ust .sar')) === 'Tasodifiy son')
await keyingi(); await keyingi(); await kut(500)
await dastur(u, [['y', 'r0-6,0']]); await boshla(u); tek('14 · «▶ Boshlash» — «Olma: 0 / 5», olma (5, 0) ga', (await matn(u, '#ust .oyin-yz')) === 'O‘yin: strelkalarni bosing · Olma: 0 / 5')
await bos(u, '↓↓→→'); tek('14 · ↓ ↓ → → — «Olma: 1 / 5»', (await matn(u, '#ust .oyin-yz')).endsWith('1 / 5'))
await terib(u); tek('14 · beshta olma — «Siz yutdingiz!»', (await hint(u)) === 'Siz yutdingiz!', await hint(u))
// ---------- 15: o'yin (9–12)
await keyingi(); await ekrangacha(a, 'B3A'); await ekrangacha(l, 'B3A'); await kut(500)
await boshla(a); tek('15 · Aziz B3A: tayyor go(4, 1) — Kamvoy «Yana o‘sha joy!»', (await muam(a)) === 'kamvoy:Yana o‘sha joy!')
r = await oyin(a, 'B3A', [['y', 'r3-5,r0-2']], 'B3B'); tek('15 · 1-pog‘ona: 5 olma → B3B', r.o, JSON.stringify(r))
r = await oyin(a, 'B3B', [['y', 'r1-4,4']], 'B3C'); tek('15 · 2-pog‘ona → B3C', r.o, JSON.stringify(r))
r = await oyin(a, 'B3C', [['y', '0,r0-3']], 'B3Y'); tek('15 · 3-pog‘ona → B3Y', r.o, JSON.stringify(r))
r = await oyin(a, 'B3Y', [['y', 'r2-5,r0-2']], 'BK'); tek('15 · ★ «O‘yiningiz tayyor!» → BK', r.g === 'O‘yiningiz tayyor!' && r.o, JSON.stringify(r))
r = await oyin(l, 'B3A', [['y', 'r3-5,r0-2']], 'B3B'); tek('15 · Lola 1-pog‘ona', r.o, JSON.stringify(r))
await gacha(u, () => document.querySelectorAll('#ust .pg-k .pg-s b')[0]?.textContent === '2')
tek('15 · doska: «Uch o‘yinni yutdi 1 / 2»; zinapoya 2 · 1 · 1 · 1', (await pogSon()) === '1/2 2 1 1 1', await pogSon())
// ---------- 16
await keyingi(); await kut(1200)
tek('16 · ustoz P11: olma dasturi bo‘sh', (await id(u)) === 'P11' && (await matn(u, '#ust .dsn')) === '0 / 3 ta blok')
tek('16 · Aziz: oxirgi yechgan pog‘onasi — B3Y', (await id(a)) === 'B3Y' && (await hint(a)) === 'Dasturingizni ustozga o‘qib bering', await id(a))
// ---------- 17–18
await keyingi(); await ekrangacha(a, 'B5'); await ekrangacha(l, 'B5'); await kut(700)
const son = (p, kk) => p.evaluate(({ r, kk }) => kk.map((k) => (document.querySelector(r + ' .sn-t[data-k="' + k + '"] b') || {}).textContent).join(','), { r: R(p), kk })
const KK = ['ta random qo‘ydi', 'ta olma terdi']
// Aziz: random — 1+1+1+2 (1-bekat) + 2+2+2+2 (2-bekat) + 2+1+1+2 (3-bekat) = 19; terdi — 4 o'yin × 5 = 20. Lola: random 1 + 2 + 2 = 5; terdi 5
tek('17 · Aziz: 19 ta random, 20 ta olma terdi', (await son(a, KK)) === '19,20', await son(a, KK))
tek('17 · Lola: 5, 5', (await son(l, KK)) === '5,5', await son(l, KK))
tek('17 · yakun: «O‘yiningiz har safar boshqacha!», keyingi dars «14 · Xatoni topish»', (await matn(u, '#ust .sar')) === 'O‘yiningiz har safar boshqacha!' && (await matn(u, '#ust [data-z="keyingi dars"]')).includes('14 · Xatoni topish'))
await keyingi(); await kut(1200)
tek('18 · Sinfimiz bugun: 24 ta random, 25 ta olma terdi', (await son(u, KK)) === '24,25', await son(u, KK))
await u.click('#ust .hn .asos'); await kut(2500)
tek('18 · «Darsni yakunlash» — hammada «Dars tugadi»', (await matn(u, '#ust .tugadi-k')).includes('Dars tugadi!') && (await hint(a)).includes('Ko‘rishguncha'))
tek('konsolda xato yo‘q', !xato.length, xato.slice(0, 4).join(' | '))
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()
process.exit(ok === jami ? 0 : 1)
