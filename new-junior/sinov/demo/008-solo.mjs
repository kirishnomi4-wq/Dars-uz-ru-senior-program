// 8-dars «Shart» — solo sinovi (20.11): bola darsni ustozsiz o'tadi (88-qaror). 16, 18-qadam yo'q; uch kartani bola o'zi sinaydi (ikki labirintda);
// 5-qadamda «Keyingi»ni o'zi bosadi; 7-qadamda dastur tayyor (solo), 10- va 14-qadamda tayyor dasturni o'zi ishga tushiradi; pog'ona bajarilsa keyingisi ochiladi; natija.
// Ishlatish (lokal server 5340 yoniq, demo-008 yig'ilgan): node new-junior/sinov/demo/008-solo.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-008.html'
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }), xato = []
const p = await (await b.newContext({ viewport: { width: 1440, height: 810 } })).newPage()
p.on('pageerror', (e) => xato.push(e.message)); p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) xato.push(m.text()) })
let ok = 0, jami = 0
const tek = (nom, s, iz = '') => { jami++; if (s) ok++; console.log((s ? '✓ ' : '✗ ') + nom + (s || iz === '' ? '' : '  — ' + iz)) }
const id = () => p.evaluate(() => (document.querySelector('#ilova .ekran') || {}).dataset?.id || '')
const matn = (s) => p.$eval(s, (e) => e.textContent.trim()).catch(() => '')
const gacha = async (f, arg, ms = 15000) => { try { await p.waitForFunction(f, arg, { timeout: ms }); return true } catch { return false } }
const ishga = async () => { await p.click('#ilova .hn .ishga, #ilova .hn .asos:not(.k-solo)'); await p.waitForTimeout(250); await gacha(() => { const e = document.querySelector('#ilova .ekran'); return e && !e.dataset.yuryapti }, null, 60000); await p.waitForTimeout(150) }
const keyingi = async () => { await p.click('#ilova .hn .asos.k-solo, #ust .hn .asos'); await p.waitForTimeout(500) }
const blq = (d) => d.map((b) => (Array.isArray(b) ? (b[0] === 'p' ? { t: 'p', m: String(b[1]), ichki: blq(b[2]) } : { t: 'a', m: b[1], ichki: blq(b[2]) }) : { t: b }))
const A = (yon, ...ich) => ['a', yon, ich], RR = (n, ...ich) => ['p', n, ich]
const qur = (d) => p.evaluate((d) => { const ek = document.querySelector('#ilova .ekran'); blQur(ek, d); sanoq(ek) }, blq(d))
const yol = []
const qayd = async () => { const e = await id(); if (yol[yol.length - 1] !== e) yol.push(e); return e }
await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'nihol') })
await p.goto(U + '?rol=solo'); await p.waitForTimeout(1000)
tek('B0', (await qayd()) === 'B0'); await p.click('#ilova .hn .asos'); await p.waitForTimeout(500)
tek('P1 — «Kirdi» soni yo‘q', (await qayd()) === 'P1' && !/[0-9]/.test(await matn('#ust .hn .hint')))
await keyingi(); tek('P2N', (await qayd()) === 'P2N'); await p.locator('#bol .jk').nth(0).click(); await p.waitForTimeout(900)
tek('P2S: «▶ Sinab ko‘rish» har kartada', (await qayd()) === 'P2S' && (await p.$$('#ust .hk-sinab')).length === 3)
for (let i = 0; i < 3; i++) { await p.locator('#ust .jk').nth(i).locator('.hk-sinab').click(); await gacha((n) => document.querySelectorAll('#ust .jk .jn').length >= n && !document.querySelector('#ust .ekran').dataset.yuryapti, i + 1, 40000) }
tek('P2S: bola uchalasini sinadi', await p.evaluate(() => [...document.querySelectorAll('#ust .jk .jn')].map((x) => x.textContent).join(' | ')) === '✕ 2-labirintda yetmadi | ✕ devorga urildi | ✓ ikkalasida yetdi')
await keyingi(); await qayd(); await keyingi(); tek('P3', (await qayd()) === 'P3')
for (let k = 0; k < 3; k++) { await p.click('#ust .hn .asos'); await p.waitForTimeout(120) }
tek('P3: uch qatorni o‘zi yoqdi', (await p.$$('#ust .xyl .xq.on')).length === 3 && (await id()) === 'P3')
await keyingi(); await qayd(); await keyingi()
tek('P6: dastur tayyor — repeat 6 [if ← [←]]', (await qayd()) === 'P6' && (await matn('#ust .dsn')) === '3 / 3 ta blok', await matn('#ust .dsn'))
await ishga(); tek('P6: o‘zi ishga tushirdi — «Ikkalasida yetdi!»', (await matn('#ust .hn .hint')) === 'Ikkalasida yetdi!', await matn('#ust .hn .hint'))
await keyingi(); tek('B1A: darhol o‘z topshirig‘i; «Keyingi ›»', (await qayd()) === 'B1A' && (await p.$$('#bol .hn .k-solo')).length === 1)
await qur([RR(5, A('down', 'd'))]); await ishga(); await gacha(() => document.querySelector('#ilova .ekran')?.dataset.id === 'B1B', null, 5000)
tek('B1A bajarildi → B1B', (await qayd()) === 'B1B')
await p.reload(); await p.waitForTimeout(1200); tek('yangilandi — o‘sha joydan (B1B)', (await id()) === 'B1B')
await keyingi(); await qayd(); await keyingi(); await qayd(); tek('«Keyingi ›» bilan B1Y', (await id()) === 'B1Y'); await keyingi()
tek('P4B', (await qayd()) === 'P4B'); await keyingi()
tek('P7: tayyor repeat 6 [if → [→]]', (await qayd()) === 'P7')
tek('P7: solo’da dastur ikki shart bilan to‘liq tayyor (5 / 5)', (await matn('#ust .dsn')) === '5 / 5 ta blok', await matn('#ust .dsn'))
await ishga(); tek('P7: o‘zi ishga tushirdi — «Ikkalasida yetdi!»', (await matn('#ust .hn .hint')) === 'Ikkalasida yetdi!', await matn('#ust .hn .hint'))
await keyingi(); tek('B2A', (await qayd()) === 'B2A')
await qur([RR(6, A('right', 'r'), A('down', 'd'))]); await ishga(); await gacha(() => document.querySelector('#ilova .ekran')?.dataset.id === 'B2B', null, 5000)
tek('B2A → B2B', (await qayd()) === 'B2B')
for (const e of ['B2C', 'B2Y']) { await keyingi(); await qayd() }
await keyingi(); tek('P9', (await qayd()) === 'P9'); await keyingi(); tek('P4C', (await qayd()) === 'P4C'); await keyingi()
tek('P8: tayyor repeat 2 [if ← [←]]', (await qayd()) === 'P8')
await ishga(); tek('P8: o‘zi ishga tushirdi — solo ishorasi «repeat sonini kattaroq qiling…»', (await matn('#ust .hn .hint')) === 'repeat sonini kattaroq qiling va qayta ishga tushiring', await matn('#ust .hn .hint'))
await qur([RR(5, A('left', 'l'))]); await ishga(); tek('P8: sonni o‘zi 5 qildi — «Xatoni tuzatdingiz!»', (await matn('#ust .hn .hint')) === 'Xatoni tuzatdingiz!', await matn('#ust .hn .hint'))
await keyingi(); tek('B3A', (await qayd()) === 'B3A')
await qur([RR(7, A('right', 'r'))]); await ishga(); await gacha(() => document.querySelector('#ilova .ekran')?.dataset.id === 'B3B', null, 5000)
tek('B3A tuzatildi → B3B', (await qayd()) === 'B3B')
for (const e of ['B3C', 'B3Y']) { await keyingi(); await qayd() }
await keyingi(); tek('16-qadam yo‘q — B5', (await qayd()) === 'B5')
const son = () => p.evaluate(() => ['ta shart qo‘ydi', 'ta labirintdan o‘tdi', 'ta xato tuzatdi'].map((k) => document.querySelector('#bol .sn-t[data-k="' + k + '"] b').textContent).join(','))
tek('B5: 1 + 2 + 1 = 4 shart, 6 labirint, 1 xato (B1A, B2A, B3A)', (await son()) === '4,6,1', await son())
tek('solo yo‘li: 26 ekran', yol.join(' ') === 'B0 P1 P2N P2S P2C P3 P4 P6 B1A B1B B1C B1Y P4B P7 B2A B2B B2C B2Y P9 P4C P8 B3A B3B B3C B3Y B5', yol.join(' '))
tek('konsolda xato yo‘q', !xato.length, xato.slice(0, 3).join(' | '))
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()
process.exit(ok === jami ? 0 : 1)
