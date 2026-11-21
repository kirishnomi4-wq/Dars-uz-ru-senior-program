// 4-dars «Hodisalar» — solo sinovi (20.11): bola darsni ustozsiz o'zi o'tadi (manba 004, «Solo»; 88-qaror).
// Ekranlar tartibi (16 va 18-qadam yo'q, doskalar o'rniga darhol o'z ekrani), sinf sonlari yo'q, uch kartani bola o'zi sinaydi (C — o'zi o'ynaydi),
// 5-qadamda «Keyingi»ni o'zi bosadi, 7/10/14-qadamda dastur tayyor — o'zi «Boshlash» va strelkalar, pog'ona yutilsa keyingisi o'zi ochiladi,
// «Keyingi ›» bilan o'tkazib yuborsa ham bo'ladi, sahifa yangilansa o'sha joydan, oxiri — o'z natijasi.
// Ishlatish (lokal server 5340 yoniq, demo-004 yig'ilgan): node new-junior/sinov/demo/004-solo.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-004.html'
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }), xato = []
const p = await (await b.newContext({ viewport: { width: 1440, height: 810 } })).newPage()
p.on('pageerror', (e) => xato.push(e.message)); p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) xato.push(m.text()) })
let ok = 0, jami = 0
const tek = (nom, s, iz = '') => { jami++; if (s) ok++; console.log((s ? '✓ ' : '✗ ') + nom + (s || iz === '' ? '' : '  — ' + iz)) }
const id = () => p.evaluate(() => (document.querySelector('#ilova .ekran') || {}).dataset?.id || '')
const matn = (s) => p.$eval(s, (e) => e.textContent.trim()).catch(() => '')
const gacha = async (f, arg, ms = 15000) => { try { await p.waitForFunction(f, arg, { timeout: ms }); return true } catch { return false } }
const KEY = { '→': 'ArrowRight', '←': 'ArrowLeft', '↑': 'ArrowUp', '↓': 'ArrowDown', '_': ' ' }
const bos = async (s) => { for (const c of s) { await p.keyboard.press(KEY[c]); await gacha(() => !document.querySelector('#ilova .ekran')?.dataset.yuryapti, null, 8000); await p.waitForTimeout(50) } await p.waitForTimeout(350) }
const boshla = async () => { await p.click('#ilova .hn .ishga'); await p.waitForTimeout(350) }
const keyingi = async () => { await p.click('#ilova .hn .asos.k-solo, #ust .hn .asos'); await p.waitForTimeout(500) }
const yol = []
const qayd = async () => { const e = await id(); if (yol[yol.length - 1] !== e) yol.push(e); return e }
const T4 = () => p.evaluate(() => { const ek = document.querySelector('#ilova .ekran'); for (const [k, t] of [['right', 'r'], ['left', 'l'], ['up', 'u'], ['down', 'd']]) { blQosh(ek, 'k', k); blQosh(ek, t) } sanoq(ek) })

await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'nihol') })
await p.goto(U + '?rol=solo'); await p.waitForTimeout(1000)
tek('B0', (await qayd()) === 'B0'); await p.click('#ilova .hn .asos'); await p.waitForTimeout(500)
tek('P1 — «Kirdi» soni yo‘q', (await qayd()) === 'P1' && !/[0-9]/.test(await matn('#ust .hn .hint')))
await keyingi(); tek('P2N', (await qayd()) === 'P2N'); await p.locator('#bol .jk').nth(0).click(); await p.waitForTimeout(900)
tek('P2S: har kartada «▶ Sinab ko‘rish»', (await qayd()) === 'P2S' && (await p.$$('#ust .hk-sinab')).length === 3)
for (let i = 0; i < 2; i++) { await p.locator('#ust .jk').nth(i).locator('.hk-sinab').click(); await gacha((n) => document.querySelectorAll('#ust .jk .jn').length >= n && !document.querySelector('#ust .ekran').dataset.yuryapti, i + 1, 20000) }
await p.locator('#ust .jk').nth(2).locator('.hk-sinab').click(); await p.waitForTimeout(500); await bos('↑↑↑↑→'); await gacha(() => document.querySelectorAll('#ust .jk .jn').length >= 3, null, 8000)
tek('P2S: A, B o‘zi sinaldi, C ni bola o‘zi o‘ynadi', await p.evaluate(() => [...document.querySelectorAll('#ust .jk .jn')].map((x) => x.textContent).join(' | ')) === '✕ yulduz boshqa joyda | ✕ yana o‘sha yo‘l | ✓ yetib bordi')
await keyingi(); tek('P2C', (await qayd()) === 'P2C'); await keyingi(); tek('P3', (await qayd()) === 'P3')
for (let k = 0; k < 3; k++) { await p.click('#ust .hn .asos'); await p.waitForTimeout(120) }
tek('P3: uch bo‘lak o‘zi yoqildi, ekran o‘sha', (await p.$$('#ust .xyl p.on')).length === 3 && (await id()) === 'P3')
await keyingi(); tek('P4', (await qayd()) === 'P4'); await keyingi()
tek('P6: dastur tayyor (→ move right), «▶ Boshlash»', (await qayd()) === 'P6' && (await matn('#ust .dsn')) === '1 ta dasturcha' && (await matn('#ust .hn .ishga')) === '▶ Boshlash')
await boshla(); await bos('→→→'); tek('P6: bola o‘zi o‘ynadi — yulduzda', (await matn('#ust .hn .hint')) === 'Yetib bordi!')
await keyingi(); tek('B1A: darhol o‘z topshirig‘i; «Keyingi ›» bor; «▶ Boshlash»', (await qayd()) === 'B1A' && (await p.$$('#bol .hn .k-solo')).length === 1 && /Boshlash/.test(await matn('#bol .hn .ishga')))
await p.evaluate(() => { const ek = document.querySelector('#ilova .ekran'); blQosh(ek, 'k', 'right'); blQosh(ek, 'r'); sanoq(ek) })
await boshla(); await bos('→→→→'); await gacha(() => document.querySelector('#ilova .ekran')?.dataset.id === 'B1B', null, 5000)
tek('B1A yutildi → B1B o‘zi ochildi', (await qayd()) === 'B1B')
await p.reload(); await p.waitForTimeout(1200); tek('sahifa yangilandi — o‘sha joydan (B1B)', (await id()) === 'B1B')
await keyingi(); await qayd(); await keyingi(); await qayd()
tek('«Keyingi ›» bilan o‘tkazildi (B1Y)', (await id()) === 'B1Y'); await keyingi()
tek('P4B', (await qayd()) === 'P4B'); await keyingi()
tek('P7: to‘rt tayyor dasturcha', (await qayd()) === 'P7' && (await matn('#ust .dsn')) === '4 ta dasturcha')
await keyingi(); tek('B2A', (await qayd()) === 'B2A')
await T4(); await boshla(); await bos('→→→→↑↑↑↑'); await gacha(() => document.querySelector('#ilova .ekran')?.dataset.id === 'B2B', null, 5000)
tek('B2A yutildi → B2B, dasturchalar oldingi pog‘onadan', (await qayd()) === 'B2B' && (await matn('#bol .dsn')) === '4 ta dasturcha')
for (const e of ['B2C', 'B2Y']) { await keyingi(); await qayd() }
await keyingi(); tek('P9', (await qayd()) === 'P9'); await keyingi(); tek('P4C', (await qayd()) === 'P4C'); await keyingi()
tek('P8: o‘yin tayyor', (await qayd()) === 'P8')
await boshla(); await bos('→→↑→→→↑↑→↓↓↓←←←↑↑'); tek('P8: bola o‘zi olma terdi va yutdi', (await matn('#ust .hn .hint')) === 'Yetib bordi!')
await keyingi(); tek('B3A — dasturchalar oldingi pog‘onadan', (await qayd()) === 'B3A' && (await matn('#bol .dsn')) === '4 ta dasturcha')
await boshla(); await bos('↑↑→↑↑→→→→→↓↓←←←↓'); await gacha(() => document.querySelector('#ilova .ekran')?.dataset.id === 'B3B', null, 5000)
tek('B3A yutildi → B3B', (await qayd()) === 'B3B')
await keyingi(); await qayd(); await keyingi()
tek('16-qadam yo‘q — darhol B5', (await qayd()) === 'B5')
const son = () => p.evaluate(() => ['marta tugma bosdi', 'olma terdi', 'marta yutdi'].map((k) => document.querySelector('#bol .sn-t[data-k="' + k + '"] b').textContent).join(','))
tek('B5: o‘z natijasi — 4 + 8 + 16 = 28 marta tugma bosdi (yulduz qochadi — yo‘l qisqa), 3 olma, 1 marta', (await son()) === '28,3,1', await son())
const KUT = 'B0 P1 P2N P2S P2C P3 P4 P6 B1A B1B B1C B1Y P4B P7 B2A B2B B2C B2Y P9 P4C P8 B3A B3B B3Y B5'
tek('solo yo‘li: 25 ekran, 16 va 18-qadamsiz', yol.join(' ') === KUT, yol.join(' '))
tek('konsolda xato yo‘q', !xato.length, xato.slice(0, 3).join(' | '))
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()
process.exit(ok === jami ? 0 : 1)
