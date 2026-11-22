// 14-dars «Xatoni topish» — solo sinovi (21.11): bola darsni ustozsiz o'zi o'tadi (manba 014, «Solo»; 88-qaror).
// 3-qadamda uch kartani bola o'zi sinaydi (C — «Bitta qadam» bilan), 5- va 7-qadamda qatorlarni o'zi yoqadi, 10-qadamda «Bitta qadam» va joy almashtirishni
// o'zi qiladi (ishora — joy almashtirish), 14-qadamda random ni o'zi o'zgartiradi; pog'ona bajarilsa keyingisi o'zi ochiladi; 16 va 18-qadam yo'q.
// Kutilgan natija (qo'lda): B1A va B2A bajarildi — 2 xato, B2A da 3 marta «Bitta qadam» (P-ekranlardagi bosish sanalmaydi), 2 pog'ona.
// Ishlatish (lokal server 5340 yoniq, demo-014 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/demo/014-solo.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-014.html'
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }), xato = []
const p = await (await b.newContext({ viewport: { width: 1440, height: 810 } })).newPage()
p.on('pageerror', (e) => xato.push(e.message)); p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) xato.push(m.text()) })
let ok = 0, jami = 0
const tek = (nom, s, iz = '') => { jami++; if (s) ok++; console.log((s ? '✓ ' : '✗ ') + nom + (s || iz === '' ? '' : '  — ' + iz)) }
const id = () => p.evaluate(() => (document.querySelector('#ilova .ekran') || {}).dataset?.id || '')
const matn = (s) => p.$eval(s, (e) => e.textContent.trim()).catch(() => '')
const gacha = async (f, arg, ms = 15000) => { try { await p.waitForFunction(f, arg, { timeout: ms }); return true } catch { return false } }
const tinch = () => gacha(() => { const e = document.querySelector('#ilova .ekran'); return e && !e.dataset.yuryapti }, null, 60000)
const tugma = () => p.evaluate(() => document.querySelector('#ilova .hn .ishga') ? '#ilova .hn .ishga' : '#ilova .hn .asos:not(.k-solo)')
const ishga = async (n = 1) => { for (let i = 0; i < n; i++) { await p.click(await tugma()); await p.waitForTimeout(400); await tinch() } }
const qadamB = async (n = 1) => { for (let i = 0; i < n; i++) { await p.click('#ilova .hn .bq-t'); await p.waitForTimeout(150); await gacha(() => { const e = document.querySelector('#ilova .ekran'); return !e.dataset.yuryapti || (e.__bq && e.__bq.kut) }, null, 10000) } await p.waitForTimeout(250) }
const keyingi = async () => { await p.click('#ilova .hn .asos.k-solo, #ust .hn .asos'); await p.waitForTimeout(600) }
const hint = () => matn('#ilova .hn .hint')
const muam = () => p.evaluate(() => { const m = document.querySelector('#ilova .dv-muam'); return m ? (m.className.match(/m-(\w+)/) || [])[1] + ':' + m.textContent.trim() : '' })
const yol = [], qayd = async () => { const e = await id(); if (yol[yol.length - 1] !== e) yol.push(e); return e }
const dastur = (d) => p.evaluate((d) => {
  const ek = document.querySelector('#ilova .ekran'), ws = BL_WS.get(ek); ws.clear()
  const zanjir = (ota, q, ichki) => { let o = null; for (const [t, m, ich] of q) { const x = blYangi(ws, t, m); if (o) o.nextConnection.connect(x.previousConnection); else if (ichki) ota.getInput('DO').connection.connect(x.previousConnection); else x.moveTo(new Blockly.utils.Coordinate(0, 0)); if (ich) zanjir(x, ich, true); o = x } }
  zanjir(null, d, false); ws.getAllBlocks(false).forEach(blBelgila); blMasshtab(ek, ws); sanoq(ek)
}, d).then(() => p.waitForTimeout(300))
const bosBlok = (tur) => p.evaluate((tur) => { const ek = document.querySelector('#ilova .ekran'), ws = BL_WS.get(ek), x = ws.getAllBlocks(true).find((q) => q.type === tur); blTanlaBos(ek, ws, x) }, tur).then(() => p.waitForTimeout(300))

await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'nihol') })
await p.goto(U + '?rol=solo'); await p.waitForTimeout(1000)
await p.evaluate(() => { let u = 5; Math.random = () => { u = (u * 1103515245 + 12345) % 2147483648; return u / 2147483648 } })
tek('B0', (await qayd()) === 'B0'); await p.click('#ilova .hn .asos'); await p.waitForTimeout(500)
tek('P1 — «Kirdi» soni yo‘q', (await qayd()) === 'P1' && !/[0-9]/.test(await matn('#ust .hn .hint')))
await keyingi(); tek('P2N — uch karta', (await qayd()) === 'P2N' && (await p.$$('#bol .jk')).length === 3)
await p.locator('#bol .jk').nth(2).click(); await p.waitForTimeout(900)
tek('P2S: har kartada «▶ Sinab ko‘rish»', (await qayd()) === 'P2S' && (await p.$$('#ust .hk-sinab')).length === 3)
for (let i = 0; i < 3; i++) { await p.locator('#ust .jk').nth(i).locator('.hk-sinab').click(); await p.waitForTimeout(300); await gacha((n) => document.querySelectorAll('#ust .jk .jn').length >= n && !document.querySelector('#ust .ekran').dataset.yuryapti, i + 1, 60000) }
tek('P2S: uchala kartani bola o‘zi sinadi (C — «Bitta qadam» bilan)', await p.evaluate(() => [...document.querySelectorAll('#ust .jk .jn')].map((x) => x.textContent).join(' | ')) === '✕ xato boshqa joyda | ✕ rasm battar | ✓ 5-qadamda topildi')
await keyingi(); tek('P2C', (await qayd()) === 'P2C'); await keyingi(); tek('P3', (await qayd()) === 'P3')
for (let k = 0; k < 4; k++) { await p.click('#ust .hn .asos'); await p.waitForTimeout(150) }
tek('P3: to‘rt qator o‘zi yoqildi', (await p.$$('#ust .xyl .xq.on')).length === 4 && (await id()) === 'P3')
await keyingi(); tek('P4', (await qayd()) === 'P4'); await keyingi()
for (let k = 0; k < 3; k++) { await p.click('#ust .hn .asos'); await p.waitForTimeout(150) }
tek('P6: uch qator o‘zi yoqildi', (await qayd()) === 'P6' && (await p.$$('#ust .xyl .xq.on')).length === 3)
await keyingi(); tek('B1A: «Keyingi ›» va «Bitta qadam» bor', (await qayd()) === 'B1A' && (await p.$$('#bol .hn .k-solo')).length === 1 && (await p.$$('#bol .hn .bq-t')).length === 1)
await ishga(); tek('B1A: chet — Kamvoy', (await muam()) === 'kamvoy:Maydon tugadi!')
await dastur([['p', '4', [['r']]], ['p', '2', [['u']]]]); await ishga(); await gacha(() => document.querySelector('#ilova .ekran')?.dataset.id === 'B1B', null, 6000)
tek('B1A tuzatildi → B1B o‘zi ochildi', (await qayd()) === 'B1B')
await keyingi(); await qayd(); await keyingi(); await qayd(); await keyingi()
tek('P4B', (await qayd()) === 'P4B'); await keyingi(); await p.waitForTimeout(400)
tek('P7: dastur tayyor, «Bitta qadam» bor', (await qayd()) === 'P7' && (await p.$$('#ilova .hn .bq-t')).length === 1)
await qadamB(1); await tinch()
tek('P7: «Bitta qadam» — rasmdan chiqdi; solo ishorasi — joy almashtirish', (await muam()) === 'ortiqvoy:Rasmdan chiqdi!' && (await hint()) === 'move right va move up ni bosing — joyi almashadi', await hint())
await bosBlok('move_right'); await bosBlok('move_up'); await ishga()
tek('P7: o‘zi almashtirdi — «Rasm tayyor!»', (await hint()) === 'Rasm tayyor!', await hint())
await keyingi(); tek('B2A', (await qayd()) === 'B2A')
await qadamB(3); await tinch(); tek('B2A: 3-qadamda rasmdan chiqdi', (await hint()) === '3-qadam: qahramon (0, 3) ga chiqdi. Shu blokni va undan oldingisini o‘qing', await hint())
await dastur([['p', '2', [['u']]], ['p', '3', [['r']]]]); await ishga(); await gacha(() => document.querySelector('#ilova .ekran')?.dataset.id === 'B2B', null, 6000)
tek('B2A tuzatildi → B2B', (await qayd()) === 'B2B')
await keyingi(); await qayd(); await keyingi(); await qayd(); await keyingi()
tek('P9', (await qayd()) === 'P9'); await keyingi(); tek('P4C', (await qayd()) === 'P4C'); await keyingi(); await p.waitForTimeout(400)
tek('P8: olma dasturi tayyor; ishora «7 ni 6 ga o‘zgartiring»', (await qayd()) === 'P8' && (await hint()) === '7 ni 6 ga o‘zgartiring', await hint())
await ishga(3); tek('P8: 4, 2, 7 — uchinchisida Kamvoy «Maydon tugadi!»', (await muam()) === 'kamvoy:Maydon tugadi!', await hint())
await p.evaluate(() => { BL_WS.get(document.querySelector('#ilova .ekran')).getBlocksByType('random_n', false)[0].setFieldValue('6', 'B') }); await ishga(3)
tek('P8: 7 → 6, uch marta — «Har safar boshqa joy!»', (await hint()) === 'Har safar boshqa joy!', await hint())
await keyingi(); tek('B3A', (await qayd()) === 'B3A')
await keyingi(); await qayd(); await keyingi(); await qayd(); await keyingi(); await qayd(); await keyingi()
tek('16, 18-qadam yo‘q — B5', (await qayd()) === 'B5'); await p.waitForTimeout(600)
const son = () => p.evaluate(() => ['ta xato tuzatdi', 'marta «Bitta qadam» bosdi', 'pog‘ona bajardi'].map((k) => document.querySelector('#bol .sn-t[data-k="' + k + '"] b').textContent).join(','))
tek('B5: o‘z natijasi — 2 xato, 3 marta «Bitta qadam», 2 pog‘ona', (await son()) === '2,3,2', await son())
const KUT = 'B0 P1 P2N P2S P2C P3 P4 P6 B1A B1B B1C B1Y P4B P7 B2A B2B B2C B2Y P9 P4C P8 B3A B3B B3C B3Y B5'
tek('solo yo‘li: 26 ekran, 16 va 18-qadamsiz', yol.join(' ') === KUT, yol.join(' '))
tek('konsolda xato yo‘q', !xato.length, xato.slice(0, 3).join(' | '))
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()
process.exit(ok === jami ? 0 : 1)
