// 2-dars «Labirint» — solo sinovi (dvigatel 5b-3, 19.11): bola darsni ustozsiz o'zi o'tadi (manba 002, «Solo» bo'limi; 88-qaror).
// Ekranlar tartibi (16 va 18-qadam yo'q, doskalar o'rniga darhol o'z ekrani), sinf sonlari yo'q, uch sinovni bola o'zi ishga tushiradi,
// 7 va 14-qadamda dastur tayyor (bola ishga tushiradi va bloklar joyini o'zi almashtiradi), 10-qadamda solo ishorasi, pog'ona yechilsa
// keyingisi o'zi ochiladi, «Keyingi ›» bilan o'tkazib yuborsa ham bo'ladi, sahifa yangilansa o'sha joydan, oxiri — o'z natijasi.
// Ishlatish (lokal server 5340 yoniq, demo-002 yig'ilgan): node new-junior/sinov/demo/002-solo.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-002.html'
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }), xato = []
const p = await (await b.newContext({ viewport: { width: 1440, height: 810 } })).newPage()
p.on('pageerror', (e) => xato.push(e.message)); p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) xato.push(m.text()) })
let ok = 0, jami = 0
const tek = (nom, s, iz = '') => { jami++; if (s) ok++; console.log((s ? '✓ ' : '✗ ') + nom + (s || iz === '' ? '' : '  — ' + iz)) }
const id = () => p.evaluate(() => (document.querySelector('#ilova .ekran') || {}).dataset?.id || '')
const ildiz = () => p.evaluate(() => (document.querySelector('#ilova > div') || {}).id)
const matn = (s) => p.$eval(s, (e) => e.textContent.trim()).catch(() => '')
const gacha = async (f, arg, ms = 15000) => { try { await p.waitForFunction(f, arg, { timeout: ms }); return true } catch { return false } }
const BLOK = { r: 'move right', l: 'move left', u: 'move up', d: 'move down' }
const qosh = async (d) => { for (const t of d) { await p.locator('#ilova .pl .mbw:not(.yopiq) .mb', { hasText: BLOK[t] }).first().click(); await p.waitForTimeout(90) } }
const dastur = () => p.evaluate(() => blBloklar(document.querySelector('#ilova .ekran')).map(blokTuri).join(''))
const ishga = async () => { await p.click('#ilova .hn .ishga, #ilova .hn .asos:not(.k-solo)'); await p.waitForTimeout(250); await gacha(() => { const e = document.querySelector('#ilova .ekran'); return e && !e.dataset.yuryapti }, null, 20000); await p.waitForTimeout(150) }
const bos = async (n) => { await p.locator('#ilova .jr-bl .mb').nth(n).click({ position: { x: 18, y: 14 } }); await p.waitForTimeout(350) }
const keyingi = async () => { await p.click('#ilova .hn .asos.k-solo, #ust .hn .asos'); await p.waitForTimeout(500) }
const yol = []
const qayd = async () => { const e = await id(); if (yol[yol.length - 1] !== e) yol.push(e); return e }

await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'nihol') })
await p.goto(U + '?rol=solo'); await p.waitForTimeout(1000)
tek('B0: «Salom, Aziz!»', (await qayd()) === 'B0' && (await matn('#ilova .sar, #ilova .qarang b')).includes('Aziz'))
await p.click('#ilova .hn .asos'); await p.waitForTimeout(500)
tek('P1 — bola o‘zi ko‘radi, «Kirdi» soni yo‘q', (await qayd()) === 'P1' && !/[0-9]/.test(await matn('#ust .hn .hint')))
await keyingi()
tek('P2N: kartani tanlaydi', (await qayd()) === 'P2N'); await p.locator('#bol .jk').nth(0).click(); await p.waitForTimeout(900)
tek('P2S: har kartada «▶ Sinab ko‘rish», o‘zi boshlanmaydi', (await qayd()) === 'P2S' && (await p.$$('#ust .hk-sinab')).length === 3 && !(await p.$$('#ust .jk .jn')).length)
tek('P2S: kartada sinf soni yo‘q, faqat o‘z javobi (A)', await p.evaluate(() => [...document.querySelectorAll('#ust .jk .jr-s')].map((s) => s.style.visibility === 'hidden' ? '-' : s.lastChild.textContent).join('')) === '1--')
for (let i = 0; i < 3; i++) { await p.locator('#ust .jk').nth(i).locator('.hk-sinab').click(); await gacha((n) => document.querySelectorAll('#ust .jk .jn').length >= n, i + 1) }
tek('P2S: bola uchalasini sinadi — A, B urildi, C chiqdi', await p.evaluate(() => [...document.querySelectorAll('#ust .jk .jn')].map((x) => x.textContent).join(' | ')) === '✕ devorga urildi | ✕ devorga urildi | ✓ chiqdi')
await keyingi(); tek('P2C', (await qayd()) === 'P2C')
await keyingi(); tek('P3: bola «Keyingi» bilan raqamlarni o‘zi yoqadi', (await qayd()) === 'P3')
for (let k = 0; k < 6; k++) { await p.click('#ust .hn .asos'); await p.waitForTimeout(120) }
tek('P3: 6 raqam yondi, ekran o‘sha', (await p.$$('#ust .dk-q.on')).length === 6 && (await id()) === 'P3')
await keyingi(); tek('P4 (reja)', (await qayd()) === 'P4')
await keyingi(); tek('P6: dastur tayyor → ↑ → →, ▶ Ishga tushir bor', (await qayd()) === 'P6' && (await dastur()) === 'rurr' && (await p.$$('#ust .hn .ishga')).length === 1)
await ishga(); tek('P6: bola o‘zi ishga tushirdi — yulduzda', (await matn('#ust .hn .hint')) === 'Yetib bordi!')
await keyingi(); tek('B2: doska yo‘q — darhol o‘z topshirig‘i; «Keyingi ›» bor', (await qayd()) === 'B2' && (await p.$$('#bol .hn .k-solo')).length === 1)
await qosh('uurrr'); await ishga(); await gacha(() => document.querySelector('#ilova .ekran')?.dataset.id === 'B2B', null, 5000)
tek('B2 yechildi → keyingi pog‘ona o‘zi ochildi (B2B)', (await qayd()) === 'B2B')
await p.reload(); await p.waitForTimeout(1200)
tek('sahifa yangilandi — o‘sha joydan (B2B)', (await id()) === 'B2B')
await keyingi(); await qayd(); await keyingi(); await qayd()
tek('«Keyingi ›» bilan pog‘onalar o‘tkazib yuborildi (B2Y)', (await id()) === 'B2Y'); await keyingi()
tek('P4B', (await qayd()) === 'P4B'); await keyingi()
tek('P7: tayyor dastur → → ↑ → ↑ →', (await qayd()) === 'P7' && (await dastur()) === 'rrurur')
await ishga(); tek('P7: urildi → solo ishorasi «4-blokni bitta pastga ko‘chiring»', (await matn('#ust .hn .hint')) === '4-blokni bitta pastga ko‘chiring')
await bos(3); await bos(4); await ishga(); tek('P7: bola o‘zi almashtirdi — yulduzda', (await dastur()) === 'rruurr' && (await matn('#ust .hn .hint')) === 'Yetib bordi!')
await keyingi(); tek('B3A: tayyor xatoli dastur', (await qayd()) === 'B3A' && (await dastur()) === 'ururr')
await bos(1); await bos(2); await ishga(); await gacha(() => document.querySelector('#ilova .ekran')?.dataset.id === 'B3B', null, 5000)
tek('B3A tuzatildi → B3B', (await qayd()) === 'B3B')
for (const e of ['B3C', 'B3Y']) { await keyingi(); await qayd() }
await keyingi(); tek('P9', (await qayd()) === 'P9'); await keyingi(); tek('P4C', (await qayd()) === 'P4C'); await keyingi()
tek('P8K: dastur tayyor ↑ → → →', (await qayd()) === 'P8K' && (await dastur()) === 'urrr')
await ishga(); tek('P8K: eshik yopiq — «Kalit qani?»', (await matn('#ust .dv-muam')).includes('Kalit qani?'))
await bos(0); await bos(1); await ishga(); tek('P8K: almashtirdi — kalit bilan chiqdi', (await matn('#ust .hn .hint')) === 'Yetib bordi!')
await keyingi(); tek('B4A', (await qayd()) === 'B4A'); await qosh('rluurrrr'); await ishga(); await gacha(() => document.querySelector('#ilova .ekran')?.dataset.id === 'B4B', null, 5000)
tek('B4A yechildi → B4B', (await qayd()) === 'B4B')
await keyingi(); await qayd(); await keyingi()
tek('16-qadam (o‘qib berish) yo‘q — darhol B5', (await qayd()) === 'B5')
tek('B5: o‘z natijasi — qadam 5+5+8 = 18, tuzatilgan xato 1, labirint 3', await p.evaluate(() => ['qadam', 'tuzatilgan xato', 'labirint'].map((k) => document.querySelector('#bol .sn-t[data-k="' + k + '"] b').textContent).join(',')) === '18,1,3', await p.evaluate(() => ['qadam', 'tuzatilgan xato', 'labirint'].map((k) => document.querySelector('#bol .sn-t[data-k="' + k + '"] b').textContent).join(',')))
tek('B5 — oxirgi ekran: «Keyingi» yo‘q', !(await p.$$('#ilova .hn .asos')).length)
const KUT = 'B0 P1 P2N P2S P2C P3 P4 P6 B2 B2B B2C B2Y P4B P7 B3A B3B B3C B3Y P9 P4C P8K B4A B4B B4Y B5'
tek('solo yo‘li: 25 ekran, 16 va 18-qadamsiz, sinf doskalarisiz', yol.join(' ') === KUT, yol.join(' '))
tek('konsolda xato yo‘q', !xato.length, xato.slice(0, 3).join(' | '))
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()
process.exit(ok === jami ? 0 : 1)
