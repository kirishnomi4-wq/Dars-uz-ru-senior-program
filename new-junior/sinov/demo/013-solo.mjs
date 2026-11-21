// 13-dars «Tasodifiy son» — solo sinovi (21.11): bola darsni ustozsiz o'zi o'tadi (manba 013, «Solo»; 88-qaror).
// 3-qadamda uch kartani bola o'zi sinaydi, 5-qadamda bo'laklarni o'zi yoqadi, 7, 10-qadamda dastur tayyor (tanlov oldindan: 8, keyin 4, 2, 5), 14-qadamda
// olma dasturi tayyor — bola o'zi o'ynaydi; pog'ona bajarilsa keyingisi o'zi ochiladi, 16 va 18-qadam yo'q, oxiri — o'z natijasi.
// Ishlatish (lokal server 5340 yoniq, demo-013 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/demo/013-solo.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-013.html'
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }), xato = []
const p = await (await b.newContext({ viewport: { width: 1440, height: 810 } })).newPage()
p.on('pageerror', (e) => xato.push(e.message)); p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) xato.push(m.text()) })
let ok = 0, jami = 0
const tek = (nom, s, iz = '') => { jami++; if (s) ok++; console.log((s ? '✓ ' : '✗ ') + nom + (s || iz === '' ? '' : '  — ' + iz)) }
const id = () => p.evaluate(() => (document.querySelector('#ilova .ekran') || {}).dataset?.id || '')
const matn = (s) => p.$eval(s, (e) => e.textContent.trim()).catch(() => '')
const gacha = async (f, arg, ms = 15000) => { try { await p.waitForFunction(f, arg, { timeout: ms }); return true } catch { return false } }
const tinch = () => gacha(() => !document.querySelector('#ilova .ekran')?.dataset.yuryapti, null, 60000)
const KEY = { '→': 'ArrowRight', '←': 'ArrowLeft', '↑': 'ArrowUp', '↓': 'ArrowDown' }
const bos = async (s) => { for (const c of s) { await p.keyboard.press(KEY[c]); await p.waitForTimeout(40); await tinch() } await p.waitForTimeout(350) }
const tugma = () => p.evaluate(() => document.querySelector('#ilova .hn .ishga') ? '#ilova .hn .ishga' : '#ilova .hn .asos:not(.k-solo)')
const ishga = async (n = 1) => { for (let i = 0; i < n; i++) { await p.click(await tugma()); await p.waitForTimeout(400); await tinch() } }
const keyingi = async () => { await p.click('#ilova .hn .asos.k-solo, #ust .hn .asos'); await p.waitForTimeout(600) }
const hint = () => matn('#ilova .hn .hint')
const yol = [], qayd = async () => { const e = await id(); if (yol[yol.length - 1] !== e) yol.push(e); return e }
const dastur = (d) => p.evaluate((d) => {
  const ek = document.querySelector('#ilova .ekran'), ws = BL_WS.get(ek); ws.clear()
  const zanjir = (ota, q, ichki) => { let o = null; for (const [t, m, ich] of q) { const x = blYangi(ws, t, m); if (o) o.nextConnection.connect(x.previousConnection); else if (ichki) ota.getInput('DO').connection.connect(x.previousConnection); else x.moveTo(new Blockly.utils.Coordinate(0, 0)); if (ich) zanjir(x, ich, true); o = x } }
  zanjir(null, d, false); ws.getAllBlocks(false).forEach(blBelgila); blMasshtab(ek, ws); sanoq(ek)
}, d).then(() => p.waitForTimeout(300))
const terib = async () => { for (let i = 0; i < 12; i++) { const s = await p.evaluate(() => { const o = OYIN.get(document.querySelector('#ilova .ekran')); if (!o || !o.olma) return ''; const h = o.h, y = katakXarita(h.k.dataset.xarita).length - 1 - h.y; let q = ''; for (let x = h.x; x < o.olma[0]; x++) q += '→'; for (let x = h.x; x > o.olma[0]; x--) q += '←'; for (let k = y; k < o.olma[1]; k++) q += '↑'; for (let k = y; k > o.olma[1]; k--) q += '↓'; return q }); if (!s) break; await bos(s) } }

await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'nihol') })
await p.goto(U + '?rol=solo'); await p.waitForTimeout(1000)
await p.evaluate(() => { let u = 5; Math.random = () => { u = (u * 1103515245 + 12345) % 2147483648; return u / 2147483648 } })
tek('B0', (await qayd()) === 'B0'); await p.click('#ilova .hn .asos'); await p.waitForTimeout(500)
tek('P1 — «Kirdi» soni yo‘q', (await qayd()) === 'P1' && !/[0-9]/.test(await matn('#ust .hn .hint')))
await keyingi(); tek('P2N — uch karta', (await qayd()) === 'P2N' && (await p.$$('#bol .jk')).length === 3)
await p.locator('#bol .jk').nth(2).click(); await p.waitForTimeout(900)
tek('P2S: har kartada «▶ Sinab ko‘rish»', (await qayd()) === 'P2S' && (await p.$$('#ust .hk-sinab')).length === 3)
for (let i = 0; i < 3; i++) { await p.locator('#ust .jk').nth(i).locator('.hk-sinab').click(); await p.waitForTimeout(300); await gacha((n) => document.querySelectorAll('#ust .jk .jn').length >= n && !document.querySelector('#ust .ekran').dataset.yuryapti, i + 1, 60000) }
tek('P2S: uchala kartani bola o‘zi sinadi', await p.evaluate(() => [...document.querySelectorAll('#ust .jk .jn')].map((x) => x.textContent).join(' | ')) === '✕ ikki o‘yin bir xil | ✕ yana bir xil | ✓ har o‘yin boshqacha')
await keyingi(); tek('P2C', (await qayd()) === 'P2C'); await keyingi(); tek('P3', (await qayd()) === 'P3')
for (let k = 0; k < 3; k++) { await p.click('#ust .hn .asos'); await p.waitForTimeout(150) }
tek('P3: uch bo‘lak o‘zi yoqildi', (await p.$$('#ust .xyl p.on')).length === 3 && (await id()) === 'P3')
await keyingi(); tek('P4', (await qayd()) === 'P4'); await keyingi(); await p.waitForTimeout(400)
tek('P6: dastur tayyor — go to x: (random 1 to 10) y: 0; ishora «random sonlarini 1 va 5 ga o‘zgartiring»', (await qayd()) === 'P6' && (await hint()) === 'random sonlarini 1 va 5 ga o‘zgartiring' && (await matn('#ilova .dsn')) === '2 / 2 ta blok', await hint())
await ishga(); tek('P6: «8» — Kamvoy «Maydon tugadi!»', (await hint()) === 'random 8 ni tanladi. Maydonda X — 0 dan 6 gacha')
await p.evaluate(() => { BL_WS.get(document.querySelector('#ilova .ekran')).getBlocksByType('random_n', false)[0].setFieldValue('5', 'B') }); await ishga(3)
tek('P6: 1 to 5 — uch marta: «Har safar boshqa joy!»', (await hint()) === 'Har safar boshqa joy!', await hint())
await keyingi(); tek('B1A: «Keyingi ›» bor', (await qayd()) === 'B1A' && (await p.$$('#bol .hn .k-solo')).length === 1)
await dastur([['y', 'r0-6,2']]); for (let i = 0; i < 9 && (await id()) === 'B1A'; i++) { await ishga(); await gacha(() => document.querySelector('#ilova .ekran')?.dataset.id !== 'B1A', null, 1800) }
tek('B1A: haqiqiy tasodif bilan — «Har safar boshqa joy!» → B1B o‘zi ochildi', (await qayd()) === 'B1B')
await keyingi(); await qayd(); await keyingi(); await qayd(); await keyingi()
tek('P4B', (await qayd()) === 'P4B'); await keyingi(); await p.waitForTimeout(400)
tek('P7: tayyor go(R3-5, 1); ishora «Y ga ham random qo‘ying»', (await qayd()) === 'P7' && (await hint()) === 'Y ga ham random qo‘ying', await hint())
await keyingi(); tek('B2A', (await qayd()) === 'B2A'); await keyingi(); await qayd(); await keyingi(); await qayd(); await keyingi(); await qayd(); await keyingi()
tek('P9', (await qayd()) === 'P9'); await keyingi(); tek('P4C', (await qayd()) === 'P4C'); await keyingi(); await p.waitForTimeout(400)
tek('P8: olma dasturi tayyor (random 0 to 6)', (await qayd()) === 'P8' && (await matn('#ilova .dsn')) === '2 / 2 ta blok')
await ishga(); await terib(); tek('P8: bola o‘zi o‘ynadi — 5 olma, «Siz yutdingiz!»', (await hint()) === 'Siz yutdingiz!', await hint())
await keyingi(); tek('B3A', (await qayd()) === 'B3A')
await dastur([['y', 'r3-5,r0-2']]); await ishga(); await terib(); await gacha(() => document.querySelector('#ilova .ekran')?.dataset.id === 'B3B', null, 6000)
tek('B3A: 5 olma terildi → B3B', (await qayd()) === 'B3B')
await keyingi(); await qayd(); await keyingi(); await qayd(); await keyingi()
tek('16, 18-qadam yo‘q — B5', (await qayd()) === 'B5'); await p.waitForTimeout(600)
const son = () => p.evaluate(() => ['ta random qo‘ydi', 'ta olma terdi'].map((k) => document.querySelector('#bol .sn-t[data-k="' + k + '"] b').textContent).join(','))
tek('B5: o‘z natijasi — 3 ta random (B1A 1 + B3A 2), 5 ta olma terdi', (await son()) === '3,5', await son())
const KUT = 'B0 P1 P2N P2S P2C P3 P4 P6 B1A B1B B1C B1Y P4B P7 B2A B2B B2C B2Y P9 P4C P8 B3A B3B B3C B3Y B5'
tek('solo yo‘li: 26 ekran, 16 va 18-qadamsiz', yol.join(' ') === KUT, yol.join(' '))
tek('konsolda xato yo‘q', !xato.length, xato.slice(0, 3).join(' | '))
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()
process.exit(ok === jami ? 0 : 1)
