// 3-dars «X va Y» — solo sinovi (20.11): bola darsni ustozsiz o'zi o'tadi (manba 003, «Solo» bo'limi; 88-qaror).
// Ekranlar tartibi (16 va 18-qadam yo'q, doskalar o'rniga darhol o'z ekrani), sinf sonlari yo'q, uch xatni bola o'zi sinaydi, 5 va 7-qadamda
// «Keyingi»ni o'zi bosadi, 10-qadamda dastur tayyor (o'zi ishga tushiradi), 14-qadamda sanoq yozuvlari ko'rinadi va bayroqchani o'zi qo'yadi,
// pog'ona yechilsa keyingisi o'zi ochiladi, «Keyingi ›» bilan o'tkazib yuborsa ham bo'ladi, sahifa yangilansa o'sha joydan, oxiri — o'z natijasi.
// Ishlatish (lokal server 5340 yoniq, demo-003 yig'ilgan): node new-junior/sinov/demo/003-solo.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-003.html'
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }), xato = []
const p = await (await b.newContext({ viewport: { width: 1440, height: 810 } })).newPage()
p.on('pageerror', (e) => xato.push(e.message)); p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) xato.push(m.text()) })
let ok = 0, jami = 0
const tek = (nom, s, iz = '') => { jami++; if (s) ok++; console.log((s ? '✓ ' : '✗ ') + nom + (s || iz === '' ? '' : '  — ' + iz)) }
const id = () => p.evaluate(() => (document.querySelector('#ilova .ekran') || {}).dataset?.id || '')
const matn = (s) => p.$eval(s, (e) => e.textContent.trim()).catch(() => '')
const gacha = async (f, arg, ms = 15000) => { try { await p.waitForFunction(f, arg, { timeout: ms }); return true } catch { return false } }
const dastur = () => p.evaluate(() => blBloklar(document.querySelector('#ilova .ekran')).map((mb) => blokTuri(mb) === 'x' ? 'x' + blokXY(mb).join('') : blokTuri(mb)).join(' '))
const ishga = async () => { await p.click('#ilova .hn .ishga, #ilova .hn .asos:not(.k-solo)'); await p.waitForTimeout(250); await gacha(() => { const e = document.querySelector('#ilova .ekran'); return e && !e.dataset.yuryapti }, null, 20000); await p.waitForTimeout(150) }
const keyingi = async () => { await p.click('#ilova .hn .asos.k-solo, #ust .hn .asos'); await p.waitForTimeout(500) }
const katak = async (x, y) => { const c = await p.evaluate(({ x, y }) => { const k = document.querySelector('#ilova .katak.maydon'), n = k.dataset.xarita.split('|').length, e = k.querySelector('.kt-c[data-k="' + x + ',' + (n - 1 - y) + '"]').getBoundingClientRect(); return [e.left + e.width / 2, e.top + e.height / 2] }, { x, y }); await p.mouse.click(c[0], c[1]); await p.waitForTimeout(300) }
const sonTanla = async (n, i, v) => { await p.locator('#ilova .jr-bl .mb').nth(n).locator('.blocklyDropdownField').nth(i).click(); await p.waitForTimeout(150); await p.locator('.blocklyDropDownDiv .blocklyMenuItem').filter({ hasText: new RegExp('^\\s*' + v + '\\s*$') }).first().click(); await p.waitForTimeout(150) }
const yol = []
const qayd = async () => { const e = await id(); if (yol[yol.length - 1] !== e) yol.push(e); return e }

await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'nihol') })
await p.goto(U + '?rol=solo'); await p.waitForTimeout(1000)
tek('B0: «Salom, Aziz!»', (await qayd()) === 'B0' && (await matn('#ilova .sar, #ilova .qarang b')).includes('Aziz'))
await p.click('#ilova .hn .asos'); await p.waitForTimeout(500)
tek('P1 — bola o‘zi ko‘radi, «Kirdi» soni yo‘q', (await qayd()) === 'P1' && !/[0-9]/.test(await matn('#ust .hn .hint')))
await keyingi()
tek('P2N: xatni tanlaydi', (await qayd()) === 'P2N'); await p.locator('#bol .jk').nth(0).click(); await p.waitForTimeout(900)
tek('P2S: har kartada «▶ Sinab ko‘rish», o‘zi boshlanmaydi', (await qayd()) === 'P2S' && (await p.$$('#ust .hk-sinab')).length === 3 && !(await p.$$('#ust .jk .jn')).length)
for (let i = 0; i < 3; i++) { await p.locator('#ust .jk').nth(i).locator('.hk-sinab').click(); await gacha((n) => document.querySelectorAll('#ust .jk .jn').length >= n && !document.querySelector('#ust .ekran').dataset.yuryapti, i + 1, 20000) }
tek('P2S: bola uchalasini sinadi — 3 katak, 7 katak, bitta katak', await p.evaluate(() => [...document.querySelectorAll('#ust .jk .jn')].map((x) => x.textContent).join(' | ')) === '✕ 3 ta katak | ✕ 7 ta katak | ✓ bitta katak')
await keyingi(); tek('P2C', (await qayd()) === 'P2C')
await keyingi(); tek('P3', (await qayd()) === 'P3')
for (let k = 0; k < 3; k++) { await p.click('#ust .hn .asos'); await p.waitForTimeout(120) }
tek('P3: bola «Keyingi» bilan uch bo‘lakni o‘zi yoqdi, ekran o‘sha', (await p.$$('#ust .xyl p.on')).length === 3 && (await id()) === 'P3')
await keyingi(); tek('P4 (reja)', (await qayd()) === 'P4')
await keyingi(); tek('P6', (await qayd()) === 'P6')
for (let k = 0; k < 3; k++) { await p.click('#ust .hn .asos'); await p.waitForTimeout(120) }
tek('P6: uch bo‘lak, yorliq «(3, 1)»', (await p.$$('#ust .xyl p.on')).length === 3 && await p.$eval('#ust .kt-yr', (e) => e.classList.contains('on')))
await keyingi(); tek('B1A: doska yo‘q — darhol o‘z topshirig‘i; «Keyingi ›» bor', (await qayd()) === 'B1A' && (await p.$$('#bol .hn .k-solo')).length === 1)
await katak(3, 0); await gacha(() => document.querySelector('#ilova .ekran')?.dataset.id === 'B1B', null, 5000)
tek('B1A topildi → keyingi pog‘ona o‘zi ochildi (B1B)', (await qayd()) === 'B1B')
await p.reload(); await p.waitForTimeout(1200)
tek('sahifa yangilandi — o‘sha joydan (B1B)', (await id()) === 'B1B')
await keyingi(); await qayd(); await keyingi(); await qayd()
tek('«Keyingi ›» bilan pog‘onalar o‘tkazib yuborildi (B1Y)', (await id()) === 'B1Y'); await keyingi()
tek('P4B', (await qayd()) === 'P4B'); await keyingi()
tek('P7: tayyor dastur go to (1, 3), go to (4, 2)', (await qayd()) === 'P7' && (await dastur()) === 'x13 x42', await dastur())
await ishga(); tek('P7: bola o‘zi ishga tushirdi — olma olindi, yulduzda', (await matn('#ust .hn .hint')) === 'Yetib bordi!' && (await p.$$('#ust .kt-olma.olindi')).length === 1)
await keyingi(); tek('B2A', (await qayd()) === 'B2A')
await p.locator('#ilova .pl .mbw:not(.yopiq) .mb', { hasText: 'go to' }).first().click(); await p.waitForTimeout(150); await sonTanla(0, 0, 5); await sonTanla(0, 1, 3)
await ishga(); await gacha(() => document.querySelector('#ilova .ekran')?.dataset.id === 'B2B', null, 5000)
tek('B2A yechildi (go to x: 5 y: 3) → B2B', (await qayd()) === 'B2B')
for (const e of ['B2C', 'B2Y']) { await keyingi(); await qayd() }
await keyingi(); tek('P9', (await qayd()) === 'P9'); await keyingi(); tek('P4C', (await qayd()) === 'P4C'); await keyingi()
tek('P8: sanoq yozuvlari darhol ko‘rinadi, solo ishorasi, «▶ Tekshirish» xira', (await qayd()) === 'P8' && (await p.$$('#ust .sq.on')).length === 3 && (await matn('#ust .hn .hint')) === '(3, 2) katakni bosing — bayroqcha qo‘yiladi' && await p.$eval('#ust .hn .ishga', (e) => e.classList.contains('kut')))
await katak(3, 2); await ishga(); tek('P8: bola bayroqcha qo‘ydi va tekshirdi — «Oldindan aytdingiz!»', (await matn('#ust .hn .hint')) === 'Oldindan aytdingiz!')
await keyingi(); tek('B3A: «Tekshirish» xira, «Keyingi ›» bor', (await qayd()) === 'B3A' && await p.$eval('#bol .hn .ishga', (e) => e.classList.contains('kut')) && (await p.$$('#bol .hn .k-solo')).length === 1)
await katak(4, 2); await ishga(); await gacha(() => document.querySelector('#ilova .ekran')?.dataset.id === 'B3B', null, 5000)
tek('B3A oldindan aytildi → B3B', (await qayd()) === 'B3B')
for (const e of ['B3C', 'B3Y']) { await keyingi(); await qayd() }
await keyingi()
tek('16-qadam (o‘qib berish) yo‘q — darhol B5', (await qayd()) === 'B5')
const son = () => p.evaluate(() => ['katak topdi', 'manzilga bordi', 'marta oldindan aytdi'].map((k) => document.querySelector('#bol .sn-t[data-k="' + k + '"] b').textContent).join(','))
tek('B5: o‘z natijasi — 1 katak, 1 manzil, 1 marta', (await son()) === '1,1,1', await son())
tek('B5 — oxirgi ekran: «Keyingi» yo‘q', !(await p.$$('#ilova .hn .asos')).length)
const KUT = 'B0 P1 P2N P2S P2C P3 P4 P6 B1A B1B B1C B1Y P4B P7 B2A B2B B2C B2Y P9 P4C P8 B3A B3B B3C B3Y B5'
tek('solo yo‘li: 26 ekran, 16 va 18-qadamsiz, sinf doskalarisiz', yol.join(' ') === KUT, yol.join(' '))
tek('konsolda xato yo‘q', !xato.length, xato.slice(0, 3).join(' | '))
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()
process.exit(ok === jami ? 0 : 1)
