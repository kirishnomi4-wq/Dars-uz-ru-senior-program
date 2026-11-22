// 16-dars «Klonlar» — solo sinovi (21.11): bola darsni ustozsiz o'zi o'tadi (manba 016, «Solo»; 88-qaror). Har pog'ona — avval xato varianti
// (muammocha), keyin namunaviy yechim (manba «Topshiriqlar»); pog'ona bajarilsa keyingisi o'zi ochiladi; 16 va 18-qadam yo'q.
// Ishlatish (lokal server 5340 yoniq, demo-016 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/demo/016-solo.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-016.html'
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }), xato = []
const p = await (await b.newContext({ viewport: { width: 1440, height: 810 } })).newPage()
p.on('pageerror', (e) => xato.push(e.message)); p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) xato.push(m.text()) })
let ok = 0, jami = 0
const tek = (nom, s, iz = '') => { jami++; if (s) ok++; console.log((s ? '✓ ' : '✗ ') + nom + (s || iz === '' ? '' : '  — ' + iz)) }
const id = () => p.evaluate(() => (document.querySelector('#ilova .ekran') || {}).dataset?.id || '')
const matn = (s) => p.$eval(s, (e) => e.textContent.trim()).catch(() => '')
const gacha = async (f, arg, ms = 15000) => { try { await p.waitForFunction(f, arg, { timeout: ms }); return true } catch { return false } }
const tinch = () => gacha(() => { const e = document.querySelector('#ilova .ekran'); return e && !e.dataset.yuryapti }, null, 90000)
const keyingi = async () => { await p.click('#ilova .hn .asos.k-solo, #ust .hn .asos'); await p.waitForTimeout(700) }
const hint = () => matn('#ilova .hn .hint')
const muam = () => p.evaluate(() => { const m = document.querySelector('#ilova .dv-muam'); return m ? (m.className.match(/m-(\w+)/) || [])[1] + ':' + m.textContent.trim() : '' })
const yol = [], qayd = async () => { const e = await id(); if (yol[yol.length - 1] !== e) yol.push(e); return e }
const tugma = () => p.evaluate(() => (document.querySelector('#ilova .hn .ishga') ? '#ilova .hn .ishga' : '#ilova .hn .asos:not(.k-solo)'))
const ishga = async () => { await p.click(await tugma()); await p.waitForTimeout(400); await tinch(); await p.waitForTimeout(250) }
const son = () => matn('#ilova .kl-son')
// dastur: dasturchalar — [[hodisa], [blok, m, ichki?]…]
const dastur = (g) => p.evaluate((g) => {
  const ek = document.querySelector('#ilova .ekran'), ws = BL_WS.get(ek); ws.clear()
  const ichiga = (ota, q) => { let o = null; for (const [t, m, ich] of q) { const x = blYangi(ws, t, m); if (o) o.nextConnection.connect(x.previousConnection); else ota.getInput('DO').connection.connect(x.previousConnection); if (ich) ichiga(x, ich); o = x } }
  g.forEach(([h, ...q], i) => { const hb = blYangi(ws, h[0], h[1]); hb.moveTo(new Blockly.utils.Coordinate(0, i * 90)); let o = hb; for (const [t, m, ich] of q) { const x = blYangi(ws, t, m); o.nextConnection.connect(x.previousConnection); if (ich) ichiga(x, ich); o = x } })
  blTartib(ws); ws.getAllBlocks(false).forEach(blBelgila); blMasshtab(ek, ws); sanoq(ek)
}, g).then(() => p.waitForTimeout(500))
const ASL = (...q) => [['f'], ...q], NUS = (...q) => [['H'], ...q]
const T4 = ['p', '4', [['d']]], T3 = ['p', '3', [['d']]], T5 = ['p', '5', [['d']]]
const GO = (a, b2, y = 4) => ['y', 'r' + a + '-' + b2 + ',' + y]
const urug = () => p.evaluate(() => { let u = 9; Math.random = () => { u = (u * 1103515245 + 12345) % 2147483648; return u / 2147483648 } })

await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'nihol') })
await p.goto(U + '?rol=solo'); await p.waitForTimeout(1000); await urug()
tek('B0', (await qayd()) === 'B0'); await p.click('#ilova .hn .asos'); await p.waitForTimeout(500)
tek('P1', (await qayd()) === 'P1'); await keyingi(); tek('P2N', (await qayd()) === 'P2N'); await p.locator('#bol .jk').nth(2).click(); await p.waitForTimeout(900)
tek('P2S: har kartada «▶ Sinab ko‘rish»', (await qayd()) === 'P2S' && (await p.$$('#ust .hk-sinab')).length === 3)
for (let i = 0; i < 3; i++) { await p.locator('#ust .jk').nth(i).locator('.hk-sinab').click(); await p.waitForTimeout(300); await gacha((n) => document.querySelectorAll('#ust .jk .jn').length >= n && !document.querySelector('#ust .ekran').dataset.yuryapti, i + 1, 90000) }
tek('P2S: uchala karta', await p.evaluate(() => [...document.querySelectorAll('#ust .jk .jn')].map((x) => x.textContent).join(' | ')) === '✕ bittadan tushadi | ✕ beshta bir xil dastur | ✓ bitta dastur, beshta dushman')
await keyingi(); tek('P2C', (await qayd()) === 'P2C'); await keyingi(); tek('P3', (await qayd()) === 'P3')
for (let k = 0; k < 3; k++) { await p.click('#ust .hn .asos'); await p.waitForTimeout(150) } tek('P3: uch bo‘lak', (await p.$$('#ust .xs-b.on')).length === 3)
await keyingi(); tek('P4', (await qayd()) === 'P4'); await keyingi()
tek('P7: dastur tayyor (solo)', (await qayd()) === 'P7')
await ishga(); tek('P7: nusxa tushdi — «Hammasi tushdi!»', (await hint()) === 'Hammasi tushdi!' && (await son()) === 'Nusxa: 1 / 1', (await hint()) + ' / ' + (await son()))
await keyingi(); tek('B1A', (await qayd()) === 'B1A')
await ishga(); tek('B1A: create clone yo‘q — Bo‘shvoy «Nusxa qani?»', (await muam()) === 'boshvoy:Nusxa qani?', await muam())
await dastur([ASL(['C']), NUS(T4)]); await ishga(); await gacha(() => document.querySelector('#ilova .ekran')?.dataset.id === 'B1B', null, 6000)
tek('B1A → B1B', (await qayd()) === 'B1B')
await dastur([ASL(['C'])]); await ishga(); tek('B1B: nusxa dasturchasi yo‘q — «Men nima qilay?»', (await muam()) === 'boshvoy:Men nima qilay?', await muam())
await dastur([ASL(['C']), NUS(T3)]); await ishga(); tek('B1B: repeat 3 — «Yerga yetmadi!», «Nusxa (5, 1) da to‘xtadi. Yergacha yana 1 ta katak»', (await muam()) === 'kamvoy:Yerga yetmadi!' && (await hint()) === 'Nusxa (5, 1) da to‘xtadi. Yergacha yana 1 ta katak', await hint())
await dastur([ASL(['C']), NUS(T5)]); await ishga(); tek('B1B: repeat 5 — «Maydon tugadi!»', (await muam()) === 'kamvoy:Maydon tugadi!', await muam())
await dastur([ASL(['C']), NUS(T4)]); await ishga(); await gacha(() => document.querySelector('#ilova .ekran')?.dataset.id === 'B1C', null, 6000)
tek('B1B → B1C', (await qayd()) === 'B1C')
await dastur([ASL(['C']), NUS(T4)]); await ishga(); tek('B1C: bitta nusxa — «Oz qoldi!» «2 ta nusxa tushishi kerak»', (await muam()) === 'kamvoy:Oz qoldi!' && (await hint()) === '2 ta nusxa tushishi kerak', await hint())
await dastur([ASL(['C'], ['C']), NUS(T4)]); await ishga(); await gacha(() => document.querySelector('#ilova .ekran')?.dataset.id === 'B1Y', null, 6000)
tek('B1C: ikki nusxa — B1Y', (await qayd()) === 'B1Y')
await dastur([ASL(['C']), NUS(T4)]); await ishga(); tek('B1Y: (3, 0) ga tushdi — «Bu yerga emas!»', (await muam()) === 'kamvoy:Bu yerga emas!' && (await hint()) === 'Nusxa (3, 0) ga tushdi. Kerak — (1, 0)', await hint())
await dastur([ASL(['C']), NUS(['x', '1,4'], T4)]); await ishga(); await gacha(() => document.querySelector('#ilova .ekran')?.dataset.id === 'P4B', null, 6000)
tek('B1Y → P4B', (await qayd()) === 'P4B'); await keyingi()
tek('P8', (await qayd()) === 'P8'); await ishga(); tek('P8: solo tayyor — 5 nusxa har xil ustun', (await hint()) === 'Hammasi tushdi!', (await hint()) + ' ' + (await muam()))
await keyingi(); tek('B2A', (await qayd()) === 'B2A')
await dastur([ASL(['p', '4', [['C']]]), NUS(GO(0, 6), T4)]); await ishga(); tek('B2A: 4 ta — «Oz qoldi!»', (await muam()) === 'kamvoy:Oz qoldi!' && (await hint()) === '5 ta nusxa tushishi kerak', await hint())
await dastur([ASL(['p', '5', [['C']]]), NUS(GO(0, 6), T4)]); await ishga(); await gacha(() => document.querySelector('#ilova .ekran')?.dataset.id === 'B2B', null, 6000)
tek('B2A → B2B', (await qayd()) === 'B2B')
await ishga(); tek('B2B: tayyor (bir ustun) — «Yana o‘sha joy!»', (await muam()) === 'kamvoy:Yana o‘sha joy!', await muam())
await dastur([ASL(['p', '4', [['C']]]), NUS(GO(0, 6), T4)]); await ishga(); await gacha(() => document.querySelector('#ilova .ekran')?.dataset.id === 'B2C', null, 6000)
tek('B2B → B2C', (await qayd()) === 'B2C')
await dastur([ASL(['p', '5', [['C']]]), NUS(GO(0, 6), T4)]); await ishga(); tek('B2C: random 0–6 — «Bu yerga emas!»', (await muam()) === 'ortiqvoy:Bu yerga emas!' && /random [4-6] ni ham tanlashi mumkin/.test(await hint()), await hint())
await dastur([ASL(['p', '5', [['C']]]), NUS(GO(0, 3), T4)]); await ishga(); await gacha(() => document.querySelector('#ilova .ekran')?.dataset.id === 'B2Y', null, 6000)
tek('B2C → B2Y', (await qayd()) === 'B2Y')
await dastur([ASL(['p', '10', [['C']]]), NUS(GO(0, 6), T4)]); await ishga(); await gacha(() => document.querySelector('#ilova .ekran')?.dataset.id === 'P9', null, 9000)
tek('B2Y (10 nusxa) → P9', (await qayd()) === 'P9'); await keyingi(); tek('P4C', (await qayd()) === 'P4C'); await keyingi()
tek('P10', (await qayd()) === 'P10')
const oyna = async (keys = '') => { await p.click(await tugma()); await p.waitForTimeout(400); for (const c of keys) { await p.keyboard.press(c === '<' ? 'ArrowLeft' : 'ArrowRight'); await p.waitForTimeout(200) } await gacha(() => !document.querySelector('#ilova .ekran[data-oyin]'), null, 90000); await p.waitForTimeout(400) }
tek('P10: solo ishorasi — delete this clone', (await hint()) === 'Nusxa dasturchasining oxiriga delete this clone qo‘ying', await hint())
await oyna(); tek('P10: delete yo‘q — «Yerda qolib ketdi!»', (await muam()) === 'kamvoy:Yerda qolib ketdi!', await muam())
await keyingi(); tek('B3A', (await qayd()) === 'B3A')
await oyna(); tek('B3A: tayyor (delete yo‘q) — «Yerda qolib ketdi!»', (await muam()) === 'kamvoy:Yerda qolib ketdi!', await muam())
await dastur([ASL(['p', '5', [['C']]]), NUS(GO(0, 6), T4, ['D'])]); await oyna()
const nat = await hint(); tek('B3A: delete bilan — yutdi yoki jon tugadi', nat === 'Siz yutdingiz!' || /Jon tugadi/.test(nat), nat)
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato.slice(0, 5) : 'yo‘q'); console.log('yo‘l:', yol.join(' ')); await b.close()
process.exit(ok === jami ? 0 : 1)
