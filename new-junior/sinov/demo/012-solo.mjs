// 12-dars «Jon va qadam» — solo sinovi (21.11): bola darsni ustozsiz o'zi o'tadi (manba 012, «Solo»; 88-qaror).
// 3-qadamda uch kartani bola o'zi sinaydi, 5-qadamda bo'laklarni o'zi yoqadi, 7, 10, 14-qadamda dastur tayyor — bola o'zi o'ynaydi (ishoralar bilan),
// pog'ona bajarilsa keyingisi o'zi ochiladi, «Keyingi ›» bilan o'tkazsa bo'ladi, 16 va 18-qadam yo'q, oxiri — o'z natijasi.
// Ishlatish (lokal server 5340 yoniq, demo-012 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/demo/012-solo.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-012.html'
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
const tugma = () => p.evaluate(() => document.querySelector('#ilova .hn .ishga') ? '#ilova .hn .ishga' : '#ilova .hn .asos')
const boshla = async () => { await p.click(await tugma()); await p.waitForTimeout(400); await tinch() }
const keyingi = async () => { await p.click('#ilova .hn .asos.k-solo, #ust .hn .asos'); await p.waitForTimeout(600) }
const hint = () => matn('#ilova .hn .hint')
const ozg = () => p.evaluate(() => { const v = {}; document.querySelectorAll('#ilova .oyna .ball-k[data-v]:not(.yoq)').forEach((k) => { v[k.dataset.v] = k.querySelector('b').textContent }); return JSON.stringify(v) })
const tugadi = () => p.evaluate(() => !!document.querySelector('#ilova .oyin-tugadi'))
const yol = [], qayd = async () => { const e = await id(); if (yol[yol.length - 1] !== e) yol.push(e); return e }
const dastur = (d) => p.evaluate((d) => {
  const ek = document.querySelector('#ilova .ekran'), ws = BL_WS.get(ek); ws.clear()
  const zanjir = (ota, q, ichki) => { let o = null; for (const [t, m, ich] of q) { const x = blYangi(ws, t, m); if (o) o.nextConnection.connect(x.previousConnection); else if (ichki) ota.getInput('DO').connection.connect(x.previousConnection); else ota.nextConnection.connect(x.previousConnection); if (ich) zanjir(x, ich, true); o = x } }
  d.forEach(([[t, m], q], i) => { const h = blYangi(ws, t, m); h.moveTo(new Blockly.utils.Coordinate(0, 1000 * i)); zanjir(h, q || [], false) })
  ws.getAllBlocks(false).forEach(blBelgila); blTartib(ws); blMasshtab(ek, ws); sanoq(ek)
}, d).then(() => p.waitForTimeout(300))
const ST = (o) => [['f'], Object.entries(o).map(([n, v]) => ['z', n + ':' + v])]
const JQR = [['c', 'jon:-1'], ['i', 'jon:0', [['g']]]], QQR = [['c', 'qadam:-1'], ['i', 'qadam:0', [['g']]]]
const KAK = (q) => [['q', 'cactus'], q], OLM = (n) => [['q', 'apple'], [['c', 'ball:' + n]]], ANY = (q) => [['k', 'any'], q]
// yo'llar — sinov/dvigatel/jon.mjs mustaqil hisobida tekshirilgan
const Y = { P7: '↑→→↓↑↑→↑→→↓→↑↑', B2A: '↑↑↑→→↓→↓↑→→→↓↓' }

await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'nihol') })
await p.goto(U + '?rol=solo'); await p.waitForTimeout(1000)
tek('B0', (await qayd()) === 'B0'); await p.click('#ilova .hn .asos'); await p.waitForTimeout(500)
tek('P1 — «Kirdi» soni yo‘q', (await qayd()) === 'P1' && !/[0-9]/.test(await matn('#ust .hn .hint')))
await keyingi(); tek('P2N — uch karta', (await qayd()) === 'P2N' && (await p.$$('#bol .jk')).length === 3)
await p.locator('#bol .jk').nth(2).click(); await p.waitForTimeout(900)
tek('P2S: har kartada «▶ Sinab ko‘rish»', (await qayd()) === 'P2S' && (await p.$$('#ust .hk-sinab')).length === 3)
for (let i = 0; i < 3; i++) { await p.locator('#ust .jk').nth(i).locator('.hk-sinab').click(); await p.waitForTimeout(300); await gacha((n) => document.querySelectorAll('#ust .jk .jn').length >= n && !document.querySelector('#ust .ekran').dataset.yuryapti, i + 1, 60000) }
tek('P2S: uchala kartani bola o‘zi sinadi', await p.evaluate(() => [...document.querySelectorAll('#ust .jk .jn')].map((x) => x.textContent).join(' | ')) === '✕ jon 3 — tugadi | ✕ jon −1 | ✓ jon 0 — tugadi')
await keyingi(); tek('P2C', (await qayd()) === 'P2C'); await keyingi(); tek('P3', (await qayd()) === 'P3')
for (let k = 0; k < 3; k++) { await p.click('#ust .hn .asos'); await p.waitForTimeout(150) }
tek('P3: uch bo‘lak o‘zi yoqildi', (await p.$$('#ust .xyl p.on')).length === 3 && (await id()) === 'P3')
await keyingi(); tek('P4', (await qayd()) === 'P4'); await keyingi(); await p.waitForTimeout(400)
tek('P6: jon qoidasi tayyor; ishora «↑ ni uch marta bosing — kaktusga teging»', (await qayd()) === 'P6' && (await hint()) === '↑ ni uch marta bosing — kaktusga teging' && (await p.evaluate(() => document.querySelectorAll('#ilova .jr-bl .mb[data-tur="i"]').length)) === 1, await hint())
await boshla(); await bos('↑↑↑'); tek('P6: bola o‘zi ↑↑↑ — «jon: 0», «O‘yin tugadi»', (await ozg()) === '{"jon":"0"}' && (await tugadi()))
await keyingi(); tek('B1A: «Keyingi ›» bor', (await qayd()) === 'B1A' && (await p.$$('#bol .hn .k-solo')).length === 1)
await dastur([ST({ jon: 3 }), KAK(JQR)]); await boshla(); await bos('→→→→'); await gacha(() => document.querySelector('#ilova .ekran')?.dataset.id === 'B1B', null, 6000)
tek('B1A: qoida ishladi → B1B o‘zi ochildi', (await qayd()) === 'B1B')
await p.reload(); await p.waitForTimeout(1500); tek('sahifa yangilandi — o‘sha joydan (B1B), dastur if ichidagisi bilan saqlangan', (await id()) === 'B1B' && (await p.evaluate(() => document.querySelectorAll('#ilova .jr-bl .mb[data-tur="g"]').length)) === 1)
await keyingi(); await qayd(); await keyingi(); await qayd(); await keyingi()
tek('P4B', (await qayd()) === 'P4B'); await keyingi(); await p.waitForTimeout(400)
tek('P7: dastur tayyor — set ball 0, olma, jon qoidasi', (await qayd()) === 'P7' && (await p.evaluate(() => blDasturchalar(document.querySelector('#ilova .ekran')).length)) === 3)
await boshla(); await bos('→' + Y.P7); tek('P7: bola o‘zi — jon 2, ball 3, yutdi', (await ozg()) === '{"ball":"3","jon":"2"}' && (await hint()) === 'Siz yutdingiz!', await ozg())
await keyingi(); tek('B2A', (await qayd()) === 'B2A')
await dastur([ST({ ball: 0, jon: 3 }), OLM(1), KAK(JQR)]); await boshla(); await bos(Y.B2A); await gacha(() => document.querySelector('#ilova .ekran')?.dataset.id === 'B2B', null, 6000)
tek('B2A: ball 3 → B2B', (await qayd()) === 'B2B')
await keyingi(); await qayd(); await keyingi(); await qayd(); await keyingi(); tek('P9', (await qayd()) === 'P9'); await keyingi(); tek('P4C', (await qayd()) === 'P4C'); await keyingi(); await p.waitForTimeout(400)
tek('P8: qadam qoidasi tayyor; ishora «Avval istalgan strelkani 6 marta bosing…»', (await qayd()) === 'P8' && (await hint()) === 'Avval istalgan strelkani 6 marta bosing, keyin yulduzga boring', await hint())
await boshla(); await bos('↑↑↓↓↑↑'); tek('P8: 6-bosishda «O‘yin tugadi»', (await tugadi()) && (await ozg()) === '{"qadam":"0"}')
await boshla(); await bos('→→→→'); tek('P8: →→→→ — yutdi, qadam 2', (await hint()) === 'Siz yutdingiz!' && (await ozg()) === '{"qadam":"2"}')
await keyingi(); tek('B3A — tayyor o‘yin', (await qayd()) === 'B3A')
await dastur([ST({ ball: 0, jon: 3, qadam: 5 }), OLM(1), KAK(JQR), ANY(QQR)]); await boshla(); await bos('→→→→→'); await gacha(() => document.querySelector('#ilova .ekran')?.dataset.id === 'B3B', null, 6000)
tek('B3A: qadam qoidasi ishladi → B3B', (await qayd()) === 'B3B')
await keyingi(); await qayd(); await keyingi(); await qayd(); await keyingi()
tek('16, 18-qadam yo‘q — B5', (await qayd()) === 'B5'); await p.waitForTimeout(600)
const son = () => p.evaluate(() => ['ta o‘yin yutdi', 'ta shart qo‘ydi', 'ta o‘zgaruvchi ishlatdi'].map((k) => document.querySelector('#bol .sn-t[data-k="' + k + '"] b').textContent).join(','))
tek('B5: o‘z natijasi — 1 ta o‘yin yutdi (B2A), 2 ta shart, 3 ta o‘zgaruvchi', (await son()) === '1,2,3', await son())
const KUT = 'B0 P1 P2N P2S P2C P3 P4 P6 B1A B1B B1C B1Y P4B P7 B2A B2B B2C B2Y P9 P4C P8 B3A B3B B3C B3Y B5'
tek('solo yo‘li: 26 ekran, 16 va 18-qadamsiz', yol.join(' ') === KUT, yol.join(' '))
tek('konsolda xato yo‘q', !xato.length, xato.slice(0, 3).join(' | '))
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()
process.exit(ok === jami ? 0 : 1)
