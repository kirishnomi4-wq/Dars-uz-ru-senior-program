// 6-dars «Amaliyot» — solo sinovi (20.11): bola darsni ustozsiz o'tadi (manba 006, «Solo»; 88-qaror).
// Ekranlar tartibi (16, 18-qadam yo'q, doskalar o'rniga darhol o'z ekrani), uch kartani bola o'zi sinaydi, 5- va 7-qadamda «Keyingi»ni o'zi bosadi,
// 10-qadamda tayyor rasmni o'zi ishga tushiradi, 14-qadamda olma qolsa — «Ikki repeat ni bosing — joyi almashadi» va joy almashtirishni o'zi qiladi,
// «Maslahat» solo'da ham qulf bilan, pog'ona bajarilsa keyingisi o'zi ochiladi, «Keyingi ›» bilan o'tkazish, yangilansa o'sha joydan, natija.
// Ishlatish (lokal server 5340 yoniq, demo-006 yig'ilgan): node new-junior/sinov/demo/006-solo.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-006.html'
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }), xato = []
const p = await (await b.newContext({ viewport: { width: 1440, height: 810 } })).newPage()
p.on('pageerror', (e) => xato.push(e.message)); p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) xato.push(m.text()) })
let ok = 0, jami = 0
const tek = (nom, s, iz = '') => { jami++; if (s) ok++; console.log((s ? '✓ ' : '✗ ') + nom + (s || iz === '' ? '' : '  — ' + iz)) }
const id = () => p.evaluate(() => (document.querySelector('#ilova .ekran') || {}).dataset?.id || '')
const matn = (s) => p.$eval(s, (e) => e.textContent.trim()).catch(() => '')
const gacha = async (f, arg, ms = 15000) => { try { await p.waitForFunction(f, arg, { timeout: ms }); return true } catch { return false } }
const ishga = async () => { await p.click('#ilova .hn .ishga, #ilova .hn .asos:not(.k-solo)'); await p.waitForTimeout(250); await gacha(() => { const e = document.querySelector('#ilova .ekran'); return e && !e.dataset.yuryapti }, null, 30000); await p.waitForTimeout(150) }
const keyingi = async () => { await p.click('#ilova .hn .asos.k-solo, #ust .hn .asos'); await p.waitForTimeout(500) }
const qur = (s) => p.evaluate((s) => { const d = [...s.matchAll(/p(\d+)\[([rlud]+)\]|g(\d),(\d)|[rlud]/g)].map((m) => (m[1] ? { t: 'p', m: m[1], ichki: [...m[2]].map((t) => ({ t })) } : m[3] ? { t: 'x', m: m[3] + ',' + m[4] } : { t: m[0] })); const ek = document.querySelector('#ilova .ekran'); blQur(ek, d); sanoq(ek) }, s)
const yol = []
const qayd = async () => { const e = await id(); if (yol[yol.length - 1] !== e) yol.push(e); return e }
await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'nihol') })
await p.goto(U + '?rol=solo'); await p.waitForTimeout(1000)
tek('B0', (await qayd()) === 'B0'); await p.click('#ilova .hn .asos'); await p.waitForTimeout(500)
tek('P1 — «Kirdi» soni yo‘q', (await qayd()) === 'P1' && !/[0-9]/.test(await matn('#ust .hn .hint')))
await keyingi(); tek('P2N', (await qayd()) === 'P2N'); await p.locator('#bol .jk').nth(0).click(); await p.waitForTimeout(900)
tek('P2S: «▶ Sinab ko‘rish» har kartada', (await qayd()) === 'P2S' && (await p.$$('#ust .hk-sinab')).length === 3)
for (let i = 0; i < 3; i++) { await p.locator('#ust .jk').nth(i).locator('.hk-sinab').click(); await gacha((n) => document.querySelectorAll('#ust .jk .jn').length >= n && !document.querySelector('#ust .ekran').dataset.yuryapti, i + 1, 25000) }
tek('P2S: bola uchalasini sinadi', await p.evaluate(() => [...document.querySelectorAll('#ust .jk .jn')].map((x) => x.textContent).join(' | ')) === '✕ sig‘madi: 4 ta blok | ✕ olmalar qoldi | ✓ 3 ta blok')
await keyingi(); await qayd(); await keyingi(); tek('P3', (await qayd()) === 'P3')
for (let k = 0; k < 3; k++) { await p.click('#ust .hn .asos'); await p.waitForTimeout(120) }
tek('P3: uch qatorni o‘zi yoqdi', (await p.$$('#ust .xyl .xq.on')).length === 3 && (await id()) === 'P3')
await keyingi(); await qayd(); await keyingi(); tek('P6: qoida', (await qayd()) === 'P6')
for (let k = 0; k < 3; k++) { await p.click('#ust .hn .asos'); await p.waitForTimeout(120) }
tek('P6: uch qoidani o‘zi yoqdi', (await p.$$('#ust .xyl .xq.on')).length === 3 && (await id()) === 'P6')
await keyingi(); tek('B1A: darhol o‘z topshirig‘i; «Keyingi ›»; «Maslahat» solo’da ham qulf', (await qayd()) === 'B1A' && (await p.$$('#bol .hn .k-solo')).length === 1 && (await p.$$('#bol .hn .mas.qulf')).length === 1)
await qur('uurr'); await ishga(); await gacha(() => document.querySelector('#ilova .ekran')?.dataset.id === 'B1B', null, 5000)
tek('B1A bajarildi → B1B', (await qayd()) === 'B1B')
await p.reload(); await p.waitForTimeout(1200); tek('yangilandi — o‘sha joydan (B1B)', (await id()) === 'B1B')
await keyingi(); await qayd(); await keyingi(); await qayd(); tek('«Keyingi ›» bilan B1Y', (await id()) === 'B1Y'); await keyingi()
tek('P4B', (await qayd()) === 'P4B'); await keyingi()
tek('P7: tayyor rasm dasturi', (await qayd()) === 'P7' && (await matn('#ust .dsn')) === '4 ta blok')
await ishga(); tek('P7: o‘zi ishga tushirdi — «Rasm tayyor!»', (await matn('#ust .hn .hint')) === 'Rasm tayyor!')
await keyingi(); tek('B2A', (await qayd()) === 'B2A')
await qur('p6[r]'); await ishga(); await gacha(() => document.querySelector('#ilova .ekran')?.dataset.id === 'B2B', null, 5000)
tek('B2A chiziq → B2B', (await qayd()) === 'B2B')
for (const e of ['B2C', 'B2Y']) { await keyingi(); await qayd() }
await keyingi(); tek('P9', (await qayd()) === 'P9'); await keyingi(); tek('P4C', (await qayd()) === 'P4C'); await keyingi()
tek('P8: tayyor dastur', (await qayd()) === 'P8')
await ishga(); tek('P8: olma qoldi — solo ishorasi «Ikki repeat ni bosing — joyi almashadi»', (await matn('#ust .hn .hint')) === 'Ikki repeat ni bosing — joyi almashadi', await matn('#ust .hn .hint'))
await p.locator('#ust .jr-bl .mb').nth(2).click({ position: { x: 14, y: 12 } }); await p.waitForTimeout(350); await p.locator('#ust .jr-bl .mb').nth(0).click({ position: { x: 14, y: 12 } }); await p.waitForTimeout(450)
await ishga(); tek('P8: o‘zi almashtirdi — «Yetib bordi!»', (await matn('#ust .hn .hint')) === 'Yetib bordi!', await matn('#ust .hn .hint'))
await keyingi(); tek('B3A', (await qayd()) === 'B3A')
await qur('g3,1 p3[u]'); await ishga(); await gacha(() => document.querySelector('#ilova .ekran')?.dataset.id === 'B3B', null, 5000)
tek('B3A ustun → B3B', (await qayd()) === 'B3B')
for (const e of ['B3C', 'B3Y']) { await keyingi(); await qayd() }
await keyingi(); tek('16-qadam yo‘q — B5', (await qayd()) === 'B5')
const son = () => p.evaluate(() => ['pog‘ona bajardi', 'ta go to qo‘ydi', 'ta repeat qo‘ydi'].map((k) => document.querySelector('#bol .sn-t[data-k="' + k + '"] b').textContent).join(','))
tek('B5: 3 pog‘ona, 1 go to, 2 repeat (B1A, B2A, B3A)', (await son()) === '3,1,2', await son())
tek('solo yo‘li: 26 ekran', yol.join(' ') === 'B0 P1 P2N P2S P2C P3 P4 P6 B1A B1B B1C B1Y P4B P7 B2A B2B B2C B2Y P9 P4C P8 B3A B3B B3C B3Y B5', yol.join(' '))
tek('konsolda xato yo‘q', !xato.length, xato.slice(0, 3).join(' | '))
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()
process.exit(ok === jami ? 0 : 1)
